/**
 * Waitlist API Route
 *
 * POST /api/waitlist
 * Handles waitlist signups and sends welcome email.
 */

import { NextRequest, NextResponse } from 'next/server';
import { waitlistSchema, MAX_BODY_SIZE } from '@/lib/utils/validation';
import { supabaseServer } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/resend';
import { getWelcomeEmailHTML, getAlreadyOnWaitlistEmailHTML } from '@/lib/email/templates';
import { checkRateLimit, getClientIP } from '@/lib/utils/ratelimit';

export async function POST(request: NextRequest) {
  try {
    // Enforce body size limit
    const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
    if (contentLength > MAX_BODY_SIZE) {
      return NextResponse.json({ error: 'Request too large' }, { status: 413 });
    }

    // Rate limit: 5 waitlist signups per hour per IP
    const ipAddress = getClientIP(request);
    const rateLimit = await checkRateLimit(ipAddress, '/api/waitlist', 5, 60 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

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
      // Return same response for duplicate emails to prevent email enumeration.
      // Send differentiated feedback via email only.
      if (error.code === '23505') {
        if (process.env.RESEND_API_KEY) {
          // Check email rate limit before sending duplicate notification
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
          const { count: recentEmailCount } = await supabaseServer
            .from('email_jobs')
            .select('*', { count: 'exact', head: true })
            .eq('recipient_email', data.email)
            .gte('created_at', oneDayAgo);

          if ((recentEmailCount ?? 0) < 1) {
            try {
              await sendEmail({
                to: data.email,
                subject: "You're already on the Authentyc waitlist",
                html: getAlreadyOnWaitlistEmailHTML(),
              });
            } catch (emailError) {
              console.error('[waitlist] Duplicate notification email error:', emailError);
            }
          }
        }

        return NextResponse.json({
          success: true,
          message: 'Successfully joined waitlist',
        });
      }
      // Check constraint violations (e.g., invalid has_ai_history value)
      if (error.code === '23514') {
        console.error('[waitlist] Database constraint violation');
        return NextResponse.json(
          { error: 'Invalid form data. Please refresh the page and try again.' },
          { status: 400 }
        );
      }
      throw error;
    }

    // Get waitlist position
    const { data: positionData } = await supabaseServer.rpc('get_waitlist_position', {
      lead_id: lead.id,
    });
    const position = positionData || 1;

    // Check email rate limit: max 1 email per 24 hours per recipient
    if (process.env.RESEND_API_KEY) {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count: recentEmailCount } = await supabaseServer
        .from('email_jobs')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_email', data.email)
        .gte('created_at', oneDayAgo);

      if ((recentEmailCount ?? 0) >= 1) {
        // Skip email but still return success
        return NextResponse.json({
          success: true,
          message: 'Successfully joined waitlist',
          position,
        });
      }
    }

    // Send welcome email via Resend with job tracking
    if (process.env.RESEND_API_KEY) {
      const emailJobId = crypto.randomUUID();
      const emailSubject = `Welcome to Authentyc [#${position} on the waitlist]`;
      const emailHtml = getWelcomeEmailHTML({
        email: data.email,
        waitlistPosition: position,
        interests: data.interests,
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
      } catch (emailError: unknown) {
        console.error('[waitlist] Email error:', emailError);
        await supabaseServer
          .from('email_jobs')
          .update({
            status: 'failed',
            error_message: emailError instanceof Error ? emailError.message : String(emailError),
          })
          .eq('id', emailJobId);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully joined waitlist',
      position,
    });
  } catch (error: unknown) {
    console.error('Waitlist error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid form data' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 }
    );
  }
}
