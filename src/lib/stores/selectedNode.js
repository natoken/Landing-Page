import { writable } from 'svelte/store';

/**
 * @typedef {{
 *   type: 'core' | 'corner' | 'team' | 'product';
 *   id: string;
 *   data: any;
 * } | null} SelectedNode
 */

/** @type {import('svelte/store').Writable<SelectedNode>} */
export const selectedNode = writable(null);

/**
 * Select a node, or deselect if already selected.
 * @param {'core' | 'corner' | 'team' | 'product'} type
 * @param {string} id
 * @param {any} data
 */
export function toggleNode(type, id, data) {
	selectedNode.update((current) => {
		if (current && current.type === type && current.id === id) {
			return null;
		}
		return { type, id, data };
	});
}

export function clearSelection() {
	selectedNode.set(null);
}
