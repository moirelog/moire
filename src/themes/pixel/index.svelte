<script lang="ts">
  import {config} from '../../../moire.config';
  import {createMemoList} from '$lib/memo.svelte';
  import type {PageData} from '../../routes/$types';
  import {marked} from 'marked';
  import {format} from 'date-fns';
  import pixelIdle from '$lib/assets/pixel-idle.png';
  import pixelRun from '$lib/assets/pixel-run.png';

  let {data}: {data: PageData} = $props();
  const memoList = createMemoList(() => data, config);

  let isMoving = $state(false);
  let scrollTimeout: ReturnType<typeof setTimeout>;

  function handleScroll() {
    isMoving = true;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isMoving = false;
    }, 150);
  }
</script>

<svelte:window onscroll={handleScroll} />

<div
  class="min-h-screen max-w-2xl mx-auto p-4 sm:p-8 selection:bg-[var(--text-color)]/20 selection:text-[var(--bg-color)]"
>
  <header class="mb-12 flex items-end justify-between border-b-2 border-[var(--text-color)] px-2 pb-4 relative">
    <div>
      <h1
        class="text-4xl text-[var(--accent-color)] drop-shadow-[3px_3px_0_var(--border-color)] uppercase tracking-wider font-black"
      >
        {config.title}
      </h1>
      <p class="mt-2 text-[var(--text-color)] font-bold opacity-80 uppercase text-[10px] tracking-widest">Version 2.0.0 [Kawaii]</p>
      
      {#if memoList.selectedTag}
        <div class="mt-6 flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
          <span class="text-[10px] font-bold text-[var(--text-color)] opacity-60">FILTERING BY:</span>
          <button
            onclick={() => memoList.selectTag(null)}
            class="bg-[var(--accent-color)] text-white px-2 py-0.5 text-[10px] font-bold border border-[var(--border-color)] shadow-[2px_2px_0_0_var(--border-color)] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_var(--border-color)] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-2 group"
          >
            #{memoList.selectedTag.toUpperCase()}
            <span class="opacity-70 group-hover:opacity-100 italic">✕</span>
          </button>
        </div>
      {/if}
    </div>
    <div class="text-right text-xs text-[var(--text-color)]">
      <p>SYSTEM: ONLINE</p>
      <p class="text-[var(--accent-color)]">BATTERY: 100%</p>
    </div>
  </header>

  <div class="mx-auto grid grid-cols-1 gap-8 2xl:grid-cols-2" data-selected-tag={memoList.selectedTag}>
    {#each memoList.visibleMemos as memo}
      <article
        class="window-frame relative flex flex-col bg-[var(--card-bg)] border-2 border-[var(--border-color)] shadow-[4px_4px_0_0_var(--accent-color)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_var(--accent-color)] transition-all duration-200 rounded-xl overflow-hidden"
        id={memo.slug}
      >
        <div
          class="flex items-center justify-between border-b-2 border-[var(--border-color)] bg-[var(--bg-color)] px-3 py-2 text-xs"
        >
          <span class="text-[var(--text-color)] font-bold truncate max-w-[70%] opacity-70"
            >♥ {format(new Date(memo.date), 'yyyy/MM/dd')}</span
          >
          <div class="flex gap-1.5">
            <button
              aria-label="Minimize"
              class="flex h-3 w-3 items-center justify-center rounded-full bg-[#ffd93d] hover:brightness-110 border border-[var(--border-color)] transition-all"
            ></button>
            <button
              aria-label="Close"
              class="flex h-3 w-3 items-center justify-center rounded-full bg-[#ff6b6b] hover:brightness-110 border border-[var(--border-color)] transition-all"
            ></button>
          </div>
        </div>

        <div class="flex-1 py-4 px-5">
          <div
            class="max-w-none text-[0.95rem] text-[var(--text-color)]
                        [&_h1]:text-[1.2rem] [&_h1]:font-black [&_h1]:mb-4 [&_h1]:mt-5 [&_h1]:text-[var(--accent-color)]
                        [&_h2]:text-[1.1rem] [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-4 [&_h2]:text-[var(--accent-color)]
                        [&_h3]:text-[1.0rem] [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-[var(--accent-color)]
                        [&_h4]:text-[0.9rem] [&_h4]:font-bold [&_h4]:mb-2 [&_h4]:mt-2 [&_h4]:text-[var(--accent-color)]
                        [&_h5]:text-[0.8rem] [&_h5]:font-bold [&_h5]:italic [&_h5]:mb-2 [&_h5]:text-[var(--accent-color)]
                        [&_p]:my-3
                        [&_a]:text-[var(--accent-color)] [&_a]:font-bold [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-2 [&_a]:decoration-dotted [&_a]:hover:text-[var(--border-color)]
                        [&_strong]:text-[var(--accent-color)]
                        [&_code]:bg-[var(--bg-color)] [&_code]:text-[var(--accent-color)] [&_code]:px-1 [&_code]:rounded-md
                        [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:text-xs [&_table]:border-2 [&_table]:border-[var(--border-color)]
                        [&_th]:bg-[var(--bg-color)] [&_th]:text-[var(--text-color)] [&_th]:p-2 [&_th]:border-b-2 [&_th]:border-[var(--border-color)] [&_th]:text-center
                        [&_td]:p-2 [&_td]:border-b [&_td]:border-[var(--border-color)] [&_td]:text-center
                        [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--accent-color)] [&_blockquote]:bg-[var(--bg-color)] [&_blockquote]:py-2 [&_blockquote]:px-4 [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:text-[0.9rem] [&_blockquote]:text-[var(--text-color)] [&_blockquote]:rounded-r-lg
                        [&_.tag-link]:bg-[var(--bg-color)] [&_.tag-link]:text-[var(--accent-color)] [&_.tag-link]:px-2 [&_.tag-link]:py-0.5 [&_.tag-link]:rounded-full [&_.tag-link]:text-[11px] [&_.tag-link]:no-underline [&_.tag-link]:mx-0.5 [&_.tag-link]:font-bold [&_.tag-link]:transition-all [&_.tag-link]:hover:scale-110
                        "
             onclick={(e) => {
                const target = e.target as HTMLElement;
                if (target.classList.contains('tag-link')) {
                    const tag = target.dataset.tag;
                    if (tag) memoList.selectTag(tag);
                }
             }}
          >
            {@html marked.parse(memo.content)}
          </div>
        </div>

        <div
          class="mt-auto border-t-2 border-[var(--border-color)] bg-[var(--bg-color)] px-3 py-1.5 text-[10px] text-[var(--text-color)] flex justify-between items-center opacity-80"
        >
          <span class="font-bold text-[var(--accent-color)]">★ {format(new Date(memo.date), 'HH:mm')}</span>
        </div>

        <div
          class="pointer-events-none absolute inset-0 z-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMSIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30 mix-blend-multiply"
        ></div>
      </article>
    {/each}
  </div>

  {#if memoList.visibleMemos.length < memoList.filteredMemos.length}
    <div class="my-12 text-center">
      <button
        onclick={memoList.loadMore}
        class="bg-[var(--bg-color)] px-6 py-2 text-[var(--border-color)] font-bold border-2 border-[var(--border-color)] shadow-[4px_4px_0_0_var(--text-color)] hover:shadow-[2px_2px_0_0_var(--text-color)] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none transition-all group"
      >
        <span class="group-hover:text-[var(--accent-color)] transition-colors">[ LOAD MORE ]</span>
      </button>
    </div>
  {/if}

  <div class="fixed bottom-8 right-8 z-50 hidden md:block">
    <div
      class="relative h-16 w-16 image-pixelated transition-transform duration-100"
      class:translate-y-[-2px]={isMoving}
    >
      {#if isMoving}
        <img
          src={pixelRun}
          alt="Running Avatar"
          class="h-full w-full object-contain drop-shadow-[4px_4px_0_rgba(0,0,0,0.1)]"
        />
      {:else}
        <img
          src={pixelIdle}
          alt="Idle Avatar"
          class="h-full w-full object-contain drop-shadow-[4px_4px_0_rgba(0,0,0,0.1)]"
        />
      {/if}
    </div>
    <div
      class="absolute -top-12 -right-4 whitespace-nowrap bg-[var(--card-bg)] border-2 border-[var(--border-color)] px-2 py-1 text-[10px] text-[var(--text-color)] shadow-[2px_2px_0_0_var(--accent-color)] opacity-0 transition-opacity duration-300 rounded-lg"
      class:opacity-100={!isMoving}
    >
      I'm watching you.
    </div>
  </div>
</div>

<style>
  /* Custom Scrollbar for Webkit */
  :global(::-webkit-scrollbar) {
    width: 16px;
    background-color: var(--bg-color);
    border-left: 2px solid var(--text-color);
  }

  :global(::-webkit-scrollbar-thumb) {
    background-color: var(--text-color);
    border: 2px solid var(--bg-color);
    box-shadow: inset 2px 2px 0 rgba(0, 0, 0, 0.1);
  }

  :global(::-webkit-scrollbar-thumb:hover) {
    background-color: var(--accent-color);
  }

  :global(::-webkit-scrollbar-track) {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==');
    opacity: 0.1;
  }

  .image-pixelated {
    image-rendering: pixelated;
  }

  [data-selected-tag] :global(.tag-link) {
      transition: all 0.1s steps(2);
  }

  /* When a tag is selected, dim other tags and highlight the active one */
  [data-selected-tag]:not([data-selected-tag="null"]) :global(.tag-link) {
      opacity: 0.4;
      filter: grayscale(1);
  }

  /* Active tag gets inverted pixel look */
  [data-selected-tag="Academic"] :global(.tag-link[data-tag="Academic"]),
  [data-selected-tag="Bento"] :global(.tag-link[data-tag="Bento"]),
  [data-selected-tag="Cyberpunk"] :global(.tag-link[data-tag="Cyberpunk"]),
  [data-selected-tag="Pixel"] :global(.tag-link[data-tag="Pixel"]),
  [data-selected-tag="Receipt"] :global(.tag-link[data-tag="Receipt"]),
  /* Generic selector that works for any tag if the attribute matches exactly */
  [data-selected-tag]:not([data-selected-tag="null"]) :global(.tag-link.active) {
      opacity: 1 !important;
      filter: grayscale(0) !important;
      background-color: var(--border-color) !important;
      color: var(--bg-color) !important;
      border-color: var(--border-color) !important;
      box-shadow: 2px 2px 0 0 var(--accent-color) !important;
  }
</style>
