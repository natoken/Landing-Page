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
				const t = pingProgress / PING_SPEED;
				const scale = 1 + t * 3;
				mesh.scale.setScalar(scale);
				pd.material.opacity = 0.3 * (1 - t);
			} else {
				mesh.scale.setScalar(1);
				pd.material.opacity = 0.15;
			}
		}
	});
</script>

{#each pingData as pd (pd.member.slug)}
	{#if pd.node}
		<!-- Click target (larger invisible sphere) -->
		<T.Mesh
			position={pd.node.position}
			onclick={() => toggleNode('team', pd.member.slug, pd.member)}
		>
			<T.SphereGeometry args={[0.2, 12, 12]} />
			<T.MeshBasicMaterial visible={false} />
		</T.Mesh>

		<!-- Bright center point -->
		<T.Mesh position={pd.node.position}>
			<T.SphereGeometry args={[0.06, 12, 12]} />
			<T.MeshBasicMaterial
				color={NODE_COLOR}
				transparent
				opacity={0.9}
			/>
		</T.Mesh>

		<!-- Static ring outline -->
		<T.Mesh position={pd.node.position}>
			<T.RingGeometry args={[0.12, 0.14, 32]} />
			<T.MeshBasicMaterial
				color={NODE_COLOR}
				transparent
				opacity={0.15}
				side={THREE.DoubleSide}
			/>
		</T.Mesh>

		<!-- Ping ring (animated) -->
		<T.Mesh
			bind:ref={pingRefs[pd.member.slug]}
			position={pd.node.position}
			material={pd.material}
		>
			<T.RingGeometry args={[0.12, 0.14, 32]} />
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
