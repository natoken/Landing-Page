<script>
	import { Canvas, T } from '@threlte/core';
	import { onMount } from 'svelte';
	import StarField from './StarField.svelte';
	import SixCorners from './SixCorners.svelte';
	import ConstellationLines from './ConstellationLines.svelte';
	import CoreNode from './CoreNode.svelte';
	import TeamNodes from './TeamNodes.svelte';
	import ProductConstellations from './ProductConstellations.svelte';
	import CameraController from './CameraController.svelte';
	import SceneSetup from './SceneSetup.svelte';
	import { clearSelection } from '$lib/stores/selectedNode.js';

	onMount(() => {
		const handleKeydown = (/** @type {KeyboardEvent} */ e) => {
			if (e.key === 'Escape') clearSelection();
		};
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});
</script>

<Canvas>
	<SceneSetup />

	<T.PerspectiveCamera
		makeDefault
		position={[0, 0, 7.5]}
		fov={65}
		near={0.1}
		far={60}
	/>

	<T.AmbientLight intensity={0.15} />

	<T.Fog
		attach="fog"
		args={['#0d1117', 14, 35]}
	/>

	<!-- Click-on-empty clears selection -->
	<T.Mesh position={[0, 0, -5]} onclick={() => clearSelection()}>
		<T.PlaneGeometry args={[100, 100]} />
		<T.MeshBasicMaterial visible={false} />
	</T.Mesh>

	<StarField />
	<ConstellationLines />
	<SixCorners />
	<CoreNode />
	<TeamNodes />
	<ProductConstellations />
	<CameraController />
</Canvas>
