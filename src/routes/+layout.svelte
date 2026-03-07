<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import NatokenLogo from '$lib/components/NatokenLogo.svelte';
  import NodeInfoPanel from '$lib/components/NodeInfoPanel.svelte';
  import MobileNavBar from '$lib/components/MobileNavBar.svelte';

  let { children } = $props();

  let ConstellationScene = $state(null);

  onMount(() => {
    import('$lib/components/three/ConstellationScene.svelte').then((mod) => {
      ConstellationScene = mod.default;
    });
  });

</script>

{#if ConstellationScene}
  <ConstellationScene />
{/if}

<div class="layout">
  <header class="site-header">
    <div class="site-brand">
      <div class="site-brand-logo" aria-hidden="true">
        <NatokenLogo />
      </div>
      <span class="site-brand-name">NATOKEN</span>
    </div>
  </header>

  {@render children()}

  <footer class="site-footer">
    <p class="site-footer-slogan">Building software that matters.</p>
    <p class="site-footer-copy">© {new Date().getFullYear()} Natoken LLC</p>
  </footer>
</div>

<NodeInfoPanel />
<MobileNavBar />

<style>
  .layout {
    position: relative;
    z-index: 1;
    pointer-events: none;
  }

  .site-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    padding: 16px 20px;
    pointer-events: none;
  }

  .site-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .site-brand-logo {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    color: var(--color-accent);
    opacity: 0.85;
  }

  .site-brand-name {
    font-family: var(--font-sans);
    font-size: 0.875rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #fff;
    opacity: 0.7;
  }

  .site-footer {
    position: fixed;
    bottom: 14px;
    left: 20px;
    z-index: 1;
    pointer-events: none;
  }

  .site-footer-slogan {
    margin: 0 0 2px;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-text-muted);
    opacity: 0.45;
  }

  .site-footer-copy {
    margin: 0;
    font-size: 0.6875rem;
    color: var(--color-text-muted);
    opacity: 0.35;
  }
</style>
