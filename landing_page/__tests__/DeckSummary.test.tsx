import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { DeckSummary } from '@/components/landing/swipe/DeckSummary';
import type { SimulatedCharacter } from '@/components/landing/SimulationResults';

function makeChar(id: string): SimulatedCharacter {
  return {
    id,
    name: `Person ${id}`,
    role: 'Role',
    avatarColor: 'bg-blue-500',
    matchScore: 88,
    alignment: ['a'],
    challenges: ['c'],
    category: 'hiring',
  };
}

describe('DeckSummary', () => {
  it('shows the interested headline and liked avatars when liked.length > 0', () => {
    render(
      <DeckSummary
        liked={[makeChar('1'), makeChar('2')]}
        category="hiring"
        onJoinWaitlist={() => {}}
        onReplayDeck={() => {}}
        onReset={() => {}}
      />
    );
    expect(screen.getByText(/You're interested in 2/)).toBeInTheDocument();
    // one avatar initial per liked character
    expect(screen.getAllByText('P')).toHaveLength(2);
  });

  it('shows the alternate copy when nothing was liked', () => {
    render(
      <DeckSummary
        liked={[]}
        category="hiring"
        onJoinWaitlist={() => {}}
        onReplayDeck={() => {}}
        onReset={() => {}}
      />
    );
    expect(screen.getByText(/Not feeling these\?/)).toBeInTheDocument();
  });

  it('wires the three buttons to their callbacks', () => {
    const onJoinWaitlist = jest.fn();
    const onReplayDeck = jest.fn();
    const onReset = jest.fn();
    render(
      <DeckSummary
        liked={[makeChar('1')]}
        category="cofounder"
        onJoinWaitlist={onJoinWaitlist}
        onReplayDeck={onReplayDeck}
        onReset={onReset}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Join Waitlist' }));
    expect(onJoinWaitlist).toHaveBeenCalledWith('cofounder');

    fireEvent.click(screen.getByRole('button', { name: 'Replay' }));
    expect(onReplayDeck).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Try Another Category' }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
