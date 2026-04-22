import puppeteer from "puppeteer";
import { getHtml } from "./generator";
import fs from "fs/promises";
import path from "path";

async function generateScreenshots() {
  const assetsDir = path.resolve(process.cwd(), "assets");
  await fs.mkdir(assetsDir, { recursive: true });

  console.log("Generating screenshots...");
  const html = await getHtml();

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // 1. Generate README Preview (Full page with paper effect)
  console.log("Capturing README preview...");
  
  // Create a wrapped version for the README to look like a physical paper
  const readmeWrappedHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 80px 40px;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            font-family: sans-serif;
          }
          #paper-container {
            background: white;
            width: 210mm;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            border: 1px solid #e5e7eb;
          }
          /* Ensure the internal resume doesn't have its own body margins */
          .resume-content body { margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        <div id="paper-container">
          ${html}
        </div>
      </body>
    </html>
  `;

  await page.setContent(readmeWrappedHtml, { waitUntil: "load" });
  await page.setViewport({ width: 1000, height: 1200, deviceScaleFactor: 2 });
  
  const readmePath = path.join(assetsDir, "readme-preview.png");
  await page.screenshot({
    path: readmePath,
    fullPage: true
  });
  console.log(`README preview saved to ${readmePath}`);

  // 2. Generate Social Preview (1280x640)
  console.log("Capturing social preview...");
  
  // For social, we want it to look "clean" and filled
  const socialHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 60px;
            background-color: white;
            display: flex;
            flex-direction: column;
            width: 1280px;
            height: 640px;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;

  await page.setContent(socialHtml, { waitUntil: "load" });
  await page.setViewport({ width: 1280, height: 640, deviceScaleFactor: 2 });

  const socialPath = path.join(assetsDir, "social-preview.png");
  await page.screenshot({
    path: socialPath
  });
  console.log(`Social preview saved to ${socialPath}`);

  await browser.close();
  console.log("Screenshots generated successfully!");
}

generateScreenshots().catch(console.error);
