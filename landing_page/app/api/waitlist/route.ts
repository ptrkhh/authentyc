/**
 * Waitlist API Route
 *
 * POST /api/waitlist
 * Handles waitlist signups and sends welcome email.
 */

import { NextRequest, NextResponse } from 'next/server';
import { waitlistSchema } from '@/lib/utils/validation';
import { supabaseServer } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/resend';
import { getWelcomeEmailHTML } from '@/lib/email/templates';

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const data = waitlistSchema.parse(body);

    // Extract UTM params and metadata from headers
    const url = new URL(request.url);
    const utm_source = url.searchParams.get('utm_source');
    const utm_medium = url.searchParams.get('utm_medium');
    const utm_campaign = url.searchParams.get('utm_campaign');
    const referrer = request.headers.get('referer');
    const user_agent = request.headers.get('user-agent');

    // Insert into database
    const { data: lead, error } = await supabaseServer
      .from('waitlist_leads')
      .insert({
        ...data,
        utm_source,
        utm_medium,
        utm_campaign,
        referrer,
        user_agent,
      })
      .select()
      .single();

    if (error) {
      // Check for duplicate email (unique constraint violation)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Email already on waitlist' },
          { status: 409 }
        );
      }
      throw error;
    }

    // Get waitlist position
    const { data: positionData } = await supabaseServer.rpc('get_waitlist_position', {
      lead_id: lead.id,
    });
    const position = positionData || 1;

    // Send welcome email via Resend with job tracking
    if (process.env.RESEND_API_KEY) {
      const emailJobId = crypto.randomUUID();
      const emailSubject = `Welcome to Authentyc [#${position} on the waitlist]`;
      const emailHtml = getWelcomeEmailHTML({
        email: data.email,
        waitlistPosition: position,
        primaryInterest: data.primary_interest,
      });

      await supabaseServer.from('email_jobs').insert({
        id: emailJobId,
        waitlist_lead_id: lead.id,
        email_type: 'welcome',
        recipient_email: data.email,
        status: 'queued',
      });

      try {
        const emailResult = await sendEmail({
          to: data.email,
          subject: emailSubject,
          html: emailHtml,
        });

        await supabaseServer
          .from('email_jobs')
          .update({
            status: emailResult.success ? 'sent' : 'failed',
            resend_email_id: emailResult.emailId || null,
            sent_at: emailResult.success ? new Date().toISOString() : null,
            error_message: emailResult.success ? null : emailResult.error,
          })
          .eq('id', emailJobId);

        if (!emailResult.success) {
          console.error('[waitlist] Email sending failed:', emailResult.error);
        }
      } catch (emailError: any) {
        console.error('[waitlist] Email error:', emailError);
        await supabaseServer
          .from('email_jobs')
          .update({
            status: 'failed',
            error_message: emailError.message,
          })
          .eq('id', emailJobId);
      }
    }

    // TODO: Track conversion in PostHog server-side

    return NextResponse.json({
      success: true,
      message: 'Successfully joined waitlist',
      position,
    });
  } catch (error: any) {
    console.error('Waitlist error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 }
    );
  }
}
