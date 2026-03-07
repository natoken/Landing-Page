<script>
	import { useThrelte } from '@threlte/core';
	import { useTask } from '@threlte/core';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { reducedMotion } from '$lib/stores/motion.js';

	const { camera } = useThrelte();

	const DRIFT_RADIUS = 0.2;
	const DRIFT_SPEED = 0.04;
	const MOUSE_INFLUENCE = 1.8;
	const LOOK_DEPTH = -2;
	const LERP_SPEED = 3;

	let time = 0;
	let paused = $state(false);
	let mouseX = 0;
	let mouseY = 0;
	let targetX = 0;
	let targetY = 0;
	let currentX = 0;
	let currentY = 0;

	const lookTarget = new THREE.Vector3(0, 0, LOOK_DEPTH);

	useTask((delta) => {
		if (paused) return;

		const cam = camera.current;
		if (!cam) return;

		// Smooth mouse follow
		targetX = mouseX * MOUSE_INFLUENCE;
		targetY = mouseY * MOUSE_INFLUENCE;
		currentX = THREE.MathUtils.lerp(currentX, targetX, delta * LERP_SPEED);
		currentY = THREE.MathUtils.lerp(currentY, targetY, delta * LERP_SPEED);

		if (!$reducedMotion) {
			time += delta * DRIFT_SPEED;
		}

		// Combine drift + mouse parallax
		const driftX = Math.sin(time) * DRIFT_RADIUS;
		const driftY = Math.cos(time * 0.7) * DRIFT_RADIUS * 0.6;

		cam.position.x = driftX + currentX;
		cam.position.y = driftY + currentY;

		// Look toward center with slight offset from mouse
		lookTarget.x = currentX * 0.3;
		lookTarget.y = currentY * 0.3;
		cam.lookAt(lookTarget);
	});

	onMount(() => {
		const handleVisibility = () => {
			paused = document.hidden;
		};

		const handleMouse = (/** @type {MouseEvent} */ e) => {
			// Normalize to -1..1
			mouseX = (e.clientX / window.innerWidth) * 2 - 1;
			mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
		};

		document.addEventListener('visibilitychange', handleVisibility);
		window.addEventListener('mousemove', handleMouse);
		return () => {
			document.removeEventListener('visibilitychange', handleVisibility);
			window.removeEventListener('mousemove', handleMouse);
		};
	});
</script>
