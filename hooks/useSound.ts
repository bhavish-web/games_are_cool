"use client";

import { useCallback, useRef } from "react";
import { useLocalStorage } from "./useLocalStorage";

type SoundType = "click" | "win" | "lose" | "move" | "match" | "error" | "start" | "tick";

export function useSound() {
  const [soundEnabled, setSoundEnabled] = useLocalStorage("gamevault_sound", true);
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine", volume = 0.3) => {
      if (!soundEnabled) return;
      
      try {
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.5, ctx.currentTime + duration);

        gainNode.gain.setValueAtTime(volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
      } catch {
        // Audio not supported
      }
    },
    [soundEnabled, getAudioContext]
  );

  const playSound = useCallback(
    (type: SoundType) => {
      if (!soundEnabled) return;

      switch (type) {
        case "click":
          playTone(800, 0.1, "sine", 0.2);
          break;
        case "win":
          playTone(523, 0.15, "sine", 0.4);
          setTimeout(() => playTone(659, 0.15, "sine", 0.4), 150);
          setTimeout(() => playTone(784, 0.3, "sine", 0.4), 300);
          break;
        case "lose":
          playTone(300, 0.2, "sawtooth", 0.3);
          setTimeout(() => playTone(200, 0.4, "sawtooth", 0.3), 200);
          break;
        case "move":
          playTone(440, 0.05, "square", 0.15);
          break;
        case "match":
          playTone(600, 0.1, "sine", 0.3);
          setTimeout(() => playTone(800, 0.2, "sine", 0.3), 100);
          break;
        case "error":
          playTone(200, 0.3, "sawtooth", 0.3);
          break;
        case "start":
          playTone(440, 0.1, "sine", 0.3);
          setTimeout(() => playTone(550, 0.1, "sine", 0.3), 100);
          setTimeout(() => playTone(660, 0.2, "sine", 0.3), 200);
          break;
        case "tick":
          playTone(1000, 0.03, "square", 0.1);
          break;
      }
    },
    [soundEnabled, playTone]
  );

  return {
    soundEnabled,
    setSoundEnabled,
    playSound,
  };
}
