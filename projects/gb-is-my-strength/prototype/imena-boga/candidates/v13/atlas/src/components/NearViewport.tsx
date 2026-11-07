import { useEffect, useRef, useState, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  ariaLabel: string;
  minimumHeight?: number;
}

// Delays code/data for interactive lower-page modules until they are near view.
// Once mounted, content remains mounted: no focus/progress or state loss.
export function NearViewport({ children, ariaLabel, minimumHeight = 220 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      setReady(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: '1600px 0px' }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ready]);

  return (
    <div ref={ref}>
      {ready ? children : (
        <div
          className="no-print"
          aria-label={ariaLabel}
          aria-busy="true"
          style={{ minHeight: minimumHeight }}
        />
      )}
    </div>
  );
}
