/**
 * Svelte action: reveal element when it enters the viewport (scroll container).
 * Respects prefers-reduced-motion (fade only, no fly).
 * @param {HTMLElement} node
 * @param {{ root?: Element; threshold?: number; useFly?: boolean }} [options]
 */
export function scrollReveal(node, options = {}) {
  const root = options.root ?? node.closest?.('.window') ?? null;
  const threshold = options.threshold ?? 0.12;
  const useFly = options.useFly ?? true;

  const reducedMotion = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          node.classList.add('scroll-revealed');
          if (reducedMotion) {
            node.classList.add('scroll-reveal-reduced');
          } else if (useFly) {
            node.classList.add('scroll-reveal-fly');
          }
        }
      }
    },
    { root, rootMargin: '0px', threshold }
  );

  node.classList.add('scroll-reveal');
  if (reducedMotion) {
    node.classList.add('scroll-reveal-reduced');
  } else if (useFly) {
    node.classList.add('scroll-reveal-fly');
  }
  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    }
  };
}
