/**
 * Check Prompts Encoding and Content
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkPrompts() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !secretKey) {
    console.error('❌ Missing environment variables!');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, secretKey);

  try {
    const { data: prompts, error } = await supabase
      .from('prompts')
      .select('key, content, metadata')
      .eq('is_active', true)
      .order('key');

    if (error) throw error;

    console.log(`Found ${prompts.length} active prompts\n`);

    prompts.forEach(p => {
      console.log('=====================================');
      console.log('Key:', p.key);
      console.log('Category:', p.metadata?.category || 'N/A');
      console.log('Total Length:', p.content.length, 'characters');
      console.log('\nFirst 300 characters:');
      console.log(p.content.substring(0, 300));
      console.log('\n...TRUNCATED...\n');
      console.log('Last 200 characters:');
      console.log(p.content.substring(p.content.length - 200));

      // Check for backslashes
      const backslashCount = (p.content.match(/\\/g) || []).length;
      console.log('\nBackslash count:', backslashCount);

      // Check for corruption patterns
      const corruptions = [
        { pattern: /\\RIMARY/g, name: '\\RIMARY (should be PRIMARY)' },
        { pattern: /\\HASE/g, name: '\\HASE (should be PHASE)' },
        { pattern: /\\or each/g, name: '\\or each (should be For each)' },
        { pattern: /\\ased/g, name: '\\ased (should be Based)' },
      ];

      console.log('\nCorruption check:');
      corruptions.forEach(({ pattern, name }) => {
        const matches = p.content.match(pattern);
        if (matches) {
          console.log(`  ❌ Found ${matches.length} instances of ${name}`);
        }
      });

      // Check first 10 lines
      const lines = p.content.split('\n');
      console.log(`\nTotal lines: ${lines.length}`);
      console.log('First 10 lines:');
      lines.slice(0, 10).forEach((line, i) => {
        console.log(`  ${i+1}: ${line}`);
      });
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkPrompts();
