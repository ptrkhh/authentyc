/**
 * Solution Section
 *
 * Explains the Authentyc approach with benefits checklist.
 * Copy from LANDING_PAGE_PLAN.md lines 138-169
 */

export function SolutionSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">The Authentyc Difference</h2>

            <p className="text-lg text-gray-700 mb-6">
              We analyze how people actually communicate when they're not performing—in their
              private AI conversations.
            </p>

            <h3 className="text-xl font-semibold mb-4">See the real person:</h3>

            <ul className="space-y-3">
              {[
                'Problem-solving patterns',
                'Communication clarity',
                'Emotional intelligence',
                'Learning velocity',
                'Collaboration style',
                'Authentic values & priorities',
              ].map((item) => (
                <li key={item} className="flex items-start">
                  <span className="text-brand-primary mr-3">✓</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-gray-600 mt-6">
              All from conversations they've already had—no extra hoops, no performance pressure.
            </p>
          </div>

          <div className="bg-gray-100 h-80 rounded-lg flex items-center justify-center">
            {/* TODO: Add illustration/screenshot */}
            <p className="text-gray-400">Illustration placeholder</p>
          </div>
        </div>
      </div>
    </section>
  );
}
