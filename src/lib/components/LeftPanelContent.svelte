<script>
  let emailCopied = $state(false);

  function copyEmail() {
    navigator.clipboard?.writeText('Admin@natoken.dev').then(() => {
      emailCopied = true;
      setTimeout(() => (emailCopied = false), 1500);
    });
  }
</script>

<div class="panel-inner">
  <section id="about" class="section-wrap">
    <div class="section">
      <div class="about-block glass">
        <h2 class="section-heading">About</h2>
        <p class="section-sub">We build products and websites that make a difference.</p>
        <p class="about-text">
          Natoken LLC develops and maintains software across the web. From live products to
          projects in development, we bring ideas to life. Get in touch to learn more or collaborate.
        </p>
      </div>
    </div>
  </section>

  <section id="contact" class="section-wrap">
    <div class="section">
      <div class="contact-block glass">
        <h2 class="section-heading">Contact</h2>
        <p class="section-sub">Reach out for inquiries or collaboration.</p>
        <div class="contact-items">
          <div class="contact-item">
            <span class="contact-label">Email</span>
            <a href="mailto:Admin@natoken.dev" class="contact-value">Admin@natoken.dev</a>
            <button
              type="button"
              class="contact-copy"
              onclick={copyEmail}
              title={emailCopied ? 'Copied!' : 'Copy email'}
              aria-label={emailCopied ? 'Copied!' : 'Copy email address'}
            >
              {#if emailCopied}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span class="contact-copy-tooltip">Copied!</span>
              {:else}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              {/if}
            </button>
          </div>
          <div class="contact-item">
            <span class="contact-label">Address</span>
            <p class="contact-value contact-address">
              5900 Balcones Drive, Suite 100<br />
              Austin, Texas 78731<br />
              USA
            </p>
          </div>
        </div>
      </div>
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

  .panel-inner .section-wrap {
    padding: 0.6rem 0;
  }

  @media (max-width: 959px) {
    .panel-inner .glass {
      background: var(--color-surface);
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
    }
  }
</style>
