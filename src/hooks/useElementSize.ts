import { useEffect, useRef, useState } from 'react';

/**
 * Observe an element's content-box size in CSS pixels.
 * Returns a ref to attach to the element and its current rounded size.
 */
export function useElementSize<T extends HTMLElement>(): [
  React.RefObject<T>,
  { width: number; height: number },
] {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Guard for SSR / environments without ResizeObserver.
    if (typeof ResizeObserver === 'undefined') {
      const rect = el.getBoundingClientRect();
      setSize({ width: Math.round(rect.width), height: Math.round(rect.height) });
      return;
    }

    const measure = (width: number, height: number) => {
      setSize((prev) => {
        const next = { width: Math.round(width), height: Math.round(height) };
        return prev.width === next.width && prev.height === next.height
          ? prev
          : next;
      });
    };

    // Measure once on mount.
    const rect = el.getBoundingClientRect();
    measure(rect.width, rect.height);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const box = entry.contentRect;
        measure(box.width, box.height);
      }
    });

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return [ref, size];
}
