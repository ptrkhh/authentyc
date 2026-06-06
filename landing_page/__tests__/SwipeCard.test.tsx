import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

// framer-motion is not observable in jsdom; mock motion + the value hooks.
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
  // Cache one stable component per tag so React doesn't remount on re-render.
  const cache = new Map<string, ReturnType<typeof passthrough>>();
  const mv = (v: number) => ({ get: () => v, set: () => {}, on: () => () => {}, destroy: () => {} });
  return {
    __esModule: true,
    motion: new Proxy({}, { get: (_t, tag) => {
      const k = String(tag);
      if (!cache.has(k)) cache.set(k, passthrough(k));
      return cache.get(k);
    }}),
    AnimatePresence: ({ children }: any) => ReactLib.createElement(ReactLib.Fragment, null, children),
    useMotionValue: (init: number) => mv(init),
    useTransform: () => mv(0),
    useReducedMotion: () => false,
  };
});

import { SwipeCard } from '@/components/landing/swipe/SwipeCard';
import type { SimulatedCharacter } from '@/components/landing/SimulationResults';

const char: SimulatedCharacter = {
  id: '1',
  name: 'Alex Rivera',
  role: 'Product Designer',
  avatarColor: 'bg-purple-500',
  matchScore: 92,
  alignment: ['Loves systems thinking', 'Direct communicator'],
  challenges: ['Can over-plan'],
  category: 'dating',
};

describe('SwipeCard', () => {
  it('renders glanceable front content and an EXAMPLE badge', () => {
    render(<SwipeCard character={char} active reducedMotion={false} onCommit={() => {}} />);
    expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
    expect(screen.getByText('Product Designer')).toBeInTheDocument();
    expect(screen.getByText('92%')).toBeInTheDocument();
    expect(screen.getByText('EXAMPLE')).toBeInTheDocument();
    // teaser = first alignment item
    expect(screen.getByText(/Loves systems thinking/)).toBeInTheDocument();
  });

  it('toggles expand-in-place with a synchronized aria-expanded', () => {
    render(<SwipeCard character={char} active reducedMotion={false} onCommit={() => {}} />);
    const toggle = screen.getByRole('button', { name: /see compatibility/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    // challenges are hidden while collapsed
    expect(screen.queryByText('Can over-plan')).not.toBeInTheDocument();

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Can over-plan')).toBeInTheDocument();
    expect(screen.getByText('Direct communicator')).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Can over-plan')).not.toBeInTheDocument();
  });
});
