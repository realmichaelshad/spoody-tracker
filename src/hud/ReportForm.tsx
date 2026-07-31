import { signal } from '@preact/signals';
import { useEffect, useRef, useState } from 'preact/hooks';
import { submitSighting } from '../lib/api';
import { compressImage } from '../lib/imageCompress';
import { config } from '../config';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      getResponse: (id?: string) => string | undefined;
    };
  }
}

/** null = closed; otherwise the report panel is open with optional preset coords. */
export const reportOpen = signal<{ lat?: number; lng?: number } | null>(null);

const CODE_A = ['WEB', 'ROOF', 'ALLEY', 'PIXEL', 'NIGHT', 'SKY', 'TRAIN', 'BODEGA', 'CAM', 'WALL'];
const CODE_B = ['WATCHER', 'SPOTTER', 'RUNNER', 'KID', 'EYES', 'TRACKER', 'HAWK', 'CRAWLER'];

function rollCodename(): string {
  const a = CODE_A[Math.floor(Math.random() * CODE_A.length)];
  const b = CODE_B[Math.floor(Math.random() * CODE_B.length)];
  return `${a}-${b}-${Math.floor(Math.random() * 98) + 1}`;
}
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
  const [photo, setPhoto] = useState<Blob | null>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoBusy, setPhotoBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileId = useRef<string>();

  /* Optional anti-bot widget — only when a site key is configured. */
  useEffect(() => {
    if (!config.turnstileSiteKey || !turnstileRef.current || turnstileId.current) return;
    const renderWidget = () => {
      if (window.turnstile && turnstileRef.current && !turnstileId.current) {
        turnstileId.current = window.turnstile.render(turnstileRef.current, {
          sitekey: config.turnstileSiteKey,
          theme: 'dark',
        });
      }
    };
    if (window.turnstile) {
      renderWidget();
    } else if (!document.querySelector('script[data-turnstile]')) {
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      s.async = true;
      s.dataset.turnstile = '1';
      s.onload = renderWidget;
      document.head.appendChild(s);
    }
  });

  const attachPhoto = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setPhotoBusy(true);
    try {
      const compressed = await compressImage(file);
      const { screenImage } = await import('../lib/nsfw');
      const screen = await screenImage(compressed);
      if (!screen.ok) {
        setPhotoBusy(false);
        setError(
          screen.reason === 'unsafe'
            ? 'IMAGE REJECTED BY THE SCANNER.'
            : 'SCANNER OFFLINE — POST WITHOUT A PHOTO.',
        );
        return;
      }
      if (photoUrl) URL.revokeObjectURL(photoUrl);
      setPhoto(compressed);
      setPhotoUrl(URL.createObjectURL(compressed));
    } catch {
      setError('COULD NOT READ THAT IMAGE.');
    }
    setPhotoBusy(false);
  };

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
      photo,
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
        <div class="name-row">
          <input
            id="rep-name"
            class="report-input"
            maxLength={24}
            placeholder="WEB-WATCHER-77"
            value={name}
            onInput={(e) => setName((e.target as HTMLInputElement).value.toUpperCase())}
          />
          <button
            class="px-btn dice-btn"
            title="Roll a codename"
            aria-label="Roll a random codename"
            onClick={() => setName(rollCodename())}
          >
            ?
          </button>
        </div>

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

        <div class="report-row photo-row">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => attachPhoto((e.target as HTMLInputElement).files?.[0])}
          />
          <button
            class="px-btn loc-btn photo-btn"
            onClick={() => fileRef.current?.click()}
            disabled={photoBusy}
          >
            {photoBusy ? 'SCANNING…' : photo ? 'CHANGE PHOTO' : 'ADD PHOTO'}
          </button>
          {photo && (
            <button
              class="px-btn loc-btn photo-clear"
              onClick={() => {
                if (photoUrl) URL.revokeObjectURL(photoUrl);
                setPhoto(null);
                setPhotoUrl('');
              }}
            >
              REMOVE
            </button>
          )}
        </div>
        {photoUrl && (
          <div class="photo-preview">
            <img src={photoUrl} alt="attached photo preview" />
            <span class="photo-ok">SCANNED ✓</span>
          </div>
        )}

        <div class="report-row loc-row">
          <button class="px-btn loc-btn" onClick={useMyLocation} disabled={locBusy}>
            {locBusy ? 'LOCATING…' : 'MY LOCATION'}
          </button>
          <button
            class="px-btn loc-btn"
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

        {config.turnstileSiteKey && <div ref={turnstileRef} class="turnstile-slot" />}

        {error && <div class="report-error">{error}</div>}

        <div class="report-row">
          <button class="send-btn" onClick={submit} disabled={busy}>
            {busy ? 'TRANSMITTING…' : 'PUT IT ON THE MAP'}
          </button>
          <button class="px-btn cancel-btn" onClick={() => (reportOpen.value = null)}>
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
