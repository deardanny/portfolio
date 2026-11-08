// Portfolio reconstructions. Fictional fixtures are separate from reported results.
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const metric = (label, value, detail='') => `<div><span>${label}</span><strong>${value}</strong><small>${detail}</small></div>`;
const metrics = (...items) => `<div class="output-metrics">${items.join('')}</div>`;
const badge = (text, kind='') => `<span class="output-badge ${kind}">${text}</span>`;
const note = (title, text) => `<aside class="output-insight"><span>${title}</span><p>${text}</p></aside>`;
const bars = rows => `<div class="output-bars">${rows.map(([name,value,label])=>`<div><span>${name}</span><i aria-hidden="true"><b style="width:${value}%"></b></i><strong>${label??value+'%'}</strong></div>`).join('')}</div>`;
const table = (headers, rows) => `<div class="output-table-wrap" tabindex="0" role="region" aria-label="Scrollable example data"><table class="output-table"><thead><tr>${headers.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((cell,i)=>i===0?`<th scope="row">${cell}</th>`:`<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const split = (a,b) => `<div class="output-split"><div>${a}</div><div>${b}</div></div>`;
const label = text => `<h3 class="output-label">${text}</h3>`;
const panels = (id, control, entries) => `<div class="output-explorer" data-switch><label class="output-control" hidden>${control}<select data-panel-select>${entries.map((e,i)=>`<option value="output-${id}-${i}">${esc(e.name)}</option>`).join('')}</select></label><div class="output-panels" aria-live="polite">${entries.map((e,i)=>`<section class="output-panel" data-panel id="output-${id}-${i}" aria-label="${esc(e.name)}"${i?' hidden':''}>${e.body}</section>`).join('')}</div></div>`;

function screening() {
  const papers = [
    ['P-01','Shared planning with an AI teammate','Include','Include','Agreement','A controlled collaborative task measures human–AI coordination. Both labels match the example inclusion rule.'],
    ['P-02','Conversational agents in individual study','Exclude','Include','Disagreement','The abstract mentions an assistant but does not establish a collaborative task. A reviewer needs to resolve the interpretation.'],
    ['P-03','Adaptive roles in a simulated kitchen','Include','Include','Low confidence','The labels agree, but the fictional model annotation expresses uncertainty about whether the reported outcome meets the rule.']
  ];
  return panels('screening','Inspect a fictional paper',papers.map((p,index)=>({name:`${p[0]} · ${p[4]}`,body:
    `${metrics(metric('Review queue','3 papers','Invented abstracts'),metric('Selected case',p[4],p[0]))}${table(['Paper','Human','LLM'],papers.map((r,i)=>[`<button type="button" class="output-record-trigger" data-preview-target="output-screening-${i}" aria-pressed="${i===index}">${r[0]}<small>${r[1]}</small></button>`,r[2],r[3]]))}${split(`${label('Selected abstract')}<div class="output-document"><span>${p[0]} / abstract excerpt</span><p>${index===0?'Participants jointly planned and completed a timed task with an AI partner. The study compared coordination strategies.':index===1?'Participants used a conversational assistant to study independently. Outcomes described individual recall and satisfaction.':'A simulated kitchen task varied the responsibilities of a human and an adaptive agent. The abstract gives limited detail on outcome measurement.'}</p></div>`,`${label('Decision inspection')}${badge(p[4],index?'warn':'')}${note('Review rationale',p[5])}<p class="output-footnote">Human review remains the final step. These sample cases do not generate the reported κ ≈ 0.80.</p>`)} `
  })));
}

