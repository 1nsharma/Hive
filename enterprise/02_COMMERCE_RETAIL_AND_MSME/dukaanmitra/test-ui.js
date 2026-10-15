import puppeteer from 'puppeteer';

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  console.log("Navigating...");
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  console.log("Title:", await page.title());
  console.log("Body HTML preview:", (await page.content()).substring(0, 500));
  
  await browser.close();
})();
