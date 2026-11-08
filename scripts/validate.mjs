import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { demoData } from './dashboard-data.mjs';
import { outputSpecs, claimFixtures, claimOutcome } from './outputs.mjs';
import { initialState, filterRecords, summarize, sortRecords, toCSV } from '../assets/dashboard-model.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const projectIds = ['screening','teaming','hospitality','synthetic','risk','education','crm','power','voc','humanitarian','fraud','job-radar','rag'];
const featuredIds = ['screening','teaming','hospitality','risk','education','power'];
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
assert.ok(demo.records.every(r=>r.channel && r.product && (r.source==='review' ? r.rating>=1&&r.rating<=5 : r.rating===null)), 'Every synthetic record needs valid analysis dimensions');
const base=initialState();
const reviewRows=filterRecords(demo.records,base,{source:'review'});
assert.equal(summarize(reviewRows).total,468,'Review overview size');
assert.equal(summarize(reviewRows).positive,263,'Sentiment totals reconcile with the dataset');
const issueState={...base,brand:'a',topic:'Battery life',sentiment:'negative'};
assert.equal(filterRecords(demo.records,issueState,{source:'review'}).length,27,'Brand, topic and sentiment must intersect');
assert.equal(filterRecords(demo.records,{...issueState,flagged:true},{source:'review'}).length,8,'Flags must narrow the existing intersection');
assert.equal(filterRecords(demo.records,{...issueState,day:'2026-02-27'},{source:'review'}).length,4,'A daily chart selection must narrow the existing intersection');
assert.equal(filterRecords(demo.records,issueState,{source:'review',omit:['sentiment']}).length,55,'Sentiment chart retains comparison choices while honoring other dimensions');
assert.equal(filterRecords(demo.records,{...base,brand:'b',period:1},{source:'review'}).length,44,'Period and brand filter together');
assert.equal(filterRecords(demo.records,{...base,channel:'Brand store',rating:5},{source:'community'}).length,0,'Incompatible dimensions produce a safe empty state');
const emptySummary=summarize(filterRecords(demo.records,{...base,query:'zz-no-match'},{source:'all'}));
assert.equal(emptySummary.total,0);assert.equal(emptySummary.rating,null);
assert.equal(filterRecords(demo.records,base,{source:'community'}).length,232,'Community uses its own dataset');
assert.equal(sortRecords(reviewRows,'oldest')[0].date,'2026-02-02');
assert.equal(sortRecords(reviewRows,'newest')[0].date,'2026-03-01');
const exportRows=filterRecords(demo.records,{...issueState,flagged:true},{source:'review'});
const csv=toCSV(exportRows,{a:'Brand A',b:'Brand B',c:'Brand C'});
assert.equal(csv.split('\r\n').length,9,'CSV must contain the eight selected records plus a header');
assert.ok(exportRows.every(r=>csv.includes(r.id)),'CSV must preserve all selected record IDs');
assert.deepEqual(projectLinks(home), featuredIds, 'Homepage must feature the agreed six projects');
assert.deepEqual(projectLinks(index), projectIds, 'Index must contain all thirteen projects once');
assert.equal((index.match(/class="output-thumbnail"/g)||[]).length,13,'Every project needs an index thumbnail');
assert.equal(Object.keys(outputSpecs).length,12,'Twelve projects supplement the standalone NLP dashboard');
for (const threshold of [.25,.5,.75]) {
  const c=claimOutcome(threshold);
  assert.equal(c.tp+c.fp+c.tn+c.fn,claimFixtures.length,'Demo confusion matrix must account for every fictional claim');
  assert.equal(c.tp+c.fn,8,'Changing a threshold cannot change the underlying fraud labels');
}
assert.deepEqual(claimOutcome(.5),{tp:6,fp:14,tn:18,fn:2,cost:37000},'Midpoint demo threshold must reconcile counts and assumed error costs');

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
  if(outputSpecs[id]) {
    assert.ok(html.includes('id="output-preview"'),`${id}: missing output preview`);
    assert.ok(html.includes(outputSpecs[id].note),`${id}: missing reconstruction disclosure`);
    const options=[...html.matchAll(/<option value="(output-[^"]+)"/g)].map(m=>m[1]);
    assert.ok(options.length>=2,`${id}: preview needs selectable examples`);
    for(const option of options)assert.ok(html.includes(`id="${option}"`),`${id}: missing example panel`);
  }
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
