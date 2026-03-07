<script>
	import { useThrelte } from '@threlte/core';
	import { useTask } from '@threlte/core';
	import { onMount } from 'svelte';
	import { reducedMotion } from '$lib/stores/motion.js';

	const { camera } = useThrelte();

	const DRIFT_RADIUS = 0.3;
	const DRIFT_SPEED = 0.05;

	let time = 0;
	let paused = $state(false);

	useTask((delta) => {
		if ($reducedMotion || paused) return;

		time += delta * DRIFT_SPEED;

		const cam = camera.current;
		if (!cam) return;

		cam.position.x = Math.sin(time) * DRIFT_RADIUS;
		cam.position.y = Math.cos(time * 0.7) * DRIFT_RADIUS * 0.6;
		cam.lookAt(0, 0, -4);
	});

	onMount(() => {
		const handleVisibility = () => {
			paused = document.hidden;
		};

		document.addEventListener('visibilitychange', handleVisibility);
		return () => document.removeEventListener('visibilitychange', handleVisibility);
	});
</script>
