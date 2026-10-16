import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
}

const GOLD = '233, 188, 99';
const LINK_DIST = 150;
const CURSOR_RADIUS = 240;

/**
 * Golden particle network. Particles drift slowly; near the pointer they connect
 * to one another with fine gold lines. Purely decorative (aria-hidden, no pointer events).
 * - Reduced motion: draws one static frame.
 * - Coarse pointers (touch): fewer particles, no links.
 * - Pauses when off-screen or when the tab is hidden.
 */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !host || !ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const lowPower = (navigator.hardwareConcurrency ?? 8) <= 2;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let running = false;
    let onScreen = true;
    const pointer = { x: -9999, y: -9999, active: false };

    const seed = () => {
      const density = coarse || lowPower ? 24000 : 8000;
      const count = Math.min(coarse ? 40 : 170, Math.round((width * height) / density));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: 0.7 + Math.random() * 1.5,
        a: 0.35 + Math.random() * 0.5,
      }));
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (!running) draw(false);
    };

    const draw = (move: boolean) => {
      ctx.clearRect(0, 0, width, height);
      const near: Particle[] = [];

      for (const p of particles) {
        if (move) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -10) p.x = width + 10;
          else if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          else if (p.y > height + 10) p.y = -10;

          // Gentle attraction towards the pointer.
          if (pointer.active) {
            const dx = pointer.x - p.x;
            const dy = pointer.y - p.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < CURSOR_RADIUS * CURSOR_RADIUS && d2 > 400) {
              p.x += dx * 0.0025;
              p.y += dy * 0.0025;
            }
          }
        }

        let glow = 0;
        if (pointer.active) {
          const d = Math.hypot(pointer.x - p.x, pointer.y - p.y);
          if (d < CURSOR_RADIUS) {
            glow = 1 - d / CURSOR_RADIUS;
            near.push(p);
          }
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + glow * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GOLD}, ${Math.min(1, p.a + glow * 0.5)})`;
        ctx.fill();
      }

      if (!coarse && near.length > 1) {
        ctx.lineWidth = 0.8;
        for (let i = 0; i < near.length; i++) {
          const a = near[i]!;
          for (let j = i + 1; j < near.length; j++) {
            const b = near[j]!;
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < LINK_DIST) {
              const fade = 1 - Math.hypot(pointer.x - (a.x + b.x) / 2, pointer.y - (a.y + b.y) / 2) / CURSOR_RADIUS;
              const alpha = (1 - d / LINK_DIST) * Math.max(0, fade) * 0.85;
              if (alpha > 0.01) {
                ctx.strokeStyle = `rgba(${GOLD}, ${alpha})`;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
              }
            }
          }
          // A faint thread from the pointer to the closest particles.
          const dp = Math.hypot(pointer.x - a.x, pointer.y - a.y);
          if (dp < LINK_DIST * 0.9) {
            ctx.strokeStyle = `rgba(${GOLD}, ${(1 - dp / (LINK_DIST * 0.9)) * 0.45})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }
    };

    const loop = () => {
      draw(true);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced || !onScreen || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      const rect = host.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = pointer.y >= 0 && pointer.y <= rect.height;
      if (reduced) draw(false);
    };
    const onPointerLeave = () => {
      pointer.active = false;
      if (reduced) draw(false);
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry?.isIntersecting ?? true;
      if (onScreen) start();
      else stop();
    });
    io.observe(host);

    if (!coarse) {
      host.addEventListener('pointermove', onPointerMove, { passive: true });
      host.addEventListener('pointerleave', onPointerLeave);
    }
    document.addEventListener('visibilitychange', onVisibility);
    resize();
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="particles" aria-hidden="true" />;
}
