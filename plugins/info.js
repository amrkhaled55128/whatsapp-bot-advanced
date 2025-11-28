export default {
  name: 'info',
  description: 'معلومات تفصيلية عن البوت',
  usage: '!info',
  category: 'عام',
  
  async execute({ sock, m, from, config }) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    const infoText = `
╔═══════════════════════╗
║  🤖 *معلومات البوت* 🤖  ║
╚═══════════════════════╝

📱 *الاسم:* ${config.botName}
🔢 *الإصدار:* ${config.version}
👨‍💻 *المطور:* ${config.owner}
⚡ *البادئة:* ${config.prefix}

━━━━━━━━━━━━━━━━━━━━━

📊 *معلومات النظام:*
├ 🕐 وقت التشغيل: ${hours}س ${minutes}د ${seconds}ث
├ 💾 الذاكرة: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
├ 🖥️ المنصة: ${process.platform}
└ 📦 Node.js: ${process.version}

━━━━━━━━━━━━━━━━━━━━━

🔧 *التقنيات المستخدمة:*
├ 📚 Baileys (WhatsApp Library)
├ 🟢 Node.js
├ ⚡ Express.js
└ 🔌 نظام البلاجنز

━━━━━━━━━━━━━━━━━━━━━

🌟 *المميزات:*
✅ دعم الأجهزة المتعددة
✅ أزرار تفاعلية
✅ نظام بلاجنز مرن
✅ ردود تلقائية ذكية
✅ معالجة الوسائط

━━━━━━━━━━━━━━━━━━━━━
💡 ${config.description}
    `.trim();

    const buttons = [
      {
        buttonId: `${config.prefix}menu`,
        buttonText: { displayText: '📋 القائمة' },
        type: 1
      },
      {
        buttonId: `${config.prefix}help`,
        buttonText: { displayText: '📖 المساعدة' },
        type: 1
      },
      {
        buttonId: `${config.prefix}ping`,
        buttonText: { displayText: '⚡ اختبار السرعة' },
        type: 1
      }
    ];

    await sock.sendMessage(from, {
      text: infoText,
      footer: '🚀 بوت واتساب متطور',
      buttons: buttons,
      headerType: 1
    }, { quoted: m });
  }
};