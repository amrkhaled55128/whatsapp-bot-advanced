export default {
  name: 'sticker',
  aliases: ['s', 'ملصق'],
  description: 'تحويل الصورة إلى ملصق',
  usage: '!sticker [صورة]',
  category: 'وسائط',
  
  async execute({ sock, m, from, reply, config }) {
    const quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage;
    const imageMessage = m.message.imageMessage || quoted?.imageMessage;
    
    if (!imageMessage) {
      const guideText = `
╭━━━━━━━━━━━━━━━━╮
┃ 🎭 *صانع الملصقات* 🎭
╰━━━━━━━━━━━━━━━━╯

⚠️ *كيفية الاستخدام:*

1️⃣ أرسل صورة
2️⃣ اكتب ${config.prefix}sticker

أو:

1️⃣ اكتب ${config.prefix}sticker
2️⃣ ارجع على صورة

━━━━━━━━━━━━━━━━
💡 يمكنك أيضاً استخدام:
${config.prefix}s (اختصار)
      `.trim();

      const buttons = [
        {
          buttonId: `${config.prefix}help`,
          buttonText: { displayText: '📖 المساعدة' },
          type: 1
        },
        {
          buttonId: `${config.prefix}menu`,
          buttonText: { displayText: '📋 القائمة' },
          type: 1
        }
      ];

      await sock.sendMessage(from, {
        text: guideText,
        footer: '🎨 أرسل صورة لتحويلها',
        buttons: buttons,
        headerType: 1
      }, { quoted: m });
      return;
    }

    await reply('🔄 جاري إنشاء الملصق... ⏳');
    
    try {
      // تحميل الصورة
      const buffer = await sock.downloadMediaMessage({
        message: { imageMessage }
      });
      
      // إرسال كملصق
      await sock.sendMessage(from, {
        sticker: buffer,
        mimetype: 'image/webp'
      }, { quoted: m });
      
      await reply('✅ تم إنشاء الملصق بنجاح! 🎉');
      
    } catch (error) {
      console.error('خطأ في إنشاء الملصق:', error);
      await reply('❌ عذراً، حدث خطأ في إنشاء الملصق. تأكد من أن الصورة بحجم مناسب.');
    }
  }
};