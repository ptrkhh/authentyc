/**
 * Database Connection Test
 *
 * Run with: node test-db.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testDatabaseConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing environment variables!');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
    console.log('SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? '✓ Set' : '✗ Missing');
    process.exit(1);
  }

  console.log('✅ Environment variables found\n');

  // Create Supabase client
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    // Test 1: Check waitlist_leads table
    console.log('Test 1: Query waitlist_leads table...');
    const { data: leads, error: leadsError } = await supabase
      .from('waitlist_leads')
      .select('count');

    if (leadsError) throw leadsError;
    console.log('✅ waitlist_leads table accessible\n');

    // Test 2: Check chat_analyses table
    console.log('Test 2: Query chat_analyses table...');
    const { data: analyses, error: analysesError } = await supabase
      .from('chat_analyses')
      .select('count');

    if (analysesError) throw analysesError;
    console.log('✅ chat_analyses table accessible\n');

    // Test 3: Check rate_limits table
    console.log('Test 3: Query rate_limits table...');
    const { data: limits, error: limitsError } = await supabase
      .from('rate_limits')
      .select('count');

    if (limitsError) throw limitsError;
    console.log('✅ rate_limits table accessible\n');

    // Test 4: Check email_jobs table
    console.log('Test 4: Query email_jobs table...');
    const { data: emails, error: emailsError } = await supabase
      .from('email_jobs')
      .select('count');

    if (emailsError) throw emailsError;
    console.log('✅ email_jobs table accessible\n');

    // Test 5: Test RPC function
    console.log('Test 5: Test get_waitlist_position function...');
    const { data: testLead, error: insertError } = await supabase
      .from('waitlist_leads')
      .insert({
        email: 'test-connection@example.com',
        interests: ['dating'],
        has_ai_history: 'some'
      })
      .select()
      .single();

    if (insertError) throw insertError;
    console.log('✅ Test lead inserted:', testLead.id);

    const { data: position, error: rpcError } = await supabase
      .rpc('get_waitlist_position', { lead_id: testLead.id });

    if (rpcError) throw rpcError;
    console.log('✅ RPC function works! Position:', position);

    // Cleanup
    await supabase
      .from('waitlist_leads')
      .delete()
      .eq('email', 'test-connection@example.com');
    console.log('✅ Test data cleaned up\n');

    console.log('🎉 ALL TESTS PASSED! Database is fully configured.\n');

  } catch (error) {
    console.error('\n❌ Database test failed:');
    console.error(error.message);
    console.error('\nDetails:', error);
    process.exit(1);
  }
}

testDatabaseConnection();
