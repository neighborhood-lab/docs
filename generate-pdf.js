#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

console.log('📚 Generating curated PDF from HTML documentation...\n');

// Parse index.html to get the exact category structure
const indexHtml = fs.readFileSync('index.html', 'utf8');

// Extract categories and their files
const categories = [
  { 
    name: '🚀 Getting Started', 
    description: 'READMEs, quickstarts, and high-level overviews',
    files: [] 
  },
  { 
    name: '📖 User Guides', 
    description: 'Detailed guides, tutorials, and how-tos',
    files: [] 
  },
  { 
    name: '🏗️ Architecture & Deployment', 
    description: 'System architecture and deployment guides',
    files: [] 
  },
  { 
    name: '⚙️ Implementation Details', 
    description: 'Code documentation, compliance, and operations',
    files: [] 
  }
];

// Parse the sidebar navigation to extract file order
const navMatch = indexHtml.match(/<nav class="sidebar-nav">([\s\S]*?)<\/nav>/);
if (navMatch) {
  const navContent = navMatch[1];
  
  // Split by nav-category divs
  const categoryMatches = navContent.match(/<div class="nav-category">([\s\S]*?)<\/div>/g);
  
  if (categoryMatches) {
    categoryMatches.forEach((catBlock, idx) => {
      if (idx >= categories.length) return;
      
      // Extract all href links from this category
      const linkRegex = /<a href="\.\/([^"]+\.html)">([^<]+)<\/a>/g;
      let match;
      while ((match = linkRegex.exec(catBlock)) !== null) {
        const filename = match[1];
        const title = match[2];
        
        // Verify file exists
        if (fs.existsSync(filename)) {
          categories[idx].files.push({ filename, title });
        }
      }
    });
  }
}

console.log('Category breakdown:');
categories.forEach(cat => {
  console.log(`  ${cat.name}: ${cat.files.length} files`);
});
console.log();

// Create combined HTML with proper structure
let combinedContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Care Commons Documentation</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
      max-width: 900px; 
      margin: 40px auto; 
      padding: 0 20px;
      line-height: 1.6;
    }
    .cover-page {
      text-align: center;
      padding: 100px 0;
      page-break-after: always;
    }
    .cover-page h1 {
      font-size: 3em;
      color: #2563eb;
      margin-bottom: 0.5em;
    }
    .cover-page .subtitle {
      font-size: 1.5em;
      color: #64748b;
      margin-bottom: 2em;
    }
    .cover-page .meta {
      color: #64748b;
      font-size: 0.9em;
    }
    .toc {
      page-break-after: always;
      margin: 40px 0;
    }
    .toc h1 {
      color: #2563eb;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 10px;
    }
    .toc-category {
      margin: 30px 0;
    }
    .toc-category h2 {
      color: #1e293b;
      font-size: 1.5em;
      margin-bottom: 10px;
    }
    .toc-category .description {
      color: #64748b;
      font-style: italic;
      margin-bottom: 15px;
    }
    .toc-category ul {
      list-style: none;
      padding-left: 20px;
    }
    .toc-category li {
      margin: 8px 0;
      color: #475569;
    }
    .part-divider {
      page-break-before: always;
      text-align: center;
      padding: 150px 0;
      page-break-after: always;
    }
    .part-divider h1 {
      font-size: 3em;
      color: #2563eb;
      margin-bottom: 0.3em;
    }
    .part-divider .description {
      font-size: 1.2em;
      color: #64748b;
    }
    h1 { 
      color: #2563eb; 
      border-bottom: 2px solid #e2e8f0; 
      padding-bottom: 10px; 
      margin-top: 40px;
      page-break-before: always;
    }
    h1:first-of-type {
      page-break-before: avoid;
    }
    h2 { 
      color: #1e293b; 
      margin-top: 30px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 8px;
    }
    h3 { 
      color: #334155; 
      margin-top: 25px;
    }
    code { 
      background: #f8fafc; 
      padding: 2px 6px; 
      border-radius: 4px; 
      font-size: 0.9em;
      font-family: 'Courier New', monospace;
    }
    pre { 
      background: #f8fafc; 
      padding: 15px; 
      border-radius: 8px; 
      overflow-x: auto; 
      border: 1px solid #e2e8f0;
      margin: 15px 0;
    }
    pre code { 
      background: none; 
      padding: 0; 
    }
    a { 
      color: #2563eb; 
      text-decoration: none; 
    }
    table { 
      border-collapse: collapse; 
      width: 100%; 
      margin: 20px 0;
      page-break-inside: avoid;
    }
    th, td { 
      border: 1px solid #e2e8f0; 
      padding: 10px; 
      text-align: left; 
    }
    th { 
      background: #f8fafc; 
      font-weight: 600; 
    }
    blockquote {
      border-left: 4px solid #2563eb;
      padding-left: 20px;
      margin: 20px 0;
      color: #64748b;
      font-style: italic;
    }
    ul, ol {
      margin: 15px 0;
      padding-left: 30px;
    }
    li {
      margin: 8px 0;
    }
    .doc-header {
      background: #f8fafc;
      padding: 15px 20px;
      border-radius: 8px;
      margin-bottom: 30px;
      border-left: 4px solid #2563eb;
    }
    .doc-header .filename {
      font-family: 'Courier New', monospace;
      color: #64748b;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <!-- Cover Page -->
  <div class="cover-page">
    <h1>📚 Care Commons Documentation</h1>
    <div class="subtitle">Shared care software, community owned</div>
    <div class="meta">
      <p>Generated: ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}</p>
      <p>Total Documents: ${categories.reduce((sum, cat) => sum + cat.files.length, 0)}</p>
      <p>Brought to you by <strong>Neighborhood Lab</strong></p>
    </div>
  </div>

  <!-- Table of Contents -->
  <div class="toc">
    <h1>Table of Contents</h1>
