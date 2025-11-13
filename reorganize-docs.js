#!/usr/bin/env node

const fs = require('fs');

console.log('📋 Reorganizing documentation structure...\n');

// Read all HTML files
const allFiles = fs.readdirSync('.')
  .filter(f => f.endsWith('.html') && f !== 'index.html')
  .map(filename => {
    const content = fs.readFileSync(filename, 'utf8');
    const titleMatch = content.match(/<title>([^<]+)<\/title>/);
    const title = titleMatch ? titleMatch[1].replace(' - Care Commons Documentation', '') : filename;
    return { filename, title };
  });

// Categorization logic based on new structure
function categorizeDoc(filename, title) {
  // DEVELOPER DOCS - exclude from main navigation
  if (
    filename.startsWith('claude-') || 
    filename.includes('-summary.html') ||
    filename.includes('implementation-') ||
    filename.includes('hardening') ||
    filename.includes('autonomous') ||
    filename.includes('pull-request') ||
    filename.includes('agents.html') ||
    filename.includes('contributing') ||
    filename.includes('dev-setup')
  ) {
    return 'developer';
  }
  
  // START HERE - Essential intro docs
  if (
    filename === 'readme.html' ||
    filename === 'showcase.html' ||
    filename === 'demo-quickstart.html' ||
    filename === 'showcase-readme.html'
  ) {
    return 'start';
  }
  
  // USING CARE COMMONS - Feature guides by vertical
  if (
    filename.includes('verticals-') &&
    (filename.includes('-readme.html') || filename.includes('-quickstart.html'))
  ) {
    return 'using';
  }
  
  if (
    filename.includes('showcase-') ||
    filename.includes('demo-') ||
    filename.includes('-examples.html') ||
    filename.includes('-wiring-guide.html')
  ) {
    return 'using';
  }
  
  // DEPLOYMENT - consolidated deployment docs
  if (
    filename.includes('deployment') ||
    filename.includes('vercel') ||
    filename.includes('cloudflare') ||
    filename.includes('database-quickstart') ||
    filename.includes('environment-setup') ||
    filename.includes('github-workflows')
  ) {
    return 'deployment';
  }
  
  // TECHNICAL REFERENCE - architecture, API, compliance
  if (
    filename.includes('architecture') ||
    filename.includes('api-') ||
    filename.includes('compliance-') && !filename.includes('claude-') ||
    filename.includes('packages-') && filename.includes('-readme') ||
    filename.includes('docs-') && (filename.includes('security') || filename.includes('performance'))
  ) {
    return 'reference';
  }
  
  // OPERATIONS - monitoring, backups, runbooks
  if (
    filename.includes('operations-') ||
    filename.includes('runbook') ||
    filename.includes('disaster') ||
    filename.includes('monitoring') ||
    filename.includes('backup')
  ) {
    return 'operations';
  }
  
  // Default to reference for anything else
  return 'reference';
}

// Categorize all documents
const categories = {
  start: { name: '🎯 Start Here', description: 'New to Care Commons? Begin here', files: [], priority: 1 },
  using: { name: '📖 Using Care Commons', description: 'Feature guides organized by what you want to do', files: [], priority: 2 },
  deployment: { name: '🚀 Deployment & Setup', description: 'Get Care Commons running', files: [], priority: 3 },
  reference: { name: '📚 Technical Reference', description: 'Architecture, APIs, and compliance details', files: [], priority: 4 },
  operations: { name: '⚙️ Operations', description: 'Monitoring, backups, and troubleshooting', files: [], priority: 5 },
  developer: { name: '👨‍💻 Developer Docs', description: 'Contributing and development (hidden from main nav)', files: [], priority: 6 }
};

allFiles.forEach(doc => {
  const cat = categorizeDoc(doc.filename, doc.title);
  categories[cat].files.push(doc);
});

// Sort files within categories
const sortPriority = (a, b) => {
  // Priority order for special files
  const priority = {
    'readme.html': 1,
    'showcase.html': 2,
    'demo-quickstart.html': 3,
  };
  
  const aPriority = priority[a.filename] || 999;
  const bPriority = priority[b.filename] || 999;
  
  if (aPriority !== bPriority) return aPriority - bPriority;
  
  // Then alphabetically
  return a.title.localeCompare(b.title);
};

Object.values(categories).forEach(cat => {
  cat.files.sort(sortPriority);
});

// Print categorization summary
console.log('NEW DOCUMENTATION STRUCTURE:\n');
Object.entries(categories)
  .sort(([,a], [,b]) => a.priority - b.priority)
  .forEach(([key, cat]) => {
    console.log(`${cat.name}: ${cat.files.length} documents`);
    if (key === 'developer') {
      console.log(`  (Hidden from main navigation)\n`);
    } else if (cat.files.length > 0) {
      console.log(`  Top items:`);
      cat.files.slice(0, 3).forEach(f => {
        console.log(`    - ${f.title}`);
      });
      console.log();
    }
  });

// Save categorization for the generate script to use
fs.writeFileSync('doc-categories.json', JSON.stringify(categories, null, 2));
console.log('✅ Saved categorization to doc-categories.json');
console.log('\nNext steps:');
console.log('  1. Review doc-categories.json');
console.log('  2. Run generate-site-html.js to update index.html');
console.log('  3. Run generate-pdf.js to create curated PDF');
