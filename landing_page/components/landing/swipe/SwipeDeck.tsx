'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import type { Category, SimulatedCharacter } from '@/components/landing/SimulationResults';
import { useSwipeDeck, type SwipeDirection } from './useSwipeDeck';
import { SwipeCard } from './SwipeCard';
import { DeckSummary } from './DeckSummary';

interface SwipeDeckProps {
  characters: SimulatedCharacter[];
  category: Category;
  onJoinWaitlist: (category: Category) => void;
  onReset: () => void;
}

export function SwipeDeck({ characters, category, onJoinWaitlist, onReset }: SwipeDeckProps) {
  const deck = useSwipeDeck(characters);
  const reducedMotion = !!useReducedMotion();
  const [exitDir, setExitDir] = useState<SwipeDirection>('like');
  const committingRef = useRef(false);

  // Reset the single-commit latch whenever the active card changes.
  useEffect(() => {
    committingRef.current = false;
  }, [deck.index]);

  const handleCommit = useCallback(
    (dir: SwipeDirection) => {
      if (committingRef.current || deck.isDone) return; // exactly one commit per card
      committingRef.current = true;
      setExitDir(dir);
      deck.commit(dir);
    },
    [deck]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleCommit('like');
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleCommit('pass');
    }
  };

  if (deck.isDone) {
    return (
      <DeckSummary
        liked={deck.liked}
        category={category}
        onJoinWaitlist={onJoinWaitlist}
        onReplayDeck={deck.reset}
        onReset={onReset}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Progress */}
      <p className="text-sm font-medium text-gray-400" aria-hidden="true">
        {Math.min(deck.index + 1, characters.length)} / {characters.length}
      </p>

      {/* Card stack: peek behind, active in front. Active card grows on expand. */}
      <div
        role="group"
        aria-roledescription="Swipe deck"
        aria-label={`Card ${deck.index + 1} of ${characters.length}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative grid grid-cols-1 grid-rows-1 w-full max-w-sm rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-4 focus-visible:ring-offset-dark-850"
      >
        <span className="sr-only">Use the left and right arrow keys to pass or like.</span>

        {/* Faint peek of the next card, behind and scaled down (decorative). */}
        {deck.next && (
          <div className="col-start-1 row-start-1 z-0 translate-y-3 scale-[0.97] opacity-50 pointer-events-none" aria-hidden="true">
            <SwipeCard character={deck.next} active={false} reducedMotion={reducedMotion} onCommit={() => {}} />
          </div>
        )}

        <AnimatePresence custom={exitDir} initial={false}>
          {deck.current && (
            <SwipeCard
              key={deck.current.id}
              character={deck.current}
              active
              reducedMotion={reducedMotion}
              onCommit={handleCommit}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Buttons — same commit path as drag/keyboard */}
      <div className="flex items-center gap-6">
        <button
          type="button"
          aria-label={deck.current ? `Pass on ${deck.current.name}` : 'Pass'}
          onClick={() => handleCommit('pass')}
          className="w-14 h-14 rounded-full border-2 border-red-400/60 text-red-400 flex items-center justify-center hover:bg-red-500/10 hover:border-red-400 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-850"
        >
          <X className="w-7 h-7" />
        </button>
        <button
          type="button"
          aria-label={deck.current ? `Like ${deck.current.name}` : 'Like'}
          onClick={() => handleCommit('like')}
          className="w-16 h-16 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:bg-brand-primary-hover transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-850"
        >
          <Heart className="w-8 h-8" fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
