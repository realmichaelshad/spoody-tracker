import { config } from '../config';
import { FilterChips } from './FilterChips';

interface Props {
  onReport?: () => void;
  onMenu?: () => void;
}

/**
 * HUD chrome: pixel frame, logo plate, corner buttons, filter chips,
 * ticker bar, climbing hero, report CTA.
 */
export function FrameChrome({ onReport, onMenu }: Props) {
  const [wordA, wordB] = splitSiteName(config.siteName);
  return (
    <div class="hud">
      <div class="hud-frame" />

      <div class="logo-plate">
        <span class="word">{wordA}</span>
        <span class="face" />
        {wordB && <span class="word">{wordB}</span>}
      </div>

      <button class="hud-btn menu-btn" aria-label="Menu" onClick={onMenu} />
      <button class="hud-btn spider-btn" aria-label="Report a sighting" onClick={onReport} />

      <FilterChips />

      <div class="ticker-bar">
        <div class="ticker-track">
          <div class="ticker-text">
            {config.siteName} ONLINE — INTERACT WITH THE MAP TO VIEW SIGHTINGS ALL OVER THE
            WORLD — REPORT YOUR OWN SIGHTING TO PUT IT ON THE MAP
          </div>
        </div>
        <button class="hud-btn sound-btn" aria-label="Toggle sound" />
      </div>

      <div class="hero" aria-hidden="true" />

      <button class="hud-btn cta-tab" onClick={onReport}>
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
