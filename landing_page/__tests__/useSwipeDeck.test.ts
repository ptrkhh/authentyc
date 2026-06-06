import { renderHook, act } from '@testing-library/react';
import { useSwipeDeck } from '@/components/landing/swipe/useSwipeDeck';
import type { SimulatedCharacter } from '@/components/landing/SimulationResults';

function makeChar(id: string): SimulatedCharacter {
  return {
    id,
    name: `Name ${id}`,
    role: 'Role',
    avatarColor: 'bg-blue-500',
    matchScore: 90,
    alignment: ['a1', 'a2'],
    challenges: ['c1'],
    category: 'dating',
  };
}

describe('useSwipeDeck', () => {
  const chars = [makeChar('1'), makeChar('2'), makeChar('3')];

  it('starts at index 0 with empty buckets', () => {
    const { result } = renderHook(() => useSwipeDeck(chars));
    expect(result.current.index).toBe(0);
    expect(result.current.current?.id).toBe('1');
    expect(result.current.next?.id).toBe('2');
    expect(result.current.liked).toEqual([]);
    expect(result.current.passed).toEqual([]);
    expect(result.current.isDone).toBe(false);
  });

  it('commit("like") buckets the current card and advances', () => {
    const { result } = renderHook(() => useSwipeDeck(chars));
    act(() => result.current.commit('like'));
    expect(result.current.index).toBe(1);
    expect(result.current.liked.map((c) => c.id)).toEqual(['1']);
    expect(result.current.passed).toEqual([]);
    expect(result.current.current?.id).toBe('2');
  });

  it('commit("pass") buckets into passed', () => {
    const { result } = renderHook(() => useSwipeDeck(chars));
    act(() => result.current.commit('pass'));
    expect(result.current.passed.map((c) => c.id)).toEqual(['1']);
    expect(result.current.liked).toEqual([]);
  });

  it('flips isDone when the last card is committed', () => {
    const { result } = renderHook(() => useSwipeDeck(chars));
    act(() => result.current.commit('like'));
    act(() => result.current.commit('pass'));
    expect(result.current.isDone).toBe(false);
    act(() => result.current.commit('like'));
    expect(result.current.isDone).toBe(true);
    expect(result.current.current).toBeUndefined();
    expect(result.current.liked.map((c) => c.id)).toEqual(['1', '3']);
    expect(result.current.passed.map((c) => c.id)).toEqual(['2']);
  });

  it('reset() returns to the initial state', () => {
    const { result } = renderHook(() => useSwipeDeck(chars));
    act(() => result.current.commit('like'));
    act(() => result.current.commit('like'));
    act(() => result.current.reset());
    expect(result.current.index).toBe(0);
    expect(result.current.liked).toEqual([]);
    expect(result.current.passed).toEqual([]);
    expect(result.current.isDone).toBe(false);
  });

  it('is done immediately for an empty deck and commit is a no-op', () => {
    const { result } = renderHook(() => useSwipeDeck([]));
    expect(result.current.isDone).toBe(true);
    expect(result.current.current).toBeUndefined();
    act(() => result.current.commit('like'));
    expect(result.current.index).toBe(0);
    expect(result.current.liked).toEqual([]);
  });
});
