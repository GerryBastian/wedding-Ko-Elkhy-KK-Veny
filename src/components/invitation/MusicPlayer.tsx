"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Music2, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import type { AudioState } from "./useWeddingAudio";

type Props = {
  state: AudioState;
  title: string;
  artist: string;
  onToggle: () => void;
  onToggleMute: () => void;
};

/** Pemutar musik melayang: piringan berputar + panel judul lagu. */
export function MusicPlayer({ state, title, artist, onToggle, onToggleMute }: Props) {
  const [expanded, setExpanded] = useState(false);
  if (!state.available) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex items-center gap-2 sm:right-6"
    >
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, x: 16, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 16, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-1 rounded-full border border-champagne/50 bg-burgundy-deep/95 py-1.5 pl-4 pr-1.5 text-pearl shadow-xl shadow-black/40 backdrop-blur-md"
          >
            <div className="mr-1 max-w-[9.5rem] leading-tight">
              <p className="truncate font-display text-sm italic">{title}</p>
              <p className="truncate text-[0.62rem] tracking-wide text-champagne/80">{artist}</p>
            </div>
            <button
              type="button"
              onClick={onToggle}
              aria-label={state.playing ? "Jeda musik" : "Putar musik"}
              className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-ivory/10"
            >
              {state.playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-px" />}
            </button>
            <button
              type="button"
              onClick={onToggleMute}
              aria-label={state.muted ? "Bunyikan musik" : "Bisukan musik"}
              aria-pressed={state.muted}
              className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-ivory/10"
            >
              {state.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              aria-label="Tutup panel musik"
              className="grid h-9 w-9 place-items-center rounded-full text-ivory/60 transition hover:bg-ivory/10"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => (expanded ? onToggle() : setExpanded(true))}
        aria-label={expanded ? (state.playing ? "Jeda musik" : "Putar musik") : "Buka pemutar musik"}
        className="bg-gold relative grid h-[3.25rem] w-[3.25rem] place-items-center rounded-full p-[3px] shadow-lg shadow-black/50"
      >
        {/* Piringan hitam */}
        <span
          className={`absolute inset-[3px] rounded-full bg-[repeating-radial-gradient(circle,#151010_0_1.5px,#0a0606_1.5px_3px)] ${
            state.playing ? "animate-spin-slow" : ""
          }`}
        >
          <span className="absolute inset-[34%] rounded-full bg-burgundy ring-1 ring-champagne/70" />
          <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-champagne" />
        </span>
        {!state.playing && (
          <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-pearl text-burgundy shadow">
            <Music2 className="h-3 w-3" />
          </span>
        )}
        {state.playing && !state.muted && (
          <span className="absolute -inset-1 rounded-full border border-champagne/40 motion-safe:animate-ping" style={{ animationDuration: "2.6s" }} />
        )}
      </button>
    </motion.div>
  );
}