function teaming() {
  const stages = [
    {name:'1 · Divide responsibilities',h:15,a:19,task:'Collect ingredients',human:'Collect onion → pot',ai:'Collect tomato → prep',message:'I will handle the tomato route. Can you start the onion soup?'},
    {name:'2 · Coordinate at the counter',h:17,a:11,task:'Avoid a shared bottleneck',human:'Use the lower passage',ai:'Wait at prep counter',message:'The center passage is busy. I will wait while you move to the pot.'},
    {name:'3 · Deliver and reassign',h:9,a:17,task:'Complete the shared order',human:'Deliver onion soup · 20 pts',ai:'Continue tomato soup · 30 pts',message:'Onion soup is ready. After delivery, help finish the tomato order.'}
  ];
  return panels('teaming','Walk through the illustrative task',stages.map(s=>({name:s.name,body:
    `${metrics(metric('Onion recipe','20 pts','Configured reward'),metric('Tomato recipe','30 pts','Configured reward'))}${split(`<div class="kitchen-board" role="img" aria-label="Schematic shared kitchen: human and AI positions change with the selected task stage">${Array.from({length:35},(_,i)=>{const stations={0:'Onion',3:'Prep',6:'Tomato',7:'Pot',13:'Serve',28:'Plate',31:'Counter',34:'Pot'};return `<div class="kitchen-cell ${stations[i]?'station':''} ${i===s.h?'human':i===s.a?'agent':''}">${i===s.h?'H':i===s.a?'AI':stations[i]||'<span aria-hidden="true">·</span>'}</div>`}).join('')}</div><p class="output-footnote">H = human · AI = teammate. Original schematic, not the study’s game map.</p>`,`${label(s.task)}<div class="output-assignment"><div><b>Human</b><span>${s.human}</span></div><div><b>AI partner</b><span>${s.ai}</span></div></div>${note('Example coordination prompt',s.message)}`)} `
  })));
}

function tui() {
  const cases = [
    {name:'Clear attributes',input:'Twin room, sea view, balcony',tokens:['Twin beds','Sea view','Balcony'],decision:'Candidate for review',reason:'The description supports all three attributes in the illustrative catalog entry.',matches:[['Twin · Sea view · Balcony','3 of 3 attributes'],['Double · Sea view · Balcony','Bed type conflicts'],['Twin · Garden view','View conflicts']]},
    {name:'Missing room detail',input:'Comfort room with a view',tokens:['Room type unclear','View unspecified','Bed type missing'],decision:'Leave unmapped',reason:'A view is mentioned, but neither the bed configuration nor the view category can be established.',matches:[['Twin · Sea view','Insufficient evidence'],['Double · Garden view','Insufficient evidence'],['Family · Courtyard view','Insufficient evidence']]},
    {name:'Conflicting description',input:'Double room — two single beds, garden outlook',tokens:['Double / twin conflict','Garden view','No balcony evidence'],decision:'Manual review',reason:'The room label and bed description disagree. Preserve the conflict instead of silently choosing one.',matches:[['Twin · Garden view','Bed count supports'],['Double · Garden view','Room label supports'],['Twin · Garden · Balcony','Balcony unsupported']]}
  ];
  return panels('tui','Try an invented supplier description',cases.map(c=>({name:c.name,body:
    `${label('Supplier text')}<blockquote class="output-quote">${c.input}</blockquote><div class="output-chips">${c.tokens.map(t=>badge(t)).join('')}</div>${split(`${label('Candidate catalog entries')}<div class="output-candidates">${c.matches.map(([a,b],i)=>`<div><span class="candidate-number">0${i+1}</span><div><strong>${a}</strong><small>${b}</small></div></div>`).join('')}</div>`,`${label('Matching decision')}${badge(c.decision,c.decision==='Candidate for review'?'':'warn')}${note('Evidence behind the decision',c.reason)}<p class="output-footnote">Concept preview of the matching workflow. No embeddings or production matcher run here.</p>`)} `
  })));
}

