"use client";

import { createContext, useContext } from "react";
import type { AudioState } from "./useWeddingAudio";

/** true setelah tamu menekan segel "Buka Undangan". */
export const OpenedContext = createContext(false);
export const useInvitationOpened = () => useContext(OpenedContext);

type MusicControls = {
  state: AudioState;
  toggle: () => void;
  toggleMute: () => void;
};

/** Kontrol musik untuk komponen di dalam undangan (mis. piringan hitam di hero). */
export const MusicContext = createContext<MusicControls>({
  state: { available: false, playing: false, muted: false },
  toggle: () => undefined,
  toggleMute: () => undefined,
});
export const useMusic = () => useContext(MusicContext);
