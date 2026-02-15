<script lang="ts">
  import {format} from 'date-fns';
  import type {PageData} from '../../routes/$types';
  import {createMemoList} from '$lib/memo.svelte';
  import Background from './Background.svelte';

  let {data, config}: {data: PageData; config: any} = $props();
  const memoList = createMemoList(() => data, config);
</script>

<div class="max-w-4xl mx-auto min-h-screen text-[var(--text-color)] p-5 md:p-10 {config.theme} relative isolate">
  <Background />

  <div class="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12">
    <aside class="md:col-span-3 md:border-r border-[var(--text-color)]/10 md:pr-8 md:text-right">
      <header class="sticky top-10">
        <h1 class="text-4xl font-black italic mb-4 text-[var(--accent-color)] tracking-tight">{config.title}</h1>
        <div class="text-sm text-[var(--text-color)]/60 italic mb-8">
          <p>{config.description}</p>
          <p class="mt-4">— {config.author}</p>
        </div>

        {#if memoList.selectedTag}
          <div class="mb-8">
            <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-color)]/40 mb-2">Filtered View</p>
            <button
              class="bg-[var(--accent-color)]/10 text-[var(--accent-color)] px-3 py-1 rounded-full text-sm italic hover:bg-[var(--accent-color)]/20 transition-colors"
              onclick={() => memoList.selectTag(null)}
            >
              #{memoList.selectedTag} ✕
            </button>
          </div>
        {/if}

        <div class="hidden md:block">
          <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-color)]/40 mb-4 pb-2 border-b border-[var(--text-color)]/5 inline-block ml-auto">Index</p>
          <ul class="text-sm space-y-3">
            {#each memoList.allTags as tag}
              <li class="list-none">
                <button
                  class="hover:text-[var(--accent-color)] hover:underline decoration-[var(--accent-color)]/30 underline-offset-4 transition-colors {memoList.selectedTag ===
                  tag
                    ? 'text-[var(--accent-color)] font-bold'
                    : 'text-[var(--text-color)]/60'}"
                  onclick={() => memoList.selectTag(tag)}
                >
                  #{tag}
                </button>
              </li>
            {/each}
          </ul>
        </div>
      </header>
    </aside>

    <main class="md:col-span-9 space-y-16 max-w-2xl">
      {#each Object.entries(memoList.groupedMemos) as [dateKey, memos]}
        <section>
          <div class="flex items-baseline gap-4 mb-10 border-b border-[var(--text-color)] pb-3">
            <h2 class="text-3xl font-black italic text-[var(--text-color)] tracking-tight">
              {format(new Date(dateKey + 'T00:00:00'), 'MMMM dd, yyyy')}
            </h2>
            <span class="text-sm text-[var(--text-color)]/40 italic font-medium">{format(new Date(dateKey + 'T00:00:00'), 'EEEE')}</span>
          </div>

          <div class="space-y-14">
            {#each memos as memo}
              <article class="group relative" id={memo.slug}>
                <div class="absolute -left-20 top-2 hidden xl:block text-xs font-bold tracking-widest text-[var(--text-color)]/30 w-12 text-right uppercase">
                  {format(memo.date, 'HH:mm')}
                </div>

                <div class="xl:hidden text-sm font-bold tracking-widest text-[var(--text-color)]/30 mb-3 uppercase">
                  {format(memo.date, 'HH:mm')}
                </div>

                <div
                  class="max-w-none text-[var(--text-color)]/90
                        [&_h1]:text-[1.35rem] [&_h1]:font-bold [&_h1]:mb-5 [&_h1]:mt-7 [&_h1]:text-[var(--text-color)]
                        [&_h2]:text-[1.25rem] [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:mt-6 [&_h2]:text-[var(--text-color)]
                        [&_h3]:text-[1.1rem] [&_h3]:font-bold [&_h3]:mb-3 [&_h3]:mt-5 [&_h3]:text-[var(--text-color)]
                        [&_h4]:text-[1rem] [&_h4]:font-bold [&_h4]:mb-3 [&_h4]:mt-4 [&_h4]:text-[var(--text-color)]/80
                        [&_h5]:text-[0.9rem] [&_h5]:font-bold [&_h5]:mb-2 [&_h5]:mt-3 [&_h5]:text-[var(--text-color)]/70
                        [&_a]:text-[var(--accent-color)] [&_a]:no-underline [&_a]:border-b [&_a]:border-[var(--accent-color)]/30 [&_a]:underline-offset-4 [&_a]:hover:border-[var(--accent-color)] [&_a]:hover:bg-[var(--accent-color)]/5 [&_a]:transition-all
                        [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
                        [&_p]:my-4
                        [&_table]:border-collapse [&_table]:border-y-1 [&_table]:border-black [&_table]:my-6 [&_table]:w-full [&_table]:text-sm
                        [&_th]:border-b-1 [&_th]:border-black [&_th]:border-dashed [&_th]:font-bold [&_th]:p-3 [&_th]:text-center [&_th]:uppercase
                        [&_td]:border-b [&_td]:border-[var(--text-color)]/10 [&_td]:border-dashed [&_td]:p-3 [&_td]:text-center
                        [&_blockquote]:border-l-4 [&_blockquote]:italic [&_blockquote]:border-[var(--accent-color)] [&_blockquote]:bg-[var(--accent-color)]/5 [&_blockquote_p]:py-3 [&_blockquote]:px-4 [&_blockquote]:my-4 [&_blockquote]:not-italic [&_blockquote]:text-[0.95rem] [&_blockquote]:text-[var(--text-color)]/80 [&_blockquote]:rounded-r-sm
                        [&_img]:rounded-sm [&_img]:border-[6px] [&_img]:border-white [&_img]:rotate-1 group-hover:[&_img]:rotate-0 [&_img]:transition-all [&_img]:duration-700
                        [&_.tag-link]:text-xs [&_.tag-link]:mx-1 [&_.tag-link]:font-bold [&_.tag-link]:uppercase [&_.tag-link]:tracking-wider [&_.tag-link]:text-[var(--text-color)]/30 [&_.tag-link:hover]:text-[var(--accent-color)] [&_.tag-link:hover]:underline [&_.tag-link]:no-underline [&_.tag-link]:transition-colors"
                  onclick={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.classList.contains('tag-link')) {
                          const tag = target.dataset.tag;
                          if (tag) memoList.selectTag(tag);
                      }
                  }}
                >
                  {@html memo.content}
                </div>
              </article>
            {/each}
          </div>
        </section>
      {/each}

      {#if memoList.visibleCount < data.memos.length}
        <div class="pt-12 text-center border-t border-[#333]/10">
          <button
            class="text-lg italic text-[#666] hover:text-[#d33682] transition-colors"
            onclick={memoList.loadMore}
          >
            ❧ Continue Reading...
          </button>
        </div>
      {/if}

      <footer class="mt-20 text-center text-sm text-[#999] italic pb-12">
        <p>— End of Manuscript —</p>
      </footer>
    </main>
  </div>
</div>

<style>
  :global(body) {
    font-variant-ligatures: common-ligatures;
  }
</style>
