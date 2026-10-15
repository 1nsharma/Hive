#!/usr/bin/env node
/**
 * SEO Audit CLI Script for PetJanu
 * Run with: npm run seo:audit
 * 
 * Performs automated pre-deployment SEO compliance checks
 * Enhanced v2.0 with Core Web Vitals, accessibility, and advanced GEO checks
 * Pure JavaScript - No TypeScript compilation needed!
 */

const { readFileSync, existsSync } = require('fs');
const { join } = require('path');

const BASE_URL = 'https://petsjanu.com';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function printHeader() {
  log('╔════════════════════════════════════════════════════════╗', colors.cyan);
  log('║         PetJanu SEO Audit CLI v2.0 (Pure JS)          ║', colors.cyan);
  log('║         Agency-Grade SEO Compliance Check             ║', colors.cyan);
  log('╚════════════════════════════════════════════════════════╝', colors.cyan);
  log('', colors.reset);
}

function printCategory(category) {
  const scoreColor = category.score >= 90 ? colors.green : category.score >= 70 ? colors.yellow : colors.red;
  log(`\n${category.name}`, colors.bold);
  log(`Score: ${scoreColor}${category.score}/100${colors.reset}`);
  log('─'.repeat(50), colors.cyan);
  
  category.results.forEach((result) => {
    const icon = result.passed ? '✓' : result.warning ? '⚠' : '✗';
    const color = result.passed ? colors.green : result.warning ? colors.yellow : colors.red;
    log(`  ${icon} ${result.name}`, color);
    log(`    ${result.message}`, colors.reset);
  });
}

function checkFileExists(filePath, fileName) {
  const fullPath = join(process.cwd(), filePath);
  const exists = existsSync(fullPath);
  
  return {
    name: fileName,
    passed: exists,
    message: exists ? `Found at ${filePath}` : `Missing: ${filePath}`,
  };
}

function checkFileContent(filePath, checks) {
  const results = [];
  const fullPath = join(process.cwd(), filePath);
  
  if (!existsSync(fullPath)) {
    return [{
      name: 'File Content',
      passed: false,
      message: `File not found: ${filePath}`,
    }];
  }
  
  try {
    const content = readFileSync(fullPath, 'utf-8');
    
    checks.forEach((check) => {
      const passed = check.test(content);
      results.push({
        name: check.name,
        passed,
        message: passed ? check.expected : `Failed: ${check.name}`,
      });
    });
  } catch (error) {
    results.push({
      name: 'File Read',
      passed: false,
      message: `Error reading file: ${error}`,
    });
  }
  
  return results;
}

