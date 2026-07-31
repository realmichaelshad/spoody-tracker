import { useEffect, useRef } from 'preact/hooks';
import type { Map as MLMap } from 'maplibre-gl';
import { sightings, latestArrival } from '../state/sightings';

const SIZE = 120; // logical px, crisp-scaled by CSS
const RANGE_KM = 400; // radar radius at the map center

function kmBetween(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

interface Props {
  map: MLMap | null;
}

/** Circular spider-web radar: blips = sightings near the map center. */
export function Radar({ map }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!map) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    let pingAge = 1e9;
    const unsub = latestArrival.subscribe((s) => {
      if (s) pingAge = 0;
    });

    const draw = (dt: number) => {
      const c = map.getCenter();
      const t = performance.now() / 1000;
      const R = SIZE / 2;
      ctx.clearRect(0, 0, SIZE, SIZE);

      /* web rings */
      ctx.strokeStyle = 'rgba(168, 225, 254, 0.75)';
      ctx.lineWidth = 1;
      for (const r of [R * 0.33, R * 0.63, R * 0.92]) {
        ctx.beginPath();
        /* slightly wobbly rings = web, not sonar */
        for (let a = 0; a <= 32; a++) {
          const ang = (a / 32) * Math.PI * 2;
          const wob = r * (1 + 0.03 * Math.sin(a * 4 + r));
          const x = R + wob * Math.cos(ang);
          const y = R + wob * Math.sin(ang);
          a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }
      /* spokes */
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(R, R);
        ctx.lineTo(R + R * 0.92 * Math.cos(ang), R + R * 0.92 * Math.sin(ang));
        ctx.stroke();
      }

      /* sweep */
      const sweep = (t * 0.9) % (Math.PI * 2);
      const grad =
        typeof (ctx as any).createConicGradient === 'function'
          ? (ctx as any).createConicGradient(sweep, R, R)
          : null;
      if (grad) {
        grad.addColorStop(0, 'rgba(150, 224, 247, 0.35)');
        grad.addColorStop(0.12, 'rgba(150, 224, 247, 0)');
        grad.addColorStop(1, 'rgba(150, 224, 247, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(R, R);
        ctx.arc(R, R, R * 0.92, 0, Math.PI * 2);
        ctx.fill();
      }

      /* blips */
      for (const s of sightings.value.values()) {
        const d = kmBetween(c.lat, c.lng, s.lat, s.lng);
        if (d > RANGE_KM) continue;
        const ang = Math.atan2(s.lat - c.lat, s.lng - c.lng);
        const rr = (d / RANGE_KM) * R * 0.9;
        const x = R + rr * Math.cos(ang);
        const y = R - rr * Math.sin(ang);
        ctx.fillStyle = '#ec5147';
        ctx.fillRect(Math.round(x) - 1.5, Math.round(y) - 1.5, 3, 3);
      }

      /* arrival ping: expanding ring */
      pingAge += dt;
      if (pingAge < 1.2) {
        const pr = (pingAge / 1.2) * R;
        ctx.strokeStyle = `rgba(236, 81, 71, ${1 - pingAge / 1.2})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(R, R, pr, 0, Math.PI * 2);
        ctx.stroke();
      }

      /* center dot */
      ctx.fillStyle = '#e6f5f8';
      ctx.fillRect(R - 1.5, R - 1.5, 3, 3);
    };

    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      draw(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      unsub();
    };
  }, [map]);

  return (
    <div class="radar" aria-hidden="true">
      <canvas ref={canvasRef} width={SIZE} height={SIZE} />
    </div>
  );
}
