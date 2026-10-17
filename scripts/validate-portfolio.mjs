#!/usr/bin/env node
/**
 * Portfolio integration smoke/regression checks.
 * No npm dependencies; run from repository root:
 * node scripts/validate-portfolio.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const css = readFileSync(resolve(root, 'portfolio.css'), 'utf8');
const js = readFileSync(resolve(root, 'portfolio.js'), 'utf8');
const errors = [];
const check = (ok, message) => { if (!ok) errors.push(message); };

const hrefs = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const idSet = new Set(ids);
check(ids.length === idSet.size, 'Duplicate HTML IDs');
for (const url of hrefs) {
  if (/^(https?:|mailto:|tel:|data:|\/)/i.test(url)) continue;
  if (url.startsWith('#')) {
    check(idSet.has(url.slice(1)), 'Unresolved anchor: ' + url);
    continue;
  }
  const localPath = resolve(root, url.split('#')[0].split('?')[0]);
  check(existsSync(localPath), 'Missing asset: ' + url);
}
for (const id of ['top', 'sobre', 'projetos', 'jornada', 'experiencia', 'contato', 'conteudo']) {
  check(idSet.has(id), 'Missing original section or main landmark: ' + id);
}
for (const asset of [
  './design-system/tokens/tokens.css',
  './design-system/components/components.css',
  './portfolio.css',
  './portfolio.js'
]) check(hrefs.includes(asset), 'Missing DS integration import: ' + asset);
check(!hrefs.includes('./style.css'), 'Legacy CSS still loaded');
check(html.includes('<body class="ds-app">'), 'Design-system app scope missing');
check(html.includes('class="ds-header"'), 'Shared header not used');
check(html.includes('data-menu-button') && html.includes('data-menu-panel'), 'Mobile menu incomplete');
check(html.includes('aria-expanded="false"'), 'Menu state not initialized');
check(html.includes('class="ds-skip-link"'), 'Skip link missing');
check(html.includes('<main id="conteudo">'), 'Main landmark missing');
check(html.includes('href="/axiom/"'), 'Axiom route missing from navigation');
check(html.includes('Abrir página do Axiom') && html.includes('Axiom ↗'),
  'Axiom branding missing in navigation');
check(!/Axion/i.test(html), 'Incorrect Axion spelling found; use Axiom');
const projectSection = html.split('id="projetos">')[1]?.split('</section>')[0] || '';
check(Boolean(projectSection), 'Featured projects section missing');
const listedRepos = [...projectSection.matchAll(new RegExp('href="https://github[.]com/rgomids/([^"/]+)"', 'g'))]
  .map(match => match[1]);
const expectedPins = ['axiom', 'atlas-erp-core', 'nexus-platform'];
check(JSON.stringify(listedRepos) === JSON.stringify(expectedPins),
  'Featured projects must match current pinned GitHub repositories in order: ' + listedRepos.join(', '));
check((projectSection.match(/class="project-card ds-card/g) || []).length === expectedPins.length,
  'Featured card count must match pinned repository count');
for (const label of ['Axiom', 'Atlas ERP Core', 'Nexus Platform']) {
  check(projectSection.includes('<h3>' + label + '</h3>'), 'Pinned project title missing: ' + label);
}
check(!/DDD Starter Modelling|Go Clean Architecture/.test(projectSection),
  'Removed forks must not remain in pinned projects');
check((html.match(/class="journey-item"/g) || []).length >= 10, 'Journey timeline may have lost entries');
check((html.match(/class="timeline-item"/g) || []).length === 3, 'Experience items changed');
check(html.includes('Rafael Gomides') && html.includes('Backend, cloud e engenharia de software'), 'Hero content changed');
check(html.includes('Da curiosidade pelo primeiro computador'), 'Journey content changed');
check(html.includes('Tem um problema difícil de backend'), 'Contact content changed');
check(/prefers-reduced-motion/.test(css), 'Reduced-motion support missing');
check(/max-width:\s*600px/.test(css), 'Small-screen layout missing');
try { new Script(js); } catch (error) { errors.push('Invalid JavaScript: ' + error.message); }

// The original site remains a static GitHub Pages page and requires no build.
check(extname('index.html') === '.html', 'Static root entry expected');

if (errors.length) {
  for (const issue of errors) console.error('FAIL:', issue);
  console.error(`Portfolio verification failed: ${errors.length} issue(s).`);
  process.exitCode = 1;
} else {
  console.log(`Portfolio verification passed: ${ids.length} anchors/IDs, assets, design-system imports, content markers and JavaScript syntax.`);
}
