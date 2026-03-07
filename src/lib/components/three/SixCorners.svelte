<script>
	import { T } from '@threlte/core';
	import { useTask } from '@threlte/core';
	import * as THREE from 'three';
	import { corners } from '$lib/data/constellation.js';
	import { reducedMotion } from '$lib/stores/motion.js';

	const FILLED_COLOR = new THREE.Color('#ed0049');
	const UNFILLED_COLOR = new THREE.Color('#e6edf3');
	const GLOW_INTENSITY_FILLED = 2.5;
	const HOVER_SCALE = 1.5;

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
		<T.SphereGeometry args={[corner.filled ? 0.12 : 0.06, 16, 16]} />
		<T.MeshBasicMaterial
			color={corner.filled ? FILLED_COLOR : UNFILLED_COLOR}
			transparent
			opacity={corner.filled ? 0.95 : (hoveredId === corner.id ? 0.5 : 0.15)}
		/>
	</T.Mesh>

	{#if corner.filled}
		<!-- Outer glow halo -->
		<T.Mesh position={corner.position}>
			<T.SphereGeometry args={[0.3, 16, 16]} />
			<T.MeshBasicMaterial
				color={FILLED_COLOR}
				transparent
				opacity={0.08}
			/>
		</T.Mesh>
		<T.PointLight
			position={corner.position}
			color={FILLED_COLOR}
			intensity={GLOW_INTENSITY_FILLED}
			distance={3}
			decay={2}
		/>
	{/if}
{/each}
