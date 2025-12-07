/**
 * Test role detection for ChatGPT messages
 */

const fs = require('fs');
const script = fs.readFileSync('script-8.txt', 'utf-8');

console.log('Testing role detection...\n');

// Find all long strings with their surrounding context
const contextPattern = /.{0,100}"([^"]{100,})".{0,100}/g;
let match;
const messagesWithContext = [];

while ((match = contextPattern.exec(script)) !== null) {
  const content = match[1];
  const before = match[0].substring(0, match[0].indexOf('"'));
  const after = match[0].substring(match[0].indexOf('"') + content.length + 2);

  // Unescape
  const unescaped = content
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
    .replace(/\\t/g, '\t');

  // Filter out technical strings
  if (
    unescaped.startsWith('http') ||
    unescaped.includes('cdn.oaistatic') ||
    unescaped.includes('window.') ||
    unescaped.includes('function(') ||
    unescaped.includes('_v4.0') ||
    unescaped.startsWith(':') ||
    !unescaped.match(/[a-z]{3,}/i)
  ) {
    continue;
  }

  messagesWithContext.push({
    before,
    content: unescaped,
    after,
  });
}

console.log(`Found ${messagesWithContext.length} messages\n`);

// Check first 10 for role indicators
messagesWithContext.slice(0, 10).forEach((msg, i) => {
  // Look for "user" or "assistant" in the context
  const hasUser = msg.before.includes('"user"') || msg.after.includes('"user"');
  const hasAssistant = msg.before.includes('"assistant"') || msg.after.includes('"assistant"');
  const hasSystem = msg.before.includes('"system"') || msg.after.includes('"system"');

  let role = 'UNKNOWN';
  if (hasUser) role = 'USER';
  if (hasAssistant) role = 'ASSISTANT';
  if (hasSystem) role = 'SYSTEM';

  console.log(`${i + 1}. [${role}]`);
  console.log(`   ${msg.content.substring(0, 100).replace(/\n/g, ' ')}...`);
  console.log(`   Context before: ...${msg.before.substring(Math.max(0, msg.before.length - 50))}`);
  console.log(`   Context after: ${msg.after.substring(0, 50)}...`);
  console.log();
});
