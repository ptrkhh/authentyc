#!/usr/bin/env node

/**
 * Simple standalone script to test Gemini API key with gemini-2.5-flash model
 * Usage: node test-gemini-api.js
 */

require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiAPI() {
  console.log('🔍 Testing Gemini API...\n');

  // Check if API key exists
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ ERROR: GEMINI_API_KEY not found in .env.local');
    console.error('   Please add your Gemini API key to .env.local');
    process.exit(1);
  }

  console.log('✓ API key found:', apiKey.substring(0, 10) + '...');

  try {
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);

    console.log('✓ Initializing gemini-2.5-flash model...');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Test with a simple prompt
    console.log('✓ Sending test prompt...\n');
    const result = await model.generateContent('Say "Hello from Gemini!" in a friendly way.');

    const response = await result.response;
    const text = response.text();

    console.log('✅ SUCCESS! Gemini API is working!\n');
    console.log('Response:');
    console.log('─'.repeat(50));
    console.log(text);
    console.log('─'.repeat(50));
    console.log('\n✓ gemini-2.5-flash model is accessible with your API key');

  } catch (error) {
    console.error('\n❌ ERROR: Failed to connect to Gemini API\n');
    console.error('Error details:');
    console.error('─'.repeat(50));
    console.error(error.message);

    if (error.status) {
      console.error('Status:', error.status);
    }

    if (error.status === 403 || error.status === 401) {
      console.error('\n💡 This looks like an authentication error.');
      console.error('   Please verify your GEMINI_API_KEY in .env.local');
      console.error('   Get a key at: https://aistudio.google.com/apikey');
    }

    console.error('─'.repeat(50));
    process.exit(1);
  }
}

// Run the test
testGeminiAPI();
