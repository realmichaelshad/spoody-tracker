import { soundOn } from '../state/settings';

/**
 * All SFX are synthesized with WebAudio — zero audio assets, zero copyright.
 * The AudioContext unlocks on the preloader's sound choice (a user gesture).
 */
let ctx: AudioContext | null = null;

export function unlockAudio(): void {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
}

type Wave = OscillatorType;

interface Note {
  freq: number;
  /** seconds from cue start */
  at?: number;
  dur?: number;
  wave?: Wave;
  vol?: number;
  /** linear pitch slide target */
  slideTo?: number;
}

function play(notes: Note[]): void {
  if (!soundOn.value || !ctx || ctx.state !== 'running') return;
  const t0 = ctx.currentTime;
  for (const n of notes) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const at = t0 + (n.at ?? 0);
    const dur = n.dur ?? 0.08;
    osc.type = n.wave ?? 'square';
    osc.frequency.setValueAtTime(n.freq, at);
    if (n.slideTo) osc.frequency.linearRampToValueAtTime(n.slideTo, at + dur);
    const vol = n.vol ?? 0.08;
    gain.gain.setValueAtTime(vol, at);
    gain.gain.exponentialRampToValueAtTime(0.001, at + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(at);
    osc.stop(at + dur + 0.02);
  }
}

export const sfx = {
  /** short UI blip — any button */
  blip: () => play([{ freq: 880, dur: 0.05 }]),
  /** typewriter tick */
  key: () => play([{ freq: 1400, dur: 0.015, wave: 'square', vol: 0.03 }]),
  /** boot complete — rising arpeggio */
  boot: () =>
    play([
      { freq: 392, at: 0, dur: 0.09 },
      { freq: 523, at: 0.09, dur: 0.09 },
      { freq: 659, at: 0.18, dur: 0.14 },
    ]),
  /** menu open / close */
  open: () => play([{ freq: 330, dur: 0.1, slideTo: 660, wave: 'triangle' }]),
  close: () => play([{ freq: 660, dur: 0.1, slideTo: 330, wave: 'triangle' }]),
  /** quantized zoom step (pitch by direction) */
  zoom: (dir: 1 | -1) => play([{ freq: dir > 0 ? 520 : 380, dur: 0.045, vol: 0.05 }]),
  /** own report placed — descending plink */
  pinDrop: () =>
    play([
      { freq: 660, at: 0, dur: 0.08, wave: 'triangle' },
      { freq: 330, at: 0.08, dur: 0.16, wave: 'triangle' },
    ]),
  /** remote sighting arrives — sonar ping with echo */
  ping: () =>
    play([
      { freq: 1200, dur: 0.18, wave: 'sine', vol: 0.07 },
      { freq: 1200, at: 0.24, dur: 0.12, wave: 'sine', vol: 0.03 },
    ]),
  /** validation / rate-limit error */
  error: () => play([{ freq: 120, dur: 0.2, vol: 0.09 }]),
  /** toggle flip */
  toggle: (on: boolean) =>
    play([{ freq: on ? 700 : 400, dur: 0.06 }, { freq: on ? 1000 : 300, at: 0.07, dur: 0.06 }]),
};
