const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoibW9ja191c2VyIiwiZW1haWwiOiJkZW1vQGV4YW1wbGUuY29tIiwibmFtZSI6IkRlbW8gU2hvcCIsImlhdCI6MTc4MzEyMzM1NywiZXhwIjoxNzgzNzI4MTU3fQ.XGR0tKIuUdhAPDL97zNSMJjbn_hQDfb-SJTb781lzWE'
      }
    }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log("1. Creating Customer from WhatsApp...");
  const c = await post('/api/whatsapp/simulate-incoming', { text: "new customer Amit" });
  console.log(JSON.stringify(c, null, 2));
  const custId = c.generatedEvents?.[0]?.payload?.record?.id;
  
  console.log("\n2. Creating Product from WhatsApp...");
  const p = await post('/api/whatsapp/simulate-incoming', { text: "add product Maggi" });
  console.log(JSON.stringify(p, null, 2));
  const prodId = p.generatedEvents?.[0]?.payload?.record?.id;

  console.log("\n3. Triggering Low Stock Sale from WhatsApp...");
  const s = await post('/api/whatsapp/simulate-incoming', { text: "low stock" }); // This maps to ADJUST_INVENTORY in my mock
  console.log(JSON.stringify(s, null, 2));
}

setTimeout(run, 3000);
