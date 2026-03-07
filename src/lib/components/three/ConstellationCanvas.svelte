<script>
	import { Canvas, T } from '@threlte/core';
	import StarField from './StarField.svelte';
	import SixCorners from './SixCorners.svelte';
	import ConstellationLines from './ConstellationLines.svelte';
	import CameraController from './CameraController.svelte';
</script>

<Canvas>
	<T.PerspectiveCamera
		makeDefault
		position={[0, 0, 9]}
		fov={65}
		near={0.1}
		far={60}
	/>

	<T.AmbientLight intensity={0.15} />

	<T.Fog
		attach="fog"
		args={['#0d1117', 12, 30]}
	/>

	<StarField />
	<ConstellationLines />
	<SixCorners />
	<CameraController />
</Canvas>