`;

categories.forEach(cat => {
  combinedContent += `
    <div class="toc-category">
      <h2>${cat.name}</h2>
      <div class="description">${cat.description}</div>
      <ul>
`;
  cat.files.forEach(file => {
    combinedContent += `        <li>${file.title}</li>\n`;
  });
  combinedContent += `      </ul>
    </div>
`;
});

combinedContent += `  </div>\n\n`;

// Add each category with its documents
let docCount = 0;
categories.forEach((cat, catIdx) => {
  // Part divider
  combinedContent += `
  <div class="part-divider">
    <h1>Part ${catIdx + 1}</h1>
    <h1>${cat.name}</h1>
    <div class="description">${cat.description}</div>
  </div>
`;

  // Add documents in this category
  cat.files.forEach((file, fileIdx) => {
    docCount++;
    if (docCount % 20 === 0) {
      console.log(`Processing ${docCount}/${categories.reduce((sum, c) => sum + c.files.length, 0)}...`);
    }

    const content = fs.readFileSync(file.filename, 'utf8');
    const articleMatch = content.match(/<article class="markdown-content">([\s\S]*?)<\/article>/);
    
    if (articleMatch) {
      combinedContent += `
  <div class="doc-header">
    <div class="filename">${file.filename}</div>
  </div>
  ${articleMatch[1]}
`;
    }
  });
});

combinedContent += '</body></html>';

// Write combined HTML
const tempFile = 'care-commons-docs-combined.html';
fs.writeFileSync(tempFile, combinedContent);
console.log(`\n✅ Created curated HTML: ${tempFile}`);

// Convert to PDF using wkhtmltopdf
const outputPdf = 'care-commons-documentation.pdf';

console.log('\n🔄 Converting to PDF...');

try {
  execSync(`which wkhtmltopdf`, { stdio: 'pipe' });
  console.log('Using wkhtmltopdf...');
  execSync(
    `wkhtmltopdf --enable-local-file-access --no-stop-slow-scripts --javascript-delay 1000 --print-media-type "${tempFile}" "${outputPdf}"`,
    { stdio: 'inherit' }
  );
  console.log(`\n✅ PDF generated: ${outputPdf}`);
  
  // Show file size
  const stats = fs.statSync(outputPdf);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(1);
  console.log(`   Size: ${sizeMB} MB`);
  
  // Clean up temp file
  fs.unlinkSync(tempFile);
  
} catch (e) {
  console.log(`\n⚠️  PDF conversion failed. Combined HTML saved as: ${tempFile}`);
  console.log('\nTo convert to PDF:');
  console.log('  • Install wkhtmltopdf: brew install wkhtmltopdf');
  console.log('  • Or open the HTML file and use "Print to PDF"');
}
