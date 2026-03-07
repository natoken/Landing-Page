<script>
	import { T } from '@threlte/core';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { productBranches } from '$lib/data/constellation.js';

	const CLUSTER_SIZE = 12;
	const CLUSTER_SPREAD = 0.6;
	const CLUSTER_COLOR = new THREE.Color('#e6edf3');

	/**
	 * Generate cluster particle positions around a center point.
	 * @param {[number, number, number]} center
	 * @returns {{ position: [number, number, number]; size: number; opacity: number }[]}
	 */
	function generateCluster(center) {
		const particles = [];
		for (let i = 0; i < CLUSTER_SIZE; i++) {
			const offsetX = (Math.random() - 0.5) * CLUSTER_SPREAD;
			const offsetY = (Math.random() - 0.5) * CLUSTER_SPREAD;
			const offsetZ = (Math.random() - 0.5) * CLUSTER_SPREAD * 0.5;
			particles.push({
				position: [
					center[0] + offsetX,
					center[1] + offsetY,
					center[2] + offsetZ
				],
				size: 0.015 + Math.random() * 0.02,
				opacity: 0.4 + Math.random() * 0.5
			});
		}
		return particles;
	}

	const clusters = productBranches.map((branch) => ({
		...branch,
		particles: generateCluster(branch.position)
	}));
</script>

{#each clusters as cluster (cluster.id)}
	{#each cluster.particles as particle, i}
		<T.Mesh position={particle.position}>
			<T.SphereGeometry args={[particle.size, 6, 6]} />
			<T.MeshBasicMaterial
				color={CLUSTER_COLOR}
				transparent
				opacity={particle.opacity}
			/>
		</T.Mesh>
	{/each}

	<!-- Subtle glow at cluster center -->
	<T.PointLight
		position={cluster.position}
		color={CLUSTER_COLOR}
		intensity={0.4}
		distance={1.5}
		decay={2}
	/>
{/each}
