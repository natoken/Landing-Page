<script>
	import { T } from '@threlte/core';
	import { useTask } from '@threlte/core';
	import * as THREE from 'three';
	import { edges as graphEdges } from '$lib/data/constellation.js';
	import { selectedNode } from '$lib/stores/selectedNode.js';

	const ACCENT = new THREE.Color('#ed0049');
	const DIM = new THREE.Color('#e6edf3');
	const PULSE_SPEED = 0.8;

	let time = 0;

	function makeLineGeo(from, to) {
		return new THREE.BufferGeometry().setFromPoints([
			new THREE.Vector3(...from),
			new THREE.Vector3(...to)
		]);
	}

	const COLOR_MAP = {
		hierarchy: ACCENT,
		product: ACCENT,
		team: DIM,
		bridge: ACCENT
	};

	const lines = graphEdges.map((edge, i) => {
		const color = COLOR_MAP[edge.type] || DIM;
		const isPulsing = edge.type === 'hierarchy' && edge.opacity > 0.1;
		const mat = new THREE.LineBasicMaterial({
			color,
			transparent: true,
			opacity: edge.opacity
		});
		return {
			id: `edge-${i}`,
			geometry: makeLineGeo(edge.from, edge.to),
			material: mat,
			pulses: isPulsing,
			baseOpacity: edge.opacity
		};
	});

	const pulsingMats = lines.filter((l) => l.pulses);

	let dimFactor = 1;

	useTask((delta) => {
		time += delta * PULSE_SPEED;

		const targetDim = $selectedNode ? 0.3 : 1.0;
		dimFactor += (targetDim - dimFactor) * Math.min(delta * 4, 1);

		const pulse = 0.7 + 0.3 * Math.sin(time);
		for (const line of lines) {
			const p = line.pulses ? pulse : 1;
			line.material.opacity = line.baseOpacity * p * dimFactor;
		}
	});
</script>

{#each lines as line (line.id)}
	<T.Line geometry={line.geometry} material={line.material} />
{/each}