function synthetic() {
  return panels('synthetic','Explore the analysis report',[
    {name:'Treatment estimates by response source',body:`${metrics(metric('Human sample','38','Observed survey responses'),metric('Synthetic sample','1,100','Claude-generated responses'))}${label('Effect on stated willingness to click Premium')}<div class="effect-report">${[['Humans',0.011,38],['Synthetic',0.912,1100]].map(([name,effect,n])=>`<div><span>${name}<small>n = ${n.toLocaleString('en-US')}</small></span><div aria-hidden="true"><i style="width:${effect*100}%"></i></div><strong>+${effect.toFixed(3)}</strong></div>`).join('')}<p>0 <span>+1 Likert point</span></p></div>${note('Read the difference carefully','These are reported estimates of stated intent. The generation prompt included a treatment-direction cue; the small human sample is inconclusive.')}`},
    {name:'Who dominates the pooled sample?',body:`${metrics(metric('Total responses','1,138','Two different data sources'),metric('Synthetic share','96.7%','1,100 ÷ 1,138'))}${label('Sample composition')}<div class="sample-waffle" role="img" aria-label="Roughly 97 of every 100 responses are synthetic">${Array.from({length:100},(_,i)=>`<i class="${i<97?'synthetic-dot':'human-dot'}"></i>`).join('')}</div><p class="output-legend"><span>Blue: synthetic ≈ 97%</span><span>Gray: human ≈ 3%</span></p>${note('Why separate the estimates?','A pooled result is dominated by the synthetic source. More generated observations do not substitute for human evidence. The 100-cell picture rounds the source shares.')}`}
  ]);
}

function education() {
  const names=['Planning','Instruction','Classroom environment','Professional practice'];
  const schools=[{name:'All three fictional schools',scores:[3.1,2.4,3.4,3.0],missing:[12,35,8,17],n:360}, {name:'School A',scores:[3.2,2.5,3.5,3.1],missing:[10,31,7,14],n:120},{name:'School B',scores:[3.0,2.2,3.3,2.8],missing:[14,42,10,21],n:120},{name:'School C',scores:[3.1,2.5,3.4,3.1],missing:[12,32,7,16],n:120}];
  return panels('education','Compare an invented school sample',schools.map(s=>({name:s.name,body:
    `${metrics(metric('Example records',s.n,'Synthetic aggregate sample'),metric('Areas compared','4','Illustrative rubric'))}${label('Scores and supporting evidence')}<div class="rubric-grid"><div class="rubric-row rubric-header"><span>Area</span><span>Average / 4</span><span>Missing evidence</span></div>${names.map((name,i)=>`<div class="rubric-row"><span>${name}</span><div><strong>${s.scores[i].toFixed(1)}</strong><i aria-hidden="true"><b style="width:${s.scores[i]/4*100}%"></b></i></div><div><strong>${s.missing[i]}%</strong><i class="amber" aria-hidden="true"><b style="width:${s.missing[i]}%"></b></i></div></div>`).join('')}</div>${split(note('Support-planning signal','In this invented sample, Instruction has both the lowest score and the most missing evidence. This illustrates a pattern to investigate, not a causal relationship.'),`${label('Privacy-aware text example')}<div class="masked-example"><p lang="en"><mark>[TEACHER]</mark> at <mark>[SCHOOL]</mark> used guided practice.</p><span>Names masked before theme extraction</span></div><p class="output-footnote">Invented text, school groups, rubric and scores. No teacher-level records are shown.</p>`)} `
  })));
}

function crm() {
  const segments=[['Recent browsers',0.86,48],['Returning buyers',0.73,72],['Occasional shoppers',0.61,60],['New sign-ups',0.48,80],['Inactive members',0.25,100]];
  return panels('crm','Change the illustrative targeting threshold',[0.4,0.6,0.8].map(t=>({name:`Propensity score ≥ ${t.toFixed(1)}`,body:
    `${metrics(metric('Fictional audience','360','Synthetic customer groups'),metric('Selected audience',segments.filter(s=>s[1]>=t).reduce((n,s)=>n+s[2],0),'Score passes the selected threshold'))}${label('Audience selection preview')}${table(['Example segment','Demo score','Customers','Selection'],segments.map(([name,score,n])=>[name,score.toFixed(2),n,badge(score>=t?'Selected':'Hold',score>=t?'':'muted')]))}${note('From scores to an experiment','The selection preview uses invented scores and counts. The actual coupon experiment compared model-based and random targeting; its reported +42% relative CTR applies only to the strongest segment. See the separate result chart below.')}`
  })));
}

