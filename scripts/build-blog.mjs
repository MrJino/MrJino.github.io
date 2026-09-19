import { readFile, readdir, mkdir, unlink, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';
import { marked } from 'marked';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const blogRoot = join(root, 'blog');
const articlesRoot = join(blogRoot, 'articles');
const siteUrl = 'https://mrjino.github.io';
const listUrl = `${siteUrl}/blog/`;
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);
const xmlEscape = escapeHtml;
const jsonForHtml = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

const catalogSource = await readFile(join(blogRoot, 'js/blog-data.js'), 'utf8');
const posts = vm.runInNewContext(`${catalogSource}\nblogPosts`, {});
const categories = ['전체', ...new Set(posts.map((post) => post.category))];
const ids = new Set();
const slugs = new Set();

function articlePath(post) {
  return `articles/${post.file.replace(/\.md$/, '')}.html`;
}

function articleUrl(post) {
  return `${listUrl}${articlePath(post)}`;
}

function imageUrl(post) {
  return post.thumbnail ? new URL(post.thumbnail, listUrl).href : '';
}

function formatDate(value) {
  return value.replaceAll('-', '.');
}

function openExternalLinksInNewTab(content) {
  return content.replace(/<a\b[^>]*>/gi, (tag) => {
    const href = tag.match(/\shref\s*=\s*(["'])(.*?)\1/i)?.[2];
    if (!href) return tag;

    let url;
    try {
      url = new URL(href, listUrl);
    } catch {
      return tag;
    }
    if (!['http:', 'https:'].includes(url.protocol) || url.origin === new URL(siteUrl).origin) return tag;

    const existingRel = tag.match(/\srel\s*=\s*(["'])(.*?)\1/i)?.[2] ?? '';
    const rel = [...new Set([...existingRel.split(/\s+/).filter(Boolean), 'noopener', 'noreferrer'])].join(' ');
    return tag
      .replace(/\starget\s*=\s*(["']).*?\1/i, '')
      .replace(/\srel\s*=\s*(["']).*?\1/i, '')
      .replace(/>$/, ` target="_blank" rel="${escapeHtml(rel)}">`);
  });
}

function renderStaticCard(post) {
  const image = post.thumbnail
    ? `<img src="${escapeHtml(post.thumbnail)}" alt="" class="w-full h-full object-cover" />`
    : `<div class="absolute inset-0 flex items-center justify-center"><span class="text-white text-2xl font-bold">${escapeHtml(post.category)}</span></div>`;
  const imageBackground = post.thumbnail ? '' : ' bg-gradient-to-br from-gray-400 to-gray-600';
  return `          <article class="blog-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <a href="${escapeHtml(articlePath(post))}" class="blog-card__link block h-full">
              <div class="aspect-video${imageBackground} relative overflow-hidden">${image}</div>
              <div class="p-5">
                <div class="flex items-center justify-between mb-3">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">${escapeHtml(post.category)}</span>
                  <time datetime="${escapeHtml(post.date)}" class="text-sm text-gray-500">${formatDate(post.date)}</time>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2">${escapeHtml(post.title)}</h3>
                <p class="text-gray-600 text-sm mb-4 line-clamp-2">${escapeHtml(post.excerpt)}</p>
                <div class="flex items-center justify-between">
                  <div class="flex gap-2 flex-wrap">${post.tags.slice(0, 2).map((tag) => `<span class="tag bg-gray-100 text-gray-600">#${escapeHtml(tag)}</span>`).join('')}</div>
                  <span class="text-xs text-gray-500">${escapeHtml(post.readTime)}</span>
                </div>
              </div>
            </a>
          </article>`;
}

function renderArticle(post, content, index) {
  const title = `${post.title} | MrJino 블로그`;
  const url = articleUrl(post);
  const image = imageUrl(post);
  const previous = posts[index - 1];
  const next = posts[index + 1];
  const categoryLinks = categories.map((category) => {
    const count = category === '전체' ? posts.length : posts.filter((entry) => entry.category === category).length;
    const href = category === '전체' ? './' : `./?category=${encodeURIComponent(category)}`;
    const active = category === post.category ? ' active' : '';
    return `<a href="${escapeHtml(href)}" class="category-item${active} w-full px-4 py-3 rounded-lg flex items-center justify-between"><span>${escapeHtml(category)}</span><span class="text-sm">${count}</span></a>`;
  }).join('\n              ');
  const articleData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    inLanguage: 'ko',
    mainEntityOfPage: url,
    author: { '@type': 'Person', name: 'MrJino', url: siteUrl },
    ...(image ? { image } : {}),
  };
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <base href="../" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(post.excerpt)}" />
    <link rel="canonical" href="${escapeHtml(url)}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="MrJino 블로그" />
    <meta property="og:title" content="${escapeHtml(post.title)}" />
    <meta property="og:description" content="${escapeHtml(post.excerpt)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    ${image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : ''}
    <meta property="article:published_time" content="${escapeHtml(post.date)}" />
    <script type="application/ld+json">${jsonForHtml(articleData)}</script>
    <link rel="stylesheet" href="../assets/css/tailwind.css" />
    <link rel="stylesheet" href="css/style.css" />
  </head>
  <body class="bg-gray-50 blog-list-page blog-post-page">
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div class="blog-header-container py-3">
        <div class="blog-header-row flex items-center gap-2">
          <img src="images/jino_icon.png" alt="" class="w-10 h-10 rounded-lg object-contain flex-shrink-0" />
          <a href="../" class="text-xl font-bold text-gray-950 hover:text-black transition-colors">MrJino</a>
          <div class="flex-1"></div>
          <div class="blog-header-tools flex gap-6 items-center">
            <form class="blog-search relative" action="./" method="get" role="search">
              <input type="search" name="q" aria-label="블로그 검색" placeholder="블로그 검색..." class="w-64 px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </form>
          </div>
        </div>
      </div>
    </nav>
    <main class="blog-content-width blog-layout blog-article-layout flex gap-8 py-12">
      <aside class="blog-sidebar w-64 flex-shrink-0" aria-label="블로그 카테고리">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24">
          <div class="p-4 border-b border-gray-200">
            <h2 class="text-lg font-bold text-gray-900">카테고리</h2>
          </div>
          <nav id="categoryNav" class="p-2" aria-label="카테고리별 글 목록">
              ${categoryLinks}
          </nav>
        </div>
      </aside>
      <div class="blog-article-main blog-results flex-1">
      <div class="blog-post-header flex items-center gap-4 mb-4">
        <a href="./" class="blog-back-link">← 목록으로</a>
        <div class="blog-post-meta">
          <span id="postCategory" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">${escapeHtml(post.category)}</span>
          <time datetime="${escapeHtml(post.date)}" class="text-sm text-gray-500">${formatDate(post.date)}</time>
          <span class="text-sm text-gray-500">${escapeHtml(post.readTime)}</span>
        </div>
      </div>
      <article class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-8 pt-8 pb-4">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">${escapeHtml(post.title)}</h1>
          <div id="postTags" class="flex gap-2 flex-wrap">${post.tags.map((tag) => `<span class="tag bg-gray-100 text-gray-600">#${escapeHtml(tag)}</span>`).join('')}</div>
        </div>
        <div class="px-8"><div class="markdown-content${post.file === 'korea-housing-policy-by-government.md' ? ' housing-policy-content' : ''}">${content}</div></div>
      </article>
      <nav class="mt-8 flex justify-between items-center" aria-label="블로그 글 탐색">
        ${previous ? `<a href="${escapeHtml(articlePath(previous))}" class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors">← 이전 글</a>` : '<span></span>'}
        ${next ? `<a href="${escapeHtml(articlePath(next))}" class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors">다음 글 →</a>` : '<span></span>'}
      </nav>
      </div>
    </main>
    <script src="js/code-copy.js"></script>
    <script>document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.markdown-content table').forEach((table) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-scroll';
        wrapper.tabIndex = 0;
        wrapper.setAttribute('role', 'region');
        wrapper.setAttribute('aria-label', '표 — 가로 스크롤 가능');
        table.before(wrapper);
        wrapper.append(table);
      });
      enhanceCodeBlocks(document.querySelector('.markdown-content'));
    });</script>
  </body>
</html>
`;
}

await mkdir(articlesRoot, { recursive: true });
const sourceFiles = new Set((await readdir(join(blogRoot, 'posts'))).filter((name) => name.endsWith('.md')));
for (const [index, post] of posts.entries()) {
  if (!Number.isInteger(post.id) || ids.has(post.id)) throw new Error(`Invalid or duplicate post ID: ${post.id}`);
  ids.add(post.id);
  if (!/^[a-z0-9-]+\.md$/.test(post.file) || !sourceFiles.has(post.file)) throw new Error(`Missing Markdown file: ${post.file}`);
  const slug = articlePath(post);
  if (slugs.has(slug)) throw new Error(`Duplicate article path: ${slug}`);
  slugs.add(slug);
  const markdown = await readFile(join(blogRoot, 'posts', post.file), 'utf8');
  let content = marked.parse(markdown).replace(/^<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>\s*/, '');
  if (post.file === 'information-security-engineer-2026.md') {
    content = content.replace('<table>', '<table class="exam-subject-table"><colgroup><col><col><col><col></colgroup>');
  }
  content = openExternalLinksInNewTab(content);
  await writeFile(join(blogRoot, slug), renderArticle(post, content, index));
}
for (const file of await readdir(articlesRoot)) {
  if (file.endsWith('.html') && !slugs.has(`articles/${file}`)) await unlink(join(articlesRoot, file));
}

const indexPath = join(blogRoot, 'index.html');
const indexHtml = await readFile(indexPath, 'utf8');
const start = '<!-- BLOG_POSTS_START -->';
const end = '<!-- BLOG_POSTS_END -->';
if (indexHtml.split(start).length !== 2 || indexHtml.split(end).length !== 2) {
  throw new Error('Blog index is missing unique generated-content markers');
}
const cards = posts.map(renderStaticCard).join('\n');
const updatedIndex = indexHtml.replace(new RegExp(`${start}[\\s\\S]*?${end}`), `${start}\n${cards}\n          ${end}`)
  .replace(/(<p id="categoryCount"[^>]*>)[^<]*/, (_, openingTag) => `${openingTag}${posts.length}개의 글`);
await writeFile(indexPath, updatedIndex);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[`${siteUrl}/about/`, `${siteUrl}/history/`, listUrl, ...posts.map(articleUrl)]
  .map((url) => `  <url><loc>${xmlEscape(url)}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile(join(root, 'sitemap.xml'), sitemap);
console.log(`Generated ${posts.length} article pages, the blog index, and sitemap.xml`);
