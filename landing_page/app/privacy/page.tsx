/**
 * Privacy Policy Page
 *
 * Comprehensive privacy policy covering all data collection,
 * third-party services, retention policies, and user rights.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Authentyc',
  description: 'How Authentyc collects, uses, and protects your personal data.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-4">
        <a href="/" className="text-brand-primary underline text-sm">
          &larr; Back to Home
        </a>
      </div>

      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-invert max-w-none space-y-6">
        {/* Table of Contents */}
        <nav className="p-4 bg-dark-850 border border-dark-800 rounded-lg mb-8">
          <p className="font-semibold mb-2 text-gray-200">Contents</p>
          <ol className="list-decimal pl-6 space-y-1 text-sm">
            <li><a href="#introduction" className="text-brand-primary underline">Introduction</a></li>
            <li><a href="#information-we-collect" className="text-brand-primary underline">Information We Collect</a></li>
            <li><a href="#how-we-use" className="text-brand-primary underline">How We Use Your Information</a></li>
            <li><a href="#third-party-services" className="text-brand-primary underline">Third-Party Services</a></li>
            <li><a href="#data-retention" className="text-brand-primary underline">Data Retention & Deletion</a></li>
            <li><a href="#data-security" className="text-brand-primary underline">Data Security</a></li>
            <li><a href="#cookies-tracking" className="text-brand-primary underline">Cookies & Tracking</a></li>
            <li><a href="#data-ownership" className="text-brand-primary underline">Data Ownership & Usage Rights</a></li>
            <li><a href="#privacy-rights" className="text-brand-primary underline">Your Privacy Rights</a></li>
            <li><a href="#childrens-privacy" className="text-brand-primary underline">Children's Privacy</a></li>
            <li><a href="#international-transfers" className="text-brand-primary underline">International Data Transfers</a></li>
            <li><a href="#changes" className="text-brand-primary underline">Changes to This Policy</a></li>
            <li><a href="#contact" className="text-brand-primary underline">Contact Us</a></li>
          </ol>
        </nav>

        <section id="introduction">
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            Authentyc AI, Inc. ("Authentyc", "we", "our", or "us") is committed to protecting
            your privacy. This Privacy Policy explains how we collect, use, store, and disclose
            your personal information when you use our website and services (collectively, the
            "Service"). By using our Service, you agree to the collection and use of information
            in accordance with this policy.
          </p>
          <p>
            <strong>Service Status:</strong> Authentyc is currently in waitlist/beta phase. This
            policy covers both the waitlist and future full service launch.
          </p>
        </section>

        <section id="information-we-collect">
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Information You Provide Directly</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Email Address:</strong> When you join our waitlist or sign up for the Service
            </li>
            <li>
              <strong>Interest Categories:</strong> Your selected categories (hiring, dating,
              co-founder matching, mastermind groups, or other specified interests)
            </li>
            <li>
              <strong>ChatGPT Conversation Experience Level:</strong> Whether you have extensive,
              some, or no ChatGPT conversation history
            </li>
            <li>
              <strong>ChatGPT Share Links:</strong> Only when you explicitly paste and submit a
              ChatGPT shared conversation link for personality analysis
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Information Collected Automatically</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Analytics Data:</strong> Page views, scroll depth, button clicks, form
              interactions, and session duration via PostHog (cookieless mode)
            </li>
            <li>
              <strong>Marketing Attribution:</strong> UTM parameters (source, medium, campaign),
              referrer URL, and landing page
            </li>
            <li>
              <strong>Technical Information:</strong> Browser type, device type, operating system,
              IP address, and user agent string
            </li>
            <li>
              <strong>Rate Limiting Data:</strong> IP address and request timestamps to prevent
              abuse (3 analyses per hour, 10 per day per IP)
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.3 AI-Generated Analysis Data</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Personality Analysis:</strong> AI-generated insights about communication
              style, problem-solving approach, and personality traits based on ChatGPT
              conversations you share
            </li>
            <li>
              <strong>Match Profiles:</strong> AI-generated example matches (hiring candidates,
              dating profiles, or co-founder profiles) based on your personality analysis
            </li>
            <li>
              <strong>Metadata:</strong> Analysis timestamps, AI model versions (e.g.,
              gpt-4o-mini, Gemini), confidence scores, processing times, and message counts
            </li>
          </ul>
        </section>

        <section id="how-we-use">
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
          <p>We use the collected information for the following purposes:</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Service Delivery</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide personality analysis based on ChatGPT conversations</li>
            <li>Generate personalized match profiles and compatibility insights</li>
            <li>Manage waitlist position and notify you when we launch</li>
            <li>Send transactional emails (welcome, updates, invitations)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Product Improvement</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Improve our AI models and personality analysis algorithms</li>
            <li>Train and refine matching logic for better compatibility predictions</li>
            <li>Analyze aggregate trends to understand which categories resonate most</li>
            <li>Conduct A/B testing on features, prompts, and user experience</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.3 Analytics & Research</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Understand user engagement and product-market fit</li>
            <li>Measure conversion rates and optimize marketing campaigns</li>
            <li>Track feature usage to prioritize development</li>
            <li>Monitor service performance and error rates</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.4 Legal Compliance</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Comply with applicable laws and regulations</li>
            <li>Prevent fraud, abuse, and violations of our Terms of Service</li>
            <li>Respond to legal requests from law enforcement or courts</li>
          </ul>
        </section>

        <section id="third-party-services">
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Third-Party Services</h2>
          <p>
            We use the following third-party services to operate our Service. Each service has
            its own privacy policy governing how they handle your data:
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <strong>Supabase (Database Hosting)</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>Purpose: Store waitlist data, personality analyses, and rate limiting data</li>
                <li>Data Shared: Email, interests, analysis results, IP addresses (hashed)</li>
                <li>Location: US-based servers with encryption at rest and in transit</li>
                <li>
                  Privacy Policy:{' '}
                  <a
                    href="https://supabase.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary underline"
                  >
                    supabase.com/privacy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <strong>OpenAI (AI Analysis)</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>
                  Purpose: Generate personality insights from ChatGPT conversation text (model:
                  gpt-4o-mini)
                </li>
                <li>
                  Data Shared: De-identified conversation text extracted from ChatGPT share links
                </li>
                <li>
                  Retention: OpenAI retains API data for 30 days for abuse monitoring, then
                  deletes it (per OpenAI API policy)
                </li>
                <li>
                  Privacy Policy:{' '}
                  <a
                    href="https://openai.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary underline"
                  >
                    openai.com/privacy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <strong>Google Gemini (Character Generation)</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>Purpose: Generate personalized match profiles based on personality analysis</li>
                <li>Data Shared: Personality analysis summaries (not raw conversations)</li>
                <li>
                  Privacy Policy:{' '}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary underline"
                  >
                    policies.google.com/privacy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <strong>Resend (Email Delivery)</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>Purpose: Send welcome emails, waitlist updates, and notifications</li>
                <li>Data Shared: Email address, first name (if provided), waitlist position</li>
                <li>
                  Privacy Policy:{' '}
                  <a
                    href="https://resend.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary underline"
                  >
                    resend.com/legal/privacy-policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <strong>PostHog (Analytics)</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>
                  Purpose: Track user engagement, scroll depth, button clicks, and conversion
                  funnels
                </li>
                <li>
                  Data Shared: Anonymized user IDs, page views, events, IP addresses (for
                  geolocation)
                </li>
                <li>
                  Mode: Cookieless tracking — no persistent cookies are set for analytics
                </li>
                <li>
                  Privacy Policy:{' '}
                  <a
                    href="https://posthog.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary underline"
                  >
                    posthog.com/privacy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <strong>Vercel (Hosting)</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>Purpose: Host our website and API endpoints</li>
                <li>Data Shared: Server logs, IP addresses, request headers</li>
                <li>
                  Privacy Policy:{' '}
                  <a
                    href="https://vercel.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary underline"
                  >
                    vercel.com/legal/privacy-policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <p className="mt-4">
            <strong>Important:</strong> We do not sell your personal information to third parties.
            We only share data with service providers necessary to operate our Service.
          </p>
        </section>

        <section id="data-retention">
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Retention & Deletion</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.1 Waitlist Data</h3>
          <p>
            We retain your email address and interest preferences for up to{' '}
            <strong>2 years from your last interaction</strong> with the Service, or until you
            request deletion, whichever comes first. This allows us to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Notify you when we launch</li>
            <li>Grant you early access based on your waitlist position</li>
            <li>Build a long-term relationship with early supporters</li>
          </ul>
          <p>
            After 2 years of inactivity, your waitlist data will be automatically deleted. We
            may send a re-engagement email before deletion. You can also request deletion at any
            time by emailing{' '}
            <a href="mailto:privacy@authentyc.ai" className="text-brand-primary underline">
              privacy@authentyc.ai
            </a>
            .
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.2 Personality Analysis Data</h3>
          <p>
            Personality analyses (including insights, match profiles, and metadata) are{' '}
            <strong>automatically deleted after 30 days</strong>. This protects your privacy while
            allowing us to demonstrate the Service during the waitlist phase.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>ChatGPT share URLs are hashed (SHA-256) before storage — we never store raw URLs</li>
            <li>Conversation text is not stored — only extracted, analyzed, and discarded</li>
            <li>
              After 30 days, all analysis results are permanently deleted via automated database
              cleanup
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.3 Rate Limiting Data</h3>
          <p>
            IP addresses and request timestamps used for rate limiting are retained for{' '}
            <strong>7 days</strong> to prevent abuse, then automatically purged.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.4 Analytics Data</h3>
          <p>
            PostHog analytics data is retained according to{' '}
            <a
              href="https://posthog.com/docs/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary underline"
            >
              PostHog's data retention policy
            </a>
            . This data is anonymized and cannot be linked back to your email address.
          </p>
        </section>

        <section id="data-security">
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal information:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Encryption:</strong> All data is encrypted in transit (HTTPS/TLS) and at rest
              (AES-256)
            </li>
            <li>
              <strong>Access Controls:</strong> Database access restricted to service role
              credentials with row-level security policies
            </li>
            <li>
              <strong>Hashing:</strong> ChatGPT share URLs are hashed before storage to prevent
              reverse lookup
            </li>
            <li>
              <strong>Rate Limiting:</strong> API endpoints are rate-limited (3 requests/hour, 10
              requests/day per IP) to prevent scraping and abuse
            </li>
            <li>
              <strong>Monitoring:</strong> Automated error tracking and security alerts for
              suspicious activity
            </li>
          </ul>
          <p>
            However, no method of transmission over the Internet or electronic storage is 100%
            secure. While we strive to protect your personal information, we cannot guarantee
            absolute security.
          </p>
        </section>

        <section id="cookies-tracking">
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Cookies & Tracking</h2>
          <p>
            We use <strong>cookieless analytics</strong> via PostHog. This means we do not set
            persistent tracking cookies on your device for analytics purposes. Our analytics
            collect anonymized, session-level data (page views, clicks, scroll depth) without
            storing cookies in your browser.
          </p>
          <p>
            We may use essential cookies strictly necessary for the operation of the Service
            (e.g., session management, security tokens). These do not require consent under
            most privacy regulations as they are necessary for the Service to function.
          </p>
          <p>
            We do not use third-party advertising cookies or tracking pixels from ad networks.
          </p>
        </section>

        <section id="data-ownership">
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Data Ownership & Usage Rights</h2>
          <p>
            <strong>You own your personality analysis data.</strong> We generate personality
            insights and match profiles on your behalf based on the ChatGPT conversations you share
            with us.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">8.1 Your Rights</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>You retain ownership of your personality analysis and generated match profiles</li>
            <li>You can request a copy of your analysis data at any time</li>
            <li>You can request deletion of your analysis data at any time</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">8.2 Our License</h3>
          <p>
            By using our Service, you grant Authentyc a non-exclusive, royalty-free license to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Store and process your analysis data to provide the Service</li>
            <li>
              Use aggregated, de-identified analysis data to improve our AI models and algorithms
            </li>
            <li>Analyze trends and patterns across multiple users to enhance matching accuracy</li>
          </ul>
          <p>
            We <strong>never</strong> share your individual personality analysis with other users
            or third parties (except as required by law).
          </p>
        </section>

        <section id="privacy-rights">
          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Your Privacy Rights</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">9.1 All Users</h3>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Access:</strong> Request a copy of the personal information we hold about you
            </li>
            <li>
              <strong>Deletion:</strong> Request deletion of your personal information (subject to
              legal retention requirements)
            </li>
            <li>
              <strong>Correction:</strong> Request correction of inaccurate personal information
            </li>
            <li>
              <strong>Opt-Out:</strong> Unsubscribe from marketing emails (via link in email footer
              or by contacting us)
            </li>
            <li>
              <strong>Portability:</strong> Receive your data in a machine-readable format (JSON)
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">9.2 California Residents (CCPA)</h3>
          <p>
            If you are a California resident, you have additional rights under the California
            Consumer Privacy Act (CCPA):
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Right to know what personal information is collected, used, and shared</li>
            <li>Right to delete personal information (with certain exceptions)</li>
            <li>Right to opt-out of the "sale" of personal information (we do not sell data)</li>
            <li>Right to non-discrimination for exercising your CCPA rights</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">9.3 European Residents (GDPR)</h3>
          <p>
            If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland,
            you have rights under the General Data Protection Regulation (GDPR):
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Right to access your personal data</li>
            <li>Right to rectification of inaccurate data</li>
            <li>Right to erasure ("right to be forgotten")</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
            <li>Right to withdraw consent at any time</li>
          </ul>
          <p>
            <strong>Legal Basis for Processing:</strong> We process your data based on (1) your
            consent (for optional features like personality analysis), (2) contractual necessity
            (to provide the Service), and (3) legitimate interests (to improve our Service).
          </p>
          <p>
            Given the nature and scale of our current data processing, we have determined that a
            Data Protection Officer (DPO) appointment is not required under GDPR Article 37. For
            all privacy-related inquiries, including GDPR requests, please contact us at{' '}
            <a href="mailto:privacy@authentyc.ai" className="text-brand-primary underline">
              privacy@authentyc.ai
            </a>
            .
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">9.4 Exercising Your Rights</h3>
          <p>
            To exercise any of these rights, contact us at{' '}
            <a href="mailto:privacy@authentyc.ai" className="text-brand-primary underline">
              privacy@authentyc.ai
            </a>
            . We will respond within 30 days (or as required by applicable law).
          </p>
        </section>

        <section id="childrens-privacy">
          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Children's Privacy</h2>
          <p>
            Our Service is <strong>not intended for children under 18</strong>. We do not knowingly
            collect personal information from children under 18. If you are a parent or guardian
            and believe your child has provided us with personal information, please contact us at{' '}
            <a href="mailto:privacy@authentyc.ai" className="text-brand-primary underline">
              privacy@authentyc.ai
            </a>{' '}
            and we will delete it promptly.
          </p>
        </section>

        <section id="international-transfers">
          <h2 className="text-2xl font-semibold mt-8 mb-4">11. International Data Transfers</h2>
          <p>
            Our Service is hosted in the United States. If you access our Service from outside the
            United States, your information will be transferred to, stored, and processed in the
            United States. By using our Service, you consent to the transfer of your information to
            the United States, which may have different data protection laws than your country of
            residence.
          </p>
          <p>
            For EEA users: We rely on Standard Contractual Clauses (SCCs) approved by the European
            Commission for data transfers to the United States.
          </p>
        </section>

        <section id="changes">
          <h2 className="text-2xl font-semibold mt-8 mb-4">12. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our
            practices, technology, legal requirements, or other factors. We will notify you of
            material changes by:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Sending an email to registered users (if material changes affect your rights)</li>
            <li>Displaying a prominent notice on our website</li>
          </ul>
          <p>
            Your continued use of the Service after changes are posted constitutes your acceptance
            of the updated Privacy Policy.
          </p>
        </section>

        <section id="contact">
          <h2 className="text-2xl font-semibold mt-8 mb-4">13. Contact Us</h2>
          <p>
            If you have questions, concerns, or requests regarding this Privacy Policy or our data
            practices, please contact us:
          </p>
          <div className="mt-4">
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:privacy@authentyc.ai" className="text-brand-primary underline">
                privacy@authentyc.ai
              </a>
            </p>
            <p>
              <strong>Company:</strong> Authentyc AI, Inc.
            </p>
            <p>
              <strong>Response Time:</strong> We aim to respond within 5 business days for general
              inquiries, and within 30 days for formal data rights requests.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
