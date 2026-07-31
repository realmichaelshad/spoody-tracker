import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { config, isDemoMode } from '../config';
import '../styles/tokens.css';
import '../styles/admin.css';

interface Row {
  id: string;
  name: string;
  message: string;
  lat: number;
  lng: number;
  place_label: string | null;
  photo_path: string | null;
  photo_state: string;
  status: string;
  report_count: number;
  created_at: string;
}

interface Queue {
  flagged: Row[];
  hidden: Row[];
  unscreened: Row[];
}

const fnUrl = (op: string) => `${config.supabaseUrl}/functions/v1/admin?op=${op}`;

function photoUrl(row: Row): string | null {
  return row.photo_path
    ? `${config.supabaseUrl}/storage/v1/object/public/photos/${row.photo_path}`
    : null;
}

function AdminApp() {
  const [token, setToken] = useState(sessionStorage.getItem('webhead:admin') ?? '');
  const [entered, setEntered] = useState(!!token);
  const [queue, setQueue] = useState<Queue | null>(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async (tok: string) => {
    setBusy(true);
    setErr('');
    try {
      const res = await fetch(fnUrl('queue'), {
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (res.status === 401) {
        setErr('BAD TOKEN.');
        setEntered(false);
        setBusy(false);
        return;
      }
      setQueue(await res.json());
      sessionStorage.setItem('webhead:admin', tok);
    } catch {
      setErr('CONTROL LINK FAILED.');
    }
    setBusy(false);
  };

  const act = async (id: string, action: string) => {
    setBusy(true);
    await fetch(fnUrl('action'), {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    }).catch(() => undefined);
    await load(token);
  };

  useEffect(() => {
    if (entered && token) void load(token);
  }, []);

  if (isDemoMode) {
    return (
      <div class="admin-center">
        <div class="admin-note">
          DEMO MODE — NO BACKEND CONFIGURED.
          <br />
          SET VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY TO ENABLE TRACKER CONTROL.
        </div>
      </div>
    );
  }

  if (!entered) {
    return (
      <div class="admin-center">
        <div class="admin-login">
          <div class="admin-title">TRACKER CONTROL</div>
          <input
            type="password"
            class="admin-input"
            placeholder="ADMIN TOKEN"
            value={token}
            onInput={(e) => setToken((e.target as HTMLInputElement).value)}
            onKeyDown={(e) => e.key === 'Enter' && (setEntered(true), void load(token))}
          />
          <button
            class="admin-btn"
            onClick={() => {
              setEntered(true);
              void load(token);
            }}
          >
            AUTHENTICATE
          </button>
          {err && <div class="admin-err">{err}</div>}
        </div>
      </div>
    );
  }

  const section = (title: string, rows: Row[], actions: Array<[string, string]>) => (
    <section class="admin-section">
      <h2>
        {title} <span class="count">{rows.length}</span>
      </h2>
      {rows.length === 0 && <div class="admin-empty">CLEAR.</div>}
      {rows.map((r) => (
        <div key={r.id} class="admin-row">
          {photoUrl(r) && <img src={photoUrl(r)!} alt="" loading="lazy" />}
          <div class="admin-row-body">
            <div class="admin-msg">{r.message}</div>
            <div class="admin-meta">
              {r.name} · {r.place_label ?? `${r.lat.toFixed(2)}, ${r.lng.toFixed(2)}`} ·{' '}
              {new Date(r.created_at).toLocaleString()} · flags: {r.report_count} · {r.status} ·
              photo: {r.photo_state}
            </div>
          </div>
          <div class="admin-actions">
            {actions.map(([label, action]) => (
              <button key={action} disabled={busy} onClick={() => act(r.id, action)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </section>
  );

  return (
    <div class="admin-page">
      <header class="admin-head">
        <span class="admin-title">TRACKER CONTROL</span>
        <button class="admin-btn" disabled={busy} onClick={() => load(token)}>
          {busy ? 'WORKING…' : 'REFRESH'}
        </button>
      </header>
      {err && <div class="admin-err">{err}</div>}
      {queue && (
        <>
          {section('FLAGGED', queue.flagged, [
            ['RESTORE', 'restore'],
            ['HIDE', 'hide'],
            ['DELETE', 'delete'],
          ])}
          {section('HIDDEN', queue.hidden, [
            ['RESTORE', 'restore'],
            ['DELETE', 'delete'],
          ])}
          {section('UNSCREENED PHOTOS', queue.unscreened, [
            ['APPROVE PHOTO', 'approve_photo'],
            ['REMOVE PHOTO', 'remove_photo'],
          ])}
        </>
      )}
    </div>
  );
}

render(<AdminApp />, document.getElementById('admin')!);
