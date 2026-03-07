import { products, getProduct } from './products.js';
import { team } from './team.js';

// --- Constants ---

const CORNER_RADIUS = 4;
const PRODUCT_RADIUS_MULT = 1.35;
const CHILD_OFFSET = 0.8;
const TEAM_OFFSET = 0.5;

// --- Helpers ---

function anglePos(angleDeg, radius, z = 0) {
	const rad = (angleDeg * Math.PI) / 180;
	return [radius * Math.cos(rad), radius * Math.sin(rad), z];
}

// --- Core Node ---

/** @type {{ position: [number, number, number]; label: string }} */
export const core = {
	position: [0, 0, 0],
	label: 'Natoken'
};

// --- 6 Corners ---

/**
 * @typedef {{ id: string; label: string; angle: number; position: [number, number, number]; filled: boolean }} Corner
 */

/** @type {Corner[]} */
export const corners = [
	{ id: 'ceo', label: 'CEO', angle: 90, position: anglePos(90, CORNER_RADIUS), filled: true },
	{ id: 'cto', label: 'CTO', angle: 30, position: anglePos(30, CORNER_RADIUS), filled: true },
	{ id: 'open-1', label: '', angle: 330, position: anglePos(330, CORNER_RADIUS), filled: false },
	{ id: 'open-2', label: '', angle: 270, position: anglePos(270, CORNER_RADIUS), filled: false },
	{ id: 'open-3', label: '', angle: 210, position: anglePos(210, CORNER_RADIUS), filled: false },
	{ id: 'open-4', label: '', angle: 150, position: anglePos(150, CORNER_RADIUS), filled: false }
];

function getCorner(id) {
	return corners.find((c) => c.id === id);
}

// --- Weight Calculation ---

/**
 * Compute product weight: 1 + sum of children's weights (recursive).
 * @param {string} slug
 * @returns {number}
 */
function computeWeight(slug) {
	const p = getProduct(slug);
	if (!p) return 1;
	return 1 + p.children.reduce((sum, child) => sum + computeWeight(child), 0);
}

// --- Product Positions ---

/**
 * @typedef {{ slug: string; position: [number, number, number]; weight: number }} ProductNode
 */

/** @type {Map<string, ProductNode>} */
const productNodeMap = new Map();

// Position root products near their parent corners
for (const p of products) {
	if (p.parent) continue; // children positioned later
	if (p.bridges && p.bridges.length > 0) continue; // bridges positioned later

	const corner = p.parentCorner ? getCorner(p.parentCorner) : null;
	let position;

	if (corner) {
		// Radiate outward from corner, slight angle offset
		const angleOffset = p.slug === 'runeforge' ? -5 : 5;
		position = anglePos(corner.angle + angleOffset, CORNER_RADIUS * PRODUCT_RADIUS_MULT, -0.5);
	} else if (p.type === 'tool') {
		// Tools float near center-bottom
		position = [0, -CORNER_RADIUS * 0.6, -0.3];
	} else {
		position = [0, 0, -1];
	}

	productNodeMap.set(p.slug, { slug: p.slug, position, weight: computeWeight(p.slug) });
}

// Position bridge products (Arisce) — midpoint of bridged products
for (const p of products) {
	if (!p.bridges || p.bridges.length === 0) continue;
	const bridged = p.bridges.map((s) => productNodeMap.get(s)).filter(Boolean);
	if (bridged.length >= 2) {
		const mid = [
			(bridged[0].position[0] + bridged[1].position[0]) / 2,
			(bridged[0].position[1] + bridged[1].position[1]) / 2 + 0.4,
			(bridged[0].position[2] + bridged[1].position[2]) / 2 - 0.3
		];
		productNodeMap.set(p.slug, { slug: p.slug, position: mid, weight: computeWeight(p.slug) });
	}
}

// Position child products near their parent
for (const p of products) {
	if (!p.parent) continue;
	const parentNode = productNodeMap.get(p.parent);
	if (!parentNode) continue;

	const parentProduct = getProduct(p.parent);
	const childIndex = parentProduct ? parentProduct.children.indexOf(p.slug) : 0;
	const angle = (childIndex * 60) + 30; // spread children around parent
	const offset = anglePos(angle, CHILD_OFFSET, -0.2);
	const position = [
		parentNode.position[0] + offset[0],
		parentNode.position[1] + offset[1],
		parentNode.position[2] + offset[2]
	];
	productNodeMap.set(p.slug, { slug: p.slug, position, weight: computeWeight(p.slug) });
}

/** @type {ProductNode[]} */
export const productNodes = Array.from(productNodeMap.values());

