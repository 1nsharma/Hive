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
  console.log("1. Creating Customer...");
  const res1 = await post('/api/munim/parse', { 
    query: "create customer amit with phone 9999", 
    businessConfig: { businessType: "demo" }
  }); // Using the original parse endpoint which we can use to generate the payload, wait no, let's just hit the dispatch directly for setup.
}
run();
