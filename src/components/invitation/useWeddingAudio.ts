"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type AudioState = {
  /** false jika file musik tidak ada / gagal dimuat */
  available: boolean;
  playing: boolean;
  muted: boolean;
};

/**
 * Musik latar. Tidak pernah autoplay — `play()` hanya dipanggil dari klik pengguna.
 * Mulai dari detik `startAt`, dan saat selesai mengulang dari titik yang sama.
 */
export function useWeddingAudio(src: string, startAt: number) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const seekedRef = useRef(false);
  const resumeOnVisibleRef = useRef(false);
  const [state, setState] = useState<AudioState>({ available: true, playing: false, muted: false });

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.src = src;
    audioRef.current = audio;

    const seekToStart = () => {
      if (seekedRef.current) return;
      if (Number.isFinite(audio.duration) && audio.duration > startAt) audio.currentTime = startAt;
      seekedRef.current = true;
    };
    const onLoaded = () => seekToStart();
    const onError = () => setState((s) => ({ ...s, available: false, playing: false }));
    const onPlay = () => setState((s) => ({ ...s, playing: true }));
    const onPause = () => setState((s) => ({ ...s, playing: false }));
    const onEnded = () => {
      audio.currentTime = Number.isFinite(audio.duration) && audio.duration > startAt ? startAt : 0;
      void audio.play().catch(() => undefined);
    };
    // Jeda saat tab/aplikasi disembunyikan (mis. pindah ke WhatsApp), lanjut saat kembali
    const onVisibility = () => {
      if (document.hidden) {
        resumeOnVisibleRef.current = !audio.paused;
        audio.pause();
      } else if (resumeOnVisibleRef.current) {
        resumeOnVisibleRef.current = false;
        void audio.play().catch(() => undefined);
      }
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("error", onError);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      document.removeEventListener("visibilitychange", onVisibility);
      audio.src = "";
      audioRef.current = null;
    };
  }, [src, startAt]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (!seekedRef.current && audio.readyState >= 1) {
        if (audio.duration > startAt) audio.currentTime = startAt;
        seekedRef.current = true;
      }
      // Volume naik perlahan agar tidak mengagetkan
      audio.volume = 0;
      await audio.play();
      const target = 0.85;
      const step = () => {
        if (!audioRef.current || audio.paused) return;
        audio.volume = Math.min(target, audio.volume + 0.05);
        if (audio.volume < target) window.setTimeout(step, 90);
      };
      step();
    } catch {
      setState((s) => ({ ...s, playing: false }));
    }
  }, [startAt]);

  const pause = useCallback(() => audioRef.current?.pause(), []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void play();
    else audio.pause();
  }, [play]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setState((s) => ({ ...s, muted: audio.muted }));
  }, []);

  return { state, play, pause, toggle, toggleMute };
}
