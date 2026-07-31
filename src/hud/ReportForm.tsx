import { signal } from '@preact/signals';
import { useState } from 'preact/hooks';
import { submitSighting } from '../lib/api';

/** null = closed; otherwise the report panel is open with optional preset coords. */
export const reportOpen = signal<{ lat?: number; lng?: number } | null>(null);
/** When true, the next map click sets report coordinates. */
export const pickingOnMap = signal(false);

interface Props {
  onPickOnMap: () => void;
  onDone: (lat: number, lng: number) => void;
}

export function ReportForm({ onPickOnMap, onDone }: Props) {
  const open = reportOpen.value;
  const [name, setName] = useState(localStorage.getItem('webhead:name') ?? '');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [locBusy, setLocBusy] = useState(false);

  if (!open) return null;
  const hasLoc = open.lat !== undefined && open.lng !== undefined;

  const useMyLocation = () => {
    setError('');
    setLocBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocBusy(false);
        reportOpen.value = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      },
      () => {
        setLocBusy(false);
        setError('LOCATION BLOCKED. PICK ON THE MAP INSTEAD.');
      },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  };

  const submit = async () => {
    if (!hasLoc) {
      setError('SET A LOCATION FIRST.');
      return;
    }
    setBusy(true);
    setError('');
    localStorage.setItem('webhead:name', name.trim().slice(0, 24));
    const res = await submitSighting({
      lat: open.lat!,
      lng: open.lng!,
      name,
      message,
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? 'SOMETHING WENT WRONG.');
      return;
    }
    const { lat, lng } = open;
    reportOpen.value = null;
    setMessage('');
    onDone(lat!, lng!);
  };

  return (
    <div
      class="report-wrap"
      role="dialog"
      aria-label="Report a sighting"
      style={pickingOnMap.value ? 'display:none' : ''}
    >
      <div class="report-panel">
        <div class="report-title">REPORT A SIGHTING</div>

        <label class="report-label" for="rep-name">
          YOUR CODENAME
        </label>
        <input
          id="rep-name"
          class="report-input"
          maxLength={24}
          placeholder="WEB-WATCHER-77"
          value={name}
          onInput={(e) => setName((e.target as HTMLInputElement).value.toUpperCase())}
        />

        <label class="report-label" for="rep-msg">
          WHAT DID YOU SEE?
        </label>
        <textarea
          id="rep-msg"
          class="report-input report-msg"
          maxLength={140}
          rows={3}
          placeholder="HE SWUNG RIGHT PAST MY WINDOW..."
          value={message}
          onInput={(e) => setMessage((e.target as HTMLTextAreaElement).value)}
        />
        <div class="report-count">{140 - message.length}</div>

        <div class="report-row loc-row">
          <button class="loc-btn" onClick={useMyLocation} disabled={locBusy}>
            {locBusy ? 'LOCATING…' : 'MY LOCATION'}
          </button>
          <button
            class="loc-btn"
            onClick={() => {
              pickingOnMap.value = true;
              onPickOnMap();
            }}
          >
            PICK ON MAP
          </button>
        </div>
        <div class={`report-loc ${hasLoc ? 'set' : ''}`}>
          {hasLoc
            ? `TARGET LOCKED: ${open.lat!.toFixed(3)}, ${open.lng!.toFixed(3)}`
            : 'NO LOCATION SET'}
        </div>

        {error && <div class="report-error">{error}</div>}

        <div class="report-row">
          <button class="send-btn" onClick={submit} disabled={busy}>
            {busy ? 'TRANSMITTING…' : 'PUT IT ON THE MAP'}
          </button>
          <button class="cancel-btn" onClick={() => (reportOpen.value = null)}>
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
