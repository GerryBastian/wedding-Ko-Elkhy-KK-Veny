"use client";

import { Pause, Play } from "lucide-react";
import { useMusic } from "@/components/invitation/opened-context";

/** Piringan hitam "ketuk untuk memutar" — terhubung ke musik latar. */
export function Vinyl({ className, label = "Ketuk untuk memutar" }: { className?: string; label?: string }) {
  const { state, toggle } = useMusic();
  if (!state.available) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={state.playing ? "Jeda musik" : "Putar musik"}
      className={`group relative flex flex-col items-center ${className ?? ""}`}
    >
      <span className="relative block aspect-square w-full">
        {/* Sampul piringan (burgundy) mengintip di belakang */}
        <span className="absolute inset-0 translate-x-[14%] rounded-[6%] bg-burgundy shadow-[0_12px_24px_-10px_rgb(30_5_10/0.6)]">
          <span className="absolute inset-[8%] rounded-[4%] border border-champagne/50" />
        </span>
        <span
          className={`absolute inset-0 rounded-full shadow-[0_10px_22px_-8px_rgb(0_0_0/0.7)] ${state.playing ? "animate-spin-slow" : ""}`}
          style={{
            background:
              "radial-gradient(circle at 50% 50%, transparent 0 31%, #0b0b0b 31.5%), repeating-radial-gradient(circle at 50% 50%, #161616 0 1.5px, #0a0a0a 1.5px 3px)",
          }}
        >
          <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_30deg,transparent_0_12%,rgb(255_255_255/0.14)_16%,transparent_22%_60%,rgb(255_255_255/0.1)_65%,transparent_70%)]" />
          {/* Label tengah */}
          <span className="absolute inset-[31%] grid place-items-center rounded-full bg-burgundy ring-2 ring-champagne/70">
            <span className="font-script text-[0.95em] leading-none text-champagne-soft">
              E<span className="font-serif text-[0.7em] italic">&amp;</span>V
            </span>
          </span>
          <span className="absolute left-1/2 top-1/2 h-[5%] w-[5%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ivory" />
        </span>
        <span className="absolute -bottom-[2%] -right-[2%] grid h-[30%] w-[30%] place-items-center rounded-full bg-gold text-burgundy-deep shadow-lg transition group-hover:scale-110">
          {state.playing ? <Pause className="h-[45%] w-[45%]" /> : <Play className="h-[45%] w-[45%] translate-x-[6%]" />}
        </span>
      </span>
      <span className="mt-[8%] whitespace-nowrap font-display text-[0.62em] uppercase tracking-[0.18em] text-burgundy">
        {state.playing ? "Sedang diputar" : label}
      </span>
    </button>
  );
}
