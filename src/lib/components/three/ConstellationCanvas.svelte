<script>
	import { Canvas, T } from '@threlte/core';
	import StarField from './StarField.svelte';
	import SixCorners from './SixCorners.svelte';
	import ConstellationLines from './ConstellationLines.svelte';
	import CoreNode from './CoreNode.svelte';
	import TeamNodes from './TeamNodes.svelte';
	import ProductConstellations from './ProductConstellations.svelte';
	import CameraController from './CameraController.svelte';
</script>

<Canvas>
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

	<StarField />
	<ConstellationLines />
	<SixCorners />
	<CoreNode />
	<TeamNodes />
	<ProductConstellations />
	<CameraController />
</Canvas>
