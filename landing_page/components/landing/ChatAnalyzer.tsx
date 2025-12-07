/**
 * ChatGPT Link Analyzer Component
 *
 * ⭐ KEY DIFFERENTIATOR ⭐
 *
 * Interactive component where users can paste ChatGPT shared links
 * and get instant personality analysis preview with simulated character matches.
 *
 * States:
 * - Initial: Category selector + Input field + instructions
 * - Loading: Spinner + progress text
 * - Results: Animated reveal of insights
 * - Simulations: 5 diverse character matches with compatibility analysis
 * - Error: Helpful error messages
 */

'use client';

import { useState } from 'react';
import { CONVERSATION_PROMPTS, getPromptByCategory } from '@/lib/constants/conversation-prompts';
import { generateSimulatedCharacters } from '@/lib/constants/simulated-characters';
import { SimulationResults, type Category, type SimulatedCharacter } from './SimulationResults';
import { Briefcase, Heart, Rocket } from 'lucide-react';

interface AnalysisResult {
  overall_vibe: string;
  insights?: string[];
}

export function ChatAnalyzer() {
  const [category, setCategory] = useState<Category>('hiring');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [characters, setCharacters] = useState<SimulatedCharacter[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    setCharacters(null);

    try {
      const response = await fetch('/api/analyze-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareUrl: url, category }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      // Set both results and characters immediately from single API response
      setResults(data.analysis);
      setCharacters(data.characters);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setCharacters(null);
    setUrl('');
    setError(null);
  };

  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case 'hiring': return <Briefcase className="w-5 h-5" />;
      case 'dating': return <Heart className="w-5 h-5" />;
      case 'founder': return <Rocket className="w-5 h-5" />;
    }
  };

  const getCategoryLabel = (cat: Category) => {
    switch (cat) {
      case 'hiring': return 'Hiring & Jobs';
      case 'dating': return 'Dating & Relationships';
      case 'founder': return 'Co-founder Matching';
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">Try It Yourself</h2>
        <p className="text-center text-gray-600 mb-8">
          See how our matching works - get simulated character matches based on your communication style
        </p>

        {/* Results State - Show both insights and characters together */}
        {results && characters && (
          <SimulationResults
            characters={characters}
            category={category}
            onReset={handleReset}
            insights={{
              overall_vibe: results.overall_vibe,
              insights: results.insights || [],
            }}
          />
        )}

        {/* Initial State */}
        {!results && !loading && !characters && (
          <div className="max-w-3xl mx-auto space-y-6 min-h-[800px]">
            {/* Category Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                I&apos;m interested in:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['hiring', 'dating', 'founder'] as Category[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      category === cat
                        ? 'border-brand-primary bg-brand-primary/5 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`${category === cat ? 'text-brand-primary' : 'text-gray-400'}`}>
                        {getCategoryIcon(cat)}
                      </div>
                      <span className={`font-medium ${category === cat ? 'text-brand-primary' : 'text-gray-700'}`}>
                        {getCategoryLabel(cat)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Instructions - Always Visible */}
            <div className="p-6 bg-gray-50 rounded-lg space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Step 1: Copy the conversation prompt</h4>

                <p className="text-gray-600 text-xs mb-2">
                  {getPromptByCategory(category).description}
                </p>

                {/* Copyable prompt */}
                <div className="bg-white p-4 rounded border border-gray-200 relative group">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(getPromptByCategory(category).prompt);
                    }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-primary text-white px-3 py-1 rounded text-xs"
                  >
                    Copy
                  </button>
                  <p className="text-gray-700 text-xs leading-relaxed">
                    {getPromptByCategory(category).prompt}
                  </p>
                </div>
                <p className="text-gray-600 mt-2 text-xs">
                  💡 Tip: Have a natural back-and-forth conversation (5-10 messages) for best results
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Step 2: Paste into ChatGPT and answer the questions</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-600">
                  <li>Go to <a href="https://chatgpt.com" target="_blank" className="text-brand-primary underline">chatgpt.com</a></li>
                  <li>Paste the prompt and press Enter</li>
                  <li>ChatGPT will ask you questions - just answer naturally (5-7 exchanges)</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Step 3: Share your conversation</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-600">
                  <li>Click the share icon (↗) in the top-right corner</li>
                  <li>Click &quot;Copy link&quot;</li>
                  <li>Paste the link below and click &quot;Analyze My Communication Style&quot;</li>
                </ol>
              </div>

              <p className="text-xs text-gray-500 italic">
                🔒 Privacy: Only you can access your shared ChatGPT link. We analyze your communication patterns to show you how our matching works.
              </p>
            </div>

            {/* Input and Button */}
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
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="max-w-3xl mx-auto text-center min-h-[800px] flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing your conversation patterns...</p>
            <p className="text-sm text-gray-500 mt-2">Generating your personalized matches...</p>
          </div>
        )}

        {/* Error State */}
        {error && !characters && (
          <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 p-4 rounded-lg">
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
