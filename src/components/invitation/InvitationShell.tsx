"use client";

import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { wedding } from "@/config/wedding";
import { EnvelopeIntro } from "./EnvelopeIntro";
import { MusicPlayer } from "./MusicPlayer";
import { ScrollProgress } from "./ScrollProgress";
import { useWeddingAudio } from "./useWeddingAudio";
import { MusicContext, OpenedContext } from "./opened-context";

type Props = {
  guestName: string | null;
  children: React.ReactNode;
};

/**
 * Alur pembuka: amplop (ketuk segel) → langsung masuk undangan.
 * Seluruh section di dalam `children` tetap Server Components.
 */
export function InvitationShell({ guestName, children }: Props) {
  const [envelope, setEnvelope] = useState(true);
  const [opened, setOpened] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const audio = useWeddingAudio(wedding.music.src, wedding.music.startAt);

  // Kunci scroll sampai amplop terbuka
  useEffect(() => {
    const root = document.documentElement;
    if (!opened) {
      window.scrollTo(0, 0);
      root.style.overflow = "hidden";
    } else {
      root.style.overflow = "";
    }
    return () => {
      root.style.overflow = "";
    };
  }, [opened]);

  // Dipanggil langsung dari ketukan segel → browser mengizinkan audio diputar
  const startMusic = () => {
    if (musicEnabled && audio.state.available && !audio.state.playing) void audio.play();
  };

  return (
    <MotionConfig reducedMotion="user">
      <MusicContext.Provider value={{ state: audio.state, toggle: audio.toggle, toggleMute: audio.toggleMute }}>
        {envelope && (
          <EnvelopeIntro
            guestName={guestName}
            musicEnabled={musicEnabled}
            musicAvailable={audio.state.available}
            onToggleMusic={() => setMusicEnabled((v) => !v)}
            onOpen={startMusic}
            onReveal={() => setOpened(true)}
            onDone={() => setEnvelope(false)}
          />
        )}

        <OpenedContext.Provider value={opened}>
          <div aria-hidden={!opened} inert={!opened}>
            {opened && <ScrollProgress />}
            <main className="overflow-x-clip">{children}</main>
          </div>
        </OpenedContext.Provider>

        {opened && !envelope && (
          <MusicPlayer
            state={audio.state}
            title={wedding.music.title}
            artist={wedding.music.artist}
            onToggle={audio.toggle}
            onToggleMute={audio.toggleMute}
          />
        )}
      </MusicContext.Provider>
    </MotionConfig>
  );
}
