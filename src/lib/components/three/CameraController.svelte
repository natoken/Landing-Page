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
	const DEFAULT_Z = 7.5;
	const MIN_Z = 3;
	const MAX_Z = 14;

	let time = 0;
	let paused = $state(false);
	let mouseX = 0;
	let mouseY = 0;
	let targetX = 0;
	let targetY = 0;
	let currentX = 0;
	let currentY = 0;
	let zoomTargetX = 0;
	let zoomTargetY = 0;
	let zoomTargetZ = DEFAULT_Z;
	let scrollZoom = DEFAULT_Z;
	let scrollFocusX = 0;
	let scrollFocusY = 0;

	const lookTarget = new THREE.Vector3(0, 0, LOOK_DEPTH);

	useTask((delta) => {
		if (paused) return;

		const cam = camera.current;
		if (!cam) return;

		// Zoom in: move toward mouse focus point; zoom out: ease back to center
		const zoomFactor = Math.max(0, (DEFAULT_Z - scrollZoom) / (DEFAULT_Z - MIN_Z));
		zoomTargetX = scrollFocusX * zoomFactor * 0.5;
		zoomTargetY = scrollFocusY * zoomFactor * 0.5;
		zoomTargetZ = scrollZoom;

		// Smooth mouse follow
		targetX = mouseX * MOUSE_INFLUENCE;
		targetY = mouseY * MOUSE_INFLUENCE;
		currentX = THREE.MathUtils.lerp(currentX, targetX, delta * LERP_SPEED);
		currentY = THREE.MathUtils.lerp(currentY, targetY, delta * LERP_SPEED);

		if (!$reducedMotion) {
			time += delta * DRIFT_SPEED;
		}

		// Combine drift + mouse parallax + zoom offset
		const driftX = Math.sin(time) * DRIFT_RADIUS;
		const driftY = Math.cos(time * 0.7) * DRIFT_RADIUS * 0.6;

		const targetCamX = driftX + currentX + zoomTargetX;
		const targetCamY = driftY + currentY + zoomTargetY;

		const lerpRate = Math.min(delta * 5, 1);
		cam.position.x = THREE.MathUtils.lerp(cam.position.x, targetCamX, lerpRate);
		cam.position.y = THREE.MathUtils.lerp(cam.position.y, targetCamY, lerpRate);
		cam.position.z = THREE.MathUtils.lerp(cam.position.z, zoomTargetZ, lerpRate);

		// Look toward center/selection with slight offset from mouse
		lookTarget.x = THREE.MathUtils.lerp(lookTarget.x, currentX * 0.3 + zoomTargetX * 0.5, lerpRate);
		lookTarget.y = THREE.MathUtils.lerp(lookTarget.y, currentY * 0.3 + zoomTargetY * 0.5, lerpRate);
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

		const handleWheel = (/** @type {WheelEvent} */ e) => {
			e.preventDefault();
			const newZoom = Math.max(MIN_Z, Math.min(MAX_Z, scrollZoom + e.deltaY * 0.005));

			if (e.deltaY < 0) {
				// Zooming in — set focus point from mouse position in world space
				const cam = camera.current;
				if (cam) {
					// Convert mouse NDC to approximate world XY at z=0
					const ndcX = (e.clientX / window.innerWidth) * 2 - 1;
					const ndcY = -((e.clientY / window.innerHeight) * 2 - 1);
					const fovRad = (cam.fov * Math.PI) / 180;
					const worldHalfH = Math.tan(fovRad / 2) * cam.position.z;
					const worldHalfW = worldHalfH * cam.aspect;
					scrollFocusX = cam.position.x + ndcX * worldHalfW;
					scrollFocusY = cam.position.y + ndcY * worldHalfH;
				}
			}

			scrollZoom = newZoom;

			// Zooming past default — snap focus back to center
			if (scrollZoom >= DEFAULT_Z) {
				scrollFocusX = 0;
				scrollFocusY = 0;
			}
		};

		document.addEventListener('visibilitychange', handleVisibility);
		window.addEventListener('mousemove', handleMouse);
		window.addEventListener('wheel', handleWheel, { passive: false });
		return () => {
			document.removeEventListener('visibilitychange', handleVisibility);
			window.removeEventListener('mousemove', handleMouse);
			window.removeEventListener('wheel', handleWheel);
		};
	});
</script>
