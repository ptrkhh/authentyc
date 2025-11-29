/**
 * Resend Email Client
 *
 * Wrapper for Resend API for email delivery.
 */

// TODO: Install resend package: npm install resend
// For now, using fetch API directly

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface SendEmailResult {
  success: boolean;
  emailId?: string;
  error?: string;
}

/**
 * Send email via Resend API
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Missing RESEND_API_KEY environment variable');
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: params.from || 'Authentyc <hello@authentyc.ai>', // TODO: Verify email domain is configured in Resend
        to: params.to,
        subject: params.subject,
        html: params.html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return {
        success: false,
        error: `Resend API error: ${error}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      emailId: data.id,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}
