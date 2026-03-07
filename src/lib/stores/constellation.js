import { writable } from 'svelte/store';

/** Whether the 3D constellation scene has finished initializing */
export const constellationReady = writable(false);
