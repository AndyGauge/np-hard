<script>
  import { base } from '$app/paths';
  import { flat, flag, countryName, countryCodes } from '$lib/outline.js';
  import { TITLE } from '$lib/config.js';

  // Group sections by country.  Pages with multiple countries appear under each.
  const byCountry = new Map();
  for (const s of flat) {
    for (const c of countryCodes(s.country)) {
      if (!byCountry.has(c)) byCountry.set(c, []);
      byCountry.get(c).push(s);
    }
  }
  // Sort sections within each country by year, sort countries by name.
  const groups = Array.from(byCountry.entries())
    .map(([code, entries]) => ({
      code,
      name: countryName(code),
      entries: entries.slice().sort((a, b) => a.year - b.year)
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  $effect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute(
      'style',
      '--bg:#ffffff;--ink:#14110d;--muted:rgba(20,17,13,0.56);--rule:rgba(20,17,13,0.16);--accent:#6a6a6a;'
    );
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = prevOverflow; };
  });
</script>

<svelte:head><title>Countries — {TITLE}</title></svelte:head>

<main class="page">
  <header class="top">
    <a class="mark" href="{base}/">{TITLE}</a>
    <nav class="top-nav">
      <a href="{base}/contents">Contents</a>
      <a class="cover-link" href="{base}/">Cover ←</a>
    </nav>
  </header>

  <div class="intro">
    <div class="kicker">Countries</div>
    <h1>Where the work was done</h1>
    <p class="sub">
      Each page is tagged with the country of its primary research.  Pages where the work
      crosses national lines — a Canadian machine investigated by an American team, a paper
      written from London about observations made in New York — appear under both flags.
    </p>
  </div>

  <nav class="jump">
    {#each groups as g}
      <a href="#{g.code}" class="jump-item">
        <span class="jump-flag" aria-hidden="true">{flag(g.code)}</span>
        <span class="jump-name">{g.name}</span>
        <span class="jump-count">{g.entries.length}</span>
      </a>
    {/each}
  </nav>

  <div class="groups">
    {#each groups as g}
      <section class="group" id={g.code}>
        <header class="group-head">
          <span class="group-flag" aria-hidden="true">{flag(g.code)}</span>
          <h2>{g.name}</h2>
          <span class="group-count">{g.entries.length} {g.entries.length === 1 ? 'page' : 'pages'}</span>
        </header>
        <ul>
          {#each g.entries as e}
            <li>
              <a class="entry" href="{base}/{e.num}">
                <span class="entry-num">{e.num}</span>
                <span class="entry-title">{e.title}</span>
                <span class="entry-meta">
                  {#if countryCodes(e.country).length > 1}
                    <span class="cross-flags" title="Cross-national page">
                      {#each countryCodes(e.country) as c}
                        {#if c !== g.code}
                          <span class="cross">also {flag(c)} {countryName(c)}</span>
                        {/if}
                      {/each}
                    </span>
                  {/if}
                  <span class="entry-year">{e.year}</span>
                  {#if e.class}<span class="entry-class entry-class-{e.class.replace(/[^a-z]/gi, '').toLowerCase()}">{e.class}</span>{/if}
                </span>
              </a>
            </li>
          {/each}
        </ul>
      </section>
    {/each}
  </div>
</main>

<style>
  .page {
    min-height: 100vh; min-height: 100dvh;
    padding: 4vw 7vw 6vw;
    display: flex; flex-direction: column; gap: 3vw;
  }

  .top { display: flex; justify-content: space-between; align-items: center; font-family: var(--sans); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.24em; color: var(--muted); }
  .mark { font-family: var(--serif); font-style: italic; font-size: 1rem; letter-spacing: 0; text-transform: none; color: var(--ink); }
  .top-nav { display: flex; gap: 1rem; }
  .top-nav :global(a) { color: var(--muted); transition: color 160ms; }
  .top-nav :global(a:hover) { color: var(--ink); }

  .intro { max-width: 1100px; }
  .kicker { font-family: var(--sans); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.28em; color: var(--muted); margin-bottom: 1.2rem; }
  h1 { font-family: var(--serif); font-weight: 300; font-style: italic; font-size: clamp(2.4rem, 6vw, 4.8rem); line-height: 0.98; letter-spacing: -0.025em; color: var(--ink); }
  .sub { font-family: var(--serif); font-weight: 300; font-size: clamp(0.95rem, 1.1vw, 1.05rem); line-height: 1.55; color: var(--ink); max-width: 56ch; margin-top: 1rem; }

  .jump {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem 0.9rem;
    padding: 1.1rem 0;
    border-top: 1px solid var(--rule);
    border-bottom: 1px solid var(--rule);
  }
  .jump-item {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--sans);
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--muted);
    padding: 0.3rem 0.6rem;
    border: 1px solid var(--rule);
    border-radius: 2px;
    transition: border-color 160ms ease, color 160ms ease;
  }
  .jump-item:hover { color: var(--ink); border-color: var(--ink); }
  .jump-flag { font-size: 1.1rem; letter-spacing: 0; }
  .jump-name { font-size: 0.7rem; }
  .jump-count { font-size: 0.62rem; color: var(--muted); }

  .groups { display: flex; flex-direction: column; gap: 3rem; }

  .group { scroll-margin-top: 1.5rem; }
  .group-head {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    border-top: 1px solid var(--rule);
    padding-top: 1rem;
  }
  .group-flag { font-size: 2rem; line-height: 1; letter-spacing: 0; }
  .group-head h2 {
    font-family: var(--serif);
    font-weight: 300;
    font-style: italic;
    font-size: clamp(1.8rem, 3.5vw, 2.6rem);
    color: var(--ink);
  }
  .group-count {
    font-family: var(--sans);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--muted);
    margin-left: auto;
  }

  ul { list-style: none; margin: 1rem 0 0; padding: 0; }

  .entry {
    display: grid;
    grid-template-columns: 3ch minmax(0, 1fr) auto;
    gap: 1.2rem;
    align-items: baseline;
    padding: 0.6rem 0;
    border-bottom: 1px dotted var(--rule);
    color: var(--ink);
  }
  .entry:hover { background: rgba(20, 17, 13, 0.03); }

  .entry-num { font-family: var(--sans); font-size: 0.68rem; letter-spacing: 0.18em; color: var(--muted); }
  .entry-title { font-family: var(--serif); font-style: italic; font-weight: 300; font-size: clamp(0.98rem, 1.15vw, 1.12rem); color: var(--ink); overflow-wrap: break-word; }
  .entry-meta {
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    font-family: var(--sans);
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .cross-flags { display: inline-flex; gap: 0.4rem; }
  .cross {
    font-size: 0.62rem;
    letter-spacing: 0.16em;
    padding: 0.2rem 0.5rem;
    border: 1px dashed var(--rule);
    border-radius: 2px;
  }
  .entry-year { font-size: 0.68rem; letter-spacing: 0.14em; }
  .entry-class { font-size: 0.58rem; letter-spacing: 0.2em; padding: 0.15rem 0.45rem; border: 1px solid currentColor; border-radius: 2px; }
  .entry-class-undecidable { color: #8a1c1c; }
  .entry-class-npcomplete { color: #a64a00; }
  .entry-class-nphard { color: #a66800; }
  .entry-class-p { color: #1c5e2c; }
  .entry-class-meta { color: var(--muted); }

  @media (max-width: 720px) {
    .entry { grid-template-columns: 2.4ch 1fr; row-gap: 0.2rem; }
    .entry-meta { grid-column: 2; flex-wrap: wrap; }
  }
</style>
