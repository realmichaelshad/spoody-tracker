import { showConfirmed, showRumored } from '../state/filters';

export function FilterChips() {
  return (
    <div class="chips">
      <button
        class={`hud-btn chip green ${showConfirmed.value ? '' : 'off'}`}
        aria-label="Toggle confirmed sightings"
        aria-pressed={showConfirmed.value}
        onClick={() => (showConfirmed.value = !showConfirmed.value)}
      />
      <button
        class={`hud-btn chip red ${showRumored.value ? '' : 'off'}`}
        aria-label="Toggle rumored sightings"
        aria-pressed={showRumored.value}
        onClick={() => (showRumored.value = !showRumored.value)}
      />
    </div>
  );
}