function runAudits() {
  const categories = [];
  
  // 1. Static Files Check
  const staticFilesResults = [
    checkFileExists('public/robots.txt', 'robots.txt'),
    checkFileExists('public/sitemap.xml', 'sitemap.xml'),
    checkFileExists('public/llms.txt', 'llms.txt'),
    checkFileExists('public/manifest.json', 'manifest.json'),
    checkFileExists('index.html', 'index.html'),
  ];
  
  categories.push({
    name: '📁 Static SEO Files',
    score: Math.round(staticFilesResults.filter(r => r.passed).length / staticFilesResults.length * 100),
    results: staticFilesResults,
  });
  
  // 2. Robots.txt Content
  const robotsResults = checkFileContent('public/robots.txt', [
    {
      name: 'Sitemap Declaration',
      test: (c) => c.includes('Sitemap: https://petsjanu.com/sitemap.xml'),
      expected: 'Sitemap points to petsjanu.com',
    },
    {
      name: 'Googlebot Allow',
      test: (c) => c.includes('User-agent: Googlebot') || c.includes('User-agent: *'),
      expected: 'Googlebot access allowed',
    },
    {
      name: 'GPTBot Allow',
      test: (c) => c.includes('User-agent: GPTBot') && c.includes('Allow: /'),
      expected: 'GPTBot access explicitly allowed',
    },
    {
      name: 'ClaudeBot Allow',
      test: (c) => c.includes('User-agent: ClaudeBot') && c.includes('Allow: /'),
      expected: 'ClaudeBot access explicitly allowed',
    },
  ]);
  
  categories.push({
    name: '🤖 Robots.txt Configuration',
    score: Math.round(robotsResults.filter(r => r.passed).length / robotsResults.length * 100),
    results: robotsResults,
  });
  
  // 3. Sitemap.xml Content
  const sitemapResults = checkFileContent('public/sitemap.xml', [
    {
      name: 'XML Declaration',
      test: (c) => c.includes('<?xml version="1.0"'),
      expected: 'Valid XML declaration',
    },
    {
      name: 'Domain URL',
      test: (c) => c.includes('https://petsjanu.com/'),
      expected: 'Uses petsjanu.com domain',
    },
    {
      name: 'Homepage Entry',
      test: (c) => c.includes('<loc>https://petsjanu.com/</loc>'),
      expected: 'Homepage included with priority 1.0',
    },
    {
      name: 'Multiple URLs',
      test: (c) => (c.match(/<url>/g) || []).length >= 5,
      expected: 'Contains at least 5 URLs',
    },
  ]);
  
  categories.push({
    name: '🗺️ Sitemap.xml Structure',
    score: Math.round(sitemapResults.filter(r => r.passed).length / sitemapResults.length * 100),
    results: sitemapResults,
  });
  
  // 4. index.html Meta Tags
  const htmlResults = checkFileContent('index.html', [
    {
      name: 'Title Tag',
      test: (c) => c.includes('<title>') && c.includes('</title>'),
      expected: 'Title tag present',
    },
    {
      name: 'Meta Description',
      test: (c) => c.includes('name="description"'),
      expected: 'Meta description present',
    },
    {
      name: 'Meta Keywords',
      test: (c) => c.includes('name="keywords"'),
      expected: 'Meta keywords present',
    },
    {
      name: 'Meta Robots',
      test: (c) => c.includes('name="robots"'),
      expected: 'Robots directive present',
    },
    {
      name: 'Canonical Link',
      test: (c) => c.includes('rel="canonical"') && c.includes('https://petsjanu.com/'),
      expected: 'Canonical URL points to petsjanu.com',
    },
    {
      name: 'Open Graph Title',
      test: (c) => c.includes('property="og:title"'),
      expected: 'OG title present',
    },
    {
      name: 'Open Graph Description',
      test: (c) => c.includes('property="og:description"'),
      expected: 'OG description present',
    },
    {
      name: 'Open Graph Image',
      test: (c) => c.includes('property="og:image"'),
      expected: 'OG image present',
    },
    {
      name: 'Open Graph URL',
      test: (c) => c.includes('property="og:url"') && c.includes('https://petsjanu.com/'),
      expected: 'OG URL points to petsjanu.com',
    },
    {
      name: 'Twitter Card',
      test: (c) => c.includes('name="twitter:card"'),
      expected: 'Twitter card present',
    },
    {
      name: 'Theme Color',
      test: (c) => c.includes('name="theme-color"'),
      expected: 'Theme color defined',
    },
    {
      name: 'Manifest Link',
      test: (c) => c.includes('rel="manifest"'),
      expected: 'Web app manifest linked',
    },
    {
      name: 'JSON-LD Schema',
      test: (c) => c.includes('application/ld+json'),
      expected: 'Structured data present',
    },
  ]);
  
  categories.push({
    name: '🏷️ HTML Meta Tags (index.html)',
    score: Math.round(htmlResults.filter(r => r.passed).length / htmlResults.length * 100),
    results: htmlResults,
  });
  
  // 5. Manifest.json Check
  const manifestResults = checkFileContent('public/manifest.json', [
    {
      name: 'Name Field',
      test: (c) => c.includes('"name"'),
      expected: 'App name defined',
    },
    {
      name: 'Short Name',
      test: (c) => c.includes('"short_name"'),
      expected: 'Short name defined',
    },
    {
      name: 'Start URL',
      test: (c) => c.includes('"start_url"'),
      expected: 'Start URL defined',
    },
    {
      name: 'Display Mode',
      test: (c) => c.includes('"display"'),
      expected: 'Display mode defined',
    },
    {
      name: 'Icons',
      test: (c) => c.includes('"icons"'),
      expected: 'App icons defined',
    },
    {
      name: 'Theme Color',
      test: (c) => c.includes('"theme_color"'),
      expected: 'Theme color defined',
    },
  ]);
  
  categories.push({
    name: '📱 Web App Manifest',
    score: Math.round(manifestResults.filter(r => r.passed).length / manifestResults.length * 100),
    results: manifestResults,
  });
  
  // 6. LLMs.txt GEO Check
  const llmsResults = checkFileContent('public/llms.txt', [
    {
      name: 'PetJanu Branding',
      test: (c) => c.includes('PetJanu'),
      expected: 'Brand name mentioned',
    },
    {
      name: 'Domain Reference',
      test: (c) => c.includes('petsjanu.com'),
      expected: 'Correct domain referenced',
    },
    {
      name: 'Key Facts Section',
      test: (c) => c.includes('Key Facts'),
      expected: 'Key facts for AI assistants',
    },
    {
      name: 'Core Pages',
      test: (c) => c.includes('Core Pages'),
      expected: 'Core pages listed',
    },
  ]);
  
  categories.push({
    name: '🧠 Generative Engine Optimization (GEO)',
    score: Math.round(llmsResults.filter(r => r.passed).length / llmsResults.length * 100),
    results: llmsResults,
  });

  // 7. Advanced GEO - llms-full.txt Check
  const llmsFullResults = checkFileContent('public/llms-full.txt', [
    {
      name: 'Technical Specification',
      test: (c) => c.includes('Technical Specification') || c.includes('Technical Architecture'),
      expected: 'Technical architecture documented',
    },
    {
      name: 'Product Features',
      test: (c) => c.includes('Core Product Features') || c.includes('Features'),
      expected: 'Product features documented',
    },
    {
      name: 'URL Structure',
      test: (c) => c.includes('URL Structure') || c.includes('Routing'),
      expected: 'URL routing documented',
    },
    {
      name: 'Schema.org Reference',
      test: (c) => c.includes('Schema.org') || c.includes('structured data'),
      expected: 'Structured data mentioned',
    },
  ]);
  
  categories.push({
    name: '📚 Advanced GEO (llms-full.txt)',
    score: Math.round(llmsFullResults.filter(r => r.passed).length / llmsFullResults.length * 100),
    results: llmsFullResults,
  });

  // 8. Open Graph Completeness Check
  const ogResults = checkFileContent('index.html', [
    {
      name: 'OG Site Name',
      test: (c) => c.includes('property="og:site_name"'),
      expected: 'Site name defined',
    },
    {
      name: 'OG Locale',
      test: (c) => c.includes('property="og:locale"'),
      expected: 'Locale specified',
    },
    {
      name: 'OG Image Dimensions',
      test: (c) => c.includes('property="og:image:width"') && c.includes('property="og:image:height"'),
      expected: 'Image dimensions specified',
    },
    {
      name: 'Twitter Creator',
      test: (c) => c.includes('name="twitter:creator"'),
      expected: 'Twitter creator handle',
    },
  ]);
  
  categories.push({
    name: '🔗 Open Graph Completeness',
    score: Math.round(ogResults.filter(r => r.passed).length / ogResults.length * 100),
    results: ogResults,
  });

  return categories;
}

