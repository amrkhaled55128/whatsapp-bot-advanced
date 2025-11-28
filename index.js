import makeWASocket, { 
  DisconnectReason, 
  useMultiFileAuthState,
  fetchLatestBaileysVersion 
} from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import pino from 'pino';
import { commands } from './commands.js';

const logger = pino({ level: 'silent' });

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    auth: state,
    browser: ['WhatsApp Bot', 'Chrome', '1.0.0']
  });

  // عرض QR Code للاتصال
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📱 امسح QR Code بواسطة واتساب:');
      qrcode.generate(qr, { small: true });
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('❌ تم قطع الاتصال:', lastDisconnect?.error);
      
      if (shouldReconnect) {
        console.log('🔄 إعادة الاتصال...');
        connectToWhatsApp();
      }
    } else if (connection === 'open') {
      console.log('✅ تم الاتصال بنجاح! 🎉');
    }
  });

  // حفظ بيانات الاعتماد
  sock.ev.on('creds.update', saveCreds);

  // معالجة الرسائل
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    const m = messages[0];
    if (!m.message) return;

    const messageText = m.message.conversation || 
                       m.message.extendedTextMessage?.text || '';
    
    const from = m.key.remoteJid;
    const isGroup = from.endsWith('@g.us');

    console.log(`\n📬 رسالة جديدة ${isGroup ? 'من مجموعة' : ''}: ${messageText}`);

    // معالجة الأوامر
    if (messageText.startsWith('!')) {
      const [command, ...args] = messageText.slice(1).split(' ');
      
      if (commands[command]) {
        await commands[command](sock, m, args);
      }
    }
  });

  return sock;
}

// بدء البوت
connectToWhatsApp();

console.log('🚀 بوت واتساب يعمل الآن...');