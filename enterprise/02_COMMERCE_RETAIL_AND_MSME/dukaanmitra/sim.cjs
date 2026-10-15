const http = require('http');
const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/whatsapp/simulate-incoming',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoibW9ja191c2VyIiwiZW1haWwiOiJkZW1vQGV4YW1wbGUuY29tIiwibmFtZSI6IkRlbW8gU2hvcCIsImlhdCI6MTc4MzEyMzM1NywiZXhwIjoxNzgzNzI4MTU3fQ.XGR0tKIuUdhAPDL97zNSMJjbn_hQDfb-SJTb781lzWE'
  }
}, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log('RESPONSE:', data));
});
req.write(JSON.stringify({ fromPhone: "919999999999", text: "Sold 50 packets of maggi to customer 1" }));
req.end();
