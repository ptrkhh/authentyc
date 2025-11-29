/**
 * Terms of Service Page
 *
 * TODO: Replace with actual terms of service before launch.
 * Consider consulting with legal counsel.
 */

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

      <div className="prose prose-gray max-w-none space-y-6">
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Authentyc, you accept and agree to be bound by these Terms of
            Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description of Service</h2>
          <p>
            Authentyc provides AI-powered personality analysis and matching services based on
            ChatGPT conversation patterns. The service is currently in waitlist/beta phase.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must provide accurate information</li>
            <li>You are responsible for the content you share</li>
            <li>You must not abuse or attempt to game the system</li>
            <li>You must comply with all applicable laws</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Usage</h2>
          <p>
            By sharing ChatGPT conversations, you grant us permission to analyze them for
            personality insights. We will only share structured insights, never raw conversations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Limitation of Liability</h2>
          <p>
            Authentyc is provided "as is" without warranties. We are not responsible for the
            accuracy of personality analyses or the outcomes of matches.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact</h2>
          <p>
            For questions about these terms, contact us at:{' '}
            <a href="mailto:legal@authentyc.ai" className="text-brand-primary underline">
              legal@authentyc.ai
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
