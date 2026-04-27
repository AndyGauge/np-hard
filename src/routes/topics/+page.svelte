<script>
  import { base } from '$app/paths';
  import { flat } from '$lib/outline.js';
  import { TITLE } from '$lib/config.js';

  // Group sections by the optional `topic` field on each section. Sections
  // without a topic land under "Other."
  const topicsMap = new Map();
  for (const s of flat) {
    const t = s.topic || 'Other';
    if (!topicsMap.has(t)) topicsMap.set(t, []);
    topicsMap.get(t).push(s);
  }
  const topics = Array.from(topicsMap.entries())
    .map(([topic, entries]) => ({ topic, entries }))
    .sort((a, b) => a.topic.localeCompare(b.topic));

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

<svelte:head><title>Topics — {TITLE}</title></svelte:head>

<main class="page">
  <header class="top">
    <a class="mark" href="{base}/">{TITLE}</a>
    <nav class="top-nav"><a class="cover-link" href="{base}/">Cover ←</a></nav>
  </header>

  <div class="intro">
    <div class="kicker">Topics</div>
    <h1>By theme</h1>
    <p class="sub">Add a <code>topic</code> field to any section in <code>outline.js</code> to group it here.</p>
  </div>

  <div class="groups">
    {#each topics as g}
      <section class="group">
        <h2>{g.topic}</h2>
        <ul>
          {#each g.entries as e}
            <li>
              <a class="entry" href="{base}/{e.num}">
                <span class="entry-num">{e.num}</span>
                <span class="entry-title">{e.title}</span>
                {#if e.year !== undefined}<span class="entry-meta">{e.year}</span>{/if}
              </a>
            </li>
          {/each}
        </ul>
      </section>
    {/each}
  </div>
</main>

<style>
  .page { min-height: 100vh; min-height: 100dvh; padding: 4vw 7vw 6vw; display: flex; flex-direction: column; gap: 3vw; }
  .top { display: flex; justify-content: space-between; align-items: center; font-family: var(--sans); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.24em; color: var(--muted); }
  .mark { font-family: var(--serif); font-style: italic; font-size: 1rem; letter-spacing: 0; text-transform: none; color: var(--ink); }
  .cover-link { color: var(--muted); transition: color 160ms; }
  .cover-link:hover { color: var(--ink); }

  .intro { max-width: 1100px; }
  .kicker { font-family: var(--sans); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.28em; color: var(--muted); margin-bottom: 1.2rem; }
  h1 { font-family: var(--serif); font-weight: 300; font-style: italic; font-size: clamp(2.4rem, 6vw, 4.8rem); line-height: 0.98; letter-spacing: -0.025em; color: var(--ink); }
  .sub { font-family: var(--serif); font-style: italic; color: var(--muted); margin-top: 1.2rem; max-width: 52ch; }
  code { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 0.9em; background: rgba(20, 17, 13, 0.06); padding: 0 0.3em; border-radius: 3px; }

  .groups { display: flex; flex-direction: column; gap: 2.4rem; margin-top: 1rem; }
  .group { padding-top: 1.4rem; border-top: 1px solid var(--rule); }
  h2 { font-family: var(--serif); font-style: italic; font-weight: 300; font-size: clamp(1.4rem, 2.2vw, 1.9rem); color: var(--ink); }
  ul { list-style: none; margin-top: 0.8rem; padding: 0; }

  .entry { display: grid; grid-template-columns: 3ch minmax(0, 1fr) auto; gap: 1.2rem; padding: 0.45rem 0; border-bottom: 1px dotted var(--rule); color: var(--ink); align-items: baseline; }
  .entry:hover { background: rgba(20, 17, 13, 0.03); }
  .entry-num { font-family: var(--sans); font-size: 0.68rem; letter-spacing: 0.18em; color: var(--muted); }
  .entry-title { font-family: var(--serif); font-style: italic; font-weight: 300; font-size: clamp(0.98rem, 1.15vw, 1.12rem); color: var(--ink); }
  .entry-meta { font-family: var(--sans); font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }
</style>
