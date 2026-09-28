/*
 * Kallah list builder: saves on the device, shares as a link, prints, and
 * hands the list to the contact form.
 */
import { kallahList } from '../data/kallahList';
import { PREFILL_KEY } from './keys';

interface Extra {
  label: string;
  have: boolean;
}

interface ListState {
  have: string[];
  extras: Extra[];
}

const STORAGE_KEY = 'plugins:kallah:v1';
const MAX_EXTRAS = 30;

const knownIds = new Set(kallahList.flatMap((g) => g.items.map((i) => i.id)));

const read = (): ListState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? sanitize(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
};

const write = (state: ListState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* Private mode or storage full: the list still works for this visit. */
  }
};

function sanitize(input: unknown): ListState {
  const obj = (input ?? {}) as Partial<ListState>;
  const have = Array.isArray(obj.have) ? obj.have.filter((id) => typeof id === 'string' && knownIds.has(id)) : [];
  const extras = Array.isArray(obj.extras)
    ? obj.extras
        .filter((x): x is Extra => !!x && typeof x.label === 'string' && x.label.trim().length > 0)
        .slice(0, MAX_EXTRAS)
        .map((x) => ({ label: x.label.trim().slice(0, 60), have: !!x.have }))
    : [];
  return { have, extras };
}

/* Shared links carry the list as base64url JSON: ?list=… */
const encode = (state: ListState) => {
  const json = JSON.stringify({ h: state.have, x: state.extras.map((e) => [e.label, e.have ? 1 : 0]) });
  const bytes = new TextEncoder().encode(json);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const decode = (param: string): ListState | null => {
  try {
    const bin = atob(param.replace(/-/g, '+').replace(/_/g, '/'));
    const json = new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
    const data = JSON.parse(json) as { h?: unknown; x?: unknown };
    const extras = Array.isArray(data.x)
      ? data.x.map((pair) => (Array.isArray(pair) ? { label: String(pair[0] ?? ''), have: pair[1] === 1 } : null))
      : [];
    return sanitize({ have: data.h, extras });
  } catch {
    return null;
  }
};

export function initKallahList() {
  const root = document.querySelector<HTMLElement>('[data-kallah]');
  if (!root) return;

  const boxes = [...root.querySelectorAll<HTMLInputElement>('input[data-item]')];
  const extrasList = root.querySelector<HTMLUListElement>('[data-extras]')!;
  const extraTemplate = document.getElementById('klist-extra') as HTMLTemplateElement;
  const addForm = root.querySelector<HTMLFormElement>('[data-add]')!;
  const toast = root.querySelector<HTMLElement>('[data-toast]')!;
  const sharedNote = root.querySelector<HTMLElement>('[data-shared]')!;

  const url = new URL(location.href);
  const sharedParam = url.searchParams.get('list');
  const shared = sharedParam ? decode(sharedParam) : null;
  let viewingShared = !!shared;
  let state: ListState = shared ?? read() ?? { have: [], extras: [] };

  let toastTimer: number | undefined;
  const say = (message: string) => {
    toast.textContent = message;
    toast.setAttribute('data-show', '');
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.removeAttribute('data-show'), 2600);
  };

  const persist = () => {
    if (!viewingShared) write(state);
  };

  const renderExtras = () => {
    extrasList.replaceChildren(
      ...state.extras.map((extra, index) => {
        const li = extraTemplate.content.firstElementChild!.cloneNode(true) as HTMLLIElement;
        const input = li.querySelector('input')!;
        input.checked = extra.have;
        input.dataset.extra = String(index);
        li.querySelector('label span')!.textContent = extra.label;
        const remove = li.querySelector<HTMLButtonElement>('.klist__remove')!;
        remove.setAttribute('aria-label', `Remove ${extra.label}`);
        remove.addEventListener('click', () => {
          state.extras.splice(index, 1);
          persist();
          renderExtras();
          update();
        });
        input.addEventListener('change', () => {
          state.extras[index].have = input.checked;
          persist();
          update();
        });
        return li;
      }),
    );
  };

  const update = () => {
    const have = new Set(state.have);
    boxes.forEach((box) => (box.checked = have.has(box.dataset.item!)));

    const total = boxes.length + state.extras.length;
    const done = state.have.length + state.extras.filter((e) => e.have).length;
    root.querySelector('[data-done]')!.textContent = String(done);
    root.querySelector('[data-total]')!.textContent = String(total);
    root.querySelector<HTMLElement>('[data-bar]')!.style.width = total ? `${(done / total) * 100}%` : '0%';

    root.querySelectorAll<HTMLElement>('[data-group]').forEach((group) => {
      const inputs = [...group.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')];
      const checked = inputs.filter((i) => i.checked).length;
      group.querySelector('[data-group-count]')!.textContent = `${checked}/${inputs.length}`;
      group.toggleAttribute('data-complete', inputs.length > 0 && checked === inputs.length);
      if (group.dataset.group === 'extras') group.toggleAttribute('data-has-items', inputs.length > 0);
    });
  };

  boxes.forEach((box) =>
    box.addEventListener('change', () => {
      const id = box.dataset.item!;
      state.have = box.checked ? [...new Set([...state.have, id])] : state.have.filter((x) => x !== id);
      persist();
      update();
    }),
  );

  addForm.hidden = false;
  addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const field = addForm.elements.namedItem('item') as HTMLInputElement;
    const label = field.value.trim().slice(0, 60);
    if (!label) return;
    if (state.extras.length >= MAX_EXTRAS) {
      say('That’s a long list! Remove something to add more.');
      return;
    }
    state.extras.push({ label, have: false });
    field.value = '';
    persist();
    renderExtras();
    update();
    say(`Added “${label}”`);
  });

  /* ---------- Actions ---------- */
  const listText = () => {
    const have = new Set(state.have);
    const need: string[] = [];
    const got: string[] = [];
    for (const group of kallahList) {
      const missing = group.items.filter((i) => !have.has(i.id)).map((i) => i.label);
      const owned = group.items.filter((i) => have.has(i.id)).map((i) => i.label);
      if (missing.length) need.push(`• ${group.title}: ${missing.join(', ')}`);
      if (owned.length) got.push(`• ${group.title}: ${owned.join(', ')}`);
    }
    const extraNeed = state.extras.filter((e) => !e.have).map((e) => e.label);
    const extraGot = state.extras.filter((e) => e.have).map((e) => e.label);
    if (extraNeed.length) need.push(`• Extras: ${extraNeed.join(', ')}`);
    if (extraGot.length) got.push(`• Extras: ${extraGot.join(', ')}`);
    return [
      'Our kallah list (from pluginson13.com)',
      '',
      'Still looking for:',
      ...(need.length ? need : ['• Nothing — we’re all set!']),
      ...(got.length ? ['', 'Already have:', ...got] : []),
    ].join('\n');
  };

  const actions: Record<string, () => void> = {
    send() {
      try {
        sessionStorage.setItem(PREFILL_KEY, JSON.stringify({ topic: 'kallah', message: listText() }));
      } catch {
        /* The contact page still opens; they can paste the list. */
      }
      location.href = '/contact/?topic=kallah#contact-form';
    },
    async share() {
      const link = new URL('/kallah/', location.origin);
      link.searchParams.set('list', encode(state));
      link.hash = 'kallah-list';
      const data = { title: 'Our kallah list', text: 'Here’s our kallah list from Plug-ins:', url: link.href };
      try {
        if (navigator.share) {
          await navigator.share(data);
          return;
        }
        await navigator.clipboard.writeText(link.href);
        say('Link copied — paste it in a message to family.');
      } catch (err) {
        if ((err as DOMException)?.name === 'AbortError') return;
        window.prompt('Copy this link to share your list:', link.href);
      }
    },
    print() {
      window.print();
    },
    reset() {
      if (!window.confirm('Start a fresh list? This clears every checkmark and extra on this device.')) return;
      state = { have: [], extras: [] };
      persist();
      renderExtras();
      update();
      say('Fresh list — mazel tov!');
    },
    adopt() {
      viewingShared = false;
      write(state);
      sharedNote.hidden = true;
      url.searchParams.delete('list');
      history.replaceState(null, '', url.pathname + url.search + url.hash);
      say('Saved as your list on this device.');
    },
  };

  root.querySelectorAll<HTMLButtonElement>('[data-action]').forEach((btn) =>
    btn.addEventListener('click', () => actions[btn.dataset.action!]?.()),
  );
  root.querySelector<HTMLElement>('[data-actions]')!.hidden = false;
  sharedNote.hidden = !viewingShared;

  renderExtras();
  update();
}