function power() {
  const scenarios=[{name:'24-hour planning scenario',demand:[2300,1850,1400,920,760,420,260,150],horizon:'24h'}, {name:'48-hour planning scenario',demand:[1850,2100,1780,1050,980,580,300,210],horizon:'48h'}];
  return panels('power','Switch the illustrative planning horizon',scenarios.map(s=>{
    const ranked=s.demand.map((n,i)=>({n,i})).sort((a,b)=>b.n-a.n);
    const selected=new Set(ranked.slice(0,5).map(x=>x.i));
    const served=s.demand.reduce((n,d,i)=>n+(selected.has(i)?Math.min(1000,d):0),0);
    return {name:s.name,body:`${metrics(metric('Scenario horizon',s.horizon,'Invented forecast inputs'),metric('Generators','5','1,000 households each'),metric('Capacity matched',served.toLocaleString('en-US'),'Households in this illustration'))}${split(`${label('Illustrative regional placement')}<div class="allocation-map" role="img" aria-label="Eight fictional regions; five have one generator assigned">${s.demand.map((d,i)=>`<div class="${selected.has(i)?'allocated':''}"><span>Region ${String.fromCharCode(65+i)}</span><strong>${d.toLocaleString('en-US')}</strong><small>${selected.has(i)?'▣ Generator':'No unit'}</small></div>`).join('')}</div><p class="output-footnote">A schematic grid, not a geographic map or the original 83-county output.</p>`,`${label('Priority queue')}${bars(ranked.slice(0,5).map(({n,i})=>[`Region ${String.fromCharCode(65+i)}`,n/2500*100,n.toLocaleString('en-US')]))}${note('Allocation rule for this demo','Assign one unit to each of the five highest-demand regions. Count at most 1,000 served households per unit; placement is fixed after deployment.')}`)}`};
  }));
}

function voc() {
  const topics=[
    ['Delivery timing',['배송','지연','도착'],[36,27,18],'배송이 예상보다 늦게 도착했어요.','The delivery arrived later than expected.'],
    ['Package condition',['포장','상자','파손'],[34,29,20],'상자가 찌그러져서 내용물을 확인했어요.','The box was dented, so I checked the contents.'],
    ['Missing items',['누락','수량','확인'],[40,24,19],'주문한 수량보다 적게 들어 있었어요.','The package contained fewer items than ordered.'],
    ['Return process',['반품','접수','회수'],[33,28,21],'반품 접수 후 회수 일정을 알고 싶어요.','I would like to know the pickup schedule after requesting a return.'],
    ['Product use',['사용','설명','방법'],[37,25,17],'설명서에서 사용 방법을 찾기 어려웠어요.','It was difficult to find the usage instructions.'],
    ['Response time',['문의','답변','대기'],[35,26,22],'문의한 내용에 대한 답변을 기다리고 있어요.','I am waiting for a response to my question.']
  ];
  return panels('voc','Inspect a synthetic topic',topics.map((t,index)=>({name:`Topic ${index+1} · ${t[0]}`,body:
    `${split(`${label('Topic landscape')}<div class="topic-landscape" role="group" aria-label="Select a synthetic topic. Positions and sizes are illustrative.">${topics.map((x,i)=>`<button type="button" class="topic-bubble ${i===index?'active':''}" data-preview-target="output-voc-${i}" aria-pressed="${i===index}" aria-label="Topic ${i+1}: ${x[0]}" style="--x:${[20,60,80,38,68,22][i]}%;--y:${[23,22,53,53,80,81][i]}%;--size:${[64,52,48,66,58,45][i]}px">${i+1}</button>`).join('')}</div><p class="output-footnote">Schematic topic layout; not trained LDA coordinates or measured prevalence.</p>`,`${label(`Topic ${index+1} · ${t[0]}`)}${bars(t[1].map((w,i)=>[`<span lang="ko">${w}</span>`,t[2][i],(t[2][i]/100).toFixed(2)]))}<p class="output-footnote">Invented word weights; only three example terms shown.</p><div class="output-document"><span>Fictional supporting ticket</span><p lang="ko">${t[3]}</p><small>${t[4]}</small></div>`)} `
  })));
}

