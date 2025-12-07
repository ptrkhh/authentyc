/**
 * Inspect ChatGPT HTML structure to find message containers
 */

const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('chatgpt-share-sample.html', 'utf-8');
const $ = cheerio.load(html);

console.log('=== HTML STRUCTURE INSPECTION ===\n');

// Check for script tags with JSON
console.log('Script tags:');
$('script').each((i, el) => {
  const $el = $(el);
  const id = $el.attr('id');
  const type = $el.attr('type');
  const content = $el.html() || '';

  if (id || type || content.length > 100) {
    console.log(`  Script ${i}:`);
    if (id) console.log(`    id: ${id}`);
    if (type) console.log(`    type: ${type}`);
    console.log(`    length: ${content.length}`);
    if (content.includes('conversation') || content.includes('message')) {
      console.log(`    ⚠️  Contains "conversation" or "message"`);
      // Show first 500 chars
      console.log(`    Preview: ${content.substring(0, 500)}...`);
    }
  }
});

console.log('\n=== LOOKING FOR MESSAGE CONTAINERS ===\n');

// Look for divs with specific classes
const classPatterns = [
  'group',
  'message',
  'conversation',
  'markdown',
  'prose',
  'turn',
];

classPatterns.forEach(pattern => {
  const elements = $(`[class*="${pattern}"]`);
  console.log(`Elements with class containing "${pattern}": ${elements.length}`);

  if (elements.length > 0 && elements.length < 50) {
    elements.slice(0, 3).each((i, el) => {
      const $el = $(el);
      const className = $el.attr('class');
      const text = $el.text().substring(0, 100);
      console.log(`  ${i + 1}. class="${className}"`);
      console.log(`     text preview: ${text}...`);
    });
  }
});

console.log('\n=== MAIN CONTENT AREA ===\n');

// Look for main content container
const main = $('main');
console.log('Main elements:', main.length);

if (main.length > 0) {
  const mainHtml = main.html() || '';
  console.log('Main HTML length:', mainHtml.length);
  console.log('Main HTML preview (first 1000):', mainHtml.substring(0, 1000));
}

console.log('\n=== ARTICLE ELEMENTS ===\n');
const articles = $('article');
console.log('Article elements:', articles.length);
articles.each((i, el) => {
  const $el = $(el);
  const className = $el.attr('class');
  const text = $el.text().substring(0, 200);
  console.log(`Article ${i + 1}:`);
  console.log(`  class: ${className}`);
  console.log(`  text length: ${$el.text().length}`);
  console.log(`  preview: ${text}...`);
});

console.log('\n=== DIV WITH DATA ATTRIBUTES ===\n');
const dataAttrs = $('div[data-testid], div[data-message-id], div[data-message]');
console.log('Divs with data-* attributes:', dataAttrs.length);
dataAttrs.each((i, el) => {
  const $el = $(el);
  const attrs = {};
  Object.keys(el.attribs).forEach(key => {
    if (key.startsWith('data-')) {
      attrs[key] = el.attribs[key];
    }
  });
  console.log(`  ${i + 1}:`, attrs);
});
