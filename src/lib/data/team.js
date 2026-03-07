/**
 * @typedef {{
 *   slug: string;
 *   nickname: string;
 *   fullName?: string;
 *   title: string;
 *   image?: string;
 *   domain: 'ceo' | 'cto' | 'cco' | 'product';
 *   product?: string;
 *   nearCorner?: string;
 * }} TeamMember
 */

/** @type {TeamMember[]} */
export const team = [
  { slug: 'nagi', nickname: 'Nagi', fullName: 'Soren Thor Warnsdorf', title: 'CEO of Natoken', image: 'Nagi%20Profile.webp', domain: 'ceo', name: 'Soren Thor Warnsdorf' },
  { slug: 'crauzer', nickname: 'Crauzer', fullName: 'Filip Quitko', title: 'CTO of Natoken', domain: 'cto', name: 'Filip Quitko' },
  { slug: 'void', nickname: 'Void', fullName: 'Ismail Immi', title: 'CEO of Taledom.com', image: 'Void%20Profile.webp', domain: 'product', product: 'taledom', name: 'Ismail Immi' },
  { slug: 'scuttlecrab', nickname: 'Scuttlecrab', fullName: 'Kerlos Youssef', title: 'CEO of Arisce.com', domain: 'product', product: 'arisce', name: 'Kerlos Youssef' }
];

/**
 * Get a team member by slug.
 * @param {string} slug
 * @returns {TeamMember | undefined}
 */
export function getMember(slug) {
  return team.find((m) => m.slug === slug);
}
