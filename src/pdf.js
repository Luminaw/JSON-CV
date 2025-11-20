const puppeteer = require('puppeteer');
const path = require('path');

async function generatePDF(htmlPath, outPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Load HTML file
  const fileUrl = `file://${path.resolve(htmlPath)}`;
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  // Generate A4 PDF
  await page.pdf({
    path: outPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0.5in',
      right: '0.5in',
      bottom: '0.5in',
      left: '0.5in'
    }
  });

  await browser.close();
}

module.exports = { generatePDF };