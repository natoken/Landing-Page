<script>
	import { T, useThrelte } from '@threlte/core';
	import { useTask } from '@threlte/core';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { reducedMotion } from '$lib/stores/motion.js';
	import { getStarCount, densityAxes } from '$lib/data/constellation.js';

	const { size } = useThrelte();

	const DEPTH_RANGE = 12;
	const SPREAD = 10;
	const MAX_STARS = 1000;

	const geometry = new THREE.SphereGeometry(0.02, 6, 6);

	const material = new THREE.ShaderMaterial({
		uniforms: {
			uTime: { value: 0 },
			uColor: { value: new THREE.Color('#e6edf3') }
		},
		vertexShader: `
			attribute float aPhase;
			attribute float aSpeed;
			attribute float aBaseOpacity;
			attribute float aSize;

			uniform float uTime;

			varying float vOpacity;

			void main() {
				vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position * aSize, 1.0);
				gl_Position = projectionMatrix * mvPosition;

				float twinkle = 0.5 + 0.5 * sin(uTime * aSpeed + aPhase);
				vOpacity = aBaseOpacity * (0.6 + 0.4 * twinkle);
			}
		`,
		fragmentShader: `
			uniform vec3 uColor;
			varying float vOpacity;

			void main() {
				gl_FragColor = vec4(uColor, vOpacity);
			}
		`,
		transparent: true,
		depthWrite: false,
		fog: true
	});

	let mesh = $state(null);
	let currentCount = $state(0);

	const phases = new Float32Array(MAX_STARS);
	const speeds = new Float32Array(MAX_STARS);
	const baseOpacities = new Float32Array(MAX_STARS);
	const sizes = new Float32Array(MAX_STARS);
	const dummy = new THREE.Object3D();

	/**
	 * @param {number} _i
	 * @returns {[number, number, number]}
	 */
	function generatePosition(_i) {
		let x = (Math.random() - 0.5) * SPREAD * 2;
		let y = (Math.random() - 0.5) * SPREAD * 2;
		let z = -Math.random() * DEPTH_RANGE;

		if (Math.random() < 0.3) {
			const axis = densityAxes[Math.floor(Math.random() * densityAxes.length)];
			const biasFactor = 0.3 + Math.random() * 0.4;
			x = x * (1 - biasFactor) + axis[0] * SPREAD * biasFactor * (0.3 + Math.random() * 0.7);
			y = y * (1 - biasFactor) + axis[1] * SPREAD * biasFactor * (0.3 + Math.random() * 0.7);
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

			const depthFactor = 1 - Math.abs(z) / DEPTH_RANGE;
			sizes[i] = 0.5 + depthFactor * 2.5;
			baseOpacities[i] = 0.15 + depthFactor * 0.7;
			phases[i] = Math.random() * Math.PI * 2;
			speeds[i] = 0.3 + Math.random() * 1.2;
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
		if (!mesh || $reducedMotion) return;
		material.uniforms.uTime.value += delta;
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
