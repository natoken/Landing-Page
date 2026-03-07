<script>
	import { selectedNode, clearSelection } from '$lib/stores/selectedNode.js';
	import { reducedMotion } from '$lib/stores/motion.js';

	let emailCopied = $state(false);

	function copyEmail() {
		navigator.clipboard?.writeText('Admin@natoken.dev').then(() => {
			emailCopied = true;
			setTimeout(() => (emailCopied = false), 1500);
		});
	}

	let node = $derived($selectedNode);
</script>

{#if node}
	<!-- Backdrop — click outside to close -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="panel-backdrop"
		class:no-motion={$reducedMotion}
		onclick={clearSelection}
		onkeydown={(e) => { if (e.key === 'Escape') clearSelection(); }}
	></div>

	<div
		class="info-panel"
		class:no-motion={$reducedMotion}
		role="dialog"
		aria-label={node.type === 'core' ? 'About Natoken' : node.data?.name || node.data?.nickname || node.id}
	>
		<button class="panel-close" onclick={clearSelection} aria-label="Close panel">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
			</svg>
		</button>

		<div class="panel-content">
			{#if node.type === 'core'}
				<!-- About Natoken -->
				<h2 class="panel-title">Natoken</h2>
				<p class="panel-subtitle">Building software that matters.</p>
				<p class="panel-text">
					Natoken LLC develops and maintains software across the web. From live products to
					projects in development, we bring ideas to life.
				</p>

				<div class="contact-section">
					<h3 class="contact-heading">Contact</h3>
					<div class="contact-row">
						<span class="contact-label">Email</span>
						<a href="mailto:Admin@natoken.dev" class="contact-value">Admin@natoken.dev</a>
						<button
							type="button"
							class="copy-btn"
							onclick={copyEmail}
							aria-label={emailCopied ? 'Copied!' : 'Copy email'}
						>
							{emailCopied ? '✓' : '⎘'}
						</button>
					</div>
					<div class="contact-row">
						<span class="contact-label">Address</span>
						<span class="contact-value">
							5900 Balcones Drive, Suite 100<br />Austin, TX 78731, USA
						</span>
					</div>
				</div>

			{:else if node.type === 'corner'}
				<!-- Corner node -->
				<h2 class="panel-title">{node.data.label || 'Open Position'}</h2>
				{#if node.data.filled}
					<p class="panel-text">Leadership corner of the Natoken constellation.</p>
				{:else}
					<p class="panel-text panel-muted">This corner is open — room for future leadership.</p>
				{/if}

			{:else if node.type === 'team'}
				<!-- Team member -->
				<div class="team-header">
					{#if node.data.image}
						<img
							src="/{node.data.image}"
							alt={node.data.nickname}
							class="team-photo"
							width="64"
							height="64"
						/>
					{:else}
						<div class="team-initial">{node.data.nickname.charAt(0)}</div>
					{/if}
					<div>
						<h2 class="panel-title">{node.data.nickname}</h2>
						{#if node.data.fullName}
							<p class="panel-subtitle">{node.data.fullName}</p>
						{/if}
					</div>
				</div>
				<p class="team-role">{node.data.title}</p>

			{:else if node.type === 'product'}
				<!-- Product -->
				{#if node.data.image}
					<img
						src="/{node.data.image}"
						alt={node.data.name}
						class="product-image"
						width="280"
						height="160"
					/>
				{/if}
				<h2 class="panel-title">{node.data.name}</h2>
				<span
					class="status-badge"
					class:live={node.data.status === 'live'}
					class:dev={node.data.status === 'in-development'}
					class:soon={node.data.status === 'coming-soon'}
				>
					{node.data.status === 'live' ? 'Live' : node.data.status === 'in-development' ? 'In Development' : 'Coming Soon'}
				</span>
				<p class="panel-text">{node.data.description}</p>
				{#if node.data.mascot}
					<p class="panel-meta">Mascot: {node.data.mascot.name}</p>
				{/if}
				{#if node.data.url}
					<a
						href={node.data.url}
						target="_blank"
						rel="noopener noreferrer"
						class="visit-link"
					>Visit →</a>
				{/if}
			{/if}
		</div>
	</div>
{/if}

<style>
	.panel-backdrop {
		position: fixed;
		inset: 0;
		z-index: 90;
		background: rgba(0, 0, 0, 0.3);
		animation: fadeIn 0.2s ease-out;
	}

	.panel-backdrop.no-motion {
		animation: none;
	}

	.info-panel {
		position: fixed;
		z-index: 100;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: min(420px, calc(100vw - 32px));
		max-height: calc(100vh - 80px);
		overflow-y: auto;
		border-radius: 16px;
		background: rgba(13, 17, 23, 0.85);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow:
			0 0 0 1px rgba(237, 0, 73, 0.08),
			0 8px 32px rgba(0, 0, 0, 0.5),
			0 0 80px rgba(237, 0, 73, 0.06);
		animation: panelIn 0.25s ease-out;
		scrollbar-width: thin;
		scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
	}

	.info-panel.no-motion {
		animation: none;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes panelIn {
		from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
		to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
	}

	.panel-close {
		position: absolute;
		top: 12px;
		right: 12px;
		background: none;
		border: none;
		color: rgba(255, 255, 255, 0.5);
		cursor: pointer;
		padding: 4px;
		border-radius: 6px;
		transition: color 0.15s, background 0.15s;
	}

	.panel-close:hover {
		color: #fff;
		background: rgba(255, 255, 255, 0.08);
	}

	.panel-content {
		padding: 24px;
	}

	.panel-title {
		margin: 0;
		font-family: var(--font-sans);
		font-size: 1.25rem;
		font-weight: 700;
		color: #fff;
		letter-spacing: -0.02em;
	}

	.panel-subtitle {
		margin: 2px 0 0;
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}

	.panel-text {
		margin: 12px 0 0;
		font-size: 0.875rem;
		line-height: 1.6;
		color: var(--color-text);
	}

	.panel-muted {
		color: var(--color-text-muted);
		font-style: italic;
	}

	.panel-meta {
		margin: 8px 0 0;
		font-size: 0.8125rem;
		color: var(--color-text-muted);
	}

	/* Contact */
	.contact-section {
		margin-top: 20px;
		padding-top: 16px;
		border-top: 1px solid rgba(255, 255, 255, 0.06);
	}

	.contact-heading {
		margin: 0 0 12px;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.contact-row {
		display: flex;
		align-items: baseline;
		gap: 8px;
		margin-bottom: 10px;
		font-size: 0.8125rem;
	}

	.contact-label {
		color: var(--color-text-muted);
		min-width: 52px;
		flex-shrink: 0;
	}

	.contact-value {
		color: var(--color-text);
	}

	a.contact-value {
		color: var(--color-accent);
		text-decoration: none;
	}

	a.contact-value:hover {
		text-decoration: underline;
	}

	.copy-btn {
		background: none;
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: var(--color-text-muted);
		cursor: pointer;
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 0.75rem;
		transition: color 0.15s, border-color 0.15s;
	}

	.copy-btn:hover {
		color: #fff;
		border-color: rgba(255, 255, 255, 0.2);
	}

	/* Team */
	.team-header {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.team-photo {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid rgba(237, 0, 73, 0.3);
	}

	.team-initial {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: rgba(237, 0, 73, 0.15);
		color: var(--color-accent);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.25rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	.team-role {
		margin: 12px 0 0;
		font-size: 0.875rem;
		color: var(--color-accent);
		font-weight: 500;
	}

	/* Product */
	.product-image {
		width: 100%;
		height: auto;
		border-radius: 8px;
		margin-bottom: 14px;
		object-fit: cover;
	}

	.status-badge {
		display: inline-block;
		margin-top: 8px;
		padding: 2px 8px;
		font-size: 0.6875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		border-radius: 4px;
		background: rgba(255, 255, 255, 0.06);
		color: var(--color-text-muted);
	}

	.status-badge.live {
		background: rgba(46, 160, 67, 0.15);
		color: #3fb950;
	}

	.status-badge.dev {
		background: rgba(237, 0, 73, 0.12);
		color: var(--color-accent);
	}

	.status-badge.soon {
		background: rgba(201, 209, 217, 0.08);
		color: var(--color-text-muted);
	}

	.visit-link {
		display: inline-block;
		margin-top: 14px;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-accent);
		text-decoration: none;
		transition: opacity 0.15s;
	}

	.visit-link:hover {
		opacity: 0.8;
	}
</style>
