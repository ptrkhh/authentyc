/**
 * Problem Section
 *
 * 3-column grid explaining the problems with traditional matching.
 * Copy from LANDING_PAGE_PLAN.md lines 86-134
 */

export function ProblemSection() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">The Problem With Matching</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-semibold mb-3">Resumes lie</h3>
            <p className="text-gray-600">
              People exaggerate skills, experience, and results.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="text-4xl mb-4">🎭</div>
            <h3 className="text-xl font-semibold mb-3">Profiles perform</h3>
            <p className="text-gray-600">
              Dating bios show best photos & curated personalities.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="text-4xl mb-4">❓</div>
            <h3 className="text-xl font-semibold mb-3">Interviews are theater</h3>
            <p className="text-gray-600">
              Everyone rehearses their answers to look good.
            </p>
          </div>
        </div>

        <p className="text-center text-lg text-gray-700 mt-12">
          You waste time, money, and emotional energy on mismatches you could have avoided.
        </p>
      </div>
    </section>
  );
}
