import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const projectIds = ['screening','teaming','tui','synthetic','risk','basd','crm','power','voc','humanitarian','fraud','job-radar','rag'];
const featuredIds = ['screening','teaming','tui','risk','basd','power'];
const read = file => readFile(join(root, file), 'utf8');
const projectLinks = html => [...html.matchAll(/data-project="([^"]+)"/g)].map(m => m[1]);
const home = await read('index.html');
const index = await read('projects/index.html');
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
assert.equal(files.length, 18, 'Seventeen pages plus a 404 page');
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
assert.equal(locations.length, 17, 'Sitemap must contain all public pages');
assert.equal(new Set(locations).size, 17, 'Sitemap URLs must be unique');
for (const file of files.filter(f => f !== '404.html')) {
  assert.ok(locations.includes('https://hdjang.com/' + file.replace(/index\.html$/, '')), `${file}: missing sitemap entry`);
}
console.log(`Validated 6 featured projects, 13 case studies, 18 HTML files, ${links} local links/assets, and 17 sitemap entries.`);
