/**
 * Test Email Script
 *
 * Tests email delivery via Resend API
 * Usage: node test-email.js your-email@example.com
 */

require('dotenv').config({ path: '.env.local' });

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_DOMAIN = process.env.RESEND_FROM_DOMAIN || 'authentyc.ai';

if (!RESEND_API_KEY) {
  console.error('❌ Missing RESEND_API_KEY in .env.local');
  process.exit(1);
}

const testEmail = process.argv[2];
if (!testEmail) {
  console.error('❌ Usage: node test-email.js your-email@example.com');
  process.exit(1);
}

async function sendTestEmail() {
  console.log('📧 Testing email delivery...');
  console.log(`From: Authentyc <hello@${EMAIL_DOMAIN}>`);
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
        from: `Authentyc <hello@${EMAIL_DOMAIN}>`,
        to: testEmail,
        subject: 'Test Email from Authentyc',
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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #2D3FE5;">Authentyc</h1>
    </div>
    <div class="content">
      <div class="success">
        <h2 style="margin: 0;">✅ Email Delivery Test Successful!</h2>
      </div>
      <p>This is a test email from your Authentyc landing page.</p>
      <p><strong>Configuration:</strong></p>
      <ul>
        <li>From domain: ${EMAIL_DOMAIN}</li>
        <li>API: Resend</li>
        <li>Status: Working correctly</li>
      </ul>
      <p>If you're seeing this, your email system is configured correctly and ready to send welcome emails to waitlist signups!</p>
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
    console.log('Check your inbox (and spam folder) for the test email.');
    console.log('');
    console.log('💡 Next: Test the full waitlist flow by submitting the form on your landing page');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

sendTestEmail();
