import React from 'react';
import { render } from '@testing-library/react';

jest.mock('framer-motion', () => {
  const ReactLib = require('react');
  const passthrough =
    (tag: string) =>
    ({
      children,
      whileHover,
      whileTap,
      whileInView,
      viewport,
      variants,
      initial,
      animate,
      exit,
      transition,
      ...rest
    }: any) =>
      ReactLib.createElement(tag, rest, children);
  return {
    __esModule: true,
    motion: new Proxy({}, { get: (_t, tag: string) => passthrough(tag) }),
    AnimatePresence: ({ children }: any) =>
      ReactLib.createElement(ReactLib.Fragment, null, children),
  };
});

import { SurfaceCard } from '@/components/ui/surface-card';

const HOVER_BORDER = 'hover:border-[var(--surface-highlight)]';

describe('SurfaceCard interactive prop', () => {
  it('is static by default (no clickable-looking hover border)', () => {
    const { container } = render(<SurfaceCard>content</SurfaceCard>);
    const root = container.firstChild as HTMLElement;
    expect(root.className).not.toContain(HOVER_BORDER);
  });

  it('shows the hover border only when interactive', () => {
    const { container } = render(<SurfaceCard interactive>content</SurfaceCard>);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain(HOVER_BORDER);
  });
});
