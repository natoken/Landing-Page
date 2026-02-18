<script>
  import { base } from '$app/paths';
  import { fly, fade } from 'svelte/transition';
  import { mobileProductDrawerOpen } from '$lib/stores/mobileDrawer.js';

  /** @type {{ name: string; description: string; status: string; url?: string; image?: string }[]} */
  let { products = [], activeIndex = 0 } = $props();

  const product = $derived(products[activeIndex] ?? products[0]);

  let touchStartY = 0;

  function close() {
    mobileProductDrawerOpen.set(false);
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) close();
  }

  function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
  }

  function handleTouchEnd(e) {
    const touchEndY = e.changedTouches[0].clientY;
    const delta = touchEndY - touchStartY;
    if (delta > 60) close();
  }
</script>

{#if $mobileProductDrawerOpen}
  <div
    class="drawer-backdrop"
    onclick={handleBackdropClick}
    role="button"
    tabindex="-1"
    onkeydown={(e) => e.key === 'Escape' && close()}
    aria-label="Close product view"
    in:fade={{ duration: 200 }}
    out:fade={{ duration: 180 }}
  >
    <div
      class="drawer-panel"
      role="dialog"
      aria-modal="true"
      aria-label="Product details"
      tabindex="0"
      ontouchstart={handleTouchStart}
      ontouchend={handleTouchEnd}
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.key === 'Escape' && close()}
      in:fly={{ y: '100%', duration: 300 }}
      out:fly={{ y: '100%', duration: 220 }}
    >
      <div class="drawer-handle" aria-hidden="true"></div>
      <div class="drawer-content">
        {#if product}
          <div class="drawer-image" aria-hidden="true">
            {#if product.image}
              <img src={base ? `${base}/${product.image}` : `/${product.image}`} alt="" width="360" height="200" />
            {:else}
              <span class="drawer-initial">{product.name.charAt(0)}</span>
            {/if}
          </div>
          <h3 class="drawer-title">{product.name}</h3>
          <span
            class="badge"
            class:badge-live={product.status === 'live'}
            class:badge-wip={product.status === 'in-development'}
          >
            {product.status === 'live' ? 'Live' : 'In development'}
          </span>
          <p class="drawer-desc">{product.description}</p>
          {#if product.url}
            <a href={product.url} target="_blank" rel="noopener noreferrer" class="drawer-link">Visit →</a>
          {/if}
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .drawer-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0 0 0 0;
  }

  .drawer-panel {
    background: var(--color-bg);
    border-radius: 12px 12px 0 0;
    max-height: 85vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.3);
  }

  .drawer-handle {
    flex-shrink: 0;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 8px;
  }

  .drawer-handle::before {
    content: '';
    width: 40px;
    height: 4px;
    background: var(--color-border-strong);
    border-radius: 2px;
  }

  .drawer-content {
    padding: 0 1.25rem 2rem;
    padding-top: 0.5rem;
  }

  .drawer-image {
    aspect-ratio: 16 / 9;
    width: 100%;
    background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-bg-soft) 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    margin-bottom: 1rem;
  }

  .drawer-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
  }

  .drawer-initial {
    font-size: 3rem;
    font-weight: 600;
    color: var(--color-accent);
    opacity: 0.6;
  }

  .drawer-title {
    font-size: var(--text-lg);
    font-weight: 600;
    margin: 0 0 0.5rem;
    letter-spacing: -0.01em;
  }

  .drawer-desc {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    line-height: var(--leading-relaxed);
    margin: 0.75rem 0 1rem;
  }

  .drawer-link {
    font-size: var(--text-sm);
    font-weight: 500;
  }

  .drawer-link:focus-visible {
    outline: 2px solid rgba(88, 166, 255, 0.5);
    outline-offset: 2px;
  }

  @media (min-width: 960px) {
    .drawer-backdrop {
      display: none;
    }
  }
</style>
