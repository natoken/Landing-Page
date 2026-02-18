<script>
  import { onMount } from 'svelte';
  import { currentAnnouncement } from '$lib/data/announcements.js';

  const STORAGE_KEY = 'natoken-announcement-dismissed';

  let visible = $state(true);

  function dismiss() {
    visible = false;
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, '1');
    }
  }

  onMount(() => {
    if (currentAnnouncement?.dismissible && sessionStorage.getItem(STORAGE_KEY) === '1') {
      visible = false;
    }
  });
</script>

{#if currentAnnouncement && visible}
  <div class="announcement-bar" role="region" aria-label="Announcement">
    <div class="announcement-inner">
      <span class="announcement-text">
        {#if currentAnnouncement.href}
          <a href={currentAnnouncement.href} class="announcement-link">{currentAnnouncement.text}</a>
        {:else}
          {currentAnnouncement.text}
        {/if}
      </span>
      {#if currentAnnouncement.dismissible}
        <button
          type="button"
          class="announcement-dismiss"
          onclick={dismiss}
          aria-label="Dismiss announcement"
        >
          ×
        </button>
      {/if}
    </div>
  </div>
{/if}

<style>
  .announcement-bar {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-shrink: 0;
    padding: 0.5rem 1.25rem;
  }

  .announcement-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.4rem 1.25rem;
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
    border-radius: 9999px;
    max-width: var(--content-max);
  }

  .announcement-text {
    font-size: var(--text-sm);
    font-weight: 700;
    color: var(--color-text);
    text-align: center;
  }

  .announcement-link {
    color: var(--color-accent);
    font-weight: 500;
  }

  .announcement-link:hover {
    text-decoration: underline;
  }

  .announcement-dismiss {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
    transition: color 0.15s ease, background 0.15s ease;
  }

  .announcement-dismiss:hover {
    color: var(--color-text);
    background: rgba(255, 255, 255, 0.06);
  }

  .announcement-dismiss:focus-visible {
    outline: 1px solid var(--color-accent);
    outline-offset: 2px;
  }
</style>
