'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { Check, AlertTriangle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import type { SimulatedCharacter } from '@/components/landing/SimulationResults';
import type { SwipeDirection } from './useSwipeDeck';

const COMMIT_OFFSET = 100; // px past which a release commits
const COMMIT_VELOCITY = 500; // px/s flick that commits regardless of offset

interface SwipeCardProps {
  character: SimulatedCharacter;
  active: boolean; // only the top card is interactive; the peek is not
  reducedMotion: boolean;
  onCommit: (dir: SwipeDirection) => void; // fired on drag-release past threshold
}

export function SwipeCard({ character, active, reducedMotion, onCommit }: SwipeCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Force-collapse if this card stops being the active card.
  useEffect(() => {
    if (!active) setExpanded(false);
  }, [active]);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], reducedMotion ? [0, 0, 0] : [-15, 0, 15]);
  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-120, -20], [1, 0]);

  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (offset.x > COMMIT_OFFSET || velocity.x > COMMIT_VELOCITY) onCommit('like');
    else if (offset.x < -COMMIT_OFFSET || velocity.x < -COMMIT_VELOCITY) onCommit('pass');
    // otherwise framer springs x back to 0 via the {left:0,right:0} constraints
  };

  // Exit fly-off direction is resolved from AnimatePresence `custom` in the parent.
  const exitVariants = {
    fly: (dir: SwipeDirection) =>
      reducedMotion
        ? { opacity: 0, transition: { duration: 0.2 } }
        : { x: dir === 'like' ? 600 : -600, opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      drag={active ? 'x' : false}
      dragDirectionLock
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={reducedMotion ? 0 : 0.6}
      style={{ x, rotate }}
      variants={exitVariants}
      exit="fly"
      onDragEnd={active ? handleDragEnd : undefined}
      className={`relative w-full rounded-2xl border border-white/10 bg-dark-800/80 backdrop-blur-sm overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.4)] ${
        active ? 'cursor-grab active:cursor-grabbing z-10' : 'pointer-events-none'
      }`}
    >
      {/* LIKE / NOPE stamps (only meaningful on the active, draggable card) */}
      {active && (
        <>
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-6 left-6 z-20 rotate-[-18deg] rounded-md border-4 border-green-400 px-3 py-1 text-2xl font-extrabold tracking-widest text-green-400"
          >
            LIKE
          </motion.div>
          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-6 right-6 z-20 rotate-[18deg] rounded-md border-4 border-red-400 px-3 py-1 text-2xl font-extrabold tracking-widest text-red-400"
          >
            NOPE
          </motion.div>
        </>
      )}

      {/* EXAMPLE badge */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-700/90 backdrop-blur-sm border border-gray-600/50 shadow-lg">
        <Sparkles className="w-3.5 h-3.5 text-gray-300" />
        <span className="text-xs font-semibold text-gray-200 tracking-wide">EXAMPLE</span>
      </div>

      {/* Header */}
      <div className={`pt-12 p-4 ${character.avatarColor} bg-opacity-20 flex items-center gap-4 border-b border-white/10`}>
        <div
          className={`w-12 h-12 rounded-full ${character.avatarColor} flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(0,0,0,0.3)]`}
        >
          {character.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-gray-100 truncate">{character.name}</h4>
          <p className="text-sm text-gray-400 truncate">{character.role}</p>
        </div>
        <div className="ml-auto flex flex-col items-end">
          <span className="text-2xl font-bold text-brand-primary">{character.matchScore}%</span>
          <span className="text-xs text-gray-500">Match</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {/* Teaser: first alignment item, truncated when collapsed */}
        {!expanded && (
          <p className="text-sm text-gray-300 leading-relaxed line-clamp-2">
            {character.alignment[0]}
          </p>
        )}

        {expanded && (
          <>
            <div>
              <h5 className="text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                Why you align
              </h5>
              <ul className="space-y-2">
                {character.alignment.map((point, idx) => (
                  <li key={idx} className="text-sm text-gray-300 leading-relaxed pl-2 border-l-2 border-green-500/30">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 border-t border-white/10">
              <h5 className="text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Potential Challenges
              </h5>
              <ul className="space-y-2">
                {character.challenges.map((point, idx) => (
                  <li key={idx} className="text-sm text-gray-300 leading-relaxed pl-2 border-l-2 border-amber-500/30">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="w-full flex items-center justify-center gap-1.5 text-sm font-medium text-brand-primary hover:text-brand-primary-hover py-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" /> Hide compatibility
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" /> See compatibility
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
