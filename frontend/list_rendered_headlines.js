const http = require('http');

http.get('http://localhost:3002', res => {
  let body = '';
  res.on('data', chunk => { body += chunk; });
  res.on('end', () => {
    // Extract headlines
    const matches = body.match(/<h[1-4][^>]*>(.*?)<\/h[1-4]>/g) || [];
    console.log(`Found ${matches.length} headlines in homepage HTML:`);
    matches.slice(0, 15).forEach((m, idx) => {
      const text = m.replace(/<[^>]+>/g, '').trim();
      console.log(`${idx + 1}: ${text}`);
    });
  });
}).on('error', err => console.error(err));
