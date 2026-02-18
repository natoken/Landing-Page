<script>
  import { onMount } from 'svelte';

  let progress = $state(0);

  onMount(() => {
    const windowEl = document.querySelector('.window');
    if (!windowEl) return;

    function update() {
      const { scrollTop, scrollHeight, clientHeight } = windowEl;
      const max = scrollHeight - clientHeight;
      progress = max > 0 ? (scrollTop / max) * 100 : 0;
    }

    update();
    windowEl.addEventListener('scroll', update);
    return () => windowEl.removeEventListener('scroll', update);
  });
</script>

<div class="scroll-progress" role="presentation" aria-hidden="true">
  <div class="scroll-progress-bar" style="width: {progress}%"></div>
</div>

<style>
  .scroll-progress {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--color-border);
    z-index: 1;
    flex-shrink: 0;
  }

  .scroll-progress-bar {
    height: 100%;
    background: var(--color-accent);
    opacity: 0.8;
    transition: width 0.1s ease-out;
  }
</style>
