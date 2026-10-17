#!/usr/bin/env node
/* Validates the repository's Jekyll blog publishing contract without dependencies.
   A full Jekyll build runs separately in CI. */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const exists = (name) => existsSync(join(root, name));
const read = (name) => readFileSync(join(root, name), 'utf8');
const required = [
  '_config.yml', 'Gemfile', '_layouts/base.html', '_layouts/article.html',
  'artigos/index.html', 'artigos/README.md', 'blog.css', 'blog.js',
  '_drafts/exemplo-de-artigo.md', 'feed.xml', 'sitemap.xml', 'robots.txt',
  'index.html', 'portfolio.css', 'CNAME'
];
for (const file of required) check(exists(file), 'Missing required file: ' + file);
check(!exists('.nojekyll'), '.nojekyll prevents Jekyll compilation on branch-based GitHub Pages');
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
const config = read('_config.yml');
const home = read('index.html');
const blog = read('artigos/index.html');
const layout = read('_layouts/base.html');
const article = read('_layouts/article.html');
const tokens = read('design-system/tokens/tokens.css');
const components = read('design-system/components/components.css');
const blogCss = read('blog.css');
const js = read('blog.js');

check(config.includes('url: "https://rafaelgomides.dev.br"'), 'Wrong canonical domain');
check(config.includes('timezone: "America/Sao_Paulo"'), 'Timezone missing');
check(config.includes('future: false') && config.includes('show_drafts: false'), 'Draft/future posts must be hidden');
check(config.includes('permalink: "/artigos/:title/"'), 'Post permalink convention missing');
check(read('CNAME').trim() === 'rafaelgomides.dev.br', 'Custom domain changed');
check(home.includes('href="/artigos/"'), 'Blog not linked from homepage');
check(home.includes('href="/feed.xml"'), 'RSS not linked from homepage');
for (const tag of ['Sobre', 'Projetos', 'Jornada', 'Experiência', 'Axion']) {
  check(home.includes(tag), 'Portfolio navigation lost: ' + tag);
}
check(layout.includes('design-system/tokens/tokens.css'), 'Shared tokens absent');
check(layout.includes('design-system/components/components.css'), 'Shared components absent');
check(layout.includes('portfolio.js'), 'Mobile navigation not reused');
check(layout.includes('blog.css'), 'Blog styling absent');
check(layout.includes('design-system/theme/theme.js'), 'Shared theme controller missing from blog');
check(layout.includes('data-theme-toggle'), 'Theme toggle missing in blog header');
check(layout.indexOf('design-system/theme/theme.js') < layout.indexOf('design-system/tokens/tokens.css'),
  'Theme initialization must precede stylesheet to prevent wrong-theme flash');
check(layout.includes('name="color-scheme" content="light dark"'), 'Browser light/dark color scheme declaration missing');
check(tokens.includes(':root[data-theme="light"]'), 'Light palette missing from design system');
check(components.includes('.ds-theme-toggle'), 'Theme toggle component styles missing');
const themeScript = read('design-system/theme/theme.js');
try { new Script(themeScript); } catch (error) { failures.push('Invalid theme controller: ' + error.message); }
check(themeScript.includes('rgomids-color-theme'), 'Theme preference storage key missing');
check(themeScript.includes('prefers-color-scheme: dark'), 'OS preference behavior missing');
check(blog.includes('site.posts') && blog.includes('data-post-search'), 'Searchable blog listing missing');
check(blog.includes('data-post-filter'), 'Tag filters missing');
check(blog.includes('site.posts.size > 0'), 'Empty state missing');
check(article.includes('class="ds-prose"'), 'Markdown reading layout missing');
check(article.includes('{{ content }}'), 'Article content insertion missing');
check(read('feed.xml').includes('<rss version="2.0"'), 'RSS output missing');
check(read('sitemap.xml').includes('<urlset'), 'Sitemap output missing');
check(read('robots.txt').includes('Sitemap:'), 'Robots sitemap reference missing');

