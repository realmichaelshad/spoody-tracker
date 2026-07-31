import { config } from '../config';
import { soundOn, openPanel } from '../state/settings';
import { newestFirst, sightings } from '../state/sightings';
import { unreadCount, notifOpen, openNotifications, closeNotifications } from '../state/notifications';
import { sfx, unlockAudio } from '../audio/sfx';

interface Props {
  onReport?: () => void;
}

/** Ticker copy: stream the latest sighting headlines, fall back to the promo line. */
function tickerText(): string {
  void sightings.value;
  const latest = newestFirst(8);
  if (!latest.length) {
    return `${config.siteName} ONLINE — INTERACT WITH THE MAP TO VIEW SIGHTINGS ALL OVER THE WORLD — REPORT YOUR OWN SIGHTING TO PUT IT ON THE MAP`;
  }
  return latest
    .map((s) => `★ ${s.name}${s.placeLabel ? ` NEAR ${s.placeLabel}` : ''}: ${s.message}`)
    .join('   •   ');
}

/**
 * HUD chrome: pixel frame, logo plate, corner buttons, filter chips,
 * ticker bar, climbing hero, report CTA.
 */
export function FrameChrome({ onReport }: Props) {
  const [wordA, wordB] = splitSiteName(config.siteName);
  return (
    <div class="hud">
      <div class="map-fx" />
      <div class="hud-frame" />

      <div class="logo-plate">
        <span class="word">{wordA}</span>
        <span class="face" />
        {wordB && <span class="word">{wordB}</span>}
      </div>

      <button
        class="hud-btn menu-btn"
        aria-label="Menu"
        onClick={() => {
          const opening = openPanel.value === 'none';
          openPanel.value = opening ? 'menu' : 'none';
          opening ? sfx.open() : sfx.close();
        }}
      />
      <button
        class="hud-btn spider-btn"
        aria-label="Sighting alerts"
        onClick={() => {
          if (notifOpen.value) {
            closeNotifications();
            sfx.close();
          } else {
            openNotifications();
            sfx.open();
          }
        }}
      >
        {unreadCount.value > 0 && <span class="badge">{Math.min(unreadCount.value, 9)}</span>}
      </button>

      <div class="ticker-bar">
        <div class="ticker-track">
          <div class="ticker-text">{tickerText()}</div>
        </div>
        <button
          class={`hud-btn sound-btn ${soundOn.value ? '' : 'off'}`}
          aria-label="Toggle sound"
          aria-pressed={soundOn.value}
          onClick={() => {
            const next = !soundOn.value;
            soundOn.value = next;
            if (next) unlockAudio();
            sfx.toggle(next);
          }}
        />
      </div>

      <div class="hero" aria-hidden="true" />

      <button class="hud-btn px-primary px-yellow cta-tab" onClick={onReport}>
        REPORT SIGHTING
      </button>
    </div>
  );
}

/** Split the site name into two words around its midpoint for the logo plate. */
function splitSiteName(name: string): [string, string] {
  const words = name.trim().split(/\s+/);
  if (words.length < 2) return [name, ''];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}