function humanitarian() {
  const groups=[{name:'Health · Fictional fund',high:4.1,low:-3.4,offset:0},{name:'Shelter · Fictional fund',high:3.6,low:-3.2,offset:8}];
  return panels('humanitarian','Inspect a fictional peer group',groups.map((g,idx)=>({name:g.name,body:
    `${metrics(metric('Illustrative peer group','20 projects','Fictional budgets and beneficiaries'),metric('Review queue','2','|Z-score| > 3'))}${split(`${label('Budget relative to the peer benchmark')}<svg class="output-scatter" viewBox="0 0 360 250" role="img" aria-label="Illustrative log-budget versus log-beneficiary scatter plot. Most points follow the benchmark; two are flagged."><path class="plot-grid" d="M45 25V210H335 M45 150H335 M45 90H335"/><path class="plot-reference" d="M55 194L325 40"/>${Array.from({length:18},(_,i)=>`<circle class="plot-point" cx="${62+i*14}" cy="${190-i*8+[-10,7,2,12,-5,5][i%6]+g.offset}" r="4"/>`).join('')}<circle class="plot-alert" cx="170" cy="47" r="7"/><text x="182" y="48">F-01</text><circle class="plot-alert" cx="264" cy="174" r="7"/><text x="275" y="176">F-02</text><text x="47" y="237">log(beneficiaries) →</text><text x="48" y="17">log(budget)</text></svg>`,`${label('Cases for contextual review')}<div class="output-candidates"><div><span class="candidate-number">01</span><div><strong>F-01 · Z = +${g.high.toFixed(1)}</strong><small>Above its peer benchmark</small></div></div><div><span class="candidate-number">02</span><div><strong>F-02 · Z = ${g.low.toFixed(1)}</strong><small>Below its peer benchmark</small></div></div></div>${note('Review questions','Check beneficiary definitions, reporting errors and unusual delivery costs. A statistical flag is not proof of waste or fraud.')}`)}<p class="output-footnote">Illustrative points and Z-scores. Actual notebook totals—15,664 analyzed and 123 flagged—are reported separately below.</p>`
  })));
}

