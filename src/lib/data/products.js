/**
 * @typedef {{
 *   slug: string;
 *   name: string;
 *   description: string;
 *   status: 'live' | 'in-development' | 'coming-soon';
 *   url?: string;
 *   image?: string;
 *   parentCorner?: string;
 *   parent?: string;
 *   children: string[];
 *   bridges?: string[];
 *   type?: 'product' | 'tool';
 * }} Product
 */

/** @type {Product[]} */
export const products = [
  {
    slug: 'runeforge',
    name: 'RuneForge.dev',
    description: 'A Game Modding Publishing Platform with a focus on creator health and support.',
    status: 'live',
    url: 'https://runeforge.dev',
    image: 'Ignis.webp',
    parentCorner: 'cto',
    children: ['champion-trials']
  },
  {
    slug: 'taledom',
    name: 'Taledom.com',
    description: 'A Web Novel Publishing Platform and writer assistant / editor tool.',
    status: 'in-development',
    url: 'https://taledom.com',
    image: undefined,
    parentCorner: 'ceo',
    children: []
  },
  {
    slug: 'arisce',
    name: 'Arisce.com',
    description: 'A Hytale Modding Team and Larger Server Project.',
    status: 'in-development',
    url: 'https://arisce.com',
    image: undefined,
    parentCorner: undefined,
    children: [],
    bridges: ['taledom', 'runeforge']
  },
  {
    slug: 'champion-trials',
    name: 'Champion Trials',
    description: 'A League of Legends Challenge App for competitive players.',
    status: 'coming-soon',
    url: undefined,
    image: undefined,
    parent: 'runeforge',
    parentCorner: undefined,
    children: []
  },
  {
    slug: 'genesis',
    name: 'Project Genesis',
    description: 'An open-source structured development system for Claude Code.',
    status: 'live',
    url: undefined,
    image: undefined,
    parentCorner: undefined,
    children: [],
    type: 'tool'
  }
];

/**
 * Get a product by slug.
 * @param {string} slug
 * @returns {Product | undefined}
 */
export function getProduct(slug) {
  return products.find((p) => p.slug === slug);
}
