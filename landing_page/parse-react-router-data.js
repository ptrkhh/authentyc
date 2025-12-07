/**
 * Parse React Router serialized data format
 */

const fs = require('fs');

const script = fs.readFileSync('script-8.txt', 'utf-8');

console.log('Script length:', script.length);

// Try to find message content
// Look for patterns like:  "text":"actual message content"
const textMatches = [...script.matchAll(/"text":"([^"]{20,}?)"/g)];

console.log(`\nFound ${textMatches.length} potential text fields:\n`);

textMatches.forEach((match, i) => {
  // Unescape the text
  const text = match[1]
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');

  console.log(`${i + 1}. ${text.substring(0, 200)}...`);
  console.log();
});

// Also try to find "parts" arrays which contain message content
const partsMatches = [...script.matchAll(/"parts":\["([^"]{20,}?)"\]/g)];

console.log(`\nFound ${partsMatches.length} potential parts arrays:\n`);

partsMatches.forEach((match, i) => {
  const text = match[1]
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');

  console.log(`${i + 1}. ${text.substring(0, 200)}...`);
  console.log();
});