// Explicit fictional claims allow every threshold result to be recomputed.
export const claimFixtures = Array.from({length:40},(_,i)=>({score:(i+1)/41,fraud:[3,11,21,26,29,34,37,39].includes(i)}));
export function claimOutcome(threshold) {
  const c={tp:0,fp:0,tn:0,fn:0};
  for(const row of claimFixtures)c[row.fraud?(row.score>=threshold?'tp':'fn'):(row.score>=threshold?'fp':'tn')]++;
  return {...c,cost:c.fn*15000+c.fp*500};
}
function fraud() {
  return panels('fraud','Compare example decision thresholds',[0.25,0.5,0.75].map(t=>{const c=claimOutcome(t);return {name:`Flag if demo score ≥ ${t.toFixed(2)}`,body:
    `${metrics(metric('Claims in demo','40','8 fictional fraud labels'),metric('Sent to review',c.tp+c.fp,'Score meets the threshold'),metric('Assumed error cost','$'+c.cost.toLocaleString('en-US'),'Not realized business losses'))}${split(`${label('What changes at this threshold?')}<div class="confusion-matrix"><div><small>Flagged · fraud</small><strong>${c.tp}</strong><span>True positives</span></div><div class="costly"><small>Not flagged · fraud</small><strong>${c.fn}</strong><span>False negatives</span></div><div class="costly"><small>Flagged · legitimate</small><strong>${c.fp}</strong><span>False positives</span></div><div><small>Not flagged · legitimate</small><strong>${c.tn}</strong><span>True negatives</span></div></div>`,`${label('Cost calculation')}<div class="output-calculation"><p>${c.fn} missed × $15,000</p><p>+ ${c.fp} false alarms × $500</p><strong>$${c.cost.toLocaleString('en-US')}</strong></div>${note('A trade-off, not a performance claim','Lowering the threshold sends more claims to review. This tiny invented sample illustrates asymmetric error costs; it does not estimate the course model’s performance.')}`)} `
  };}));
}

function jobRadar() {
  const jobs=[
    {name:'Ready for human review',company:'Example Studio',title:'Applied NLP Analyst',checks:[['Publication date','Explicit date supplied'],['Role and skills','NLP / Python / evaluation'],['Eligibility','Explicit role-level evidence']],result:'Ready for review',why:'The example passes the discovery gates. A person still checks the original posting before applying.'},
    {name:'Hold · publication date missing',company:'Example Research',title:'Machine Learning Associate',checks:[['Publication date','Only an update date exists'],['Role and skills','Strong text match'],['Eligibility','Explicit role-level evidence']],result:'Needs verification',why:'An update timestamp cannot establish when the role was published. Keep it available for rechecking instead of marking it as reported.'},
    {name:'Hold · eligibility unclear',company:'Example Analytics',title:'Data Scientist',checks:[['Publication date','Explicit date supplied'],['Role and skills','Python / analytics / ML'],['Eligibility','Application asks a sponsorship question']],result:'Needs verification',why:'A form question does not establish sponsorship availability. Withhold the recommendation until role-specific evidence is found.'}
  ];
  return panels('job-radar','Open an invented discovery result',jobs.map((j,i)=>({name:j.name,body:
    `${split(`<div class="job-preview"><span>FICTIONAL JOB FEED / 0${i+1}</span><h3>${j.title}</h3><p>${j.company}</p>${badge(j.result,i?'warn':'')}<div class="output-chips"><span>Python</span><span>${i===0?'NLP':'Applied ML'}</span><span>Early career</span></div></div>`,`${label('Evidence checklist')}<div class="output-checklist">${j.checks.map(([a,b],k)=>`<div><span class="check-symbol">${i===1&&k===0||i===2&&k===2?'?':'✓'}</span><div><strong>${a}</strong><small>${b}</small></div></div>`).join('')}</div>`)}${note('Reporting decision',j.why)}<p class="output-footnote">Example companies and roles only. No live job search, personal résumé, eligibility claim about the owner, or external message is sent.</p>`
  })));
}

