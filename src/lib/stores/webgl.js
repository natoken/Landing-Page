import { readable } from 'svelte/store';

/** @type {import('svelte/store').Readable<boolean>} */
export const webglAvailable = readable(false, (set) => {
	if (typeof window === 'undefined') return;

	try {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('webgl2') || canvas.getContext('webgl');
		set(!!ctx);
	} catch {
		set(false);
	}
});
