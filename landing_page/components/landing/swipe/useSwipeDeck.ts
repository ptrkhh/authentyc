import { useState, useCallback } from 'react';
import type { SimulatedCharacter } from '@/components/landing/SimulationResults';

export type SwipeDirection = 'like' | 'pass';

export interface SwipeDeckState {
  index: number;
  current: SimulatedCharacter | undefined;
  next: SimulatedCharacter | undefined;
  liked: SimulatedCharacter[];
  passed: SimulatedCharacter[];
  isDone: boolean;
  commit: (dir: SwipeDirection) => void;
  reset: () => void;
}

/**
 * Pure deck state for the swipe interaction. No DOM, no framer-motion.
 *
 * `commit` is intentionally NOT guarded against being called twice for the same
 * card within a single render — that guarantee is enforced by the `committingRef`
 * latch in SwipeDeck. The guard here only prevents advancing past the end.
 */
export function useSwipeDeck(characters: SimulatedCharacter[]): SwipeDeckState {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<SimulatedCharacter[]>([]);
  const [passed, setPassed] = useState<SimulatedCharacter[]>([]);

  const commit = useCallback(
    (dir: SwipeDirection) => {
      const card = characters[index];
      if (!card) return; // already past the end
      if (dir === 'like') setLiked((prev) => [...prev, card]);
      else setPassed((prev) => [...prev, card]);
      setIndex((i) => i + 1);
    },
    [characters, index]
  );

  const reset = useCallback(() => {
    setIndex(0);
    setLiked([]);
    setPassed([]);
  }, []);

  return {
    index,
    current: characters[index],
    next: characters[index + 1],
    liked,
    passed,
    isDone: index >= characters.length,
    commit,
    reset,
  };
}
