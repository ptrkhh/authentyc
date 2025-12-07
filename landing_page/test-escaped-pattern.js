/**
 * Test pattern with proper escaping
 */

const fs = require('fs');

const script = fs.readFileSync('script-8.txt', 'utf-8');

console.log('Looking for escaped message patterns...\n');

// In the file, quotes are escaped as \"
// So we need to look for: ,[number],\"long string content\"

// Pattern: ],number],\"text content\"
const pattern = /\],\[(\d+)\],\\"([^\\]{50,}?)\\"/g;
const matches = [...script.matchAll(pattern)];

console.log(`Found ${matches.length} potential messages:\n`);

// Filter and process
const messages = [];
matches.forEach((match, i) => {
  const number = match[1];
  let content = match[2];

  // Unescape the content
  content = content
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
    .replace(/\\t/g, '\t');

  // Skip very short or system messages
  if (content.trim().length < 10) return;

  messages.push({ number, content });

  if (i < 15) {
    console.log(`${i + 1}. [${number}]:`);
    console.log(`   ${content.substring(0, 150)}...`);
    console.log();
  }
});

console.log(`\nTotal messages after filtering: ${messages.length}`);
