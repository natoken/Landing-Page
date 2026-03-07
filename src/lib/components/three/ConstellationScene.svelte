<script>
	import { onMount } from 'svelte';
	import { webglAvailable } from '$lib/stores/webgl.js';
	import { constellationReady } from '$lib/stores/constellation.js';
	import ConstellationFallback from '$lib/components/ConstellationFallback.svelte';

	let SceneContent = $state(null);
	let sceneVisible = $state(false);
	let mounted = $state(false);

	onMount(() => {
		mounted = true;

		if (!$webglAvailable) {
			sceneVisible = true;
			constellationReady.set(true);
			return;
		}

		// Dynamic import of Threlte — not in initial bundle
		import('./ConstellationCanvas.svelte').then((mod) => {
			SceneContent = mod.default;
			// Small delay to ensure content has painted first
			requestAnimationFrame(() => {
				sceneVisible = true;
				constellationReady.set(true);
			});
		});
	});
</script>

<div
	class="constellation-root"
	class:constellation-visible={sceneVisible}
	aria-hidden="true"
>
	{#if mounted}
		{#if $webglAvailable && SceneContent}
			<SceneContent />
		{:else if !$webglAvailable}
			<ConstellationFallback />
		{/if}
	{/if}
</div>

<style>
	.constellation-root {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		background: var(--color-bg);
		opacity: 0;
		transition: opacity 0.8s ease-out;
	}

	.constellation-root.constellation-visible {
		opacity: 1;
	}

	.constellation-root :global(canvas) {
		display: block;
		width: 100% !important;
		height: 100% !important;
	}
</style>
