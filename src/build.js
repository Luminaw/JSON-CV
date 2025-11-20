const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const { generatePDF } = require('./pdf');

// Register helpers
Handlebars.registerHelper('join', (arr, sep) => arr ? arr.join(sep) : '');

async function buildResume(inputPath, templatePath, outPath) {
  // Load and validate JSON
  const { validateResume } = require('./validate');
  const validation = validateResume(inputPath);
  if (!validation.valid) {
    console.error('Validation errors:');
    validation.errors.forEach(err => console.error(`- ${err.message}`));
    throw new Error('Invalid resume JSON');
  }

  const resumeData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

  // Load template
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const template = Handlebars.compile(templateSource);

  // Render HTML
  const html = template(resumeData);

  // Ensure dist directory exists
  const distDir = path.dirname(outPath);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Save HTML
  const htmlPath = path.join(distDir, 'resume.html');
  fs.writeFileSync(htmlPath, html);

  // Generate PDF
  await generatePDF(htmlPath, outPath);
}

module.exports = { buildResume };