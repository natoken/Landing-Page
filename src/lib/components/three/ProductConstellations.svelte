<script>
	import { T } from '@threlte/core';
	import { useTask } from '@threlte/core';
	import * as THREE from 'three';
	import { productNodes } from '$lib/data/constellation.js';
	import { products } from '$lib/data/products.js';
	import { toggleNode, hoveredProduct, hoveredPath } from '$lib/stores/selectedNode.js';
	import { reducedMotion } from '$lib/stores/motion.js';

	const COMPANY_ACCENT = new THREE.Color('#ed0049');

	/** Base star radius — scales with weight */
	const BASE_RADIUS = 0.05;
	const WEIGHT_SCALE = 0.025;
	const INNER_SCALE = 0.5; // inner circle is 50% of full radius
	const RING_INNER_GAP = 0.03; // transparent gap between inner and ring
	const RING_THICKNESS = 0.012; // thin accent ring

	/**
	 * Build render data: each product gets an inner circle + outer ring,
	 * sized by weight, colored by product accent.
	 */
	let time = 0;
	const SHIMMER_SPEED = 0.8;

	const nodes = productNodes.map((pn, i) => {
		const product = products.find((p) => p.slug === pn.slug);
		const radius = BASE_RADIUS + pn.weight * WEIGHT_SCALE;
		const accent = product?.accentColor ? new THREE.Color(product.accentColor) : COMPANY_ACCENT;
		const ringMaterial = new THREE.MeshBasicMaterial({
			color: accent,
			transparent: true,
			opacity: 0.9,
			side: THREE.DoubleSide,
			fog: false
		});
		return {
			slug: pn.slug,
			position: pn.position,
			radius,
			accent,
			product,
			ringMaterial,
			phase: i * 0.7
		};
	});

	useTask((delta) => {
		time += delta;

		// Shimmer animation on rings
		if (!$reducedMotion) {
			const st = time * SHIMMER_SPEED;
			for (const node of nodes) {
				const breath = 0.4 + 0.5 * (0.5 + 0.5 * Math.sin(st + node.phase));
				node.ringMaterial.opacity = breath;
			}
		}

		// Hover-based line highlighting — brighten path, keep others normal
		const path = $hoveredPath;
		const hasHover = path.size > 0;
		for (const line of childLineData) {
			const isInPath = hasHover && path.has(line.parentSlug) && path.has(line.childSlug);
			const target = isInPath ? 1.0 : line.baseOpacity;
			line.material.opacity += (target - line.material.opacity) * Math.min(delta * 8, 1);
		}

		// Keep bridge lines at normal opacity
		const bridgeTarget = 0.24;
		bridgeLineMaterial.opacity += (bridgeTarget - bridgeLineMaterial.opacity) * Math.min(delta * 8, 1);
	});

	/**
	 * Collect parent→child line segments.
	 */
	const childLines = [];
	for (const product of products) {
		if (!product.children || product.children.length === 0) continue;
		const parentNode = productNodes.find((n) => n.slug === product.slug);
		if (!parentNode) continue;

		for (const childSlug of product.children) {
			const childNode = productNodes.find((n) => n.slug === childSlug);
			if (childNode) {
				const childProduct = products.find((p) => p.slug === childSlug);
				childLines.push({
					key: `${product.slug}-${childSlug}`,
					parentSlug: product.slug,
					childSlug,
					from: parentNode.position,
					to: childNode.position,
					color: childProduct?.accentColor || product.accentColor || '#ed0049'
				});
			}
		}
	}

	/**
	 * Collect bridge line segments.
	 */
	const bridgeLines = [];
	for (const product of products) {
		if (!product.bridges || product.bridges.length === 0) continue;
		const pNode = productNodes.find((n) => n.slug === product.slug);
		if (!pNode) continue;

		for (const bridgeSlug of product.bridges) {
			const bridgeNode = productNodes.find((n) => n.slug === bridgeSlug);
			if (bridgeNode) {
				bridgeLines.push({
					key: `${product.slug}-bridge-${bridgeSlug}`,
					from: pNode.position,
					to: bridgeNode.position
				});
			}
		}
	}

	/** Create line geometry from two points */
	function makeLineGeometry(from, to) {
		const geo = new THREE.BufferGeometry();
		geo.setAttribute(
			'position',
			new THREE.Float32BufferAttribute([...from, ...to], 3)
		);
		return geo;
	}

	const childLineData = childLines.map((l) => ({
		key: l.key,
		parentSlug: l.parentSlug,
		childSlug: l.childSlug,
		geometry: makeLineGeometry(l.from, l.to),
		material: new THREE.LineBasicMaterial({
			color: new THREE.Color(l.color),
			transparent: true,
			opacity: 0.4
		}),
		baseOpacity: 0.4
	}));

	const bridgeLineMaterial = new THREE.LineBasicMaterial({
		color: COMPANY_ACCENT,
		transparent: true,
		opacity: 0.24
	});

	const bridgeLineData = bridgeLines.map((l) => ({
		key: l.key,
		geometry: makeLineGeometry(l.from, l.to)
	}));
</script>

<!-- Product star nodes -->
{#each nodes as node (node.slug)}
	<!-- Click target (invisible, larger) -->
	<T.Mesh
		name={`product:${node.slug}`}
		position={node.position}
	>
		<T.SphereGeometry args={[Math.max(node.radius * 1.5, 0.1), 12, 12]} />
		<T.MeshBasicMaterial visible={false} />
	</T.Mesh>

	<!-- Inner circle: company accent (solid core) -->
	<T.Mesh position={node.position}>
		<T.SphereGeometry args={[node.radius * INNER_SCALE, 16, 16]} />
		<T.MeshBasicMaterial
			color={COMPANY_ACCENT}
			fog={false}
			depthWrite={false}
		/>
	</T.Mesh>

	<!-- Outer ring: product custom accent color (breathing shimmer) -->
	{@const ringInner = node.radius * INNER_SCALE + RING_INNER_GAP}
	{@const ringOuter = ringInner + RING_THICKNESS}
	<T.Mesh position={node.position} material={node.ringMaterial}>
		<T.RingGeometry args={[ringInner, ringOuter, 32]} />
	</T.Mesh>

	<!-- Glow halo in product accent -->
	<T.Mesh position={node.position}>
		<T.SphereGeometry args={[node.radius * 3, 16, 16]} />
		<T.MeshBasicMaterial
			color={node.accent}
			transparent
			opacity={0.04}
			depthWrite={false}
		/>
	</T.Mesh>

	<T.PointLight
		position={node.position}
		color={node.accent}
		intensity={0.4}
		distance={1.5}
		decay={2}
	/>
{/each}

<!-- Parent → Child connection lines (colored by product accent) -->
{#each childLineData as line (line.key)}
	<T.Line geometry={line.geometry} material={line.material} />
{/each}

<!-- Bridge connection lines -->
{#each bridgeLineData as line (line.key)}
	<T.Line geometry={line.geometry} material={bridgeLineMaterial} />
{/each}
