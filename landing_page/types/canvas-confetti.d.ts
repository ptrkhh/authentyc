// Minimal ambient types for canvas-confetti (the package ships none at v1.9.4).
// DELETE this file if @types/canvas-confetti is ever added to devDependencies —
// two ambient declarations for the same module would collide.
declare module 'canvas-confetti' {
  interface ConfettiOptions {
    particleCount?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
    [key: string]: unknown;
  }
  function confetti(options?: ConfettiOptions): Promise<null> | null;
  export default confetti;
}
