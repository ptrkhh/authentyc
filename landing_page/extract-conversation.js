/**
 * Extract conversation data from ChatGPT HTML
 */

const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('chatgpt-share-sample.html', 'utf-8');
const $ = cheerio.load(html);

console.log('=== EXTRACTING CONVERSATION DATA ===\n');

// Find the script with conversation data
$('script').each((i, el) => {
  const $el = $(el);
  const content = $el.html() || '';

  // Look for window.__reactRouterContext
  if (content.includes('window.__reactRouterContext')) {
    console.log(`Found window.__reactRouterContext in script ${i}`);
    console.log('Length:', content.length);

    // Extract the JSON data
    // The format is: window.__reactRouterContext.streamController.enqueue("[...]")
    try {
      // Find the JSON string
      const match = content.match(/enqueue\("(.+)"\)/s);
      if (match) {
        // The JSON is escaped, need to unescape it
        let jsonStr = match[1];

        // Unescape the string
        jsonStr = jsonStr
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\');

        // Try to parse as JSON
        console.log('\nJSON string preview (first 1000 chars):');
        console.log(jsonStr.substring(0, 1000));

        // Save to file for inspection
        fs.writeFileSync('conversation-data-raw.txt', jsonStr, 'utf-8');
        console.log('\nSaved raw data to: conversation-data-raw.txt');

        // Try to parse the array
        try {
          const data = JSON.parse(jsonStr);
          console.log('\nParsed successfully!');
          console.log('Type:', typeof data);
          console.log('Is array:', Array.isArray(data));

          if (Array.isArray(data)) {
            console.log('Array length:', data.length);
            console.log('\nFirst few elements:');
            data.slice(0, 5).forEach((item, i) => {
              console.log(`  ${i}:`, typeof item, JSON.stringify(item).substring(0, 100));
            });

            // Save parsed data
            fs.writeFileSync('conversation-data.json', JSON.stringify(data, null, 2), 'utf-8');
            console.log('\nSaved parsed data to: conversation-data.json');
          }
        } catch (parseErr) {
          console.error('\nFailed to parse JSON:', parseErr.message);
        }
      } else {
        console.log('No match found for enqueue pattern');
      }
    } catch (err) {
      console.error('Error:', err.message);
    }
  }

  // Also check for CLIENT_BOOTSTRAP
  if (content.includes('window.CLIENT_BOOTSTRAP')) {
    console.log(`\nFound window.CLIENT_BOOTSTRAP in script ${i}`);
    try {
      const match = content.match(/window\.CLIENT_BOOTSTRAP=(.+?)(?:;|<\/script>)/s);
      if (match) {
        const data = JSON.parse(match[1]);
        fs.writeFileSync('client-bootstrap.json', JSON.stringify(data, null, 2), 'utf-8');
        console.log('Saved to: client-bootstrap.json');
      }
    } catch (err) {
      console.error('Error parsing CLIENT_BOOTSTRAP:', err.message);
    }
  }
});
