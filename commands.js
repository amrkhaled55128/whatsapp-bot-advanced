// ملف الأوامر
export const commands = {
  // أمر المساعدة
  help: async (sock, m) => {
    const helpText = `
🤖 *أوامر البوت:*

!help - عرض قائمة الأوامر
!ping - اختبار الاتصال
!info - معلومات عن البوت
!sticker - تحويل صورة إلى ملصق

✨ المزيد من الأوامر قريباً!
    `;
    
    await sock.sendMessage(m.key.remoteJid, { text: helpText });
  },

  // أمر فحص الاتصال
  ping: async (sock, m) => {
    const start = Date.now();
    await sock.sendMessage(m.key.remoteJid, { text: '🏓 Pong!' });
    const end = Date.now();
    
    await sock.sendMessage(m.key.remoteJid, { 
      text: `⏱️ السرعة: ${end - start}ms` 
    });
  },

  // معلومات البوت
  info: async (sock, m) => {
    const infoText = `
🤖 *معلومات البوت:*

📛 الاسم: بوت واتساب متطور
🔧 المكتبة: Baileys
⚡ الإصدار: 1.0.0
👨‍💻 المطور: GitHub

✨ بوت متطور لواتساب
    `;
    
    await sock.sendMessage(m.key.remoteJid, { text: infoText });
  },

  // تحويل صورة إلى ملصق
  sticker: async (sock, m) => {
    const quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage;
    
    if (!quoted || !quoted.imageMessage) {
      await sock.sendMessage(m.key.remoteJid, { 
        text: '⚠️ ارجع للرسالة واكتب !sticker' 
      });
      return;
    }

    await sock.sendMessage(m.key.remoteJid, { 
      text: '🔄 جاري إنشاء الملصق...' 
    });
    
    // هنا يمكن إضافة كود تحويل الصورة
  }
};