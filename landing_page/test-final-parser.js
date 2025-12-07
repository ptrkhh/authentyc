/**
 * Test the final parser with the updated pattern
 */

const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('chatgpt-share-sample.html', 'utf-8');
const $ = cheerio.load(html);

console.log('Testing final parser...\n');

const messages = [];
const scripts = $('script');

scripts.each((i, el) => {
  const scriptContent = $(el).html() || '';

  if (scriptContent.includes('window.__reactRouterContext') && scriptContent.length > 10000) {
    console.log(`Found React Router context in script ${i}`);

    // Extract messages using the pattern: ,[number],"message content"
    const messagePattern = /,\[(\d+)\],"([^"]{50,}?)"/g;
    const messageMatches = [...scriptContent.matchAll(messagePattern)];

    console.log(`Found ${messageMatches.length} potential message strings`);

    // Skip first message (usually system/empty)
    messageMatches.forEach((match, index) => {
      if (index === 0) return;

      const content = match[2]
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .replace(/\\t/g, '\t');

      // Skip very short messages
      if (content.trim().length < 10) return;

      // Alternate between user and assistant
      const role = index % 2 === 1 ? 'user' : 'assistant';
      messages.push({ role, content });
    });
  }
});

console.log(`\nExtracted ${messages.length} messages\n`);

if (messages.length > 0) {
  console.log('First 5 messages:');
  messages.slice(0, 5).forEach((msg, i) => {
    console.log(`\n${i + 1}. [${msg.role.toUpperCase()}]`);
    console.log(msg.content.substring(0, 150) + (msg.content.length > 150 ? '...' : ''));
  });
}
