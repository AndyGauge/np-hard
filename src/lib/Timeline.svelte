<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { flat, YEAR_MIN, YEAR_MAX } from './outline.js';

  let { currentNum, ticks } = $props();

  const RANGE = YEAR_MAX - YEAR_MIN || 1;

  // Default to ~7 evenly-spaced decade-rounded ticks if none supplied.
  const autoTicks = (() => {
    const span = YEAR_MAX - YEAR_MIN;
    const step = span > 200 ? 50 : span > 100 ? 20 : span > 40 ? 10 : span > 15 ? 5 : 1;
    const out = [];
    const start = Math.ceil(YEAR_MIN / step) * step;
    for (let y = start; y <= YEAR_MAX; y += step) out.push(y);
    return out;
  })();

  const tickValues = ticks ?? autoTicks;

  function x(year) {
    return ((year - YEAR_MIN) / RANGE) * 100;
  }

  let current = $derived(flat.find((s) => s.num === currentNum));

  function onBarClick(e) {
    const target = /** @type {HTMLElement} */ (e.currentTarget);
    const rect = target.getBoundingClientRect();
    const frac = (e.clientX - rect.left) / rect.width;
    const desired = YEAR_MIN + frac * RANGE;

    let best = flat[0];
    let bestDist = Infinity;
    for (const s of flat) {
      const d = Math.abs(s.year - desired);
      if (d < bestDist) { best = s; bestDist = d; }
    }
    if (best && best.num !== currentNum) {
      goto(base + '/' + best.num);
    }
  }
</script>

<button type="button" class="timeline" aria-label="Timeline — click to jump" onclick={onBarClick}>
  <span class="axis"></span>

  {#each tickValues as t}
    <span class="tick" style:left="{x(t)}%">
      <span class="tick-label">{t}</span>
    </span>
  {/each}

  {#each flat as s (s.num)}
    <a
      class="dot"
      class:active={s.num === currentNum}
      style:left="{x(s.year)}%"
      href="{base}/{s.num}"
      title="{s.num} · {s.title} · {s.year}"
      onclick={(e) => e.stopPropagation()}
    ></a>
  {/each}

  {#if current}
    <span class="year-flag" style:left="{x(current.year)}%">
      <span class="year">{current.year}</span>
    </span>
  {/if}
</button>

<style>
  .timeline {
    position: relative;
    display: block;
    width: 100%;
    height: 48px;
    margin-top: 1rem;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
  }

  .axis {
    position: absolute;
    top: 50%; left: 0; right: 0;
    height: 1px;
    background: var(--rule);
    transform: translateY(-50%);
    pointer-events: none;
  }

  .tick {
    position: absolute;
    top: 50%;
    width: 1px;
    height: 10px;
    background: var(--rule);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .tick-label {
    position: absolute;
    top: 10px; left: 50%;
    transform: translateX(-50%);
    font-family: var(--sans);
    font-size: 0.55rem;
    color: var(--muted);
    letter-spacing: 0.2em;
    white-space: nowrap;
  }

  .dot {
    position: absolute;
    top: 50%;
    width: 5px; height: 5px;
    background: var(--muted);
    opacity: 0.4;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 200ms, height 200ms, background 200ms, opacity 200ms, transform 160ms;
  }
  .dot::before { content: ''; position: absolute; inset: -6px; }
  .dot:hover { opacity: 1; transform: translate(-50%, -50%) scale(1.4); }
  .dot.active {
    width: 12px; height: 12px;
    background: var(--accent);
    opacity: 1;
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 18%, transparent);
  }

  .year-flag {
    position: absolute;
    top: 50%;
    transform: translate(-50%, calc(-100% - 10px));
    pointer-events: none;
  }

  .year {
    font-family: var(--serif);
    font-style: italic;
    font-size: 0.95rem;
    color: var(--accent);
    white-space: nowrap;
  }

  @media (max-width: 720px) {
    .tick-label { font-size: 0.5rem; }
    .dot { width: 4px; height: 4px; }
    .dot.active { width: 10px; height: 10px; }
  }
</style>
