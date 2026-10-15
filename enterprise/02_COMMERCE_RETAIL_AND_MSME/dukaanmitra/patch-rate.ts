import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf-8');

content = content.replace(
  /const isRateLimit = \(err: any\) => [\s\S]*?const ai = new GoogleGenAI/,
  `const isRateLimit = (err: any) => {
  const errStr = String(err).toLowerCase();
  const errMsg = String(err?.message || "").toLowerCase();
  return errStr.includes('429') || errStr.includes('quota') || errStr.includes('resource_exhausted') || 
         errMsg.includes('429') || errMsg.includes('quota') || err?.status === 429;
};
const ai = new GoogleGenAI`
);

fs.writeFileSync('server.ts', content);
