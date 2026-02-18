<script>
  import '../app.css';
  import { base } from '$app/paths';
  import { tick } from 'svelte';
  import ProductDrawer from '$lib/components/ProductDrawer.svelte';
  import ParticleRenderer from '$lib/components/ParticleRenderer.svelte';
  import LeftPanelContent from '$lib/components/LeftPanelContent.svelte';
  import CenterPanelContent from '$lib/components/CenterPanelContent.svelte';
  import RightPanelContent from '$lib/components/RightPanelContent.svelte';
  import NatokenLogo from '$lib/components/NatokenLogo.svelte';
  import { products } from '$lib/data/products.js';
  import { activeProductIndex } from '$lib/stores/spotlight.js';
  import { activeMobilePanel } from '$lib/stores/mobilePanel.js';

  let { children } = $props();

  $effect(() => {
    $activeMobilePanel;
    tick().then(() => {
      document.querySelectorAll('.panel-scroll').forEach((el) => {
        el.scrollTop = 0;
      });
    });
  });
</script>

<svelte:head>
  {#if base}
    <base href="{base}/" />
  {/if}
</svelte:head>

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

  <!-- Mobile: header with panel switcher -->
  <header class="mobile-header" aria-label="Panel navigation">
    <button
      type="button"
      class="mobile-tab"
      class:active={$activeMobilePanel === 'left'}
      onclick={() => activeMobilePanel.set('left')}
      aria-label="Open left panel"
      aria-pressed={$activeMobilePanel === 'left'}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 16v-4M12 8h.01"/>
      </svg>
      <span>About</span>
    </button>
    <button
      type="button"
      class="mobile-tab"
      class:active={$activeMobilePanel === 'center'}
      onclick={() => activeMobilePanel.set('center')}
      aria-label="Open middle panel"
      aria-pressed={$activeMobilePanel === 'center'}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
      <span>Team</span>
    </button>
    <button
      type="button"
      class="mobile-tab"
      class:active={$activeMobilePanel === 'right'}
      onclick={() => activeMobilePanel.set('right')}
      aria-label="Open right panel"
      aria-pressed={$activeMobilePanel === 'right'}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
      <span>Products</span>
    </button>
  </header>

  <div class="layout-grid">
    <!-- Left panel -->
    <div class="panel panel-left" class:visible={$activeMobilePanel === 'left'}>
      <div class="panel-scroll">
        <LeftPanelContent />
      </div>
    </div>

    <!-- Center column (hidden on mobile when not active) -->
    <div class="center-column" class:visible={$activeMobilePanel === 'center'}>
      <div class="panel panel-center" class:visible={$activeMobilePanel === 'center'}>
        <div class="panel-scroll">
          <CenterPanelContent />
        </div>
        <div class="particles-desktop">
          <ParticleRenderer />
        </div>
      </div>
    </div>

    <!-- Right panel (hidden on mobile when not active) -->
    <div class="panel panel-right" class:visible={$activeMobilePanel === 'right'}>
      <div class="panel-scroll">
        <RightPanelContent />
      </div>
    </div>
  </div>

  <!-- Mobile: single ParticleRenderer at bottom (all panels) -->
  <div class="particles-mobile">
    <ParticleRenderer />
  </div>

  <ProductDrawer products={products} activeIndex={$activeProductIndex} />
  {@render children()}
</div>

<style>
  .layout {
    height: 100vh;
    padding: 12px;
    padding-top: 0;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  .layout-top {
    flex-shrink: 0;
    padding-top: 0.35rem;
    margin-bottom: 0.25rem;
    display: flex;
    justify-content: center;
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

  .mobile-header {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    margin-bottom: 0.5rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 9999px;
    box-shadow: 0 1px 0 var(--color-border);
  }

  .mobile-tab {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 1rem;
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text-muted);
    background: transparent;
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    transition: color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  }

  .mobile-tab:hover {
    color: var(--color-text);
    background: rgba(255, 255, 255, 0.06);
  }

  .mobile-tab.active {
    color: #fff;
    background: var(--color-accent);
    box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.4);
  }

  .layout-grid {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .center-column {
    position: relative;
    display: none;
    flex-direction: column;
    flex: 1;
    min-height: 0;
  }

  .center-column.visible {
    display: flex;
  }

  .panel-center {
    z-index: 1;
  }

  .panel {
    display: none;
    flex: 1;
    min-height: 0;
    flex-direction: column;
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 0 0 1px var(--color-border);
    background: var(--color-bg);
    background-image: linear-gradient(
      135deg,
      rgba(88, 166, 255, 0.08) 0%,
      rgba(88, 166, 255, 0.03) 25%,
      transparent 50%,
      transparent 75%,
      rgba(88, 166, 255, 0.04) 100%
    );
  }

  @media (max-width: 959px) {
    .panel-left {
      background: var(--color-bg);
      background-image: none;
    }
  }

  .panel.visible {
    display: flex;
  }

  .panel-scroll {
    flex: 1;
    min-height: 0;
    min-width: 0;
    overflow-y: auto;
    overflow-x: hidden;
    scroll-behavior: smooth;
    scrollbar-width: thin;
    scrollbar-color: var(--color-border-strong) transparent;
  }

  .panel-scroll::-webkit-scrollbar {
    width: 2px;
  }

  .panel-scroll::-webkit-scrollbar:vertical {
    width: 2px;
  }

  .panel-scroll::-webkit-scrollbar:horizontal {
    height: 2px;
  }

  .panel-scroll::-webkit-scrollbar-track,
  .panel-scroll::-webkit-scrollbar-corner {
    background: transparent !important;
  }

  .panel-scroll::-webkit-scrollbar-thumb {
    background: var(--color-border-strong);
    border-radius: 2px;
  }

  .panel-scroll::-webkit-scrollbar-thumb:hover {
    background: var(--color-text-muted);
  }

  .panel-scroll::-webkit-scrollbar-button {
    display: none !important;
    height: 0 !important;
    width: 0 !important;
    background: transparent !important;
  }

  .particles-desktop {
    display: none;
  }

  .particles-mobile {
    display: block;
    position: fixed;
    bottom: 12px;
    left: 12px;
    right: 12px;
    height: max(32vh, 140px);
    pointer-events: none;
    z-index: 0;
  }

  .particles-mobile :global(.particles-container) {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
  }

  @media (min-width: 960px) {
    .mobile-header {
      display: none;
    }

    .layout-grid {
      display: grid;
      grid-template-columns: min(280px, 28vw) 1fr min(320px, 30vw);
      gap: 12px;
    }

    .center-column {
      display: flex !important;
      grid-column: 2;
      min-width: 0;
    }

    .panel {
      display: flex !important;
    }

    .particles-desktop {
      display: block;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: max(32vh, 140px);
      z-index: 0;
      pointer-events: none;
    }

    .particles-desktop :global(.particles-container) {
      position: absolute;
      inset: 0;
      height: 100%;
      margin-bottom: 0;
    }

    .particles-mobile {
      display: none;
    }
  }
</style>
