import { writable } from 'svelte/store';

/** @type {'left' | 'center' | 'right'} */
export const activeMobilePanel = writable('left');
