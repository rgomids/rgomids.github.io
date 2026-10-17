#!/usr/bin/env node
// Dependency-free static checks for the design-system prototype.
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pages = ['index.html', 'blog.html', 'article.html', 'projects.html'];
const failures = [];
const report = (condition, message) => { if (!condition) failures.push(message); };
const read = (path) => readFileSync(join(root, path), 'utf8');

const tokenCss = read('tokens/tokens.css');
const componentsCss = read('components/components.css');
const previewCss = read('preview/preview.css');
const previewJs = read('preview/preview.js');
const css = tokenCss + '\n' + componentsCss + '\n' + previewCss;

const definitions = new Set([...css.matchAll(/(--ds-[a-z\d-]+)\s*:/gi)].map(match => match[1]));
const references = new Set([...css.matchAll(/var\(\s*(--ds-[a-z\d-]+)/gi)].map(match => match[1]));
for (const variable of references) report(definitions.has(variable), `Undefined token: ${variable}`);
report(css.includes('.ds-app [hidden]'), 'Hidden elements need explicit display:none rule');
report(css.includes('prefers-reduced-motion'), 'Reduced motion support missing');
report(css.includes(':focus-visible'), 'Visible focus support missing');

const getToken = (name, css = tokenCss) => {
  const match = css.match(new RegExp(name + '\\s*:\\s*(#[0-9a-f]{6})', 'i'));
  report(Boolean(match), `Missing color token: ${name}`);
  return match?.[1];
};
const luminance = (hex) => {
  const channels = [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const linear = channels.map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
};
const contrast = (a, b) => {
  const bright = Math.max(luminance(a), luminance(b));
  const dark = Math.min(luminance(a), luminance(b));
  return (bright + 0.05) / (dark + 0.05);
};
const lightBlock = tokenCss.match(/:root\[data-theme="light"\]\s*\{([^}]+)\}/);
report(Boolean(lightBlock), 'Explicit light palette missing');
for (const [foreground, background] of [
  ['--ds-color-text', '--ds-color-bg'],
  ['--ds-color-muted', '--ds-color-bg'],
  ['--ds-color-muted', '--ds-color-surface'],
  ['--ds-color-accent', '--ds-color-bg'],
  ['--ds-color-highlight', '--ds-color-bg'],
  ['--ds-color-accent-contrast', '--ds-color-accent'],
  ['--ds-color-highlight-contrast', '--ds-color-highlight']
]) {
  for (const [theme, variables] of [['dark', tokenCss.split('/* Explicit light palette.')[0]], ['light', lightBlock?.[1] || '']]) {
    const fg = getToken(foreground, variables);
    const bg = getToken(background, variables);
    if (fg && bg) report(contrast(fg, bg) >= 4.5,
      `Text contrast below 4.5:1 for ${theme}: ${foreground} on ${background}`);
  }
}

for (const page of pages) {
  const relativePath = 'preview/' + page;
  const html = read(relativePath);
  report(/<html\s+lang="pt-BR"/i.test(html), `Missing language in ${page}`);
  report(/<main\s+id="conteudo"/i.test(html), `Missing main landmark in ${page}`);
  report(/<title>[^<]+<\/title>/i.test(html), `Missing title in ${page}`);
  report(/name="viewport"/i.test(html), `Missing viewport in ${page}`);
  report(html.includes('data-menu-button') && html.includes('data-menu-panel'), `Missing responsive menu contract in ${page}`);
  report(html.includes('data-theme-toggle'), `Missing theme switch in ${page}`);
  report(html.includes('../theme/theme.js'), `Missing shared theme controller in ${page}`);
  report(html.indexOf('../theme/theme.js') < html.indexOf('../tokens/tokens.css'),
    `Theme init must precede CSS loading in ${page}`);
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const href = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|\/)/i.test(href)) continue;
    if (href.startsWith('#')) {
      report(ids.has(href.slice(1)), `Broken anchor in ${page}: ${href}`);
      continue;
    }
    const [target, hash] = href.split('#');
    const fullPath = resolve(root, 'preview', target);
    report(existsSync(fullPath), `Missing relative asset in ${page}: ${href}`);
    if (hash && existsSync(fullPath) && fullPath.endsWith('.html')) {
      const targetHtml = readFileSync(fullPath, 'utf8');
      report(targetHtml.includes(`id="${hash}"`), `Broken destination anchor: ${href}`);
    }
  }
}
report(read('preview/blog.html').includes('data-post-search'), 'Blog search UI missing');
report(read('preview/blog.html').includes('data-post-filter'), 'Blog filter UI missing');
try { new Script(previewJs); } catch (error) { failures.push('Invalid preview JavaScript: ' + error.message); }
const themeJs = read('theme/theme.js');
try { new Script(themeJs); } catch (error) { failures.push('Invalid shared theme script: ' + error.message); }
report(themeJs.includes('prefers-color-scheme: dark'), 'System appearance support missing');
report(themeJs.includes('localStorage'), 'Persistent appearance preference missing');
report(componentsCss.includes('.ds-theme-toggle'), 'Shared theme control styles missing');

if (failures.length) {
  console.error(`Design system checks failed (${failures.length}):`);
  for (const failure of failures) console.error(' - ' + failure);
  process.exitCode = 1;
} else {
  console.log(`Design system checks passed: ${pages.length} HTML pages, linked assets, JS syntax, CSS tokens, contrast and accessibility primitives.`);
}
