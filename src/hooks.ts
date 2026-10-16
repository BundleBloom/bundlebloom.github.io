import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

function subscribeMedia(query: string) {
  return (cb: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener('change', cb);
    return () => mq.removeEventListener('change', cb);
  };
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(subscribeMedia(query), () => window.matchMedia(query).matches, () => false);
}

export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/** Adds `is-visible` once the element scrolls into view. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-visible');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add('is-visible');
            io.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/** Tracks whether any of the given element ids is on screen. */
export function useAnyInView(ids: string[], rootMargin = '0px'): boolean {
  const [inView, setInView] = useState(false);
  const key = ids.join(',');
  useEffect(() => {
    const els = key
      .split(',')
      .map((id) => document.getElementById(id))
      .filter((e): e is HTMLElement => e !== null);
    if (els.length === 0 || !('IntersectionObserver' in window)) return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }
        setInView(visible.size > 0);
      },
      { rootMargin },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [key, rootMargin]);
  return inView;
}
