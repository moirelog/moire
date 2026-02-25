
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

      let markdownString = rawContent as string;

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
              const normalizedAssetUrl = assetUrl.startsWith('/') ? `.${ assetUrl }` : assetUrl;
              return `![${ alt }](${ normalizedAssetUrl })`;
            }
          }

          return match;
        });
      };

      const fmRegex = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---/;
      const fmMatch = markdownString.match(fmRegex);
      let created: Date | null = null;
      let modified: Date | null = null;

      if (fmMatch) {
        const fm = fmMatch[1];
        markdownString = markdownString.replace(fmRegex, '').trim();

        const createdMatch = fm.match(/created:\s*(.+)/);
        if (createdMatch) {
          const createdStr = createdMatch[1].trim();
          try {
            created = new Date(createdStr);
          } catch (e) {
            console.error(`Failed to parse created date from frontmatter for ${ slug }:`, e);
          }
        }

        const modifiedMatch = fm.match(/modified:\s*(.+)/);
        if (modifiedMatch) {
          const modifiedStr = modifiedMatch[1].trim();
          try {
            modified = new Date(modifiedStr);
          } catch (e) {
            console.error(`Failed to parse modified date from frontmatter for ${ slug }:`, e);
          }
        }
      }

      let markdown = resolveAssets(markdownString, path);

      markdown = markdown.replace(
        /(^|\s)#([^\s#.,!?;:()\[\]"']+)/g,
        '$1<button class="tag-link" data-tag="$2">#$2</button>'
      );

      const htmlContent = await marked.parse(markdown);

      let date = new Date();

      const filenameDate = (() => {
        const match = slug.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
        if (match) {
          const year = match[1];
          const month = match[2];
          const day = match[3];
          const hour = match[4];
          const minute = match[5];
          const second = match[6];

          const isoString = `${ year }-${ month }-${ day }T${ hour }:${ minute }:${ second }Z`;
          return new Date(isoString);
        }
        return null;
      })();

      if (config.order_by === 'modified') {
        date = modified || created || filenameDate || new Date();
      } else {
        date = created || filenameDate || new Date();
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

  memos.sort((a, b) => b.date.getTime() - a.date.getTime());

  return memos;
}
