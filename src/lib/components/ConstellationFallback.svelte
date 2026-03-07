<div class="fallback" aria-hidden="true">
	<div class="fallback-glow"></div>
	<div class="fallback-stars">
		{#each Array(80) as _, i}
			<div
				class="fallback-dot"
				style:left="{Math.random() * 100}%"
				style:top="{Math.random() * 100}%"
				style:width="{1 + Math.random() * 2}px"
				style:height="{1 + Math.random() * 2}px"
				style:opacity={0.15 + Math.random() * 0.5}
			></div>
		{/each}
	</div>
</div>

<style>
	.fallback {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		background: var(--color-bg);
		overflow: hidden;
	}

	.fallback-glow {
		position: absolute;
		bottom: -20%;
		left: -10%;
		right: -10%;
		height: 60%;
		background: radial-gradient(
			ellipse 80% 60% at 50% 100%,
			var(--color-accent-glow) 0%,
			var(--color-accent-subtle) 30%,
			transparent 70%
		);
	}

	.fallback-stars {
		position: absolute;
		inset: 0;
	}

	.fallback-dot {
		position: absolute;
		border-radius: 50%;
		background: var(--color-star);
	}
</style>
