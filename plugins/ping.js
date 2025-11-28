export default {
  name: 'ping',
  description: 'اختبار سرعة استجابة البوت',
  usage: '!ping',
  category: 'عام',
  
  async execute({ sock, m, from, config }) {
    const start = Date.now();
    
    const sent = await sock.sendMessage(from, { 
      text: '⏳ جاري الاختبار...' 
    }, { quoted: m });
    
    const end = Date.now();
    const ping = end - start;
    
    let status = '';
    if (ping < 100) status = '🟢 ممتاز';
    else if (ping < 300) status = '🟡 جيد';
    else status = '🔴 بطيء';

    const resultText = `
╭━━━━━━━━━━━━━━━╮
┃  ⚡ *نتيجة الاختبار* ⚡
╰━━━━━━━━━━━━━━━╯

📊 *السرعة:* ${ping}ms
📈 *الحالة:* ${status}
⏱️ *الوقت:* ${new Date().toLocaleTimeString('ar-EG')}

━━━━━━━━━━━━━━━
✅ البوت يعمل بشكل طبيعي!
    `.trim();

    const buttons = [
      {
        buttonId: `${config.prefix}ping`,
        buttonText: { displayText: '🔄 إعادة الاختبار' },
        type: 1
      },
      {
        buttonId: `${config.prefix}info`,
        buttonText: { displayText: 'ℹ️ معلومات البوت' },
        type: 1
      }
    ];

    await sock.sendMessage(from, {
      text: resultText,
      footer: '⚡ اختبار السرعة',
      buttons: buttons,
      headerType: 1
    }, { quoted: m });
  }
};