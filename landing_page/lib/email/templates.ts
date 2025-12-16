/**
 * Email Templates
 *
 * HTML email templates for waitlist and notifications.
 *
 * TODO: Verify domain (authentyc.ai) and social handles before launch
 * TODO: Consider using React Email or MJML for better templating
 */

export interface WelcomeEmailData {
  email: string;
  waitlistPosition: number;
  interests: string[];
}

/**
 * Welcome email template for new waitlist signups
 */
export function getWelcomeEmailHTML(data: WelcomeEmailData): string {
  const interestLabels: Record<string, string> = {
    hiring_recruiter: 'hiring/recruiting',
    hiring_jobseeker: 'job seeking',
    dating: 'dating',
    cofounder: 'co-founder matching',
    mastermind: 'mastermind groups',
    other: 'exploring Authentyc',
  };

  // Format multiple interests into a readable string
  const interestTexts = data.interests.map(i => interestLabels[i] || 'our platform');
  let interestText: string;

  if (interestTexts.length === 1) {
    interestText = interestTexts[0];
  } else if (interestTexts.length === 2) {
    interestText = `${interestTexts[0]} and ${interestTexts[1]}`;
  } else {
    const last = interestTexts[interestTexts.length - 1];
    const rest = interestTexts.slice(0, -1).join(', ');
    interestText = `${rest}, and ${last}`;
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Authentyc</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .content {
      padding: 30px 0;
    }
    .position {
      font-size: 24px;
      font-weight: 700;
      color: #2D3FE5;
      margin: 20px 0;
    }
    .footer {
      border-top: 1px solid #e5e7eb;
      padding: 20px 0;
      font-size: 14px;
      color: #6b7280;
      text-align: center;
    }
    a {
      color: #2D3FE5;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Authentyc</h1>
  </div>

  <div class="content">
    <h2>Welcome to Authentyc [#${data.waitlistPosition} on the waitlist]</h2>

    <p>Hi there,</p>

    <p class="position">You're officially on the Authentyc waitlist (#${data.waitlistPosition}).</p>

    <p>We're building a new way to match people based on authentic compatibility—not curated profiles or rehearsed answers.</p>

    <p><strong>Here's what happens next:</strong></p>
    <ul>
      <li>We'll email you when we launch invite-only access (Q1 2026)</li>
      <li>You'll get first access to ${interestText}</li>
      <li>We might reach out for early feedback (optional, with perks)</li>
    </ul>

    <p><strong>In the meantime, you can:</strong></p>
    <ul>
      <li>Follow our journey on Twitter <a href="https://twitter.com/authentyc_ai">@authentyc_ai</a></li>
      <!-- TODO: Verify Twitter handle exists before launch -->
      <li>Share with friends who'd benefit from authentic matching</li>
    </ul>

    <p>Questions? Just reply to this email.</p>

    <p>— The Authentyc Team</p>

    <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
      P.S. We're testing multiple categories (hiring, dating, founder matching, and more) to identify which provides the strongest signal. Your preferences help us decide which to launch first. Hit reply if you have thoughts!
    </p>
  </div>

  <div class="footer">
    <p>© 2025 Authentyc AI, Inc.</p>
    <!-- TODO: Verify domain authentyc.ai is configured before launch -->
    <p>
      <a href="https://authentyc.ai/privacy">Privacy Policy</a> |
      <a href="https://authentyc.ai/terms">Terms of Service</a>
    </p>
  </div>
</body>
</html>
  `.trim();
}
