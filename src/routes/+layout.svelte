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
  <div class="layout-top">
    <div class="site-brand">
      <div class="site-brand-logo" aria-hidden="true">
        <NatokenLogo />
      </div>
      <h1 class="site-brand-title">NATOKEN</h1>
      <p class="site-brand-slogan">Building software that matters.</p>
    </div>
  </div>

  {@render children()}

  <footer class="site-footer">
    <p>© {new Date().getFullYear()} Natoken LLC</p>
  </footer>
</div>

<NodeInfoPanel />
<MobileNavBar />

<style>
  .layout {
    position: relative;
    z-index: 1;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 0.35rem;
  }

  .layout-top {
    flex-shrink: 0;
    pointer-events: none;
  }

  .site-brand {
    position: relative;
    text-align: center;
    padding: 0.25rem 0;
  }

  .site-brand-title {
    position: relative;
    z-index: 1;
    margin: 0;
    font-family: var(--font-sans);
    font-size: clamp(2.5rem, 11vw, 4.25rem);
    font-weight: 900;
    letter-spacing: -0.04em;
    line-height: 1;
    text-transform: uppercase;
    color: #fff;
  }

  .site-brand-slogan {
    position: relative;
    z-index: 1;
    margin: 0.1rem 0 0;
    font-size: var(--text-base);
    font-weight: 500;
    color: var(--color-text);
    opacity: 0.95;
  }

  .site-brand-logo {
    position: absolute;
    left: 50%;
    top: calc(50% + 48px);
    transform: translate(-50%, -50%);
    width: 300px;
    height: 300px;
    z-index: 0;
    pointer-events: none;
    color: var(--color-accent);
  }

  .site-footer {
    position: fixed;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    pointer-events: none;
    text-align: center;
  }

  .site-footer p {
    margin: 0;
    font-size: 0.75rem;
    color: var(--color-text-muted);
    opacity: 0.5;
  }
</style>
