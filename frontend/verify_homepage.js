const http = require('http');

http.get('http://localhost:3002', res => {
  let body = '';
  res.on('data', chunk => { body += chunk; });
  res.on('end', () => {
    console.log('=== HOMEPAGE VERIFICATION ===');
    console.log('1. Outdated "अध्यक्ष पद पर NSUI आगे" present?:', body.includes('अध्यक्ष पद पर NSUI आगे'));
    console.log('2. "टुडेज़ टॉपिक" badge present?:', body.includes('टुडेज़ टॉपिक'));
    console.log('3. Updated "DUSU चुनाव 2026 में ABVP का दबदबा" present?:', body.includes('ABVP का दबदबा'));
    console.log('4. Morning utility "आज का मौसम" present?:', body.includes('आज का मौसम'));
    console.log('5. Morning utility "सोने का भाव" present?:', body.includes('सोने का भाव'));
    console.log('6. Morning utility "चांदी का भाव" present?:', body.includes('चांदी का भाव'));
    console.log('7. Morning utility "पेट्रोल का रेट" present?:', body.includes('पेट्रोल का रेट'));
    console.log('8. Morning utility "डीजल का रेट" present?:', body.includes('डीजल का रेट'));
    console.log('9. Morning utility "दैनिक राशिफल" present?:', body.includes('दैनिक राशिफल'));
  });
}).on('error', err => console.error(err));
