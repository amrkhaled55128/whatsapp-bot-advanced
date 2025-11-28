export default {
  name: 'help',
  description: 'عرض قائمة الأوامر المتاحة',
  usage: '!help',
  category: 'عام',
  
  async execute({ sock, m, from, config }) {
    const helpText = `
╔═══════════════════╗
║  🤖 *${config.botName}* 🤖  ║
╚═══════════════════╝

📋 *الأوامر المتاحة:*

*▸ الأوامر العامة:*
├ ${config.prefix}menu - القائمة التفاعلية
├ ${config.prefix}help - قائمة الأوامر
├ ${config.prefix}ping - اختبار الاتصال
└ ${config.prefix}info - معلومات البوت

*▸ أوامر الوسائط:*
├ ${config.prefix}sticker - تحويل صورة لملصق
└ ${config.prefix}ai - دردشة مع الذكاء الاصطناعي

*▸ الإعدادات:*
└ ${config.prefix}settings - إعدادات البوت

━━━━━━━━━━━━━━━━━━━
⚡ البادئة: ${config.prefix}
👨‍💻 المطور: ${config.owner}
━━━━━━━━━━━━━━━━━━━

💡 *نصيحة:* استخدم ${config.prefix}menu للقائمة التفاعلية!
    `.trim();

    const buttons = [
      {
        buttonId: `${config.prefix}menu`,
        buttonText: { displayText: '📋 القائمة التفاعلية' },
        type: 1
      },
      {
        buttonId: `${config.prefix}info`,
        buttonText: { displayText: 'ℹ️ معلومات البوت' },
        type: 1
      },
      {
        buttonId: `${config.prefix}ping`,
        buttonText: { displayText: '⚡ اختبار السرعة' },
        type: 1
      }
    ];

    const buttonMessage = {
      text: helpText,
      footer: '✨ اضغط على الأزرار للتفاعل',
      buttons: buttons,
      headerType: 1
    };

    await sock.sendMessage(from, buttonMessage, { quoted: m });
  }
};