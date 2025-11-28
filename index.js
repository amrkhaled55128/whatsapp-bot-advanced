import makeWASocket, { 
  DisconnectReason, 
  useMultiFileAuthState,
  fetchLatestBaileysVersion 
} from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import pino from 'pino';
import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import config from './config.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logger = pino({ level: 'silent' });
const plugins = new Map();

// تحميل البلاجنز
async function loadPlugins() {
  const pluginDir = join(__dirname, 'plugins');
  const files = readdirSync(pluginDir).filter(f => f.endsWith('.js'));
  
  console.log(`\n📦 تحميل ${files.length} بلاجن...`);
  
  for (const file of files) {
    try {
      const plugin = await import(`./plugins/${file}`);
      const name = file.replace('.js', '');
      plugins.set(name, plugin.default);
      console.log(`✅ تم تحميل: ${name}`);
    } catch (error) {
      console.error(`❌ خطأ في تحميل ${file}:`, error.message);
    }
  }
  
  console.log(`✅ تم تحميل جميع البلاجنز\n`);
}

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    auth: state,
    browser: ['WhatsApp Bot', 'Chrome', '1.0.0'],
    getMessage: async (key) => {
      return { conversation: '' };
    }
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      console.log('\n═══════════════════════════════');
      console.log('📱 امسح QR Code بواسطة واتساب:');
      qrcode.generate(qr, { small: true });
      console.log('═══════════════════════════════\n');
    }

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('❌ تم قطع الاتصال:', lastDisconnect?.error?.message);
      
      if (shouldReconnect) {
        console.log('🔄 إعادة الاتصال...');
        setTimeout(() => connectToWhatsApp(), 3000);
      }
    } else if (connection === 'open') {
      console.log('\n✅ تم الاتصال بنجاح! 🎉');
      console.log(`🤖 البوت: ${config.botName}`);
      console.log(`📝 البادئة: ${config.prefix}`);
      console.log('════════════════════════════════\n');
    }
  });

  sock.ev.on('creds.update', saveCreds);

  // معالجة الرسائل
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    const m = messages[0];
    if (!m.message) return;
    if (m.key.fromMe) return; // تجاهل رسائل البوت نفسه

    const messageText = m.message.conversation || 
                       m.message.extendedTextMessage?.text || 
                       m.message.buttonsResponseMessage?.selectedButtonId || 
                       m.message.listResponseMessage?.singleSelectReply?.selectedRowId || 
                       '';
    
    const from = m.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    const sender = m.key.participant || from;

    // استخراج اسم المرسل
    const pushName = m.pushName || 'مستخدم';

    console.log(`\n💬 رسالة ${isGroup ? 'من مجموعة' : 'خاصة'}: ${messageText}`);
    console.log(`👤 المرسل: ${pushName}`);

    // معالجة الأوامر
    if (messageText.startsWith(config.prefix)) {
      const args = messageText.slice(config.prefix.length).trim().split(/ +/);
      const command = args.shift().toLowerCase();
      
      console.log(`⚡ تنفيذ أمر: ${command}`);

      // البحث عن البلاجن
      const plugin = plugins.get(command);
      
      if (plugin) {
        try {
          const context = {
            sock,
            m,
            args,
            from,
            sender,
            isGroup,
            pushName,
            config,
            reply: async (text) => {
              return await sock.sendMessage(from, { text }, { quoted: m });
            },
            sendMessage: async (content) => {
              return await sock.sendMessage(from, content, { quoted: m });
            }
          };
          
          await plugin.execute(context);
          console.log(`✅ تم تنفيذ: ${command}`);
        } catch (error) {
          console.error(`❌ خطأ في تنفيذ ${command}:`, error.message);
          await sock.sendMessage(from, { 
            text: `⚠️ حدث خطأ في تنفيذ الأمر: ${error.message}` 
          }, { quoted: m });
        }
      } else {
        await sock.sendMessage(from, { 
          text: `❌ الأمر "${command}" غير موجود\nاكتب ${config.prefix}help للمساعدة` 
        }, { quoted: m });
      }
    }
  });

  return sock;
}

// بدء البوت
await loadPlugins();
connectToWhatsApp();

console.log('🚀 بوت واتساب يعمل الآن...');