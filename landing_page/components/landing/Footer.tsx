/**
 * Footer - Dark Design
 *
 * Site footer with emerald accents and premium styling.
 */

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-6">
          <h3 className="text-3xl font-bold text-white font-display">Authentyc</h3>
          <p className="text-gray-400 text-lg">Match people by who they really are.</p>

          <div className="flex justify-center space-x-8 pt-6">
            <a
              href="#"
              className="text-gray-400 hover:text-brand-primary transition-colors duration-300"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-brand-primary transition-colors duration-300"
            >
              LinkedIn
            </a>
            <a
              href="mailto:hello@authentyc.ai"
              className="text-gray-400 hover:text-brand-primary transition-colors duration-300"
            >
              Email
            </a>
          </div>

          <div className="pt-8 border-t border-white/10 text-sm">
            <p className="text-gray-500">© 2025 Authentyc AI, Inc.</p>
            <div className="flex justify-center space-x-6 mt-3">
              <a
                href="/privacy"
                className="text-gray-500 hover:text-brand-primary transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <span className="text-gray-700">•</span>
              <a
                href="/terms"
                className="text-gray-500 hover:text-brand-primary transition-colors duration-300"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
