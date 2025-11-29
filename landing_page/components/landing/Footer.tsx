/**
 * Footer
 *
 * Site footer with links.
 * Copy from LANDING_PAGE_PLAN.md lines 500-513
 *
 * TODO: Update social media links before launch
 * TODO: Verify email address (hello@authentyc.ai)
 */

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-white">Authentyc</h3>
          <p>Match people by who they really are.</p>

          <div className="flex justify-center space-x-6 pt-4">
            {/* TODO: Replace with actual Twitter URL */}
            <a href="#" className="hover:text-white transition-colors">
              Twitter
            </a>
            {/* TODO: Replace with actual LinkedIn URL */}
            <a href="#" className="hover:text-white transition-colors">
              LinkedIn
            </a>
            <a href="mailto:hello@authentyc.ai" className="hover:text-white transition-colors">
              Email
            </a>
          </div>

          <div className="pt-6 border-t border-gray-700 text-sm">
            <p>© 2025 Authentyc AI, Inc.</p>
            <div className="flex justify-center space-x-4 mt-2">
              <a href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
