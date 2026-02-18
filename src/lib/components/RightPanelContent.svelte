<script>
  import { base } from '$app/paths';
  import { products } from '$lib/data/products.js';
  import { activeProductIndex } from '$lib/stores/spotlight.js';
  import { mobileProductDrawerOpen } from '$lib/stores/mobileDrawer.js';
</script>

<div class="panel-inner">
  <section id="products" class="section-wrap products-section">
    <div class="section section-wide">
      <h2 class="section-heading">Products & Websites</h2>
      <p class="section-sub">Live and in development.</p>
      <ul class="grid">
        {#each products as product, i}
          <li data-product-index={i}>
            <div
              class="card product-card"
              role="button"
              tabindex="0"
              onclick={() => {
                activeProductIndex.set(i);
                mobileProductDrawerOpen.set(true);
              }}
              onkeydown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  activeProductIndex.set(i);
                  mobileProductDrawerOpen.set(true);
                }
              }}
            >
              <div class="product-image" aria-hidden="true">
                {#if product.image}
                  <img src={base ? `${base}/${product.image}` : `/${product.image}`} alt="" width="280" height="160" />
                {:else}
                  <span class="product-initial">{product.name.charAt(0)}</span>
                {/if}
              </div>
              <div class="product-card-body">
                <h3 class="card-title">{product.name}</h3>
                <span
                  class="badge badge-product"
                  class:badge-live={product.status === 'live'}
                  class:badge-wip={product.status === 'in-development'}
                >
                  {product.status === 'live' ? 'Live' : 'In development'}
                </span>
                <p class="card-desc">{product.description}</p>
                {#if product.url}
                  <a href={product.url} target="_blank" rel="noopener noreferrer" class="card-link" onclick={(e) => e.stopPropagation()}
                    >Visit →</a
                  >
                {/if}
              </div>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  </section>
</div>

<style>
  .panel-inner {
    padding: 0.4rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100%;
  }

  .panel-inner .section-wrap:first-child {
    padding-top: 0.4rem;
  }

  .panel-inner .section-heading {
    margin-top: 0;
  }

  .products-section {
    flex: 1;
  }

  .badge-product {
    font-size: 0.625rem;
    padding: 0.1rem 0.35rem;
    margin-top: 0.25rem;
    display: block;
    width: fit-content;
  }
</style>
