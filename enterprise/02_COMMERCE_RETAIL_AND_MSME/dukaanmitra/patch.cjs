const fs = require('fs');

let content = fs.readFileSync('src/utils.ts', 'utf8');

// Replace fetch calls with a wrapper
const fetchWrapper = `
async function fetchWithAuth(url: string, options: any = {}) {
  let token = null;
  let demoId = null;
  try {
    const authData = localStorage.getItem('dukaanmitra_auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      token = parsed.token;
    }
  } catch (e) {}
  
  try {
    demoId = localStorage.getItem('dukaanmitra_demo_id');
    if (!demoId) {
      demoId = 'demo_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('dukaanmitra_demo_id', demoId);
    }
  } catch (e) {}

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', 'Bearer ' + token);
  }
  if (demoId) {
    headers.set('x-demo-id', demoId);
  }
  options.headers = headers;
  
  return fetch(url, options);
}
`;

// Inject fetchWrapper after imports
content = content.replace(/(import .* from "\.\/types";\n)/, "$1\n" + fetchWrapper + "\n");

// Replace all occurrences of fetch( with fetchWithAuth(
content = content.replace(/fetch\(/g, 'fetchWithAuth(');

fs.writeFileSync('src/utils.ts', content);
