/**
 * ChatGPT Link Analyzer Component
 *
 * ⭐ KEY DIFFERENTIATOR ⭐
 *
 * Interactive component where users can paste ChatGPT shared links
 * and get instant personality analysis preview with simulated character matches.
 * Embedded within CategoryCards — receives its category as a prop.
 *
 * States:
 * - Initial: Input field + instructions
 * - Loading: Spinner + progress text
 * - Results: Animated reveal of insights
 * - Simulations: 5 diverse character matches with compatibility analysis
 * - Error: Helpful error messages
 */

'use client';

import { useState, useEffect } from 'react';
import type { ConversationPrompt } from '@/lib/constants/conversation-prompts';
import { SimulationResults, type Category, type SimulatedCharacter } from './SimulationResults';

interface AnalysisResult {
  overall_vibe: string;
  insights?: string[];
}

interface ChatAnalyzerProps {
  category: Category;
  onJoinWaitlist?: (category: Category) => void; // optional here; always provided by page.tsx in practice
}

export function ChatAnalyzer({ category, onJoinWaitlist }: ChatAnalyzerProps) {
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

  return (
    <div className="bg-dark-850 rounded-2xl shadow-[0_0_60px_rgba(16,185,129,0.3)] border-2 border-brand-primary/30 overflow-hidden p-8 md:p-12 relative before:absolute before:inset-0 before:rounded-2xl before:p-[2px] before:bg-gradient-to-br before:from-brand-primary/40 before:via-transparent before:to-brand-primary/20 before:-z-10">

        {/* Results State - Show both insights and characters together */}
        {results && characters && (
          <SimulationResults
            characters={characters}
            category={category}
            onJoinWaitlist={onJoinWaitlist ?? (() => {})}
            onReset={handleReset}
            insights={{
              overall_vibe: results.overall_vibe,
              insights: results.insights || [],
            }}
          />
        )}

        {/* Initial State */}
        {!results && !loading && !characters && (
          <div className="max-w-3xl mx-auto space-y-6 min-h-[400px] md:min-h-[500px]">
            {/* Instructions - Always Visible */}
            <div className="p-6 bg-dark-800/50 border border-brand-primary/20 rounded-lg space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-100 mb-2">Step 1: Copy the conversation prompt</h4>

                {promptsLoading && (
                  <div className="text-gray-400 text-xs py-4">
                    Loading prompts...
                  </div>
                )}

                {promptsError && (
                  <div className="text-red-400 text-xs py-4">
                    Failed to load prompts. Please refresh the page.
                  </div>
                )}

                {!promptsLoading && !promptsError && getPromptByCategory(category) && (
                  <>
                    <p className="text-gray-400 text-xs mb-2">
                      {getPromptByCategory(category)?.description}
                    </p>

                    {/* Copyable prompt */}
                    <div className="space-y-2">
                      <textarea
                        readOnly
                        value={getPromptByCategory(category)?.prompt || ''}
                        rows={6}
                        className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded text-gray-300 text-xs leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
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
                        className={`w-full font-semibold px-4 py-2.5 rounded transition-all shadow-sm hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900 ${
                          copied
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-brand-primary hover:bg-brand-primary-hover'
                        } text-white`}
                      >
                        {copied ? '✓ Copied!' : '📋 Copy Prompt'}
                      </button>
                    </div>
                    <p className="text-gray-400 mt-2 text-xs">
                      💡 Tip: Have a natural back-and-forth conversation (5-10 messages) for best results
                    </p>
                  </>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-gray-100 mb-2">Step 2: Paste into ChatGPT and answer the questions</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-400">
                  <li>Go to <a href="https://chatgpt.com" target="_blank" className="text-brand-primary underline hover:text-brand-primary-hover">chatgpt.com</a></li>
                  <li>Paste the prompt and press Enter</li>
                  <li>ChatGPT will ask you questions - just answer naturally (5-7 exchanges)</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-gray-100 mb-2">Step 3: Share your conversation</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-400">
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
                placeholder="https://chatgpt.com/s/... or /share/..."
                className="w-full px-4 py-3 bg-dark-900 border border-white/10 text-gray-200 placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary/50"
              />
              <button
                onClick={handleAnalyze}
                disabled={!url}
                className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] disabled:opacity-50 disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900"
              >
                Analyze My Communication Style
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div role="status" aria-live="polite" className="max-w-3xl mx-auto text-center min-h-[600px] flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4 shadow-[0_0_30px_rgba(16,185,129,0.4)]"></div>
            <p className="text-gray-300">Analyzing your conversation patterns...</p>
            <p className="text-sm text-gray-400 mt-2">Generating your personalized matches...</p>
          </div>
        )}

        {/* Error State */}
        {error && !characters && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div role="alert" className="bg-red-950/30 border border-red-500/30 p-4 rounded-lg">
              <p className="text-red-300">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setUrl('');
                  setShowManualPaste(false);
                }}
                className="mt-2 text-red-400 hover:text-red-300 font-medium min-h-[44px] px-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900"
              >
                Try again
              </button>
            </div>

            {/* Manual Paste Fallback */}
            {showManualPaste && (
              <div className="bg-blue-950/30 border border-blue-500/30 p-6 rounded-lg space-y-4">
                <div>
                  <h3 className="font-semibold text-blue-200 mb-2">
                    Alternative: Paste Your Conversation Text
                  </h3>
                  <p className="text-sm text-blue-300 mb-4">
                    Having trouble with the link? You can paste the conversation text directly below.
                    Just copy all the messages from your ChatGPT conversation and paste them here.
                  </p>
                </div>

                <textarea
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="Paste your entire conversation here (both your questions and ChatGPT's responses)..."
                  className="w-full px-4 py-3 bg-dark-900 border border-white/10 text-gray-300 placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 min-h-[200px] font-mono text-sm"
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
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900"
                >
                  Analyze Pasted Text
                </button>
              </div>
            )}
          </div>
        )}
        </div>
  );
}
