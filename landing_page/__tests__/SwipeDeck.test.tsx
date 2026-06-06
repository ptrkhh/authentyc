import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('framer-motion', () => {
  const ReactLib = require('react');
  const passthrough =
    (tag: string) =>
    ({
      children,
      drag,
      dragConstraints,
      dragElastic,
      dragDirectionLock,
      dragSnapToOrigin,
      onDragEnd,
      onDrag,
      style,
      variants,
      initial,
      animate,
      exit,
      transition,
      whileTap,
      whileHover,
      whileDrag,
      whileInView,
      viewport,
      custom,
      layout,
      ...rest
    }: any) =>
      ReactLib.createElement(tag, rest, children);
  // Cache one stable component per tag so React doesn't remount the subtree on
  // every re-render (a fresh function per access changes component identity).
  const cache = new Map<string, ReturnType<typeof passthrough>>();
  const mv = (v: number) => ({ get: () => v, set: () => {}, on: () => () => {}, destroy: () => {} });
  return {
    __esModule: true,
    motion: new Proxy({}, { get: (_t, tag) => {
      const k = String(tag);
      if (!cache.has(k)) cache.set(k, passthrough(k));
      return cache.get(k);
    } }),
    AnimatePresence: ({ children }: any) => ReactLib.createElement(ReactLib.Fragment, null, children),
    useMotionValue: (init: number) => mv(init),
    useTransform: () => mv(0),
    useReducedMotion: () => false,
  };
});

import { SwipeDeck } from '@/components/landing/swipe/SwipeDeck';
import type { SimulatedCharacter } from '@/components/landing/SimulationResults';

function makeChar(id: string): SimulatedCharacter {
  return {
    id,
    name: `Person ${id}`,
    role: 'Role',
    avatarColor: 'bg-blue-500',
    matchScore: 90,
    alignment: ['align point'],
    challenges: ['challenge point'],
    category: 'dating',
  };
}

function renderDeck(overrides: Partial<React.ComponentProps<typeof SwipeDeck>> = {}) {
  const props = {
    characters: [makeChar('1'), makeChar('2')],
    category: 'dating' as const,
    onJoinWaitlist: jest.fn(),
    onReset: jest.fn(),
    ...overrides,
  };
  render(<SwipeDeck {...props} />);
  return props;
}

describe('SwipeDeck', () => {
  it('shows a progress counter starting at 1 / total', () => {
    renderDeck();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  it('advances and buckets when the ♥ Like button is clicked', () => {
    renderDeck();
    fireEvent.click(screen.getByRole('button', { name: 'Like Person 1' }));
    expect(screen.getByText('2 / 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Like Person 2' })).toBeInTheDocument();
  });

  it('reaches DeckSummary with the correct liked count after working through the deck', () => {
    renderDeck();
    fireEvent.click(screen.getByRole('button', { name: 'Like Person 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Like Person 2' }));
    expect(screen.getByText(/You're interested in 2/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Join Waitlist' })).toBeInTheDocument();
  });

  it('shows the liked-count-0 copy when every card is passed', () => {
    renderDeck();
    fireEvent.click(screen.getByRole('button', { name: 'Pass on Person 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Pass on Person 2' }));
    expect(screen.getByText(/Not feeling these\?/)).toBeInTheDocument();
  });

  it('advances on ArrowRight (like) via keyboard', () => {
    renderDeck();
    const group = screen.getByRole('group', { name: /card 1 of 2/i });
    fireEvent.keyDown(group, { key: 'ArrowRight' });
    expect(screen.getByText('2 / 2')).toBeInTheDocument();
  });

  it('the waitlist CTA calls onJoinWaitlist with the category', () => {
    const { onJoinWaitlist } = renderDeck();
    fireEvent.click(screen.getByRole('button', { name: 'Like Person 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Like Person 2' }));
    fireEvent.click(screen.getByRole('button', { name: 'Join Waitlist' }));
    expect(onJoinWaitlist).toHaveBeenCalledWith('dating');
  });

  it('Replay resets the deck back to the first card', () => {
    renderDeck();
    fireEvent.click(screen.getByRole('button', { name: 'Like Person 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Like Person 2' }));
    fireEvent.click(screen.getByRole('button', { name: 'Replay' }));
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });
});
