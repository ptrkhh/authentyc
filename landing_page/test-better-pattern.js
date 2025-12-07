/**
 * Test better regex pattern for extracting messages
 */

const fs = require('fs');

const script = fs.readFileSync('script-8.txt', 'utf-8');

console.log('Looking for message patterns...\n');

// The pattern appears to be:  ],[number],"message content"
// where the message content can be quite long

// Let's try to find strings that are surrounded by numbers in brackets and quotes
const pattern = /\[(\d+)\],"([^"]{30,}?)"/g;
const matches = [...script.matchAll(pattern)];

console.log(`Found ${matches.length} potential messages:\n`);

matches.slice(0, 20).forEach((match, i) => {
  const [,, number,, content] = match;

  // Unescape
  const unescaped = content
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');

  console.log(`${i + 1}. [${match[1]}]:`);
  console.log(`   ${unescaped.substring(0, 100)}...`);
  console.log();
});
