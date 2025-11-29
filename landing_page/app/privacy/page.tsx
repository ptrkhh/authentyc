/**
 * Privacy Policy Page
 *
 * TODO: Replace with actual privacy policy before launch.
 * Consider using a privacy policy generator or consulting with legal.
 */

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-gray max-w-none space-y-6">
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Overview</h2>
          <p>
            Authentyc AI, Inc. ("we", "our", or "us") is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, and safeguard your information when
            you use our service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Email address (for waitlist signup)</li>
            <li>Category preference (hiring, dating, founder matching)</li>
            <li>
              ChatGPT conversation data (only when explicitly shared by you via share links)
            </li>
            <li>Usage analytics (via PostHog)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and improve our service</li>
            <li>To send you updates about your waitlist status</li>
            <li>To analyze personality traits for matching purposes</li>
            <li>To improve our algorithms and models</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Data Privacy & Security</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We hash ChatGPT share URLs before storing them</li>
            <li>We do not store raw conversation text</li>
            <li>All analyses are automatically deleted after 30 days</li>
            <li>We encrypt all data in transit and at rest</li>
            <li>We never sell your data to third parties</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Request deletion of your data at any time</li>
            <li>Opt out of email communications</li>
            <li>Request a copy of your data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p>
            For privacy-related questions or requests, contact us at:{' '}
            <a href="mailto:privacy@authentyc.ai" className="text-brand-primary underline">
              privacy@authentyc.ai
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
