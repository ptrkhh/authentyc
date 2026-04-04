/**
 * Resend Email Client
 *
 * Uses the official Resend SDK for email delivery.
 */

import { Resend } from 'resend';

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

function getResendClient(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Missing RESEND_API_KEY environment variable');
  }
  return new Resend(process.env.RESEND_API_KEY);
}

/**
 * Send email via Resend SDK
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const resend = getResendClient();
  const emailDomain = process.env.RESEND_FROM_DOMAIN || 'authentyc.ai';
  const fromEmail = params.from || `Authentyc <hello@${emailDomain}>`;

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      emailId: data?.id,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}
