import { useEffect, useRef, useState } from "react";
import { Music2, VolumeX } from "lucide-react";

// Soft romantic instrumental — royalty-free piano loop from Pixabay CDN.
const MUSIC_SRC =
  "https://cdn.pixabay.com/audio/2022/10/18/audio_31c2d2d2e8.mp3";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const a = new Audio(MUSIC_SRC);
    a.loop = true;
    a.volume = 0.35;
    a.preload = "auto";
    audioRef.current = a;
    setReady(true);
    // Attempt soft autoplay (likely blocked until user interacts)
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    return () => {
      a.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={playing ? "Mute background music" : "Play background music"}
      className="fixed bottom-5 right-5 z-50 grid h-12 w-12 place-items-center rounded-full text-white shadow-gold transition-transform hover:scale-105 active:scale-95"
      style={{ background: "var(--gradient-gold)" }}
      disabled={!ready}
    >
      {playing ? (
        <Music2 className="h-5 w-5 animate-float-soft" />
      ) : (
        <VolumeX className="h-5 w-5" />
      )}
    </button>
  );
}
