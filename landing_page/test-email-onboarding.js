/**
 * Test Email with Resend Onboarding Domain
 * This uses the default onboarding@resend.dev address for testing
 */

require('dotenv').config({ path: '.env.local' });

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  console.error('❌ Missing RESEND_API_KEY in .env.local');
  process.exit(1);
}

const testEmail = process.argv[2] || 'ptrkhh@gmail.com';

async function sendTestEmail() {
  console.log('📧 Testing email delivery with Resend onboarding domain...');
  console.log('From: onboarding@resend.dev (Resend test domain)');
  console.log(`To: ${testEmail}`);
  console.log('');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Authentyc Test <onboarding@resend.dev>',
        to: testEmail,
        subject: 'Test Email from Authentyc (via Resend test domain)',
        html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px; border-bottom: 2px solid #2D3FE5; }
    .content { padding: 20px 0; }
    .success { background: #10b981; color: white; padding: 15px; border-radius: 5px; text-align: center; }
    .warning { background: #f59e0b; color: white; padding: 10px; border-radius: 5px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #2D3FE5;">Authentyc</h1>
    </div>
    <div class="content">
      <div class="success">
        <h2 style="margin: 0;">✅ Email Test Successful!</h2>
      </div>
      
      <div class="warning">
        <strong>⚠️ This is using Resend's test domain (onboarding@resend.dev)</strong>
      </div>
      
      <p>This is a test email from your Authentyc landing page.</p>
      
      <p><strong>Next Steps:</strong></p>
      <ol>
        <li>Verify your custom domain (authentyc.dpdns.org) in Resend dashboard</li>
        <li>Once verified, emails will come from hello@authentyc.dpdns.org</li>
        <li>Test the waitlist form on your landing page</li>
      </ol>
      
      <p>If you're seeing this, your Resend API key is working correctly!</p>
    </div>
  </div>
</body>
</html>
        `,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Email send failed:');
      console.error(errorText);
      process.exit(1);
    }

    const data = await response.json();
    console.log('✅ Email sent successfully!');
    console.log(`Email ID: ${data.id}`);
    console.log('');
    console.log('📬 Check your inbox (and spam folder) for the test email');
    console.log('   From: onboarding@resend.dev');
    console.log('');
    console.log('⚠️  NOTE: This used Resend\'s test domain. To use your custom domain:');
    console.log('   1. Go to https://resend.com/domains');
    console.log('   2. Verify authentyc.dpdns.org shows as "Verified"');
    console.log('   3. If not, check DNS records and complete verification');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

sendTestEmail();
