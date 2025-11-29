/**
 * ChatGPT Link Analyzer Component
 *
 * ⭐ KEY DIFFERENTIATOR ⭐
 *
 * Interactive component where users can paste ChatGPT shared links
 * and get instant personality analysis preview.
 *
 * States:
 * - Initial: Input field + instructions
 * - Loading: Spinner + progress text
 * - Results: Animated reveal of insights
 * - Error: Helpful error messages
 */

'use client';

import { useState } from 'react';

export function ChatAnalyzer() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    // TODO: Implement analysis
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareUrl: url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResults(data.analysis);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">Try It Yourself</h2>
        <p className="text-center text-gray-600 mb-8">
          Paste a ChatGPT shared link to see your communication style analysis
        </p>

        {/* Initial State */}
        {!results && !loading && (
          <div className="space-y-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://chatgpt.com/share/..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
            <button
              onClick={handleAnalyze}
              disabled={!url}
              className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold px-6 py-3 rounded-lg transition-all disabled:opacity-50"
            >
              Analyze My Communication Style
            </button>
            <p className="text-sm text-gray-500 text-center">
              Don't have a shared link?{' '}
              <a href="#" className="text-brand-primary underline">
                Click here for instructions
              </a>
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing your conversation patterns...</p>
          </div>
        )}

        {/* Results State */}
        {results && !loading && (
          <div className="space-y-6">
            <div className="bg-brand-primary/10 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-2">Overall Vibe</h3>
              <p className="text-lg">{results.overall_vibe}</p>
            </div>

            <div className="grid gap-4">
              {results.insights?.map((insight: string, idx: number) => (
                <div key={idx} className="bg-white border border-gray-200 p-4 rounded-lg">
                  <p className="text-gray-700">{insight}</p>
                </div>
              ))}
            </div>

            <button className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold px-6 py-3 rounded-lg transition-all">
              Get Personalized Matches → Join Waitlist
            </button>

            <button
              onClick={() => {
                setResults(null);
                setUrl('');
              }}
              className="w-full text-gray-600 hover:text-gray-800"
            >
              Try another conversation
            </button>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setUrl('');
              }}
              className="mt-2 text-red-600 hover:text-red-800 font-medium"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
