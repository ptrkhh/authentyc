/**
 * Test the parser logic directly in JavaScript
 */

const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('chatgpt-share-sample.html', 'utf-8');
const $ = cheerio.load(html);

console.log('Testing parser with sample HTML...\n');

const messages = [];

// Strategy 2: Parse React Router context
const scripts = $('script');
let foundData = false;

scripts.each((i, el) => {
  const scriptContent = $(el).html() || '';

  if (scriptContent.includes('window.__reactRouterContext') && scriptContent.length > 10000) {
    console.log(`Found React Router context in script ${i}`);
    console.log(`Script length: ${scriptContent.length}`);
    foundData = true;

    // Extract conversation messages using regex patterns
    const partsPattern = /"parts":\["([^"]+?)"\]/g;
    const partsMatches = [...scriptContent.matchAll(partsPattern)];

    console.log(`Found ${partsMatches.length} parts matches`);

    partsMatches.forEach((match, index) => {
      const content = match[1]
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t');

      // Skip empty messages
      if (content.trim().length === 0) {
        console.log(`Skipping empty message at index ${index}`);
        return;
      }

      // Alternate between user and assistant
      const role = index % 2 === 0 ? 'user' : 'assistant';
      messages.push({ role, content });

      console.log(`\nMessage ${index + 1} [${role}]:`);
      console.log(content.substring(0, 100) + '...');
    });
  }
});

console.log(`\n=== FINAL RESULT ===`);
console.log(`Messages extracted: ${messages.length}`);

if (messages.length > 0) {
  console.log('\nFirst 3 messages:');
  messages.slice(0, 3).forEach((msg, i) => {
    console.log(`\n${i + 1}. [${msg.role}]`);
    console.log(msg.content.substring(0, 200));
  });
}
