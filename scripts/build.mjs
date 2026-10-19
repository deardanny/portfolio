import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
import { projects, featuredIds, groups, projectVisualHTML } from './projects.mjs';
import { dashboardPageHTML, dashboardPreviewHTML } from './dashboard.mjs';
import { projectOutputHTML, outputThumbnail, outputSpecs } from './outputs.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'https://hdjang.com';
const year = 2026;
const assetVersions = Object.fromEntries(await Promise.all(
  ['assets/site.css','assets/projects.css','assets/site.js','assets/charts.js','assets/favicon.svg','assets/dashboard.css','assets/dashboard.js','assets/dashboard-model.mjs','assets/outputs.css'].map(async path =>
    [path, createHash('sha256').update(await readFile(join(root, path))).digest('hex').slice(0,12)]
  )
));
const asset = path => `/${path}?v=${assetVersions[path]}`;
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nav = [['about','About','/'],['projects','Research & Projects','/projects/'],['experience','Experience','/experience/'],['cv','CV','/cv/']];

function shell({title, description, active, path, body, charts=false}) {
  const documentTitle = title ? `${title} — Daniel Jang` : 'Daniel Jang — NLP, LLMs & Human–AI Research';
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <title>${escape(documentTitle)}</title>
  <meta name="description" content="${escape(description)}">
  <link rel="canonical" href="${origin}${path}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escape(documentTitle)}">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:url" content="${origin}${path}">
  <meta property="og:image" content="${origin}/assets/portrait.jpg">
  <meta property="og:image:alt" content="Daniel (Heedong) Jang">
  <link rel="icon" href="${asset('assets/favicon.svg')}" type="image/svg+xml">
  <link rel="stylesheet" href="${asset('assets/site.css')}">${active==='projects'?`\n  <link rel="stylesheet" href="${asset('assets/outputs.css')}">`:''}
  <script src="${asset('assets/site.js')}" defer></script>
  ${charts?`<link rel="stylesheet" href="${asset('assets/projects.css')}"><script src="${asset('assets/charts.js')}" defer></script>`:''}
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div id="research-portfolio"><div class="rp-site">
    <header class="site-header">
      <a class="wordmark" href="/">Daniel Jang<span class="wordmark-note">Research & practice</span></a>
      <nav aria-label="Main navigation">${nav.map(([id,label,url])=>`<a href="${url}"${id===active?' aria-current="page"':''}>${label}</a>`).join('')}</nav>
    </header>
    <div class="site-layout">
      <aside class="profile" aria-label="Profile">
        <img src="/assets/portrait.jpg" class="portrait" width="640" height="960" alt="Black-and-white portrait of Daniel Jang">
        <div class="profile-copy"><a class="profile-name" href="/">Daniel Jang</a><p class="given-name">Heedong Jang · 장희동</p><p class="profile-role">Research Assistant<br>MISM · BIDA<br>Carnegie Mellon University</p><p class="profile-location">Pittsburgh, PA</p></div>
        <div class="profile-links"><a href="mailto:hdjang7@gmail.com">Email <span aria-hidden="true">↗</span></a><a href="https://www.linkedin.com/in/heedongjang/" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a><a href="https://github.com/deardanny" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a></div>
      </aside>
      <main id="main">${body}</main>
    </div>
    <footer class="site-footer"><span>© ${year} Daniel (Heedong) Jang</span><span>NLP · LLM evaluation · Applied ML</span></footer>
  </div></div>
</body>
</html>
`;
}

function resourceLinks(p, className='') {
  return (p.resources || []).map(r=>`<a${className?` class="${className}"`:''} href="${escape(r.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(`${r.label} for ${p.title}`)}">${escape(r.label)} <span aria-hidden="true">↗</span></a>`).join('');
}
function workRow(p, number, featured=false) {
  return `<article class="work-entry" data-project="${p.id}"><a class="work-row${featured?' work-featured':' with-output'}" href="/projects/${p.id}/"><span class="work-number" aria-hidden="true">${String(number).padStart(2,'0')}</span><div class="work-copy"><div class="work-topline"><p class="work-meta">${escape(p.meta)}</p><span class="work-status">${escape(p.status)}</span></div><h3>${escape(p.title)}</h3><p class="work-summary">${escape(p.desc)}</p><span class="work-evidence">${escape(p.signal)}<span class="evidence-context"> · ${escape(p.signalContext)}</span></span></div>${featured?'':outputThumbnail(p.id)}<span class="work-arrow" aria-hidden="true">↗</span></a><div class="work-links"><a href="/projects/${p.id}/" aria-label="${escape(`Case study: ${p.title}`)}">Case study <span aria-hidden="true">→</span></a>${outputSpecs[p.id]?`<a href="/projects/${p.id}/#output-preview" aria-label="${escape(`Interactive preview: ${p.title}`)}">Interactive preview <span aria-hidden="true">↗</span></a>`:''}${resourceLinks(p)}${p.resourceStatus?`<span class="resource-status">${escape(p.resourceStatus)}</span>`:''}</div></article>`;
}
const featured = featuredIds.map(id=>projects.find(p=>p.id===id));

const about = `
  <section class="introduction">
    <p class="eyebrow">NLP / LLMs / Applied machine learning</p>
    <h1 class="intro-title">Language models,<br>human judgment.</h1>
    <p class="intro-copy">I’m a research assistant and master’s student at Carnegie Mellon University, working on LLM evaluation and human–AI collaboration.</p>
    <p class="intro-context">My research builds on industry experience developing NLP systems and customer models at Kimberly-Clark. I’m interested in how language models can support decisions, and how to evaluate them alongside the people who use them.</p>
  </section>
  <section class="home-research" aria-labelledby="selected-work"><div class="section-heading"><h2 id="selected-work">Selected research & practice</h2><span>6 projects · Research to real-world decisions</span></div>${featured.map((p,i)=>workRow(p,i+1,true)).join('')}<a class="text-link all-work" href="/projects/">Explore all 13 projects <span aria-hidden="true">→</span></a></section>
  <section class="practice-note" aria-labelledby="practice-heading"><p class="eyebrow">A common thread</p><h2 id="practice-heading">From model output to a useful decision.</h2><p>Across research and industry, I work on the space between an algorithm and the person using it: defining the question, testing the evidence, and making the result understandable.</p><div class="inline-links"><a href="/experience/">Experience & background ↗</a><a href="/cv/">View CV ↗</a></div></section>`;

const projectIndex = `<p class="eyebrow">13 projects · Research, industry & personal work</p><h1>Research & Projects</h1><p class="page-intro">The questions I work on, the systems I build, and what the evidence can tell us. Open a project for methods, my contribution, and a visual explanation.</p><div class="project-filters" aria-label="Filter projects" hidden><button type="button" data-filter="all" aria-pressed="true">All <span>13</span></button>${groups.map(g=>`<button type="button" data-filter="${g.id}" aria-pressed="false">${g.label} <span>${projects.filter(p=>p.group===g.id).length}</span></button>`).join('')}</div><p class="filter-result" role="status" hidden>Showing all 13 projects</p>${groups.map(g=>`<section class="project-group" data-group="${g.id}" aria-labelledby="group-${g.id}"><div class="section-heading"><h2 id="group-${g.id}">${g.label}</h2><span>${projects.filter(p=>p.group===g.id).length} projects</span></div><p class="group-description">${g.description}</p>${projects.filter(p=>p.group===g.id).map(p=>workRow(p,projects.indexOf(p)+1)).join('')}</section>`).join('')}`;

const roles = [
  {dates:'May 2026 — Present',org:'Carnegie Mellon University',role:'Research Assistant · Human–AI Teaming Lab',text:'Developed an LLM paper-screening classifier and evaluated agreement with human labels. Adapted Overcooked maps, rewards, and LLM prompts for research on coordination and adaptation.',link:'/projects/screening/',label:'Explore the research'},
  {dates:'June — August 2026',org:'Butler Area School District',role:'Data Scientist Intern',text:'Standardized 50,000+ teacher evaluation records and analyzed 25,000+ qualitative comments. Built PII-masking workflows and presented findings to inform training and support priorities.',link:'/projects/basd/',label:'View the case study'},
  {dates:'October 2021 — June 2025',org:'Yuhan-Kimberly (Kimberly-Clark)',role:'Data Scientist · AI Labs',text:'Led an in-house NLP platform for consumer feedback and product issue monitoring. Built churn and purchase propensity models, evaluated targeting through A/B testing, and automated reporting.',link:'/projects/risk/',label:'View the NLP platform'}
];
const experience = `<p class="eyebrow">Research, industry & teaching</p><h1>Experience</h1><p class="page-intro">Building language-based systems and studying how people use them.</p><section class="roles" aria-label="Research and professional experience">${roles.map(r=>`<article class="role"><p class="role-dates">${r.dates}</p><h2>${r.org}</h2><p class="role-title">${r.role}</p><p>${r.text}</p><a class="text-link" href="${r.link}">${r.label} ↗</a></article>`).join('')}</section><section class="experience-section"><h2>Teaching</h2><p class="entry-title">Teaching Assistant · Data-Focused Python</p><p class="secondary">Carnegie Mellon University</p></section><section class="experience-section"><h2>Education</h2><div class="education-entry"><p class="entry-title">Carnegie Mellon University · Heinz College</p><p>Master of Information Systems Management<br>Business Intelligence & Data Analytics</p><p class="secondary">August 2025 — Expected December 2026</p></div><div class="education-entry"><p class="entry-title">Syracuse University</p><p>B.S. Information Management & Technology · Cum Laude</p><p class="secondary">May 2016</p></div></section><section class="experience-section"><h2>Earlier experience</h2><ul class="earlier-roles"><li><span>Saerona · Founder</span><span>2017–2020</span></li><li><span>Unico Search · ICT Consultant</span><span>2018–2019</span></li><li><span>Cavtil · IT Analyst</span><span>2016–2017</span></li></ul></section>`;

const cvText=await readFile(join(root,'scripts/cv-text.txt'),'utf8');
const cv = `<p class="eyebrow">Background & qualifications</p><h1>CV</h1><p class="page-intro">Research and industry experience, education, and technical skills.</p><div class="cv-actions"><a class="button" href="/Daniel_Jang_Resume.pdf" download="Daniel_Jang_Resume.pdf">Download PDF <span aria-hidden="true">↓</span></a><a class="text-link" href="/Daniel_Jang_Resume.pdf" target="_blank" rel="noopener">Open PDF ↗</a><span class="secondary">Résumé · 1 page</span></div><a class="cv-page" href="/Daniel_Jang_Resume.pdf" target="_blank" rel="noopener" aria-label="Open Daniel Jang’s résumé as a PDF"><img src="/assets/cv-preview.png" width="1020" height="1320" alt="Preview of Daniel Jang’s résumé. The full text is available below."></a><details class="cv-text"><summary>Read as text</summary><div>${escape(cvText)}</div></details>`;

const visualFallbacks={risk:'Sentiment accuracy: vendor system 60%; RoBERTa 80%; GPT-4o 95%.',crm:'CTR index for the best-performing segment: random targeting 100; model targeting 142.'};
function detail(p) {
  const sections=[['approach','Approach',p.approach],['contribution','My contribution',p.contribution],['evidence','Results & evidence',p.evidence],['context','Scope & interpretation',p.context]];
  const next=projects[(projects.indexOf(p)+1)%projects.length];
  return `<a class="back-link" href="/projects/">← All 13 projects</a><article class="case-study"><p class="eyebrow">${escape(p.meta)}</p><h1>${escape(p.title)}</h1><p class="page-intro">${escape(p.desc)}</p>${p.resources?.length?`<nav class="case-resources" aria-label="Project resources">${resourceLinks(p,'button')}</nav>`:`<p class="case-resource-status resource-status">${escape(p.resourceStatus)}</p>`}<div class="case-labels"><span class="status-badge">${escape(p.status)}</span>${p.tags.map(t=>`<span>${escape(t)}</span>`).join('')}</div><dl class="case-facts"><div><dt>My role</dt><dd>${escape(p.role)}</dd></div><div><dt>Scope</dt><dd>${escape(p.scope)}</dd></div><div><dt>When</dt><dd>${escape(p.period)}</dd></div></dl><section class="case-question"><h2>The question</h2><p>${escape(p.question)}</p></section>${p.id==='risk'?dashboardPreviewHTML():projectOutputHTML(p)}${p.id==='risk'?projectVisualHTML(p):`<details class="output-method"><summary>Method & project evidence <span>Open the supporting figure</span></summary>${projectVisualHTML(p)}</details>`}${visualFallbacks[p.id]?`<noscript><p>${visualFallbacks[p.id]}</p></noscript>`:''}<div class="case-sections">${sections.map(([id,label,text])=>`<section id="${id}"><h2>${label}</h2><p>${escape(text)}</p></section>`).join('')}</div><aside class="case-takeaway"><p class="eyebrow">What this work taught me</p><p>${escape(p.takeaway)}</p></aside><section class="case-materials" aria-label="Project materials"><h2>Project materials</h2><p>${escape(p.materials)}</p></section></article><nav class="case-navigation" aria-label="Other projects"><a href="/projects/">All projects</a><a href="/projects/${next.id}/">Next: ${escape(next.title)} →</a></nav>`;
}

const pages=[
  {path:'/',file:'index.html',title:'',active:'about',description:'Daniel Jang is a research assistant and MISM student at Carnegie Mellon University working on NLP, LLM evaluation, and human–AI collaboration.',body:about},
  {path:'/projects/',file:'projects/index.html',title:'Research & Projects',active:'projects',description:'Selected research and applied machine learning projects by Daniel Jang, with methods, evaluation, and visual explanations.',body:projectIndex},
  {path:'/experience/',file:'experience/index.html',title:'Experience',active:'experience',description:'Research, industry, teaching, and education: Carnegie Mellon University, Butler Area School District, and Kimberly-Clark.',body:experience},
  {path:'/cv/',file:'cv/index.html',title:'CV',active:'cv',description:'Read and download Daniel Jang’s résumé, including research and industry experience, education, and technical skills.',body:cv},
  ...projects.map(p=>({path:`/projects/${p.id}/`,file:`projects/${p.id}/index.html`,title:p.title,active:'projects',description:p.desc,body:detail(p),charts:true})),
  {path:'/projects/risk/dashboard/',file:'projects/risk/dashboard/index.html',customHTML:dashboardPageHTML(asset)}
];
for(const page of pages){await mkdir(dirname(join(root,page.file)),{recursive:true});await writeFile(join(root,page.file),(page.customHTML||shell(page)).replace(/[ \t]+$/gm,''));}
await writeFile(join(root,'404.html'),shell({title:'Page not found',description:'Return to Daniel Jang’s portfolio.',active:'',path:'/404.html',body:'<p class="eyebrow">404</p><h1>This page has moved.</h1><p class="page-intro">Explore my research and projects, or return to the homepage.</p><a class="button" href="/">Back to About →</a>'}));
await writeFile(join(root,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+pages.map(p=>`  <url><loc>${origin}${p.path}</loc></url>`).join('\n')+'\n</urlset>\n');
console.log(`Built ${pages.length} pages and the 404 page.`);
