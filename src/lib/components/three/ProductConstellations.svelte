<script>
	import { T } from '@threlte/core';
	import * as THREE from 'three';
	import { productNodes } from '$lib/data/constellation.js';
	import { products } from '$lib/data/products.js';
	import { toggleNode } from '$lib/stores/selectedNode.js';

	const PRODUCT_COLOR = new THREE.Color('#e6edf3');
	const ACCENT_COLOR = new THREE.Color('#ed0049');

	/** Base star radius — scales with weight */
	const BASE_RADIUS = 0.04;
	const WEIGHT_SCALE = 0.03;

	/**
	 * Build render data: each product gets a star sized by weight,
	 * plus line segments to its children.
	 */
	const nodes = productNodes.map((pn) => {
		const product = products.find((p) => p.slug === pn.slug);
		const isRoot = product && product.parentCorner;
		const radius = BASE_RADIUS + pn.weight * WEIGHT_SCALE;
		return {
			slug: pn.slug,
			position: pn.position,
			radius,
			isRoot,
			product
		};
	});

	/**
	 * Collect parent→child line segments.
	 * These are the mini-constellation connections within product clusters.
	 */
	const childLines = [];
	for (const product of products) {
		if (!product.children || product.children.length === 0) continue;
		const parentNode = productNodes.find((n) => n.slug === product.slug);
		if (!parentNode) continue;

		for (const childSlug of product.children) {
			const childNode = productNodes.find((n) => n.slug === childSlug);
			if (childNode) {
				childLines.push({
					key: `${product.slug}-${childSlug}`,
					from: parentNode.position,
					to: childNode.position
				});
			}
		}
	}

	/**
	 * Collect bridge line segments (e.g. Arisce → Taledom, Arisce → RuneForge).
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

	const childLineGeos = childLines.map((l) => ({
		key: l.key,
		geometry: makeLineGeometry(l.from, l.to)
	}));

	const bridgeLineGeos = bridgeLines.map((l) => ({
		key: l.key,
		geometry: makeLineGeometry(l.from, l.to)
	}));

	const childLineMaterial = new THREE.LineBasicMaterial({
		color: PRODUCT_COLOR,
		transparent: true,
		opacity: 0.15
	});

	const bridgeLineMaterial = new THREE.LineBasicMaterial({
		color: ACCENT_COLOR,
		transparent: true,
		opacity: 0.08
	});
</script>

<!-- Product star nodes -->
{#each nodes as node (node.slug)}
	<!-- Click target -->
	<T.Mesh
		position={node.position}
		onclick={() => toggleNode('product', node.slug, node.product)}
	>
		<T.SphereGeometry args={[Math.max(node.radius * 2.5, 0.15), 12, 12]} />
		<T.MeshBasicMaterial visible={false} />
	</T.Mesh>

	<!-- Main star point -->
	<T.Mesh position={node.position}>
		<T.SphereGeometry args={[node.radius, 16, 16]} />
		<T.MeshBasicMaterial
			color={node.isRoot ? ACCENT_COLOR : PRODUCT_COLOR}
			transparent
			opacity={node.isRoot ? 0.85 : 0.7}
		/>
	</T.Mesh>

	<!-- Subtle glow for root products -->
	{#if node.isRoot}
		<T.Mesh position={node.position}>
			<T.SphereGeometry args={[node.radius * 3, 16, 16]} />
			<T.MeshBasicMaterial
				color={ACCENT_COLOR}
				transparent
				opacity={0.04}
			/>
		</T.Mesh>
		<T.PointLight
			position={node.position}
			color={ACCENT_COLOR}
			intensity={0.6}
			distance={2}
			decay={2}
		/>
	{:else}
		<T.PointLight
			position={node.position}
			color={PRODUCT_COLOR}
			intensity={0.2}
			distance={1}
			decay={2}
		/>
	{/if}
{/each}

<!-- Parent → Child connection lines (mini-constellation shapes) -->
{#each childLineGeos as line (line.key)}
	<T.Line geometry={line.geometry} material={childLineMaterial} />
{/each}

<!-- Bridge connection lines -->
{#each bridgeLineGeos as line (line.key)}
	<T.Line geometry={line.geometry} material={bridgeLineMaterial} />
{/each}
