type RafThrottled<T extends unknown[]> = ((...args: T) => void) & { cancel: () => void };

export function rafThrottle<T extends unknown[]>(callback: (...args: T) => void): RafThrottled<T> {
  let rafId: number | null = null;
  let lastArgs: T | null = null;

  const throttled = ((...args: T) => {
    lastArgs = args;
    if (rafId !== null) return;

    rafId = window.requestAnimationFrame(() => {
      rafId = null;
      if (!lastArgs) return;
      callback(...lastArgs);
      lastArgs = null;
    });
  }) as RafThrottled<T>;

  throttled.cancel = () => {
    if (rafId !== null) window.cancelAnimationFrame(rafId);
    rafId = null;
    lastArgs = null;
  };

  return throttled;
}

