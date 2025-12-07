/**
 * Extract conversation data from ChatGPT HTML - v2
 */

const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('chatgpt-share-sample.html', 'utf-8');
const $ = cheerio.load(html);

console.log('=== EXTRACTING CONVERSATION DATA V2 ===\n');

// Find the script with conversation data
let scriptIndex = 0;
$('script').each((i, el) => {
  const $el = $(el);
  const content = $el.html() || '';

  // Look for window.__reactRouterContext with significant content
  if (content.includes('window.__reactRouterContext') && content.length > 10000) {
    console.log(`Found large window.__reactRouterContext in script ${i}`);
    console.log('Length:', content.length);

    // Save the full script content
    const filename = `script-${i}.txt`;
    fs.writeFileSync(filename, content, 'utf-8');
    console.log(`Saved to: ${filename}`);

    // Look for the "mapping" keyword which usually contains the conversation
    if (content.includes('"mapping"') || content.includes("'mapping'")) {
      console.log('✓ Contains "mapping" - likely has conversation data');

      // Try to extract the mapping section
      const mappingMatch = content.match(/"mapping"[^{]*{[^}]*}/);
      if (mappingMatch) {
        console.log('\nMapping section preview:');
        console.log(mappingMatch[0].substring(0, 500));
      }
    }

    // Look for message-like content
    const hasContent = content.includes('"content"') || content.includes("'content'");
    const hasAuthor = content.includes('"author"') || content.includes("'author'");
    const hasMessage = content.includes('"message"') || content.includes("'message'");

    console.log(`\nContent indicators:`);
    console.log(`  - Has "content": ${hasContent}`);
    console.log(`  - Has "author": ${hasAuthor}`);
    console.log(`  - Has "message": ${hasMessage}`);

    scriptIndex = i;
  }
});

// Try to find any message-like content in the HTML
console.log('\n=== SEARCHING FOR MESSAGE PATTERNS ===\n');

// Look for text that might be conversation content
const bodyText = $('body').text();
console.log('Body text length:', bodyText.length);

// Look for the conversation title from the logs
if (bodyText.includes('Life partner reflection questions')) {
  console.log('✓ Found conversation title in body text');
}

// Try to find any structured data
console.log('\n=== LOOKING FOR STRUCTURED DATA PATTERNS ===\n');

// Search for common message patterns in the script content
const script8 = $('script').eq(8).html() || '';
if (script8.length > 0) {
  // Look for the structure that contains messages
  // Based on the preview, it seems to use a reference-based format

  // Try to find where the actual message content is
  const patterns = [
    /"text":"([^"]{50,}?)"/g,
    /'text':'([^']{50,})'/g,
    /"parts":\["([^"]{50,}?)"\]/g,
    /"content":"([^"]{50,}?)"/g,
  ];

  patterns.forEach((pattern, index) => {
    const matches = [...script8.matchAll(pattern)];
    if (matches.length > 0) {
      console.log(`Pattern ${index + 1} (${pattern.source}) found ${matches.length} matches:`);
      matches.slice(0, 3).forEach((match, i) => {
        console.log(`  ${i + 1}: "${match[1].substring(0, 100)}..."`);
      });
      console.log();
    }
  });
}