const defs = new Set([...tokens.matchAll(/(--ds-[\da-z-]+)\s*:/gi)].map(m => m[1]));
for (const cssVar of blogCss.matchAll(/var\(\s*(--ds-[\da-z-]+)/gi)) {
  check(defs.has(cssVar[1]), 'Undefined design token: ' + cssVar[1]);
}
check(components.includes('.ds-app [hidden]'), 'Native hidden semantics missing');
try { new Script(js); } catch (error) { failures.push('Invalid JavaScript: ' + error.message); }

const postsDirectory = join(root, '_posts');
const postFiles = readdirSync(postsDirectory).filter(file => file.endsWith('.md'));
const slugSet = new Set();
for (const filename of postFiles) {
  check(/^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(filename), 'Invalid post file name: ' + filename);
  const post = read('_posts/' + filename);
  const frontmatter = post.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  check(Boolean(frontmatter), 'Missing front matter: ' + filename);
  if (!frontmatter) continue;
  const yaml = frontmatter[1];
  check(!/## Notas editoriais|Rascunho editorial|discussion-urls=|<mention-page/i.test(post),
    'Editorial annotations leaked into published article: ' + filename);
  const mermaidBlocks = (post.match(/data-diagram-widget/g) || []).length +
    (post.match(/<pre class="mermaid">/g) || []).length +
    (post.match(/```mermaid/g) || []).length;
  if (mermaidBlocks > 0) {
    check(exists('blog-mermaid.js'), 'Mermaid renderer missing for: ' + filename);
    check(read('_layouts/article.html').includes('blog-mermaid.js'), 'Mermaid layout script missing');
    const renderer = read('blog-mermaid.js');
    check(renderer.includes('[data-diagram-widget]'), 'Diagram viewer controller missing');
    check(renderer.includes('data-diagram-copy'), 'Diagram copy action missing');
  }
  if (filename.includes('chatgpt-como-camada-de-preparacao')) {
    const articleBody = post.slice(frontmatter[0].length);
    const paragraphs = articleBody.split(/\n\s*\n/).filter(block =>
      /^[A-Za-zÀ-ÿ“‘]/.test(block.trim()));
    check(paragraphs.length >= 40, 'Notion paragraph breaks lost: ' + paragraphs.length);
    check(mermaidBlocks === 2, 'First article must contain two diagrams');
    check((articleBody.match(/data-diagram-widget/g) || []).length === 2,
      'Both diagrams must offer visual/code toggle');
    const embeddedSources = [...articleBody.matchAll(
      /<code class="language-mermaid-source">([\s\S]*?)<\/code>/g
    )].map(match => match[1]
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
      .replace(/&amp;/g, '&').trim());
    check(embeddedSources.length === 2, 'Both diagrams must expose a copyable source');
    for (const [index, name] of ['architecture', 'sequence'].entries()) {
      const source = 'diagrams/article-chatgpt-' + name + '.mmd';
      const svg = 'assets/artigos/chatgpt-como-camada-de-preparacao/' + name + '.svg';
      check(articleBody.includes(name + '.svg'), 'Missing local SVG reference: ' + name);
      check(articleBody.includes('article-chatgpt-' + name + '.mmd'),
        'Missing original Mermaid source link: ' + name);
      check(exists(source), 'Missing source Mermaid file: ' + source);
      check(exists(svg), 'Missing compiled diagram: ' + svg);
      if (exists(svg)) {
        const xml = read(svg);
        check(xml.includes('<svg') && xml.includes('</svg>'), 'Invalid SVG: ' + svg);
      }
      if (exists(source) && embeddedSources[index]) {
        check(read(source).trim() === embeddedSources[index],
          'Displayed diagram source differs from the compiled Mermaid source: ' + name);
      }
    }
    check(articleBody.includes('flowchart LR') && articleBody.includes('sequenceDiagram'),
      'Expected Mermaid diagram definitions missing');
  }
  for (const field of ['title', 'description', 'date', 'tags']) {
    check(new RegExp('^' + field + ':\\s*\\S+', 'm').test(yaml), 'Missing field ' + field + ' in ' + filename);
  }
  check(!/^published:\s*true\s*$/m.test(yaml) || !/^draft:\s*true\s*$/m.test(yaml), 'Contradictory publish metadata in ' + filename);
  const slug = filename.slice(11, -3);
  check(!slugSet.has(slug), 'Duplicate permalink slug: ' + slug);
  slugSet.add(slug);
}
check(readdirSync(join(root, '_drafts')).some(file => file.endsWith('.md')), 'Missing draft example');

if (failures.length) {
  for (const issue of failures) console.error('FAIL: ' + issue);
  console.error(`Blog validation failed: ${failures.length} issue(s).`);
  process.exitCode = 1;
} else {
  console.log(`Blog validation passed: ${required.length} required files, publishing contract, tokens and ${postFiles.length} published Markdown post(s).`);
}
