import puppeteer from "puppeteer";
import Handlebars from "handlebars";
import { ResumeSchema } from "./schema";
import fs from "fs/promises";
import path from "path";

export async function generatePdf() {
  console.log("≡ƒÜÇ Starting PDF generation...");

  // 1. Determine which JSON to use
  let jsonPath = path.resolve(process.cwd(), "resume.json");
  let isExample = false;

  try {
    await fs.access(jsonPath);
    console.log("≡ƒôä Found 'resume.json', using personal data.");
  } catch {
    jsonPath = path.resolve(process.cwd(), "example_resume.json");
    console.log("≡ƒôä 'resume.json' not found, falling back to 'example_resume.json'.");
    isExample = true;
  }

  // 2. Read and validate JSON
  const rawData = await fs.readFile(jsonPath, "utf-8");
  const jsonData = JSON.parse(rawData);
  const validatedData = ResumeSchema.parse(jsonData);

  // 3. Prepare Template
  const templatePath = path.resolve(process.cwd(), "templates/resume.hbs");
  const cssPath = path.resolve(process.cwd(), "templates/style.css");
  
  const templateSource = await fs.readFile(templatePath, "utf-8");
  const cssSource = await fs.readFile(cssPath, "utf-8");
  
  // Handlebars Helper for Date Formatting
  Handlebars.registerHelper("formatDate", (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Fallback to raw string if invalid
    return date.toLocaleString("en-US", { month: "short", year: "numeric" });
  });

  const template = Handlebars.compile(templateSource);
  const html = template({
    ...validatedData,
    style: cssSource
  });

  // 4. Render with Puppeteer
  console.log("≡ƒîÉ Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  
  await page.setContent(html, { waitUntil: "networkidle0" });
  
  const outputPath = path.resolve(process.cwd(), "resume.pdf");
  console.log(`≡ƒû¿∩╕Å  Rendering PDF to ${outputPath}...`);
  
  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
    displayHeaderFooter: false,
    margin: {
      top: "0",
      right: "0",
      bottom: "0",
      left: "0",
    }
  });

  await browser.close();
  console.log("Γ£à PDF generated successfully!");
}
