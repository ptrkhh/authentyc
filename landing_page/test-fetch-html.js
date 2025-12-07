/**
 * Test script to fetch and save ChatGPT shared link HTML for inspection
 */

const fs = require('fs');

async function fetchAndSaveHTML() {
  const shareUrl = 'https://chatgpt.com/share/69355c5c-3c24-8004-a863-3bc2bb96ea56';

  console.log('Fetching:', shareUrl);

  const response = await fetch(shareUrl, {
    headers: {
      'User-Agent': 'Authentyc Bot/1.0 (https://authentyc.ai; contact@authentyc.ai)',
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  if (!response.ok) {
    console.error('HTTP error:', response.status);
    process.exit(1);
  }

  const html = await response.text();

  console.log('HTML length:', html.length);
  console.log('Status:', response.status);
  console.log('Content-Type:', response.headers.get('content-type'));

  // Save to file
  const filename = 'chatgpt-share-sample.html';
  fs.writeFileSync(filename, html, 'utf-8');
  console.log('Saved to:', filename);

  // Check for __NEXT_DATA__
  const hasNextData = html.includes('__NEXT_DATA__');
  console.log('Has __NEXT_DATA__:', hasNextData);

  // Check for common selectors
  console.log('\nSearching for message containers...');
  const patterns = [
    'class="group',
    'data-testid',
    'data-message',
    'conversation-turn',
    'markdown',
    'prose',
  ];

  patterns.forEach(pattern => {
    const count = (html.match(new RegExp(pattern, 'g')) || []).length;
    console.log(`  "${pattern}": ${count} occurrences`);
  });
}

fetchAndSaveHTML().catch(console.error);
