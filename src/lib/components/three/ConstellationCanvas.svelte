<script>
	import { Canvas, T } from '@threlte/core';
	import StarField from './StarField.svelte';
	import SixCorners from './SixCorners.svelte';
	import ProductBranches from './ProductBranches.svelte';
	import CameraController from './CameraController.svelte';
</script>

<Canvas>
	<T.PerspectiveCamera
		makeDefault
		position={[0, 0, 6]}
		fov={60}
		near={0.1}
		far={50}
	/>

	<T.AmbientLight intensity={0.1} />

	<T.Fog
		attach="fog"
		args={['#0d1117', 8, 18]}
	/>

	<StarField />
	<SixCorners />
	<ProductBranches />
	<CameraController />
</Canvas>
