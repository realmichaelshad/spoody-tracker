import type { ComponentChildren } from 'preact';
import { config, HOUSE_LINES } from '../config';
import { openPanel } from '../state/settings';
import { newestFirst, sightings } from '../state/sightings';
import { unreadCount, notifOpen, openNotifications, closeNotifications } from '../state/notifications';
import { sfx } from '../audio/sfx';

interface Props {
  onReport?: () => void;
}

const SEP = '   •   ';

/**
 * Ticker content: live sighting headlines with the creator credit and a
 * couple of house lines mixed in, so the crawl never reads like pure log.
 */
function tickerContent(): ComponentChildren[] {
  void sightings.value;
  const latest = newestFirst(8);

  const lines: ComponentChildren[] = [];

  if (config.creatorUrl) {
    lines.push(
      <a class="ticker-link" href={config.creatorUrl} target="_blank" rel="noopener noreferrer">
        ★ BUILT BY {config.creatorHandle} — FOLLOW ON X
      </a>,
    );
  }

  if (latest.length) {
    lines.push(
      ...latest.map(
        (s) => `★ ${s.name}${s.placeLabel ? ` NEAR ${s.placeLabel}` : ''}: ${s.message}`,
      ),
    );
  } else {
    lines.push(`${config.siteName} ONLINE — SPOT SOMETHING? PUT IT ON THE MAP`);
  }

  /* Spread the house lines evenly through the crawl so they never bunch up,
     however many sightings happen to be loaded. */
  const gap = (lines.length + HOUSE_LINES.length) / (HOUSE_LINES.length + 1);
  HOUSE_LINES.forEach((line, i) => {
    const at = Math.min(lines.length, Math.round(gap * (i + 1)));
    lines.splice(at, 0, line);
  });

  /* Interleave separators without a trailing one. */
  return lines.flatMap((l, i) => (i === 0 ? [l] : [SEP, l]));
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

      <h1 class="logo-plate">
        <span class="word">{wordA}</span>
        {/* Real space so the heading reads "SPOODY TRACKER", not one word,
            to search engines and screen readers. Flex gap handles the look. */}
        <span class="sr-space"> </span>
        <span class="face" aria-hidden="true" />
        {wordB && <span class="word">{wordB}</span>}
      </h1>

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
          <div class="ticker-text">{tickerContent()}</div>
        </div>
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
