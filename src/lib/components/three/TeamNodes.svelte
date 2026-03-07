<script>
	import { T } from '@threlte/core';
	import { useTask } from '@threlte/core';
	import * as THREE from 'three';
	import { team } from '$lib/data/team.js';
	import { teamNodes } from '$lib/data/constellation.js';
	import { reducedMotion } from '$lib/stores/motion.js';
	import { toggleNode } from '$lib/stores/selectedNode.js';

	const NODE_COLOR = new THREE.Color('#e6edf3');
	const PING_SPEED = 0.4;
	const PING_INTERVAL = 4;

	let time = 0;

	// Pre-create ping ring materials and track refs
	const pingData = team.map((member, i) => {
		const node = teamNodes.find((n) => n.slug === member.slug);
		const material = new THREE.MeshBasicMaterial({
			color: NODE_COLOR,
			transparent: true,
			opacity: 0.3,
			side: THREE.DoubleSide
		});
		return {
			member,
			node,
			phase: i * (PING_INTERVAL / team.length),
			material,
			meshRef: null
		};
	});

	/** @type {Record<string, THREE.Mesh>} */
	let pingRefs = $state({});

	useTask((delta) => {
		if ($reducedMotion) return;
		time += delta;

		for (const pd of pingData) {
			const mesh = pingRefs[pd.member.slug];
			if (!mesh) continue;

			const cycle = (time + pd.phase) % PING_INTERVAL;
			const pingProgress = cycle / PING_INTERVAL;

			if (pingProgress < PING_SPEED) {
				// Expanding ping
				const t = pingProgress / PING_SPEED;
				const eased = t * t * (3 - 2 * t); // smoothstep
				const scale = 1 + eased * 2.5;
				mesh.scale.setScalar(scale);
				pd.material.opacity = 0.25 * (1 - eased * eased);
			} else {
				// Idle — ping ring invisible (static ring handles base visual)
				mesh.scale.setScalar(0.01);
				pd.material.opacity = 0;
			}
		}
	});
</script>

{#each pingData as pd (pd.member.slug)}
	{#if pd.node}
		<!-- Click target (larger invisible sphere) -->
		<T.Mesh
			name={`team:${pd.member.slug}`}
			position={pd.node.position}
		>
			<T.SphereGeometry args={[0.1, 12, 12]} />
			<T.MeshBasicMaterial visible={false} />
		</T.Mesh>

		<!-- Bright center point -->
		<T.Mesh position={pd.node.position}>
			<T.SphereGeometry args={[0.06, 12, 12]} />
			<T.MeshBasicMaterial
				color={NODE_COLOR}
				transparent
				opacity={0.9}
				fog={false}
			/>
		</T.Mesh>

		<!-- Static ring outline (thin) -->
		<T.Mesh position={pd.node.position}>
			<T.RingGeometry args={[0.09, 0.10, 32]} />
			<T.MeshBasicMaterial
				color={NODE_COLOR}
				transparent
				opacity={0.15}
				side={THREE.DoubleSide}
			/>
		</T.Mesh>

		<!-- Ping ring (animated, thin) -->
		<T.Mesh
			bind:ref={pingRefs[pd.member.slug]}
			position={pd.node.position}
			material={pd.material}
		>
			<T.RingGeometry args={[0.09, 0.10, 32]} />
		</T.Mesh>

		<!-- Subtle glow -->
		<T.PointLight
			position={pd.node.position}
			color={NODE_COLOR}
			intensity={0.4}
			distance={1.5}
			decay={2}
		/>
	{/if}
{/each}
