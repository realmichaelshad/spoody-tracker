/*
 * Contact form: inline validation, prefill from the kallah list or ?topic=,
 * and delivery through the configured form service — or, if none is set up
 * yet, the customer's own email app with the message already written.
 */
import { PREFILL_KEY } from './keys';

type Field = HTMLInputElement | HTMLTextAreaElement;

export function initContactForm() {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;

  const result = form.querySelector<HTMLElement>('[data-result]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const topic = form.querySelector<HTMLSelectElement>('#cf-topic')!;
  const message = form.querySelector<HTMLTextAreaElement>('#cf-message')!;
  const endpoint = form.dataset.endpoint;
  const email = form.dataset.email!;

  /* ---------- Prefill ---------- */
  const selectTopic = (key: string | null) => {
    const option = [...topic.options].find((o) => o.dataset.topic === key);
    if (option) topic.value = option.value;
  };
  selectTopic(new URLSearchParams(location.search).get('topic'));
  try {
    const raw = sessionStorage.getItem(PREFILL_KEY);
    if (raw) {
      const prefill = JSON.parse(raw) as { topic?: string; message?: string };
      selectTopic(prefill.topic ?? null);
      if (prefill.message && !message.value) message.value = prefill.message;
      sessionStorage.removeItem(PREFILL_KEY);
    }
  } catch {
    /* Nothing to prefill. */
  }

  /* ---------- Validation ---------- */
  const emailField = form.querySelector<HTMLInputElement>('#cf-email')!;
  const emailError = document.getElementById('cf-email-err')!;
  const wantsEmail = () => (form.querySelector<HTMLInputElement>('input[name="reply_by"]:checked')?.value ?? '') === 'Email';

  const checks: [Field, (value: string) => boolean][] = [
    [form.querySelector<HTMLInputElement>('#cf-name')!, (v) => v.trim().length > 1],
    [form.querySelector<HTMLInputElement>('#cf-phone')!, (v) => v.replace(/\D/g, '').length >= 10],
    [
      emailField,
      (v) => {
        const value = v.trim();
        emailError.textContent = value ? 'That email address doesn’t look right.' : 'Add your email so we can reply by email.';
        return value ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) : !wantsEmail();
      },
    ],
    [message, (v) => v.trim().length > 2],
  ];

  const showError = (field: Field, bad: boolean) => {
    field.setAttribute('aria-invalid', String(bad));
    const error = document.getElementById(field.getAttribute('aria-describedby') ?? '');
    if (error) error.hidden = !bad;
  };

  for (const [field, ok] of checks) {
    field.addEventListener('blur', () => {
      if (field.value) showError(field, !ok(field.value));
    });
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true' && ok(field.value)) showError(field, false);
    });
  }

  const showResult = (kind: 'ok' | 'error' | 'mail', html: string) => {
    result.dataset.kind = kind;
    result.innerHTML = html;
    result.hidden = false;
    result.focus();
  };

  /* ---------- Submit ---------- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let firstBad: Field | null = null;
    for (const [field, ok] of checks) {
      const bad = !ok(field.value);
      showError(field, bad);
      if (bad && !firstBad) firstBad = field;
    }
    if (firstBad) {
      firstBad.focus();
      return;
    }

    const data = new FormData(form);
    if (data.get('_gotcha') || data.get('botcheck')) return;

    if (!endpoint) {
      // No form service yet: hand the message to the customer's email app.
      const details = [
        `Name: ${data.get('name')}`,
        `Phone: ${data.get('phone')}`,
        data.get('email') ? `Email: ${data.get('email')}` : '',
        `Reply by: ${data.get('reply_by')}`,
        `Topic: ${data.get('topic')}`,
        `Store: ${data.get('store')}`,
        data.get('model') ? `Model: ${data.get('model')}` : '',
      ].filter(Boolean);
      const body = `${details.join('\n')}\n\n${data.get('message')}`;
      const subject = `${data.get('topic')} — ${data.get('name')}`;
      location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      showResult(
        'mail',
        `Your email app should open with the message ready to send. Didn’t open? Email <a href="mailto:${email}">${email}</a> or call us.`,
      );
      return;
    }

    submit.setAttribute('aria-busy', 'true');
    submit.querySelector('span')!.textContent = 'Sending…';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      showResult('ok', 'Thanks — we got it! We’ll get back to you during store hours, Sunday to Friday.');
    } catch {
      showResult(
        'error',
        `Sorry, that didn’t go through. Please try again, email <a href="mailto:${email}">${email}</a>, or call either store.`,
      );
    } finally {
      submit.removeAttribute('aria-busy');
      submit.querySelector('span')!.textContent = 'Send message';
    }
  });
}
