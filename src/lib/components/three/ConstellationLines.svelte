<script>
	import { T, useThrelte, extend } from '@threlte/core';
	import { useTask } from '@threlte/core';
	import * as THREE from 'three';
	import { Line2 } from 'three/addons/lines/Line2.js';
	import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
	import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
	import { edges as graphEdges, corners, core, getProductNode } from '$lib/data/constellation.js';
	import { hoveredPath, hoveredCorner } from '$lib/stores/selectedNode.js';

	extend({ Line2 });

	const { size } = useThrelte();

	const ACCENT = '#ed0049';
	const DIM = '#e6edf3';
	const PULSE_SPEED = 0.8;
	const HEX_LINE_WIDTH = 2.5; // px — fat hex edges
	const THIN_LINE_WIDTH = 1.0; // px — other edges

	let time = 0;

	const COLOR_MAP = {
		hierarchy: ACCENT,
		product: ACCENT,
		team: DIM,
		bridge: ACCENT
	};

	function makeFatLineGeo(from, to) {
		const geo = new LineGeometry();
		geo.setPositions([...from, ...to]);
		return geo;
	}

	/**
	 * Check if an edge connects to a given position (by reference).
	 */
	function edgeTouches(edge, pos) {
		return edge.from === pos || edge.to === pos;
	}

	// Determine if edge is a hex outline (corner-to-corner)
	const cornerPositions = new Set(corners.map((c) => c.position));

	const lines = graphEdges.map((edge, i) => {
		const colorHex = COLOR_MAP[edge.type] || DIM;
		const isPulsing = edge.type === 'hierarchy' && edge.opacity > 0.1;
		const isHexEdge = edge.type === 'hierarchy' && cornerPositions.has(edge.from) && cornerPositions.has(edge.to);

		const mat = new LineMaterial({
			color: new THREE.Color(colorHex).getHex(),
			transparent: true,
			opacity: edge.opacity,
			linewidth: isHexEdge ? HEX_LINE_WIDTH : THIN_LINE_WIDTH,
			resolution: new THREE.Vector2(size.current.width, size.current.height),
			fog: false,
			depthWrite: false
		});

		return {
			id: `edge-${i}`,
			edge,
			geometry: makeFatLineGeo(edge.from, edge.to),
			material: mat,
			pulses: isPulsing,
			baseOpacity: edge.opacity,
			isHex: isHexEdge
		};
	});

	useTask((delta) => {
		time += delta * PULSE_SPEED;

		const hCorner = $hoveredCorner;
		const hPath = $hoveredPath;
		const hasHover = hPath.size > 0;

		let cornerPos = null;
		let rootProductPos = null;
		if (hCorner) {
			const c = corners.find((cn) => cn.id === hCorner);
			if (c) cornerPos = c.position;
			const rootSlug = [...hPath].pop();
			if (rootSlug) {
				const pn = getProductNode(rootSlug);
				if (pn) rootProductPos = pn.position;
			}
		}

		// Update resolution for LineMaterial
		const w = size.current.width;
		const h = size.current.height;

		const pulse = 0.7 + 0.3 * Math.sin(time);
		for (const line of lines) {
			const p = line.pulses ? pulse : 1;
			line.material.resolution.set(w, h);

			if (hasHover) {
				const isCornerToCore = cornerPos && edgeTouches(line.edge, cornerPos) && edgeTouches(line.edge, core.position);
				const isProductToCorner = cornerPos && rootProductPos && edgeTouches(line.edge, cornerPos) && edgeTouches(line.edge, rootProductPos);
				const isHighlighted = isCornerToCore || isProductToCorner;

				// Brighten highlighted edges, leave others at normal opacity
				const target = isHighlighted ? Math.min(line.baseOpacity * 3, 1.0) : line.baseOpacity;
				line.material.opacity += (target * p - line.material.opacity) * Math.min(delta * 8, 1);

				// Make highlighted edges thicker
				if (isHighlighted && !line.isHex) {
					line.material.linewidth += (THIN_LINE_WIDTH * 2 - line.material.linewidth) * Math.min(delta * 8, 1);
				}
			} else {
				line.material.opacity += (line.baseOpacity * p - line.material.opacity) * Math.min(delta * 8, 1);
				if (!line.isHex) {
					line.material.linewidth += (THIN_LINE_WIDTH - line.material.linewidth) * Math.min(delta * 8, 1);
				}
			}
		}
	});
</script>

{#each lines as line (line.id)}
	<T.Line2 geometry={line.geometry} material={line.material} />
{/each}
