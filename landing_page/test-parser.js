/**
 * Test the updated parser
 */

const fs = require('fs');
const { parseChatGPTShareHTML } = require('./lib/chatgpt/parser.ts');

const html = fs.readFileSync('chatgpt-share-sample.html', 'utf-8');

console.log('Testing parser with sample HTML...\n');

const result = parseChatGPTShareHTML(html);

console.log('\n=== PARSER RESULT ===');
console.log('Messages found:', result.messageCount);
console.log('Has personality prompt:', result.hasPersonalityPrompt);
console.log('Quality:', result.estimatedQuality);

if (result.messages.length > 0) {
  console.log('\nFirst 3 messages:');
  result.messages.slice(0, 3).forEach((msg, i) => {
    console.log(`\n${i + 1}. [${msg.role}]`);
    console.log(msg.content.substring(0, 200) + '...');
  });
}
