import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { demoData } from './dashboard-data.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const projectIds = ['screening','teaming','tui','synthetic','risk','basd','crm','power','voc','humanitarian','fraud','job-radar','rag'];
const featuredIds = ['screening','teaming','tui','risk','basd','power'];
const read = file => readFile(join(root, file), 'utf8');
const projectLinks = html => [...html.matchAll(/data-project="([^"]+)"/g)].map(m => m[1]);
const home = await read('index.html');
const index = await read('projects/index.html');
const demo = JSON.parse((await read('projects/risk/dashboard/index.html')).match(/<script type="application\/json" id="demo-data">([\s\S]*?)<\/script>/)[1]);
assert.deepEqual(demo, demoData, 'Published demo data must match the synthetic fixture');
assert.equal(demo.records.length, 700, 'Demo must contain 700 invented records');
assert.equal(new Set(demo.records.map(r=>r.id)).size, 700, 'Every demo record needs a unique ID');
assert.equal(demo.records.filter(r=>r.source==='review').length, 468, 'Review sample size');
assert.equal(demo.records.filter(r=>r.source==='community').length, 232, 'Community sample size');
assert.ok(demo.records.every(r=>!r.flagged || r.sentiment==='negative' && r.keyword), 'Flags must have a signal and a negative annotation');
assert.deepEqual(projectLinks(home), featuredIds, 'Homepage must feature the agreed six projects');
assert.deepEqual(projectLinks(index), projectIds, 'Index must contain all thirteen projects once');

for (const id of projectIds) {
  const html = await read(`projects/${id}/index.html`);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${id}: one main heading`);
  assert.match(html, /<figure\b[\s\S]*<figcaption>[^<]+<\/figcaption>/, `${id}: visual with a caption`);
  for (const section of ['approach','contribution','evidence','context']) {
    assert.ok(html.includes(`<section id="${section}">`), `${id}: missing ${section}`);
  }
  for (const label of ['My role','Scope','When']) {
    assert.ok(html.includes(`<dt>${label}</dt>`), `${id}: missing ${label}`);
  }
  assert.ok(!/\b(?:undefined|TODO|TBD)\b/.test(html), `${id}: unfinished content`);
}

async function htmlFiles(directory = '') {
  const files = [];
  for (const entry of await readdir(join(root, directory), { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(path));
    else if (entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}
const files = await htmlFiles();
assert.equal(files.length, 19, 'Eighteen pages including the dashboard, plus a 404 page');
let links = 0;
for (const file of files) {
  const html = await read(file);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, new Set(ids).size, `${file}: duplicate HTML IDs`);
  const route = '/' + file.replace(/index\.html$/, '');
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url = new URL(match[1].replace(/&amp;/g, '&'), `https://hdjang.com${route}`);
    if (url.origin !== 'https://hdjang.com') continue;
    let target = decodeURIComponent(url.pathname).replace(/^\//, '');
    if (!target || target.endsWith('/')) target += 'index.html';
    assert.ok((await stat(join(root, target))).isFile(), `${file}: missing ${target}`);
    if (url.hash && target.endsWith('.html')) {
      const destination = await read(target);
      assert.ok(destination.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${file}: missing anchor ${url.hash}`);
    }
    links++;
  }
}
const locations = [...(await read('sitemap.xml')).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
assert.equal(locations.length, 18, 'Sitemap must contain all public pages');
assert.equal(new Set(locations).size, 18, 'Sitemap URLs must be unique');
for (const file of files.filter(f => f !== '404.html')) {
  assert.ok(locations.includes('https://hdjang.com/' + file.replace(/index\.html$/, '')), `${file}: missing sitemap entry`);
}
console.log(`Validated 6 featured projects, 13 case studies, 19 HTML files, ${links} local links/assets, and 18 sitemap entries.`);
