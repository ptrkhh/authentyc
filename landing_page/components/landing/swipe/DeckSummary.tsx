'use client';

import { useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { Category, SimulatedCharacter } from '@/components/landing/SimulationResults';

interface DeckSummaryProps {
  liked: SimulatedCharacter[];
  category: Category;
  onJoinWaitlist: (category: Category) => void; // primary CTA → opens waitlist modal
  onReplayDeck: () => void; // resets the deck to index 0 (same characters)
  onReset: () => void; // clears results, returns to category selector
}

export function DeckSummary({ liked, category, onJoinWaitlist, onReplayDeck, onReset }: DeckSummaryProps) {
  const likedCount = liked.length;
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (likedCount > 0 && !reducedMotion) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    // Fire once on mount only — do not re-fire on re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headline =
    likedCount > 0
      ? `You're interested in ${likedCount} — join to meet them for real`
      : 'Not feeling these? Your real matches are tailored to you — join the waitlist.';

  return (
    <div className="max-w-md mx-auto text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <h3 className="text-2xl font-bold text-gray-100">{headline}</h3>

      <div className="flex flex-col gap-3 pt-2">
        <button
          type="button"
          onClick={() => onJoinWaitlist(category)}
          className="bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold px-8 py-4 rounded-lg transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900"
        >
          Join Waitlist
        </button>
        <button
          type="button"
          onClick={onReplayDeck}
          className="px-8 py-3 rounded-lg border border-white/20 text-gray-300 hover:bg-dark-800 hover:border-brand-primary/50 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900"
        >
          Replay
        </button>
        <button
          type="button"
          onClick={onReset}
          className="px-8 py-2 text-sm text-gray-400 hover:text-gray-200 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900 rounded"
        >
          Try Another Category
        </button>
      </div>
    </div>
  );
}
