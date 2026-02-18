<script>
  import { team } from '$lib/data/team.js';
</script>

<div class="panel-inner">
  <section id="team" class="section-wrap">
    <div class="section section-wide">
      <h2 class="section-heading">Team</h2>
      <p class="section-sub">The people behind Natoken LLC.</p>
      <ul class="grid team-grid team-grid-center">
        {#each team as member}
          <li>
            <article class="team-card">
              <div class="team-image" aria-hidden="true">
                {#if member.image}
                  <img src={member.image} alt="" width="280" height="280" />
                {:else}
                  <span class="team-initial">{(member.nickname ?? member.name).charAt(0)}</span>
                {/if}
                <h3 class="team-nickname">{member.nickname ?? member.name}</h3>
              </div>
              <div class="team-text">
                {#if member.fullName}
                  <p class="team-fullname">{member.fullName}</p>
                {/if}
                <p class="team-title">{member.title}</p>
              </div>
            </article>
          </li>
        {/each}
      </ul>
    </div>
  </section>
  <footer class="panel-footer">
    <p class="footer-copy">© {new Date().getFullYear()} Natoken LLC</p>
  </footer>
</div>

<style>
  .panel-inner {
    padding: 0.4rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
    min-height: 100%;
    width: 100%;
    min-width: 0;
    overflow: hidden;
    box-sizing: border-box;
  }

  .panel-inner .section-wrap {
    width: 100%;
    min-width: 0;
    max-width: 100%;
  }

  .panel-inner .section-wrap:first-child {
    padding-top: 0.4rem;
  }

  .panel-inner .section-heading {
    margin-top: 0;
  }

  .panel-inner .section,
  .panel-inner .section-wide {
    max-width: 100% !important;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }

  .panel-footer {
    margin-top: auto;
    text-align: center;
    padding: 1.5rem 1rem;
    border-top: 1px solid var(--color-border);
    position: relative;
    z-index: 1;
  }

  .footer-copy {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }

  .team-grid-center {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 12px;
    max-width: 100%;
    width: 100%;
    min-width: 0;
  }

  .team-grid-center li {
    min-width: 0;
  }

  .team-grid-center .team-card {
    width: 240px;
    min-width: 240px;
    max-width: 240px;
    margin-left: auto;
    margin-right: auto;
  }

  .team-grid-center .team-image {
    width: 240px;
    min-width: 240px;
    max-width: 240px;
    height: 240px;
    min-height: 240px;
    max-height: 240px;
    aspect-ratio: 1 / 1;
  }
</style>
