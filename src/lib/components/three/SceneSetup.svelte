<script>
	import { useThrelte } from '@threlte/core';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { toggleNode, clearSelection, hoveredProduct } from '$lib/stores/selectedNode.js';
	import { productNodes, teamNodes, corners, core } from '$lib/data/constellation.js';
	import { products } from '$lib/data/products.js';
	import { team } from '$lib/data/team.js';

	const { camera, scene } = useThrelte();
	const raycaster = new THREE.Raycaster();
	const pointer = new THREE.Vector2();

	const DEFAULT_Z = 7.5;

	/**
	 * Build a flat list of all interactive nodes with their hit radii.
	 * Stores each node's actual z position for accurate ray projection.
	 */
	const allNodes = [];

	for (const pn of productNodes) {
		const product = products.find((p) => p.slug === pn.slug);
		if (product) {
			allNodes.push({
				type: 'product', id: pn.slug, data: product,
				x: pn.position[0], y: pn.position[1], z: pn.position[2],
				hitRadius: 0.15, priority: 1
			});
		}
	}

	for (const tn of teamNodes) {
		const member = team.find((m) => m.slug === tn.slug);
		if (member) {
			allNodes.push({
				type: 'team', id: tn.slug, data: member,
				x: tn.position[0], y: tn.position[1], z: tn.position[2],
				hitRadius: 0.14, priority: 1
			});
		}
	}

	for (const c of corners) {
		allNodes.push({
			type: 'corner', id: c.id, data: c,
			x: c.position[0], y: c.position[1], z: c.position[2],
			hitRadius: c.filled ? 0.18 : 0.12, priority: 2
		});
	}

	allNodes.push({
		type: 'core', id: 'natoken', data: { label: core.label },
		x: core.position[0], y: core.position[1], z: core.position[2],
		hitRadius: 0.5, priority: 3
	});

	/**
	 * Find closest node by projecting the ray to each node's actual z-level.
	 * This handles nodes at varying depths (products at z=-0.3 to z=-0.6).
	 * Hit radii scale with camera distance for consistent screen-space feel.
	 */
	function findNodeAlongRay(ray, camZ) {
		const scale = camZ / DEFAULT_Z;

		let best = null;
		let bestDist = Infinity;

		for (const node of allNodes) {
			// Find where the ray passes through this node's z-level
			if (ray.direction.z === 0) continue;
			const t = (node.z - ray.origin.z) / ray.direction.z;
			if (t < 0) continue; // behind camera

			const rx = ray.origin.x + ray.direction.x * t;
			const ry = ray.origin.y + ray.direction.y * t;

			const dx = rx - node.x, dy = ry - node.y;
			const d = Math.sqrt(dx * dx + dy * dy);
			const threshold = node.hitRadius * scale;

			if (d < threshold) {
				const weighted = d + node.priority * 0.01;
				if (weighted < bestDist) {
					best = node;
					bestDist = weighted;
				}
			}
		}

		return best;
	}

	onMount(() => {
		const getPointer = (/** @type {MouseEvent} */ e) => {
			pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
			pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
		};

		const handleClick = (/** @type {MouseEvent} */ e) => {
			if (/** @type {HTMLElement} */ (e.target).closest('.info-panel, .mobile-nav')) return;

			const cam = camera.current;
			if (!cam) return;

			getPointer(e);
			raycaster.setFromCamera(pointer, cam);
			const node = findNodeAlongRay(raycaster.ray, cam.position.z);

			if (node) {
				toggleNode(node.type, node.id, node.data);
			} else {
				clearSelection();
			}
		};

		let lastHovered = null;
		let lastFoundAny = false;
		const handleMove = (/** @type {MouseEvent} */ e) => {
			const cam = camera.current;
			if (!cam) return;

			getPointer(e);
			raycaster.setFromCamera(pointer, cam);
			const node = findNodeAlongRay(raycaster.ray, cam.position.z);

			const foundProduct = node?.type === 'product' ? node.id : null;
			const foundAny = node !== null;

			if (foundProduct !== lastHovered) {
				lastHovered = foundProduct;
				hoveredProduct.set(foundProduct);
			}

			if (foundAny !== lastFoundAny) {
				lastFoundAny = foundAny;
				document.body.style.cursor = foundAny ? 'pointer' : 'default';
			}
		};

		window.addEventListener('click', handleClick);
		window.addEventListener('pointermove', handleMove);

		return () => {
			window.removeEventListener('click', handleClick);
			window.removeEventListener('pointermove', handleMove);
			document.body.style.cursor = 'default';
		};
	});
</script>
