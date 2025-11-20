# JSON-CV

A CLI tool to generate ATS-friendly resumes from IETF JSON Resume format using Handlebars templates and Puppeteer for PDF output.

## Features

- Generate semantic HTML resumes from JSON data
- Produce A4-sized PDFs optimized for Applicant Tracking Systems (ATS)
- Support for multiple Handlebars templates
- Built-in HTML preview server
- JSON validation against IETF schema

## Installation

Or clone and install locally:

```bash
git clone https://github.com/Luminaw/JSON-CV
cd json-cv
pnpm install
```

## Usage

### Basic PDF Generation

```bash
json-cv --input examples/resume.json --template templates/default.hbs --out dist/resume.pdf
```

### Preview HTML

```bash
json-cv --input examples/resume.json --template templates/default.hbs --preview
```

### Validate JSON

```bash
json-cv --input examples/resume.json --validate
```

### CLI Options

- `--input, -i`: Path to JSON resume file (default: resume.json)
- `--template, -t`: Path to Handlebars template file (required for build/preview)
- `--out, -o`: Output path for PDF (default: dist/resume.pdf)
- `--preview, -p`: Start HTML preview server
- `--open`: Open browser when previewing
- `--validate, -v`: Validate JSON against IETF schema

## JSON Resume Format

Uses the [IETF JSON Resume Schema](https://jsonresume.org/schema/). See `examples/resume.json` for a sample.

## Templates

Templates are Handlebars files in the `templates/` directory. The default template is ATS-optimized with semantic HTML.

### Customizing Templates

- Use semantic HTML tags (header, main, section, h1-h3, ul/li)
- Keep CSS minimal and readable
- Avoid images for critical information
- Include plain-text fallbacks where needed

## Development

```bash
pnpm run build    # Generate PDF
pnpm run preview  # Start preview server
pnpm run validate # Validate example JSON
```

## License

MIT