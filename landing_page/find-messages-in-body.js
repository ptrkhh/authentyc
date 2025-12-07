/**
 * Find message content in HTML body
 */

const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('chatgpt-share-sample.html', 'utf-8');
const $ = cheerio.load(html);

console.log('=== FINDING MESSAGES IN HTML BODY ===\n');

// Save body text to see what's there
const bodyText = $('body').text();
fs.writeFileSync('body-text.txt', bodyText, 'utf-8');
console.log('Saved body text to body-text.txt');
console.log('Body text length:', bodyText.length);

// Search for the conversation title
const titleIndex = bodyText.indexOf('Life partner reflection questions');
console.log('\nTitle found at index:', titleIndex);

if (titleIndex >= 0) {
  // Show context around the title
  console.log('\nContext around title:');
  console.log(bodyText.substring(Math.max(0, titleIndex - 200), titleIndex + 200));
}

// Look for div elements that might contain messages
console.log('\n=== SEARCHING FOR DIV ELEMENTS ===\n');

// Try different selectors
const selectors = [
  'div[data-message-id]',
  'div[data-message-author-role]',
  'div[class*="message"]',
  'div[class*="turn"]',
  'div[class*="agent"]',
  'div[class*="user"]',
];

selectors.forEach(selector => {
  const elements = $(selector);
  if (elements.length > 0) {
    console.log(`Found ${elements.length} elements with selector: ${selector}`);
    elements.slice(0, 2).each((i, el) => {
      const $el = $(el);
      console.log(`  ${i + 1}:`);
      console.log(`    class: ${$el.attr('class')}`);
      console.log(`    text: ${$el.text().substring(0, 100)}...`);
    });
  }
});

// Try to find the main thread container
console.log('\n=== MAIN THREAD CONTAINER ===\n');
const thread = $('#thread');
if (thread.length > 0) {
  console.log('Found #thread element');

  // Save its HTML
  const threadHtml = thread.html() || '';
  fs.writeFileSync('thread.html', threadHtml, 'utf-8');
  console.log('Saved thread HTML to thread.html');
  console.log('Thread HTML length:', threadHtml.length);

  // Look for direct children
  const children = thread.children();
  console.log(`\nThread has ${children.length} direct children`);

  children.each((i, el) => {
    const $el = $(el);
    const tagName = el.name;
    const className = $el.attr('class');
    console.log(`  ${i + 1}. <${tagName}> class="${className}"`);
  });
}

// Search for specific text patterns that might indicate message boundaries
console.log('\n=== TEXT PATTERN ANALYSIS ===\n');

// Count newlines and see if there are distinct message blocks
const lines = bodyText.split('\n').filter(line => line.trim().length > 20);
console.log(`Found ${lines.length} non-empty lines (> 20 chars)`);

if (lines.length > 0 && lines.length < 100) {
  console.log('\nFirst 10 lines:');
  lines.slice(0, 10).forEach((line, i) => {
    console.log(`  ${i + 1}: ${line.substring(0, 100)}...`);
  });
}
