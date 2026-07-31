import { useEffect, useState } from 'preact/hooks';
import { config } from '../config';
import { soundOn } from '../state/settings';
import { unlockAudio, sfx } from '../audio/sfx';

const LINES = [
  `WELCOME TO ${config.siteName}.`,
  'INTERACT WITH THE MAP TO VIEW',
  'SIGHTINGS ALL OVER THE WORLD.',
];

interface Props {
  onDone: () => void;
}

/**
 * Boot screen: typewriter welcome, pixel progress bar, SOUND ON/OFF choice.
 * The sound choice doubles as the user gesture that unlocks WebAudio.
 */
export function Preloader({ onDone }: Props) {
  const [typed, setTyped] = useState(0);
  const [bar, setBar] = useState(0);
  const total = LINES.join('').length;

  useEffect(() => {
    const typeTimer = setInterval(() => {
      setTyped((n) => {
        if (n >= total) {
          clearInterval(typeTimer);
          return n;
        }
        if (n % 2 === 0) sfx.key();
        return n + 1;
      });
    }, 22);
    const barTimer = setInterval(() => {
      setBar((b) => Math.min(b + 1, 10));
    }, 120);
    return () => {
      clearInterval(typeTimer);
      clearInterval(barTimer);
    };
  }, []);

  const ready = typed >= total && bar >= 10;

  const choose = (on: boolean) => {
    soundOn.value = on;
    unlockAudio();
    if (on) sfx.boot();
    onDone();
  };

  /* Render typed chars across the fixed lines */
  let remaining = typed;
  const shown = LINES.map((line) => {
    const take = Math.max(0, Math.min(line.length, remaining));
    remaining -= take;
    return line.slice(0, take);
  });

  return (
    <div class="preloader">
      <div class="pre-inner">
        <div class="pre-face" aria-hidden="true" />
        <div class="pre-text" aria-live="polite">
          {shown.map((l, i) => (
            <div key={i} class="pre-line">
              {l}
              {typed < total && l.length > 0 && shown[i + 1] === '' ? (
                <span class="pre-caret" />
              ) : null}
            </div>
          ))}
        </div>
        <div class="pre-bar" role="progressbar" aria-valuenow={bar} aria-valuemax={10}>
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} class={`pre-cell ${i < bar ? 'on' : ''}`} />
          ))}
        </div>
        <div class={`pre-choice ${ready ? 'ready' : ''}`}>
          <div class="pre-prompt">CHOOSE YOUR SETTINGS AND START TRACKING</div>
          <div class="pre-btns">
            <button class="px-primary px-green pre-btn" onClick={() => choose(true)} disabled={!ready}>
              SOUND ON
            </button>
            <button class="px-primary pre-btn alt" onClick={() => choose(false)} disabled={!ready}>
              SOUND OFF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
