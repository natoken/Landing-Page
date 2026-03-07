/**
 * 6 Corners — hexagonal leadership anchor positions.
 * Arranged in a regular hexagon centered at origin.
 * Angles: 90° (top), 30° (top-right), 330° (bottom-right),
 *         270° (bottom), 210° (bottom-left), 150° (top-left)
 *
 * @type {{ id: string; label: string; angle: number; position: [number, number, number]; filled: boolean }[]}
 */
const RADIUS = 4;

export const corners = [
	{
		id: 'ceo',
		label: 'CEO',
		angle: 90,
		position: [
			RADIUS * Math.cos((90 * Math.PI) / 180),
			RADIUS * Math.sin((90 * Math.PI) / 180),
			0
		],
		filled: true
	},
	{
		id: 'cto',
		label: 'CTO',
		angle: 30,
		position: [
			RADIUS * Math.cos((30 * Math.PI) / 180),
			RADIUS * Math.sin((30 * Math.PI) / 180),
			0
		],
		filled: true
	},
	{
		id: 'open-1',
		label: '',
		angle: 330,
		position: [
			RADIUS * Math.cos((330 * Math.PI) / 180),
			RADIUS * Math.sin((330 * Math.PI) / 180),
			0
		],
		filled: false
	},
	{
		id: 'open-2',
		label: '',
		angle: 270,
		position: [
			RADIUS * Math.cos((270 * Math.PI) / 180),
			RADIUS * Math.sin((270 * Math.PI) / 180),
			0
		],
		filled: false
	},
	{
		id: 'open-3',
		label: '',
		angle: 210,
		position: [
			RADIUS * Math.cos((210 * Math.PI) / 180),
			RADIUS * Math.sin((210 * Math.PI) / 180),
			0
		],
		filled: false
	},
	{
		id: 'open-4',
		label: '',
		angle: 150,
		position: [
			RADIUS * Math.cos((150 * Math.PI) / 180),
			RADIUS * Math.sin((150 * Math.PI) / 180),
			0
		],
		filled: false
	}
];

/**
 * Product branch positions — near their respective leadership corners.
 * @type {{ id: string; name: string; nearCorner: string; position: [number, number, number] }[]}
 */
export const productBranches = [
	{
		id: 'runeforge',
		name: 'RuneForge',
		nearCorner: 'cto',
		position: [
			RADIUS * 1.35 * Math.cos((25 * Math.PI) / 180),
			RADIUS * 1.35 * Math.sin((25 * Math.PI) / 180),
			-0.5
		]
	},
	{
		id: 'taledom',
		name: 'Taledom',
		nearCorner: 'ceo',
		position: [
			RADIUS * 1.35 * Math.cos((95 * Math.PI) / 180),
			RADIUS * 1.35 * Math.sin((95 * Math.PI) / 180),
			-0.5
		]
	}
];

/**
 * Star density bias — the 6 hexagonal axes along which stars cluster slightly.
 * Each axis is a normalized direction vector from center.
 * @type {[number, number][]}
 */
export const densityAxes = corners.map((c) => {
	const rad = (c.angle * Math.PI) / 180;
	return [Math.cos(rad), Math.sin(rad)];
});

/**
 * Star count tiers by viewport width.
 * @type {{ maxWidth: number; count: number }[]}
 */
export const starTiers = [
	{ maxWidth: 639, count: 500 },
	{ maxWidth: 1279, count: 750 },
	{ maxWidth: Infinity, count: 1000 }
];

/**
 * Get the star count for a given viewport width.
 * @param {number} width
 * @returns {number}
 */
export function getStarCount(width) {
	for (const tier of starTiers) {
		if (width <= tier.maxWidth) return tier.count;
	}
	return 1000;
}
