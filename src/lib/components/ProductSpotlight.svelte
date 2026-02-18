<script>
  import { fly } from 'svelte/transition';

  /** @type {{ name: string; description: string; status: string; url?: string; image?: string }[]} */
  let { products = [], activeIndex = 0 } = $props();

  const product = $derived(products[activeIndex] ?? products[0]);
</script>

<aside class="spotlight" aria-label="Product spotlight">
  <div class="spotlight-slot">
    {#if product}
      {#key product.name}
        <div class="spotlight-inner" in:fly={{ y: -16, duration: 250 }} out:fly={{ y: 16, duration: 200 }}>
          <div class="spotlight-image" aria-hidden="true">
          {#if product.image}
            <img src={product.image} alt="" width="360" height="200" />
          {:else}
            <span class="spotlight-initial">{product.name.charAt(0)}</span>
          {/if}
        </div>
        <h3 class="spotlight-title">{product.name}</h3>
        <span
          class="badge"
          class:badge-live={product.status === 'live'}
          class:badge-wip={product.status === 'in-development'}
        >
          {product.status === 'live' ? 'Live' : 'In development'}
        </span>
        <p class="spotlight-desc">{product.description}</p>
        {#if product.url}
          <a href={product.url} target="_blank" rel="noopener noreferrer" class="spotlight-link">Visit →</a>
        {/if}
        </div>
      {/key}
    {/if}
  </div>
</aside>

<style>
  .spotlight {
    padding: 0;
    position: sticky;
    top: 0;
    align-self: start;
    max-height: 100vh;
    overflow-y: auto;
    width: 100%;
    min-width: 0;
  }

  .spotlight-slot {
    position: relative;
    min-height: 280px;
    width: 100%;
  }

  .spotlight-inner {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    box-sizing: border-box;
    background: transparent;
    padding: 1.25rem 0;
  }

  .spotlight-link:focus-visible {
    outline: 2px solid rgba(88, 166, 255, 0.5);
    outline-offset: 2px;
  }

  .spotlight-image {
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

  .spotlight-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
  }

  .spotlight-initial {
    font-size: 3rem;
    font-weight: 600;
    color: var(--color-accent);
    opacity: 0.6;
  }

  .spotlight-title {
    font-size: var(--text-lg);
    font-weight: 600;
    margin: 0 0 0.5rem;
    letter-spacing: -0.01em;
  }

  .spotlight-desc {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    line-height: var(--leading-relaxed);
    margin: 0.75rem 0 1rem;
  }

  .spotlight-link {
    font-size: var(--text-sm);
    font-weight: 500;
  }
</style>
