<script>
	import { T, useThrelte } from '@threlte/core';
	import { useTask } from '@threlte/core';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { reducedMotion } from '$lib/stores/motion.js';
	import { selectedNode } from '$lib/stores/selectedNode.js';
	import { getStarCount, densityAxes } from '$lib/data/constellation.js';

	const { size } = useThrelte();

	const FIELD_RADIUS = 14;
	const MAX_STARS = 1000;
	const ENTRANCE_DURATION = 2.5;

	const geometry = new THREE.PlaneGeometry(0.1, 0.1);

	const material = new THREE.ShaderMaterial({
		uniforms: {
			uTime: { value: 0 },
			uEntrance: { value: 0 },
			uDim: { value: 1.0 }
		},
		vertexShader: `
			attribute float aPhase;
			attribute float aSpeed;
			attribute float aBaseOpacity;
			attribute float aSize;
			attribute float aColorTemp;
			attribute float aEntranceDelay;

			uniform float uTime;
			uniform float uEntrance;

			varying float vOpacity;
			varying float vColorTemp;
			varying vec2 vUv;

			void main() {
				vUv = uv;
				vColorTemp = aColorTemp;

				// Entrance: each star fades in based on its delay
				float entranceProgress = clamp((uEntrance - aEntranceDelay) * 3.0, 0.0, 1.0);
				float entranceEase = entranceProgress * entranceProgress * (3.0 - 2.0 * entranceProgress);

				// Billboard
				vec3 instancePos = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
				vec3 camRight = vec3(modelViewMatrix[0][0], modelViewMatrix[1][0], modelViewMatrix[2][0]);
				vec3 camUp = vec3(modelViewMatrix[0][1], modelViewMatrix[1][1], modelViewMatrix[2][1]);

				float scaledSize = aSize * entranceEase;
				vec3 worldPos = instancePos + camRight * position.x * scaledSize + camUp * position.y * scaledSize;
				vec4 mvPosition = modelViewMatrix * vec4(worldPos, 1.0);
				gl_Position = projectionMatrix * mvPosition;

				// Twinkle with varied waveform
				float t1 = sin(uTime * aSpeed + aPhase);
				float t2 = sin(uTime * aSpeed * 0.5 + aPhase * 2.3);
				float twinkle = 0.5 + 0.3 * t1 + 0.2 * t2;

				vOpacity = aBaseOpacity * twinkle * entranceEase;
			}
		`,
		fragmentShader: `
			uniform float uDim;
			varying float vOpacity;
			varying float vColorTemp;
			varying vec2 vUv;

			void main() {
				vec2 center = vUv - 0.5;
				float dist = length(center) * 2.0;

				// Tight bright core + wider soft glow
				float core = exp(-dist * dist * 12.0);
				float glow = exp(-dist * dist * 2.5) * 0.35;
				float outerGlow = exp(-dist * dist * 0.8) * 0.08;
				float alpha = (core + glow + outerGlow) * vOpacity;

				if (alpha < 0.005) discard;

				// Color temperature: cool blue → white → warm gold
				vec3 coolColor = vec3(0.7, 0.8, 1.0);
				vec3 warmColor = vec3(1.0, 0.9, 0.7);
				vec3 white = vec3(1.0);

				vec3 starColor;
				if (vColorTemp < 0.5) {
					starColor = mix(coolColor, white, vColorTemp * 2.0);
				} else {
					starColor = mix(white, warmColor, (vColorTemp - 0.5) * 2.0);
				}

				// Hot white core
				starColor = mix(starColor, vec3(1.0), core * 0.6);

				gl_FragColor = vec4(starColor, alpha * uDim);
			}
		`,
		transparent: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending,
		fog: false
	});

	let mesh = $state(null);
	let currentCount = $state(0);
	let entranceTime = 0;
	let entranceComplete = false;

	const phases = new Float32Array(MAX_STARS);
	const speeds = new Float32Array(MAX_STARS);
	const baseOpacities = new Float32Array(MAX_STARS);
	const sizes = new Float32Array(MAX_STARS);
	const colorTemps = new Float32Array(MAX_STARS);
	const entranceDelays = new Float32Array(MAX_STARS);
	const dummy = new THREE.Object3D();

	/**
	 * @param {number} _i
	 * @returns {[number, number, number]}
	 */
	function generatePosition(_i) {
		// Spherical distribution — stars all around, not just a flat wall
		const u = Math.random();
		const v = Math.random();
		const theta = 2 * Math.PI * u;
		const phi = Math.acos(2 * v - 1);
		// Bias radius: more stars in the mid-range, fewer at center/edge
		const r = (0.8 + Math.random() * 0.2) * FIELD_RADIUS * Math.cbrt(Math.random());

		let x = r * Math.sin(phi) * Math.cos(theta);
		let y = r * Math.sin(phi) * Math.sin(theta);
		let z = r * Math.cos(phi) - FIELD_RADIUS * 0.3;

		// 25% of stars cluster toward hexagonal density axes (XY plane)
		if (Math.random() < 0.25) {
			const axis = densityAxes[Math.floor(Math.random() * densityAxes.length)];
			const biasFactor = 0.2 + Math.random() * 0.3;
			x = x * (1 - biasFactor) + axis[0] * 5 * biasFactor * (0.5 + Math.random() * 0.5);
			y = y * (1 - biasFactor) + axis[1] * 5 * biasFactor * (0.5 + Math.random() * 0.5);
		}

		return [x, y, z];
	}

	function buildStars(count) {
		if (!mesh) return;

		for (let i = 0; i < count; i++) {
			const [x, y, z] = generatePosition(i);
			dummy.position.set(x, y, z);
			dummy.updateMatrix();
			mesh.setMatrixAt(i, dummy.matrix);

			const dist = Math.sqrt(x * x + y * y + z * z);
			const depthFactor = 1 - Math.min(dist / FIELD_RADIUS, 1);
			const rand = Math.random();

			// Power-curve size distribution: mostly tiny, rare large "hero" stars
			const isHero = rand > 0.97;
			const isMedium = rand > 0.85;
			if (isHero) {
				sizes[i] = 2.5 + Math.random() * 2.0;
				baseOpacities[i] = 0.7 + depthFactor * 0.3;
				speeds[i] = 0.15 + Math.random() * 0.4;
			} else if (isMedium) {
				sizes[i] = 1.0 + depthFactor * 1.5;
				baseOpacities[i] = 0.3 + depthFactor * 0.5;
				speeds[i] = 0.3 + Math.random() * 0.8;
			} else {
				sizes[i] = 0.3 + depthFactor * 0.8;
				baseOpacities[i] = 0.1 + depthFactor * 0.4;
				speeds[i] = 0.5 + Math.random() * 1.5;
			}

			phases[i] = Math.random() * Math.PI * 2;

			// Color temperature: 0=cool blue, 0.5=white, 1=warm gold
			// Bias toward white/cool with occasional warm
			colorTemps[i] = Math.random() < 0.7
				? Math.random() * 0.5
				: 0.5 + Math.random() * 0.5;

			// Entrance delay: far stars appear first, close ones last
			const distNorm = Math.min(dist / FIELD_RADIUS, 1);
			entranceDelays[i] = (1 - distNorm) * 0.8 + Math.random() * 0.2;
		}

		mesh.instanceMatrix.needsUpdate = true;
		mesh.count = count;
		updateAttributes(count);
	}

	function updateAttributes(count) {
		if (!mesh) return;
		const geom = mesh.geometry;

		const setOrUpdate = (/** @type {string} */ name, /** @type {Float32Array} */ array) => {
			const existing = geom.getAttribute(name);
			if (existing) {
				existing.array = array;
				existing.needsUpdate = true;
			} else {
				geom.setAttribute(name, new THREE.InstancedBufferAttribute(array, 1));
			}
		};

		setOrUpdate('aPhase', phases.slice(0, count));
		setOrUpdate('aSpeed', speeds.slice(0, count));
		setOrUpdate('aBaseOpacity', baseOpacities.slice(0, count));
		setOrUpdate('aSize', sizes.slice(0, count));
		setOrUpdate('aColorTemp', colorTemps.slice(0, count));
		setOrUpdate('aEntranceDelay', entranceDelays.slice(0, count));
	}

	$effect(() => {
		if (!mesh) return;
		const count = getStarCount(size.current.width);
		if (count !== currentCount) {
			buildStars(count);
			currentCount = count;
		}
	});

	useTask((delta) => {
		if (!mesh) return;

		// Entrance animation
		if (!entranceComplete) {
			entranceTime += delta;
			const progress = Math.min(entranceTime / ENTRANCE_DURATION, 1);
			material.uniforms.uEntrance.value = progress;
			if (progress >= 1) entranceComplete = true;
		}

		if (!$reducedMotion) {
			material.uniforms.uTime.value += delta;
		}

		// Smooth dim when panel is open
		const targetDim = $selectedNode ? 0.3 : 1.0;
		const currentDim = material.uniforms.uDim.value;
		material.uniforms.uDim.value += (targetDim - currentDim) * Math.min(delta * 4, 1);
	});

	onMount(() => {
		return () => {
			geometry.dispose();
			material.dispose();
		};
	});
</script>

<T.InstancedMesh
	bind:ref={mesh}
	args={[geometry, material, MAX_STARS]}
	frustumCulled={false}
/>