function rag() {
  const examples=[
    {q:'How were the documents split?',answer:'The fictional methods note describes 1,000-character chunks with 200-character overlap.',context:[['Methods excerpt','Documents are divided into chunks of 1,000 characters. Adjacent chunks overlap by 200 characters.'],['Retrieval excerpt','The index returns three passages for each question.'],['Limitations excerpt','Retrieval coverage and answer support have not been independently evaluated.']]},
    {q:'How much did answer accuracy improve?',answer:'The supplied example context does not report an accuracy comparison. An improvement cannot be established from these passages.',context:[['Limitations excerpt','Retrieval coverage and answer support have not been independently evaluated.'],['Methods excerpt','The answer is generated from a question and retrieved text.'],['Retrieval excerpt','The index returns three passages for each question.']]}
  ];
  return panels('rag','Ask a preset example question',examples.map(e=>({name:e.q,body:
    `<div class="rag-file"><span aria-hidden="true">▤</span><div><strong>Illustrative methods note</strong><small>Fictional text · no document upload</small></div>${badge('3 passages')}</div><div class="rag-question"><span>Question</span><p>${e.q}</p></div>${split(`${label('Prepared answer preview')}<div class="rag-answer"><p>${e.answer}</p><span>Example response · no live model call</span></div>`,`${label('Context supplied to the answer')}<div class="rag-passages">${e.context.map(([name,text],i)=>`<details${i===0?' open':''}><summary>0${i+1} · ${name}</summary><p>${text}</p></details>`).join('')}</div>`)}<p class="output-footnote">An explanatory interface around the public command-line prototype. The original implementation has no citation UI or evaluated refusal guarantee; these prepared examples illustrate how to inspect context.</p>`
  })));
}

export const outputSpecs = {
  screening:{title:'A paper-screening review desk',kind:'Workflow reconstruction',artifact:'Classifier & evaluation workflow',note:'Invented abstracts and labels illustrate the review process. No study papers, private protocol or participant data are reproduced.',render:screening},
  teaming:{title:'Inside the shared kitchen task',kind:'Task-design illustration',artifact:'Modified research environment',note:'An original schematic of coordination choices. The 20 / 30 point recipe rewards are project settings; routes and dialogue are illustrative, not study observations.',render:teaming},
  tui:{title:'From supplier text to a matching decision',kind:'In-progress concept preview',artifact:'Data-quality analysis & matching design',note:'Synthetic room descriptions and catalog entries. This illustrates the intended matching interaction; it is not a completed production system.',render:tui},
  synthetic:{title:'Two sources. Two very different estimates.',kind:'Reported analysis',artifact:'Source-stratified experiment report',note:'Sample sizes and treatment estimates come from the course report. Visuals do not imply statistical significance or observed subscription behavior.',render:synthetic},
  education:{title:'An aggregate view for support planning',kind:'Synthetic dashboard',artifact:'Privacy-aware analytics & reporting',note:'All school labels, rubric details, example text and displayed scores are invented. This preview explains the aggregate reporting workflow without disclosing district records.',render:education},
  crm:{title:'Turn model scores into a test audience',kind:'Synthetic workbench',artifact:'Propensity models & campaign experiment',note:'Illustrative audience groups, scores and counts. Actual experiment results are kept separate from the fictional selection preview.',render:crm},
  power:{title:'A forecast becomes a placement plan',kind:'Synthetic planning view',artifact:'Forecasting notebook & allocation report',note:'Invented regional demand and a simplified allocation rule demonstrate the resource constraint. This is not the project’s forecast output or an operational recommendation.',render:power},
  voc:{title:'Explore the language inside a topic',kind:'Synthetic topic explorer',artifact:'Korean text pipeline & LDA exploration',note:'Six illustrative topics with invented tickets, weights and positions. The public notebook’s company outputs remain excluded.',render:voc},
  humanitarian:{title:'An explainable budget-review queue',kind:'Synthetic analysis view',artifact:'Team notebook & audit-prioritization story',note:'Fictional peer groups and plot points recreate the type of analysis. My contribution focused on framing, communication and notebook assembly within the team.',render:humanitarian},
  fraud:{title:'See the cost of changing a threshold',kind:'Synthetic decision lab',artifact:'Model evaluation & cost analysis',note:'Calculated from 40 explicitly invented claims. The $15,000 / $500 error costs are the study’s assumptions, not measured losses.',render:fraud},
  'job-radar':{title:'A recommendation with its evidence',kind:'Workflow reconstruction',artifact:'Automated discovery & verification tool',note:'Fictional job listings show the implemented recommendation gates. This is a presentation of the workflow, not a connected feed or the original reporting interface.',render:jobRadar},
  rag:{title:'Read the context behind an answer',kind:'Prototype walkthrough',artifact:'PDF retrieval & command-line Q&A',note:'Prepared questions, passages and responses illustrate the pipeline. The visual inspection interface is new for this portfolio; no API or upload runs here.',render:rag}
};

