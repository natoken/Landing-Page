import { writable, derived } from 'svelte/store';
import { products } from '$lib/data/products.js';

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

/** @type {import('svelte/store').Writable<string | null>} */
export const hoveredProduct = writable(null);

/**
 * Compute full ancestor path from a product slug up to the root product.
 * @param {string} slug
 * @returns {string[]}
 */
function getAncestorPath(slug) {
	const path = [slug];
	let current = products.find((p) => p.slug === slug);
	while (current?.parent) {
		path.push(current.parent);
		current = products.find((p) => p.slug === current.parent);
	}
	return path;
}

/** Set of product slugs in the hovered node's ancestor chain */
export const hoveredPath = derived(hoveredProduct, ($hp) => {
	if (!$hp) return new Set();
	return new Set(getAncestorPath($hp));
});

/** The parentCorner of the root product in the hovered chain */
export const hoveredCorner = derived(hoveredProduct, ($hp) => {
	if (!$hp) return null;
	const path = getAncestorPath($hp);
	const root = products.find((p) => p.slug === path[path.length - 1]);
	return root?.parentCorner || null;
});
