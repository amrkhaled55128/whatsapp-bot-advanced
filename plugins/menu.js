export default {
  name: 'menu',
  description: 'القائمة التفاعلية',
  usage: '!menu',
  category: 'عام',
  
  async execute({ sock, m, from, config, pushName }) {
    const menuText = `
╭━━━━━━━━━━━━━━━━━━╮
┃ 🌟 *القائمة الرئيسية* 🌟
╰━━━━━━━━━━━━━━━━━━╯

👋 أهلاً *${pushName}*!

📱 اختر الفئة المناسبة:
    `.trim();

    const sections = [
      {
        title: '📋 الأوامر العامة',
        rows: [
          {
            title: '📖 المساعدة',
            description: 'عرض جميع الأوامر المتاحة',
            rowId: `${config.prefix}help`
          },
          {
            title: '⚡ اختبار السرعة',
            description: 'فحص سرعة استجابة البوت',
            rowId: `${config.prefix}ping`
          },
          {
            title: 'ℹ️ المعلومات',
            description: 'معلومات تفصيلية عن البوت',
            rowId: `${config.prefix}info`
          }
        ]
      },
      {
        title: '🎨 أوامر الوسائط',
        rows: [
          {
            title: '🎭 صنع ملصق',
            description: 'تحويل الصور إلى ملصقات',
            rowId: `${config.prefix}sticker`
          },
          {
            title: '🤖 الذكاء الاصطناعي',
            description: 'دردشة مع الذكاء الاصطناعي',
            rowId: `${config.prefix}ai مرحباً`
          }
        ]
      },
      {
        title: '⚙️ الإعدادات',
        rows: [
          {
            title: '🔧 الإعدادات',
            description: 'تخصيص إعدادات البوت',
            rowId: `${config.prefix}settings`
          }
        ]
      }
    ];

    const listMessage = {
      text: menuText,
      footer: `✨ ${config.botName} | v${config.version}`,
      title: '🤖 بوت واتساب',
      buttonText: '📋 اضغط هنا',
      sections
    };

    await sock.sendMessage(from, listMessage, { quoted: m });
  }
};