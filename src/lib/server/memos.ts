
import { marked } from 'marked';
import { config } from '../../../moire.config';

export type Memo = {
  slug: string;
  content: string;
  date: Date;
  tags: string[];
};

export async function getMemos(): Promise<Memo[]> {
  const memoModules = import.meta.glob('/src/memos/**/*.md', { query: '?raw', import: 'default', eager: true });
  const assetModules = import.meta.glob('/src/memos/**/*.{png,jpg,jpeg,gif,webp}', { eager: true });

  const memos: Memo[] = await Promise.all(
    Object.entries(memoModules).map(async ([path, rawContent]) => {
      const slug = path.split('/').pop()?.replace('.md', '') || 'unknown';

      const markdownString = rawContent as string;

      const resolveAssets = (markdown: string, memoPath: string) => {
        return markdown.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, distinctUrl) => {
          let assetKeyLink = '';

          if (!distinctUrl.startsWith('http') && !distinctUrl.startsWith('/')) {
            const memoDir = memoPath.substring(0, memoPath.lastIndexOf('/'));
            let assetPath = `${ memoDir }/${ distinctUrl }`;
            assetPath = assetPath.replace('/./', '/');
            // Simple normalization for ../
            const parts = assetPath.split('/');
            const stack = [];
            for (const part of parts) {
              if (part === '..') stack.pop();
              else if (part !== '.') stack.push(part);
            }
            assetKeyLink = stack.join('/');
          }

          if (assetKeyLink) {
            const assetModule = assetModules[assetKeyLink] as { default: string } | string;
            const assetUrl = assetModule && typeof assetModule === 'object' ? assetModule.default : assetModule;

            if (assetUrl) {
              return `![${ alt }](${ assetUrl })`;
            }
          }

          return match;
        });
      };

      let processedMarkdown = resolveAssets(markdownString, path);

      processedMarkdown = processedMarkdown.replace(
        /(^|\s)#([^\s#.,!?;:()\[\]"']+)/g,
        '$1<button class="tag-link" data-tag="$2">#$2</button>'
      );

      const htmlContent = await marked.parse(processedMarkdown);

      let date = new Date();
      const match = slug.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
      if (match) {
        const year = match[1];
        const month = match[2];
        const day = match[3];
        const hour = match[4];
        const minute = match[5];
        const second = match[6];

        const isoString = `${ year }-${ month }-${ day }T${ hour }:${ minute }:${ second }Z`;
        date = new Date(isoString);
      }

      let tags: string[] = [];
      const tagMatch = markdownString.match(/#([^\s#.,!?;:()\[\]"']+)/g);
      if (tagMatch) {
        tags = tagMatch.map(t => t.slice(1));
        tags = [...new Set(tags)];
      }

      return {
        slug,
        content: htmlContent,
        date,
        tags
      };
    })
  );

  memos.sort((a, b) => b.slug.localeCompare(a.slug));

  return memos;
}
