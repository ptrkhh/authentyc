/**
 * Test new parser approach for ChatGPT share links
 */

const fs = require('fs');
const script = fs.readFileSync('script-8.txt', 'utf-8');

console.log('Testing new parser approach...\n');

// Strategy: Find all strings longer than 50 chars
// These are likely to be message content, not property names or IDs
const allStrings = [];
const stringPattern = /"([^"]{50,})"/g;
let match;

while ((match = stringPattern.exec(script)) !== null) {
  const content = match[1];

  // Unescape the content
  const unescaped = content
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
    .replace(/\\t/g, '\t');

  // Filter out URLs, technical strings, metadata, etc.
  if (
    unescaped.startsWith('http') ||
    unescaped.startsWith('https://') ||
    unescaped.includes('cdn.oaistatic') ||
    unescaped.includes('window.') ||
    unescaped.includes('function(') ||
    unescaped.includes('import ') ||
    unescaped.match(/^[a-f0-9-]{36}$/i) || // UUIDs
    unescaped.includes('_v4.0') || // Model names
    unescaped.startsWith(':') || // Technical data like ":239},0.071673..."
    unescaped.match(/^[\d\.,\[\]\{\}\\:]+/) || // Starts with numbers/brackets
    unescaped.length < 20 || // Too short to be a meaningful message
    !unescaped.match(/[a-z]{3,}/i) // Must contain actual words (3+ letters)
  ) {
    continue;
  }

  allStrings.push(unescaped);
}

console.log(`Found ${allStrings.length} potential message strings\n`);

// Now we need to identify which are messages and assign roles
// In a typical conversation: user, assistant, user, assistant, etc.
// The first message is usually from the user

console.log('First 10 strings:\n');
allStrings.slice(0, 10).forEach((str, i) => {
  console.log(`${i + 1}. [${i % 2 === 0 ? 'USER' : 'ASST'}]`);
  console.log(`   ${str.substring(0, 150).replace(/\n/g, ' ')}${str.length > 150 ? '...' : ''}`);
  console.log();
});
