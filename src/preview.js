const express = require('express');
const path = require('path');
const { buildResume } = require('./build');
const { exec } = require('child_process');

async function startPreview(inputPath, templatePath, openBrowser = false) {
  // Build HTML first
  const htmlPath = path.join('dist', 'resume.html');
  await buildResume(inputPath, templatePath, path.join('dist', 'resume.pdf')); // Build PDF too, but we use HTML

  const app = express();
  const port = 3000;

  app.use(express.static('dist'));

  app.get('/', (req, res) => {
    res.sendFile(path.resolve(htmlPath));
  });

  app.listen(port, () => {
    console.log(`Preview server running at http://localhost:${port}`);
    if (openBrowser) {
      // Open browser
      const start = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
      exec(`${start} http://localhost:${port}`);
    }
  });
}

module.exports = { startPreview };