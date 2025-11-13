#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

console.log('📚 Generating PDF from HTML documentation...\n');

// Get all HTML files except index
const htmlFiles = fs.readdirSync('.')
  .filter(f => f.endsWith('.html') && f !== 'index.html')
  .sort();

console.log(`Found ${htmlFiles.length} HTML files`);

// Create a combined HTML file with just the content
let combinedContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Care Commons Documentation</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 900px; margin: 40px auto; padding: 0 20px; }
    h1 { color: #2563eb; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 40px; page-break-before: always; }
    h2 { color: #1e293b; margin-top: 30px; }
    code { background: #f8fafc; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
    pre { background: #f8fafc; padding: 15px; border-radius: 8px; overflow-x: auto; border: 1px solid #e2e8f0; }
    pre code { background: none; padding: 0; }
    a { color: #2563eb; text-decoration: none; }
    table { border-collapse: collapse; width: 100%; margin: 20px 0; }
    th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
    th { background: #f8fafc; font-weight: 600; }
    .doc-separator { page-break-before: always; margin-top: 60px; }
  </style>
</head>
<body>
  <h1 style="page-break-before: avoid;">Care Commons Documentation</h1>
  <p><em>Generated: ${new Date().toISOString().split('T')[0]}</em></p>
  <p>Comprehensive documentation for Care Commons - Shared care software, community owned</p>
`;

let count = 0;
for (const file of htmlFiles) {
  count++;
  if (count % 10 === 0) {
    console.log(`Processing ${count}/${htmlFiles.length}...`);
  }
  
  const content = fs.readFileSync(file, 'utf8');
  
  // Extract just the article content
  const articleMatch = content.match(/<article class="markdown-content">([\s\S]*?)<\/article>/);
  if (articleMatch) {
    combinedContent += `\n<div class="doc-separator"></div>\n${articleMatch[1]}\n`;
  }
}

combinedContent += '</body></html>';

// Write combined HTML
const tempFile = 'care-commons-docs-combined.html';
fs.writeFileSync(tempFile, combinedContent);
console.log(`\n✅ Created combined HTML: ${tempFile}`);

// Try to convert to PDF using wkhtmltopdf or weasyprint
const outputPdf = 'care-commons-documentation.pdf';

console.log('\n🔄 Converting to PDF...');

// Try different PDF converters
const converters = [
  { name: 'wkhtmltopdf', cmd: `wkhtmltopdf --enable-local-file-access --no-stop-slow-scripts --javascript-delay 1000 "${tempFile}" "${outputPdf}"` },
  { name: 'weasyprint', cmd: `weasyprint "${tempFile}" "${outputPdf}"` },
  { name: 'prince', cmd: `prince "${tempFile}" -o "${outputPdf}"` }
];

let success = false;
for (const converter of converters) {
  try {
    execSync(`which ${converter.name}`, { stdio: 'pipe' });
    console.log(`Using ${converter.name}...`);
    execSync(converter.cmd, { stdio: 'inherit' });
    success = true;
    break;
  } catch (e) {
    // Converter not found or failed, try next one
  }
}

if (success) {
  console.log(`\n✅ PDF generated: ${outputPdf}`);
  // Clean up temp file
  fs.unlinkSync(tempFile);
} else {
  console.log(`\n⚠️  No PDF converter found. Combined HTML saved as: ${tempFile}`);
  console.log('\nTo convert to PDF, install one of these tools:');
  console.log('  • wkhtmltopdf: brew install wkhtmltopdf');
  console.log('  • weasyprint: pip install weasyprint');
  console.log('  • Or use a browser: open the HTML file and use "Print to PDF"');
}
