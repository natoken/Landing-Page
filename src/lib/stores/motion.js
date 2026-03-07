import { readable } from 'svelte/store';

/** @type {import('svelte/store').Readable<boolean>} */
export const reducedMotion = readable(false, (set) => {
	if (typeof window === 'undefined') return;

	const query = window.matchMedia('(prefers-reduced-motion: reduce)');
	set(query.matches);

	const handler = (/** @type {MediaQueryListEvent} */ e) => set(e.matches);
	query.addEventListener('change', handler);

	return () => query.removeEventListener('change', handler);
});