export function projectOutputHTML(p) {
  const spec=outputSpecs[p.id];
  if(!spec)return '';
  return `<section class="project-output" id="output-preview" aria-labelledby="output-heading"><div class="output-heading"><div><p class="eyebrow">What I built / a closer look</p><h2 id="output-heading">${spec.title}</h2></div><span class="output-kind">${spec.kind}</span></div><div class="output-window"><div class="output-window-bar"><span class="window-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>${spec.artifact}</span><span class="output-live-label">Explore</span></div>${spec.render()}</div><p class="output-disclosure">${spec.note}</p><noscript><p class="output-disclosure">The first example is shown. Enable JavaScript to switch examples.</p></noscript></section>`;
}

export function outputThumbnail(id) {
  // Decorative index thumbnails summarize each artifact, not a second data display.
  const chart='<path d="M12 61H126 M12 13V61" class="mini-grid"/><path d="M15 53L43 45L70 48L96 29L124 18" class="mini-line"/>';
  const rows='<path d="M17 20H90 M17 37H111 M17 54H75" class="mini-bars"/>';
  const doc='<rect x="18" y="9" width="43" height="57" rx="3"/><path d="M27 22H51 M27 32H51 M27 42H43" class="mini-grid"/><path d="M74 25H118 M74 38H111 M74 51H119" class="mini-bars"/>';
  const art={
    screening:doc,
    teaming:Array.from({length:24},(_,i)=>`<rect x="${16+i%6*18}" y="${10+Math.floor(i/6)*15}" width="14" height="11" rx="2" class="${[8,16].includes(i)?'mini-fill':''}"/>`).join(''),
    tui:'<rect x="10" y="22" width="42" height="30" rx="3"/><path d="M58 37H76 M70 32L76 37L70 42" class="mini-line"/><rect x="84" y="9" width="43" height="16" rx="3" class="mini-fill"/><rect x="84" y="30" width="43" height="16" rx="3"/><rect x="84" y="51" width="43" height="16" rx="3"/>',
    synthetic:'<path d="M18 58H123" class="mini-grid"/><rect x="35" y="54" width="24" height="4" class="mini-fill"/><rect x="81" y="14" width="24" height="44" class="mini-fill"/>',
    risk:chart,education:rows,crm:rows,power:Array.from({length:8},(_,i)=>`<rect x="${18+i%4*27}" y="${14+Math.floor(i/4)*26}" width="21" height="20" rx="3" class="${i<5?'mini-fill':''}"/>`).join(''),
    voc:'<circle cx="32" cy="26" r="14"/><circle cx="70" cy="19" r="10"/><circle cx="105" cy="40" r="18" class="mini-fill"/><circle cx="59" cy="52" r="13"/>',
    humanitarian:`<path d="M12 61H126 M12 13V61" class="mini-grid"/>${Array.from({length:12},(_,i)=>`<circle cx="${23+i*8}" cy="${60-i*3-(i%3)*5}" r="2" class="mini-fill"/>`).join('')}<circle cx="66" cy="15" r="5"/><circle cx="111" cy="53" r="5"/>`,
    fraud:'<rect x="29" y="10" width="37" height="25" rx="3"/><rect x="72" y="10" width="37" height="25" rx="3" class="mini-fill"/><rect x="29" y="41" width="37" height="25" rx="3" class="mini-fill"/><rect x="72" y="41" width="37" height="25" rx="3"/>',
    'job-radar':doc,rag:doc
  };
  return `<svg class="output-thumbnail" viewBox="0 0 140 76" aria-hidden="true" focusable="false">${art[id]||chart}</svg>`;
}
