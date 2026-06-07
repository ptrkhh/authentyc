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

import { SimulationResults, type SimulatedCharacter } from '@/components/landing/SimulationResults';

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

describe('SimulationResults renders the swipe deck', () => {
  const baseProps = {
    characters: [makeChar('1'), makeChar('2')],
    category: 'dating' as const,
    onReset: jest.fn(),
    insights: { overall_vibe: 'Curious and direct', insights: ['Insight A'] },
  };

  it('keeps the insights section and shows the deck instead of the old grid CTA', () => {
    render(<SimulationResults {...baseProps} onJoinWaitlist={jest.fn()} />);
    expect(screen.getByText('Curious and direct')).toBeInTheDocument();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
    expect(screen.queryByText(/Get Real Matches/)).not.toBeInTheDocument();
  });

  it('forwards onJoinWaitlist from the end-of-deck CTA', () => {
    const onJoinWaitlist = jest.fn();
    render(<SimulationResults {...baseProps} onJoinWaitlist={onJoinWaitlist} />);
    fireEvent.click(screen.getByRole('button', { name: 'Like Person 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Like Person 2' }));
    fireEvent.click(screen.getByRole('button', { name: 'Join Waitlist' }));
    expect(onJoinWaitlist).toHaveBeenCalledWith('dating');
  });
});
