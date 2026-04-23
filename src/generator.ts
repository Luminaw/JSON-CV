import puppeteer from "puppeteer";
import Handlebars from "handlebars";
import { ResumeSchema } from "./schema";
import fs from "fs/promises";
import path from "path";

// Handlebars Helper for Date Formatting
Handlebars.registerHelper("formatDate", (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
});

Handlebars.registerHelper("iconForNetwork", (network: string) => {
  if (!network) return "fas fa-link";
  const map: Record<string, string> = {
    github: "fab fa-github",
    linkedin: "fab fa-linkedin",
    twitter: "fab fa-x-twitter",
    x: "fab fa-x-twitter",
    instagram: "fab fa-instagram",
    facebook: "fab fa-facebook",
    youtube: "fab fa-youtube",
    twitch: "fab fa-twitch",
    discord: "fab fa-discord",
    stackoverflow: "fab fa-stack-overflow",
    medium: "fab fa-medium",
    behance: "fab fa-behance",
    dribbble: "fab fa-dribbble",
    codepen: "fab fa-codepen",
    gitlab: "fab fa-gitlab",
    bitbucket: "fab fa-bitbucket",
  };
  return map[network.toLowerCase()] || "fas fa-link";
});

export async function getHtml() {
  // 1. Determine which JSON to use
  let jsonPath = path.resolve(process.cwd(), "resume.json");

  try {
    await fs.access(jsonPath);
  } catch {
    jsonPath = path.resolve(process.cwd(), "example_resume.json");
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
  
  const template = Handlebars.compile(templateSource);
  return template({
    ...validatedData,
    style: cssSource
  });
}

export async function generatePdf() {
  console.log("Starting PDF generation...");

  const html = await getHtml();

  // 4. Render with Puppeteer
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  
  await page.setContent(html, { waitUntil: "networkidle0" });
  
  const outputPath = path.resolve(process.cwd(), "resume.pdf");
  console.log(`Rendering PDF to ${outputPath}...`);
  
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
  console.log("PDF generated successfully!");
}
