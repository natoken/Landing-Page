<script>
	import { T } from '@threlte/core';
	import { useTask } from '@threlte/core';
	import * as THREE from 'three';
	import { corners } from '$lib/data/constellation.js';
	import { reducedMotion } from '$lib/stores/motion.js';

	const FILLED_COLOR = new THREE.Color('#ed0049');
	const UNFILLED_COLOR = new THREE.Color('#e6edf3');
	const GLOW_INTENSITY_FILLED = 1.5;
	const HOVER_SCALE = 1.4;

	let hoveredId = $state(null);
	let cornerRefs = $state({});

	useTask((delta) => {
		for (const c of corners) {
			if (!cornerRefs[c.id]) continue;

			const isHovered = hoveredId === c.id;
			const targetScale = isHovered ? HOVER_SCALE : 1;
			const currentScale = cornerRefs[c.id].scale.x;

			if ($reducedMotion) {
				cornerRefs[c.id].scale.setScalar(targetScale);
			} else {
				const newScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * 8);
				cornerRefs[c.id].scale.setScalar(newScale);
			}
		}
	});
</script>

{#each corners as corner (corner.id)}
	<T.Mesh
		bind:ref={cornerRefs[corner.id]}
		position={corner.position}
		onpointerenter={() => { hoveredId = corner.id; }}
		onpointerleave={() => { if (hoveredId === corner.id) hoveredId = null; }}
	>
		<T.SphereGeometry args={[corner.filled ? 0.08 : 0.05, 16, 16]} />
		<T.MeshBasicMaterial
			color={corner.filled ? FILLED_COLOR : UNFILLED_COLOR}
			transparent
			opacity={corner.filled ? 0.9 : (hoveredId === corner.id ? 0.6 : 0.25)}
		/>
	</T.Mesh>

	{#if corner.filled}
		<T.PointLight
			position={corner.position}
			color={FILLED_COLOR}
			intensity={GLOW_INTENSITY_FILLED}
			distance={2}
			decay={2}
		/>
	{/if}
{/each}
