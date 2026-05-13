const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const htmlPath = path.resolve(__dirname, '../docs/travel-planner-design.html');
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });

  // Let CSS animations settle
  await new Promise(r => setTimeout(r, 1000));

  const pdfPath = path.resolve(__dirname, '../docs/smart-travel-planner-system-design.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();
  console.log('PDF saved to:', pdfPath);
})();
