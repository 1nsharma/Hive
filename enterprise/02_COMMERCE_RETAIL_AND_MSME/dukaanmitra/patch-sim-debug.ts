import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf-8');
content = content.replace(
  /const events = await globalCommandBus\.dispatch\(cmd\);/g,
  `console.log("Dispatching command:", cmd);
  let events = [];
  try {
    events = await globalCommandBus.dispatch(cmd);
  } catch (err: any) {
    console.error("Dispatch threw error:", err);
    throw err;
  }`
);
fs.writeFileSync('server.ts', content);
