/*
 * Gentle fade-up for sections as they scroll in. Content is visible by
 * default; only once this runs are below-the-fold blocks hidden, and anything
 * already on screen is marked visible first so nothing flickers.
 */
const items = [...document.querySelectorAll<HTMLElement>('.reveal')];
const motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

if (items.length && motionOk && 'IntersectionObserver' in window) {
  const viewport = window.innerHeight;
  for (const el of items) {
    if (el.getBoundingClientRect().top < viewport * 0.92) el.classList.add('is-in');
  }
  document.documentElement.classList.add('js');

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  for (const el of items) if (!el.classList.contains('is-in')) io.observe(el);
}
