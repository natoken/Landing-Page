<script>
	import { T } from '@threlte/core';
	import { useTask } from '@threlte/core';
	import * as THREE from 'three';
	import { core } from '$lib/data/constellation.js';
	import { reducedMotion } from '$lib/stores/motion.js';

	const CORE_COLOR = new THREE.Color('#ed0049');
	const PULSE_SPEED = 0.6;
	const BASE_INTENSITY = 3;

	let time = 0;
	let lightRef = $state(null);

	useTask((delta) => {
		if ($reducedMotion || !lightRef) return;
		time += delta * PULSE_SPEED;
		lightRef.intensity = BASE_INTENSITY + Math.sin(time) * 0.8;
	});
</script>

<!-- Core sphere -->
<T.Mesh position={core.position}>
	<T.SphereGeometry args={[0.18, 24, 24]} />
	<T.MeshBasicMaterial
		color={CORE_COLOR}
		transparent
		opacity={0.95}
	/>
</T.Mesh>

<!-- Outer glow halo -->
<T.Mesh position={core.position}>
	<T.SphereGeometry args={[0.45, 24, 24]} />
	<T.MeshBasicMaterial
		color={CORE_COLOR}
		transparent
		opacity={0.06}
	/>
</T.Mesh>

<!-- Point light -->
<T.PointLight
	bind:ref={lightRef}
	position={core.position}
	color={CORE_COLOR}
	intensity={BASE_INTENSITY}
	distance={5}
	decay={2}
/>
