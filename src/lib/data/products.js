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
 *   mascot?: { name: string; image?: string };
 *   accentColor?: string;
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
    children: ['champion-trials'],
    mascot: { name: 'Ignis' },
    accentColor: '#ed0049'
  },
  {
    slug: 'taledom',
    name: 'Taledom.com',
    description: 'A Web Novel Publishing Platform and writer assistant / editor tool.',
    status: 'in-development',
    url: 'https://taledom.com',
    image: undefined,
    parentCorner: 'ceo',
    children: ['breaking-worlds', 'minos-journey', 'tower-of-heavens'],
    mascot: { name: 'Inky' },
    accentColor: '#3e88f2'
  },
  {
    slug: 'breaking-worlds',
    name: 'Breaking Worlds',
    description: 'A Dark Psychological Fantasy novel.',
    status: 'in-development',
    url: undefined,
    image: undefined,
    parent: 'taledom',
    parentCorner: undefined,
    children: [],
    mascot: { name: 'Kyuro' },
    accentColor: '#3e88f2'
  },
  {
    slug: 'minos-journey',
    name: "Mino's Journey",
    description: 'A novel published on Taledom.',
    status: 'in-development',
    url: undefined,
    image: undefined,
    parent: 'taledom',
    parentCorner: undefined,
    children: [],
    mascot: { name: 'Mino' },
    accentColor: '#3e88f2'
  },
  {
    slug: 'tower-of-heavens',
    name: 'Tower of Heavens',
    description: 'A novel series of two sister stories progressing together with different main characters.',
    status: 'in-development',
    url: undefined,
    image: undefined,
    parent: 'taledom',
    parentCorner: undefined,
    children: ['eyes-of-abyss', 'eyes-of-dawn'],
    accentColor: '#3e88f2'
  },
  {
    slug: 'eyes-of-abyss',
    name: 'The Eyes of Abyss',
    description: 'A sister novel in the Tower of Heavens series.',
    status: 'in-development',
    url: undefined,
    image: undefined,
    parent: 'tower-of-heavens',
    parentCorner: undefined,
    children: [],
    accentColor: '#3e88f2'
  },
  {
    slug: 'eyes-of-dawn',
    name: 'The Eyes of Dawn',
    description: 'A sister novel in the Tower of Heavens series.',
    status: 'in-development',
    url: undefined,
    image: undefined,
    parent: 'tower-of-heavens',
    parentCorner: undefined,
    children: [],
    accentColor: '#3e88f2'
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
    bridges: ['taledom', 'runeforge'],
    accentColor: '#6b3fa0'
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
    children: [],
    accentColor: '#d4a830'
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
    type: 'tool',
    accentColor: '#ed0049'
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