/**
 * Get a product node by slug.
 * @param {string} slug
 * @returns {ProductNode | undefined}
 */
export function getProductNode(slug) {
	return productNodeMap.get(slug);
}

// --- Team Positions ---

/**
 * @typedef {{ slug: string; position: [number, number, number] }} TeamNode
 */

/** @type {TeamNode[]} */
export const teamNodes = team.map((member) => {
	let position;

	if (member.domain === 'product' && member.product) {
		// Positioned near their product node
		const prodNode = productNodeMap.get(member.product);
		if (prodNode) {
			position = [
				prodNode.position[0] + TEAM_OFFSET * 0.6,
				prodNode.position[1] - TEAM_OFFSET * 0.4,
				prodNode.position[2] + 0.1
			];
		}
	}

	if (!position) {
		// Positioned near their corner
		const cornerId = member.nearCorner || member.domain;
		const corner = getCorner(cornerId);
		if (corner) {
			// Offset slightly inward from the corner toward center
			const inwardFactor = 0.7;
			position = [
				corner.position[0] * inwardFactor + (0),
				corner.position[1] * inwardFactor + (0),
				0.1
			];
		}
	}

	if (!position) {
		position = [0, 0, 0];
	}

	return { slug: member.slug, position };
});

/**
 * Get a team node by slug.
 * @param {string} slug
 * @returns {TeamNode | undefined}
 */
export function getTeamNode(slug) {
	return teamNodes.find((n) => n.slug === slug);
}

// --- Edges ---

/**
 * @typedef {{ from: [number, number, number]; to: [number, number, number]; type: 'hierarchy' | 'product' | 'team' | 'bridge'; opacity: number }} Edge
 */

/** @type {Edge[]} */
export const edges = [];

// Corner → Core
for (const c of corners) {
	edges.push({ from: c.position, to: core.position, type: 'hierarchy', opacity: 0.04 });
}

// Corner → Corner (hexagon outline)
for (let i = 0; i < corners.length; i++) {
	const next = corners[(i + 1) % corners.length];
	const eitherFilled = corners[i].filled || next.filled;
	edges.push({
		from: corners[i].position,
		to: next.position,
		type: 'hierarchy',
		opacity: eitherFilled ? 0.15 : 0.04
	});
}

// Product → Parent Corner
for (const p of products) {
	if (!p.parentCorner) continue;
	const corner = getCorner(p.parentCorner);
	const pNode = productNodeMap.get(p.slug);
	if (corner && pNode) {
		edges.push({ from: pNode.position, to: corner.position, type: 'product', opacity: 0.12 });
	}
}

// Product → Parent Product (children)
for (const p of products) {
	if (!p.parent) continue;
	const parentNode = productNodeMap.get(p.parent);
	const childNode = productNodeMap.get(p.slug);
	if (parentNode && childNode) {
		edges.push({ from: childNode.position, to: parentNode.position, type: 'product', opacity: 0.15 });
	}
}

// Bridge connections (Arisce)
for (const p of products) {
	if (!p.bridges) continue;
	const pNode = productNodeMap.get(p.slug);
	if (!pNode) continue;
	for (const bridgeSlug of p.bridges) {
		const bridgeNode = productNodeMap.get(bridgeSlug);
		if (bridgeNode) {
			edges.push({ from: pNode.position, to: bridgeNode.position, type: 'bridge', opacity: 0.08 });
		}
	}
}

// Team → Domain
for (const tn of teamNodes) {
	const member = team.find((m) => m.slug === tn.slug);
	if (!member) continue;

	if (member.domain === 'product' && member.product) {
		const prodNode = productNodeMap.get(member.product);
		if (prodNode) {
			edges.push({ from: tn.position, to: prodNode.position, type: 'team', opacity: 0.06 });
		}
	} else {
		const cornerId = member.nearCorner || member.domain;
		const corner = getCorner(cornerId);
		if (corner) {
			edges.push({ from: tn.position, to: corner.position, type: 'team', opacity: 0.06 });
		}
	}
}

// --- Star Field Config (preserved) ---

/** @type {[number, number][]} */
export const densityAxes = corners.map((c) => {
	const rad = (c.angle * Math.PI) / 180;
	return [Math.cos(rad), Math.sin(rad)];
});

/** @type {{ maxWidth: number; count: number }[]} */
export const starTiers = [
	{ maxWidth: 639, count: 500 },
	{ maxWidth: 1279, count: 750 },
	{ maxWidth: Infinity, count: 1000 }
];

/**
 * @param {number} width
 * @returns {number}
 */
export function getStarCount(width) {
	for (const tier of starTiers) {
		if (width <= tier.maxWidth) return tier.count;
	}
	return 1000;
}
