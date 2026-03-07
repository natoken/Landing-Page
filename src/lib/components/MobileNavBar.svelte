<script>
	import { selectedNode, toggleNode, clearSelection } from '$lib/stores/selectedNode.js';
	import { team } from '$lib/data/team.js';
	import { products } from '$lib/data/products.js';

	function openAbout() {
		if ($selectedNode?.type === 'core') {
			clearSelection();
		} else {
			toggleNode('core', 'natoken', { label: 'Natoken' });
		}
	}

	function openTeam() {
		// Cycle through team members, or show first if nothing selected
		const currentSlug = $selectedNode?.type === 'team' ? $selectedNode.id : null;
		const idx = team.findIndex((m) => m.slug === currentSlug);
		const next = team[(idx + 1) % team.length];
		toggleNode('team', next.slug, next);
	}

	function openProducts() {
		// Show root products (those with parentCorner)
		const roots = products.filter((p) => p.parentCorner);
		const currentSlug = $selectedNode?.type === 'product' ? $selectedNode.id : null;
		const idx = roots.findIndex((p) => p.slug === currentSlug);
		const next = roots[(idx + 1) % roots.length];
		toggleNode('product', next.slug, next);
	}
</script>

<nav class="mobile-nav" aria-label="Site navigation">
	<button
		type="button"
		class="nav-btn"
		class:active={$selectedNode?.type === 'core'}
		onclick={openAbout}
		aria-label="About Natoken"
	>
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
		</svg>
		<span>About</span>
	</button>
	<button
		type="button"
		class="nav-btn"
		class:active={$selectedNode?.type === 'team'}
		onclick={openTeam}
		aria-label="View team"
	>
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
			<path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
		</svg>
		<span>Team</span>
	</button>
	<button
		type="button"
		class="nav-btn"
		class:active={$selectedNode?.type === 'product'}
		onclick={openProducts}
		aria-label="View products"
	>
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
			<rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
		</svg>
		<span>Products</span>
	</button>
</nav>

<style>
	.mobile-nav {
		display: flex;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 80;
		justify-content: center;
		gap: 4px;
		padding: 8px 16px;
		padding-bottom: max(8px, env(safe-area-inset-bottom));
		background: rgba(13, 17, 23, 0.85);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border-top: 1px solid rgba(255, 255, 255, 0.06);
	}

	.nav-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		flex: 1;
		max-width: 100px;
		padding: 8px 4px 4px;
		background: none;
		border: none;
		color: rgba(255, 255, 255, 0.45);
		font-family: var(--font-sans);
		font-size: 0.625rem;
		font-weight: 600;
		cursor: pointer;
		border-radius: 8px;
		transition: color 0.15s, background 0.15s;
	}

	.nav-btn:hover {
		color: rgba(255, 255, 255, 0.7);
	}

	.nav-btn.active {
		color: var(--color-accent);
		background: rgba(237, 0, 73, 0.08);
	}

	@media (min-width: 960px) {
		.mobile-nav {
			display: none;
		}
	}
</style>