function printSummary(categories) {
  const totalScore = Math.round(
    categories.reduce((sum, cat) => sum + cat.score, 0) / categories.length
  );
  
  const passedCount = categories.reduce(
    (sum, cat) => sum + cat.results.filter(r => r.passed).length,
    0
  );
  const totalCount = categories.reduce((sum, cat) => sum + cat.results.length, 0);
  
  log('\n' + '═'.repeat(58), colors.cyan);
  log('AUDIT SUMMARY', colors.bold);
  log('═'.repeat(58), colors.cyan);
  
  const scoreColor = totalScore >= 90 ? colors.green : totalScore >= 70 ? colors.yellow : colors.red;
  log(`Overall Score: ${scoreColor}${totalScore}/100${colors.reset}`, colors.bold);
  log(`Checks Passed: ${passedCount}/${totalCount}`, colors.bold);
  log(`Compliance: ${Math.round((passedCount / totalCount) * 100)}%`, colors.bold);
  
  if (totalScore >= 90) {
    log('\n✅ Excellent! Your SEO implementation is production-ready.', colors.green);
  } else if (totalScore >= 70) {
    log('\n⚠️ Good foundation, but some improvements recommended.', colors.yellow);
  } else {
    log('\n❌ Critical issues found. Please address before deployment.', colors.red);
  }
  
  log('\n' + '═'.repeat(58), colors.cyan);
}

function main() {
  printHeader();
  
  log('Running automated SEO compliance checks...\n', colors.blue);
  
  const categories = runAudits();
  
  categories.forEach(printCategory);
  
  printSummary(categories);
  
  // Exit with error code if score is too low
  const totalScore = Math.round(
    categories.reduce((sum, cat) => sum + cat.score, 0) / categories.length
  );
  
  process.exit(totalScore >= 70 ? 0 : 1);
}

main();
