/**
 * src/japanese-audio.js — 4-Layer Looped Japanese Yo-Scale WebAudio Synthesizer (Ledger 2)
 * Tuned to the traditional Yo pentatonic scale (D4, E4, G4, A4, B4 = 293.66, 329.63, 392.00, 440.00, 493.88 Hz).
 * Mute-by-default; stacks Shakuhachi Flute -> Koto Pluck -> Taiko Pulse -> Bonshō Bell as stages unlock.
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

const YO_SCALE_HZ = [293.66, 329.63, 392.00, 440.00, 493.88]; // D4, E4, G4, A4, B4

export function createJapaneseYoAudio() {
  let muted = true;
  let ctx = null;
  let loopTimer = null;
  let step = 0;
  let activeLayers = 1;

  const ensureCtx = () => {
    if (!ctx && typeof window !== "undefined") {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (Ctor) ctx = new Ctor();
    }
    if (ctx && ctx.state === "suspended") ctx.resume();
    return ctx;
  };

  const playVoice = (freq, type, gainPeak, attack, decay, cutoff = 900) => {
    const ac = ensureCtx();
    if (!ac || muted) return;

    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const filter = ac.createBiquadFilter();
    const gain = ac.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoff, now);
    filter.frequency.exponentialRampToValueAtTime(240, now + decay);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(gainPeak, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);

    osc.start(now);
    osc.stop(now + decay + 0.06);
  };

  const tickLoop = () => {
    if (!muted) {
      const note = YO_SCALE_HZ.at(step % YO_SCALE_HZ.length);

      // Layer 1: Shakuhachi Bamboo Flute breath phrase (every 4th beat)
      if (activeLayers >= 1 && step % 4 === 0) {
        playVoice(note, "sine", 0.045, 0.22, 1.9, 760);
      }

      // Layer 2: Plucked Koto pentatonic ostinato (every beat)
      if (activeLayers >= 2) {
        const kotoNote = YO_SCALE_HZ.at((step * 2) % YO_SCALE_HZ.length);
        playVoice(kotoNote, "triangle", 0.038, 0.01, 0.65, 1400);
      }

      // Layer 3: Deep Taiko heartbeat pulse (beats 0 and 3 of 4)
      if (activeLayers >= 3 && (step % 4 === 0 || step % 4 === 3)) {
        playVoice(73.42, "sine", 0.075, 0.015, 0.55, 220); // D2
      }

      // Layer 4: Shimmering Bonshō temple bell overtone (every 8th beat)
      if (activeLayers >= 4 && step % 8 === 0) {
        playVoice(587.33, "sine", 0.032, 0.02, 2.8, 1600); // D5
        playVoice(880.00, "sine", 0.016, 0.02, 2.4, 1600); // A5
      }
    }
    step++;
  };

  const startLoop = () => {
    if (loopTimer || typeof window === "undefined") return;
    loopTimer = window.setInterval(tickLoop, 520);
  };

  return {
    isMuted: () => muted,
    setLayers: (layers) => {
      activeLayers = Math.max(1, Math.min(4, layers | 0));
    },
    toggleMute: () => {
      muted = !muted;
      if (!muted) {
        ensureCtx();
        startLoop();
        tickLoop();
      }
      return muted;
    },
    playChime: () => {
      if (muted) return;
      playVoice(587.33, "sine", 0.055, 0.01, 1.2, 1500);
      playVoice(880.00, "sine", 0.025, 0.01, 1.0, 1500);
    },
  };
}
