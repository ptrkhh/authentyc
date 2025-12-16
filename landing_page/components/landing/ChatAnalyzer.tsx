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

import { useState, useEffect } from 'react';
import type { ConversationPrompt } from '@/lib/constants/conversation-prompts';
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
  const [showManualPaste, setShowManualPaste] = useState(false);
  const [manualText, setManualText] = useState('');
  const [copied, setCopied] = useState(false);

  // Fetch prompts from database on mount
  const [prompts, setPrompts] = useState<ConversationPrompt[]>([]);
  const [promptsLoading, setPromptsLoading] = useState(true);
  const [promptsError, setPromptsError] = useState(false);

  useEffect(() => {
    async function fetchPrompts() {
      try {
        const response = await fetch('/api/prompts');
        if (response.ok) {
          const data = await response.json();
          setPrompts(data.prompts);
          setPromptsError(false);
        } else {
          console.error('[ChatAnalyzer] Failed to fetch prompts from API');
          setPromptsError(true);
        }
      } catch (error) {
        console.error('[ChatAnalyzer] Error fetching prompts:', error);
        setPromptsError(true);
      } finally {
        setPromptsLoading(false);
      }
    }

    fetchPrompts();
  }, []);

  // Helper to get prompt by category
  const getPromptByCategory = (cat: Category): ConversationPrompt | undefined => {
    return prompts.find(p => p.category === cat);
  };

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

      const parserFailureIndicators = [
        'empty',
        'invalid conversation',
        'no messages',
        'failed to fetch',
        'failed to parse',
        'parsing failed'
      ];

      const isParserFailure = parserFailureIndicators.some(indicator =>
        errorMessage.toLowerCase().includes(indicator)
      );

      if (isParserFailure) {
        setShowManualPaste(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setCharacters(null);
    setUrl('');
    setError(null);
    setShowManualPaste(false);
    setManualText('');
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

                {promptsLoading && (
                  <div className="text-gray-600 text-xs py-4">
                    Loading prompts...
                  </div>
                )}

                {promptsError && (
                  <div className="text-red-600 text-xs py-4">
                    Failed to load prompts. Please refresh the page.
                  </div>
                )}

                {!promptsLoading && !promptsError && getPromptByCategory(category) && (
                  <>
                    <p className="text-gray-600 text-xs mb-2">
                      {getPromptByCategory(category)?.description}
                    </p>

                    {/* Copyable prompt */}
                    <div className="space-y-2">
                      <textarea
                        readOnly
                        value={getPromptByCategory(category)?.prompt || ''}
                        rows={6}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded text-gray-700 text-xs leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                      />
                      <button
                        onClick={() => {
                          const prompt = getPromptByCategory(category);
                          if (prompt) {
                            navigator.clipboard.writeText(prompt.prompt);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }
                        }}
                        className={`w-full font-semibold px-4 py-2.5 rounded transition-all shadow-sm hover:shadow-md ${
                          copied
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-brand-primary hover:bg-brand-primary-hover'
                        } text-white`}
                      >
                        {copied ? '✓ Copied!' : '📋 Copy Prompt'}
                      </button>
                    </div>
                    <p className="text-gray-600 mt-2 text-xs">
                      💡 Tip: Have a natural back-and-forth conversation (5-10 messages) for best results
                    </p>
                  </>
                )}
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
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setUrl('');
                  setShowManualPaste(false);
                }}
                className="mt-2 text-red-600 hover:text-red-800 font-medium"
              >
                Try again
              </button>
            </div>

            {/* Manual Paste Fallback */}
            {showManualPaste && (
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg space-y-4">
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Alternative: Paste Your Conversation Text
                  </h3>
                  <p className="text-sm text-blue-700 mb-4">
                    Having trouble with the link? You can paste the conversation text directly below.
                    Just copy all the messages from your ChatGPT conversation and paste them here.
                  </p>
                </div>

                <textarea
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="Paste your entire conversation here (both your questions and ChatGPT's responses)..."
                  className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px] font-mono text-sm"
                />

                <button
                  onClick={async () => {
                    if (!manualText.trim()) {
                      return;
                    }

                    setLoading(true);
                    setError(null);
                    setShowManualPaste(false);

                    try {
                      const response = await fetch('/api/analyze-chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          shareUrl: url,
                          category,
                          manualText: manualText.trim()
                        }),
                      });

                      const data = await response.json();

                      if (!response.ok) {
                        throw new Error(data.error || 'Analysis failed');
                      }

                      setResults(data.analysis);
                      setCharacters(data.characters);
                    } catch (err) {
                      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
                      setError(errorMessage);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={!manualText.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all disabled:opacity-50"
                >
                  Analyze Pasted Text
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
