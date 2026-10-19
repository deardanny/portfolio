(() => {
  'use strict';
  const data=JSON.parse(document.getElementById('demo-data').textContent);
  const $=id=>document.getElementById(id);
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const initial=()=>({view:'reviews',brand:'a',period:4,measure:'share',source:'all',sentiment:'all',search:'',flagged:false,topic:null,page:0});
  let state=initial();
  const brandName=id=>data.brands.find(b=>b.id===id).name;
  const pct=(part,total)=>total?Math.round(part/total*100):0;
  const number=n=>n.toLocaleString('en-US');
  const dateLabel=value=>new Date(value+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'UTC'});
  const weekIndices=()=>[0,1,2,3].filter(w=>w>=4-state.period);
  const records=(source,focus=true)=>data.records.filter(r=>r.week>=4-state.period&&r.source===source&&(!focus||r.brand===state.brand));
  const sentiments=rows=>['positive','neutral','negative'].map(s=>rows.filter(r=>r.sentiment===s).length);
  const metrics=items=>items.map(([label,value,note,tone])=>`<div class="ds-metric${tone?' '+tone:''}"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`).join('');
  const badge=r=>`<span class="ds-badge ${r.sentiment}">${r.sentiment}</span>${r.flagged?'<span class="ds-badge flag">Review flag</span>':''}`;
  const legend=()=>`<div class="ds-legend">${data.brands.map(b=>`<span><i class="brand-${b.id}"></i>${b.name}${b.id===state.brand?' · focus':''}</span>`).join('')}</div>`;

  function lineChart(target,source,negative=false) {
    const all=records(source,false), indexes=weekIndices();
    const series=data.brands.map(b=>({id:b.id,name:b.name,values:indexes.map(week=>{
      const rows=all.filter(r=>r.brand===b.id&&r.week===week);
      const count=negative?rows.filter(r=>r.sentiment==='negative').length:rows.length;
      return negative&&state.measure==='share'?pct(count,rows.length):count;
    })}));
    const percent=negative&&state.measure==='share';
    const width=Math.max(260,Math.round($(target).getBoundingClientRect().width||600));
    const height=228,left=38,right=18,top=20,bottom=36,plotWidth=width-left-right,plotHeight=height-top-bottom;
    const max=percent?100:Math.max(10,Math.ceil(Math.max(...series.flatMap(s=>s.values))/10)*10);
    const x=i=>left+(indexes.length===1?plotWidth/2:plotWidth*i/(indexes.length-1));
    const y=v=>top+plotHeight*(1-v/max);
    const title=`${negative?'Negative reviews':'Community posts'} by week${percent?', percent of reviews':', count'}`;
    const desc=series.map(s=>`${s.name}: ${s.values.map((v,i)=>`${dateLabel(data.weeks[indexes[i]])} ${v}${percent?'%':''}`).join(', ')}`).join('. ');
    let svg=`<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escape(title+'. '+desc)}"><title>${title}</title>`;
    [0,max/2,max].forEach(value=>{svg+=`<line x1="${left}" x2="${width-right}" y1="${y(value)}" y2="${y(value)}" class="ds-gridline"/><text x="${left-9}" y="${y(value)+4}" text-anchor="end" class="ds-axis">${value}${percent?'%':''}</text>`;});
    indexes.forEach((week,i)=>{svg+=`<text x="${x(i)}" y="${height-10}" text-anchor="${indexes.length===1?'middle':i===0?'start':i===indexes.length-1?'end':'middle'}" class="ds-axis">${dateLabel(data.weeks[week])}</text>`;});
    for(const s of [...series].sort((a,b)=>(a.id===state.brand)-(b.id===state.brand))) {
      svg+=`<g class="ds-series series-${s.id}${s.id===state.brand?' is-focus':''}">${s.values.length>1?`<polyline points="${s.values.map((v,i)=>`${x(i)},${y(v)}`).join(' ')}"/>`:''}${s.values.map((v,i)=>`<circle cx="${x(i)}" cy="${y(v)}" r="${s.id===state.brand?4:3}"><title>${s.name}, week of ${dateLabel(data.weeks[indexes[i]])}: ${v}${percent?'%':''}</title></circle>`).join('')}</g>`;
    }
    return svg+'</svg>'+legend();
  }
  function renderCharts(){
    $('review-trend').innerHTML=lineChart('review-trend','review',true);
    $('community-trend').innerHTML=lineChart('community-trend','community');
  }
  function renderReviews(){
    const rows=records('review'),[positive,,negative]=sentiments(rows),flags=rows.filter(r=>r.flagged);
    $('review-metrics').innerHTML=metrics([
      ['Reviews analyzed',number(rows.length),`${brandName(state.brand)} · fictional sample`],
      ['Positive sentiment',pct(positive,rows.length)+'%',`${positive} of ${rows.length} demo reviews`],
      ['Needs a closer look',number(flags.length),'Simulated keyword flags','ds-alert-metric'],
      ['Tracked attributes',data.attributes.length,'Select an attribute to explore']
    ]);
    $('review-trend-caption').textContent=state.measure==='share'?'Percent of each brand’s reviews labeled negative. Rates keep different volumes comparable.':'Number of each brand’s reviews labeled negative. Counts show the volume of feedback.';
    const stats=data.attributes.map(topic=>{const list=rows.filter(r=>r.topic===topic);return {topic,n:list.length,pos:list.filter(r=>r.sentiment==='positive').length,neg:list.filter(r=>r.sentiment==='negative').length};});
    $('attribute-chart').innerHTML=stats.map(s=>`<button type="button" class="ds-attribute-row" data-topic="${escape(s.topic)}" data-source="review"><span><strong>${s.topic}</strong><small>${s.n} fictional reviews</small></span><span class="ds-bar-track" aria-hidden="true"><i style="width:${pct(s.pos,s.n)}%"></i></span><b>${pct(s.pos,s.n)}% <span aria-hidden="true">↗</span></b></button>`).join('');
    const all=records('review',false);
    $('brand-comparison').innerHTML=data.brands.map(b=>{const list=all.filter(r=>r.brand===b.id),counts=sentiments(list);return `<button type="button" class="ds-brand-row${b.id===state.brand?' is-selected':''}" data-brand="${b.id}" aria-pressed="${b.id===state.brand}"><span class="ds-brand-title"><strong>${b.name}</strong><small>${list.length} reviews</small></span><span class="ds-stacked-bar" aria-hidden="true">${counts.map((count,i)=>`<i class="${['positive','neutral','negative'][i]}" style="width:${count/list.length*100}%"></i>`).join('')}</span><span class="ds-brand-values">${counts.map((n,i)=>`${pct(n,list.length)}% ${['positive','neutral','negative'][i]}`).join(' · ')}</span></button>`;}).join('');
    const concern=[...stats].sort((a,b)=>b.neg/b.n-a.neg/a.n)[0];
    $('review-brief').innerHTML=`<p class="ds-kicker">GenAI workflow / Example brief</p><h2>What deserves attention?</h2><p class="ds-brief-lead">${escape(concern.topic)} has the highest negative share in ${brandName(state.brand)}’s selected sample.</p><ul><li><strong>Signal.</strong> ${concern.neg} of ${concern.n} reviews mentioning ${escape(concern.topic.toLowerCase())} are labeled negative (${pct(concern.neg,concern.n)}%).</li><li><strong>Context.</strong> Across all attributes, ${pct(negative,rows.length)}% of the brand’s ${rows.length} reviews are negative.</li><li><strong>Next step.</strong> Inspect ${flags.length} flagged records before deciding whether an issue needs follow-up.</li></ul><button type="button" class="ds-primary-button" data-investigate="flagged">Inspect the evidence →</button><p class="ds-brief-note">Prepared narrative from synthetic records. No live AI model is called.</p>`;
    $('review-queue').innerHTML=flags.length?[...flags].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3).map(r=>`<button type="button" class="ds-queue-record" data-record="${r.id}"><span class="ds-queue-meta">${dateLabel(r.date)} · ${r.id}</span><span class="ds-badge flag">${escape(r.keyword)}</span><p>${escape(r.text)}</p><span class="ds-queue-action">Open fictional record ↗</span></button>`).join(''):'<p class="ds-empty">No keyword flags in this sample. You can still inspect all reviews in the evidence explorer.</p>';
  }
  function renderCommunity(){
    const all=records('community',false),rows=records('community'),flags=rows.filter(r=>r.flagged).length;
    $('community-metrics').innerHTML=metrics([
      ['Community posts',number(all.length),'All three fictional brands'],
      ['Focus share of voice',pct(rows.length,all.length)+'%',`${rows.length} posts mention ${brandName(state.brand)}`],
      ['Conversation topics',data.topics.length,'Lifestyle and product-adjacent themes'],
      ['Flagged focus posts',flags,'Simulated review queue','ds-alert-metric']
    ]);
    $('voice-chart').innerHTML=data.brands.map(b=>{const count=all.filter(r=>r.brand===b.id).length;return `<button type="button" class="ds-voice-row${state.brand===b.id?' is-selected':''}" data-brand="${b.id}" aria-pressed="${state.brand===b.id}"><span><i class="brand-${b.id}"></i><strong>${b.name}</strong><small>${count} posts</small><b>${pct(count,all.length)}%</b></span><span class="ds-bar-track" aria-hidden="true"><i class="brand-${b.id}" style="width:${count/all.length*100}%"></i></span></button>`;}).join('');
    const stats=data.topics.map(topic=>({topic,count:rows.filter(r=>r.topic===topic).length,latest:rows.filter(r=>r.topic===topic&&r.week===3).length,previous:data.records.filter(r=>r.source==='community'&&r.brand===state.brand&&r.topic===topic&&r.week===2).length})).sort((a,b)=>b.count-a.count);
    const max=Math.max(...stats.map(t=>t.count),1);
    $('topic-chart').innerHTML=stats.map(t=>`<button type="button" class="ds-attribute-row ds-topic-row" data-topic="${escape(t.topic)}" data-source="community"><span><strong>${escape(t.topic)}</strong><small>${t.latest} latest week · ${t.previous} previous week</small></span><span class="ds-bar-track" aria-hidden="true"><i style="width:${t.count/max*100}%"></i></span><b>${t.count} <span aria-hidden="true">↗</span></b></button>`).join('');
    const rising=[...stats].sort((a,b)=>(b.latest-b.previous)-(a.latest-a.previous))[0];
    $('community-brief').innerHTML=`<p class="ds-kicker">GenAI workflow / Example brief</p><h2>Look beyond the feature list.</h2><p class="ds-brief-lead">${escape(rising.topic)} is ${rising.latest>rising.previous?'gaining attention':'a conversation to watch'} in ${brandName(state.brand)}’s fictional community sample.</p><ul><li><strong>Change.</strong> ${rising.latest} posts in the latest week, compared with ${rising.previous} in the previous week.</li><li><strong>Position.</strong> ${brandName(state.brand)} accounts for ${pct(rows.length,all.length)}% of posts in the selected period.</li><li><strong>Question.</strong> What needs or trade-offs appear in the original wording?</li></ul><button type="button" class="ds-primary-button" data-topic="${escape(rising.topic)}" data-source="community">Explore this topic →</button><p class="ds-brief-note">Prepared narrative from synthetic records. Weekly comparisons use Feb 23 versus Feb 16, even when only one week is selected.</p>`;
  }
  function filteredEvidence(){
    const query=state.search.trim().toLowerCase();
    return data.records.filter(r=>r.brand===state.brand&&r.week>=4-state.period&&(state.source==='all'||r.source===state.source)&&(state.sentiment==='all'||r.sentiment===state.sentiment)&&(!state.flagged||r.flagged)&&(!state.topic||r.topic===state.topic)&&(!query||`${r.text} ${r.topic} ${r.id}`.toLowerCase().includes(query))).sort((a,b)=>b.date.localeCompare(a.date)||a.id.localeCompare(b.id));
  }
  function renderEvidence(){
    const rows=filteredEvidence(),pageSize=10,pages=Math.max(1,Math.ceil(rows.length/pageSize));
    state.page=Math.min(state.page,pages-1);
    const displayed=rows.slice(state.page*pageSize,(state.page+1)*pageSize);
    $('evidence-scope').textContent=`${brandName(state.brand)} · ${state.topic||'All topics'} · ${state.period} ${state.period===1?'week':'weeks'}`;
    $('evidence-count').textContent=`${rows.length} matching fictional ${rows.length===1?'record':'records'}. ${rows.length?`Showing ${state.page*pageSize+1}–${state.page*pageSize+displayed.length}.`:''}`;
    $('evidence-table').innerHTML=rows.length?`<table class="ds-table"><caption class="ds-sr-only">Filtered fictional reviews and community posts</caption><thead><tr><th scope="col">Record</th><th scope="col">Text & topic</th><th scope="col">Annotations</th><th scope="col"><span class="ds-sr-only">Open record</span></th></tr></thead><tbody>${displayed.map(r=>`<tr><td><strong>${dateLabel(r.date)}</strong><span>${r.source==='review'?'Retail review':'Community post'}</span><small>${r.id}</small></td><td><p>${escape(r.text)}</p><span class="ds-topic-label">${escape(r.topic)}</span></td><td><div class="ds-badges">${badge(r)}</div></td><td><button type="button" class="ds-text-button" data-record="${r.id}" aria-label="Open fictional record ${r.id}">Open ↗</button></td></tr>`).join('')}</tbody></table>`:'<div class="ds-empty"><strong>No matching records.</strong><p>Try a different word, widen the period, or clear the evidence filters.</p></div>';
    $('page-status').textContent=`Page ${state.page+1} of ${pages}`;
    $('previous-page').disabled=state.page===0;
    $('next-page').disabled=state.page>=pages-1;
    $('export-csv').disabled=!rows.length;
  }
  function syncControls(){
    $('brand-filter').value=state.brand; $('period-filter').value=String(state.period);
    $('evidence-source').value=state.source; $('evidence-sentiment').value=state.sentiment;
    $('evidence-flagged').checked=state.flagged;
    if($('evidence-search').value!==state.search)$('evidence-search').value=state.search;
    document.querySelectorAll('[data-view]').forEach(button=>{const active=button.dataset.view===state.view;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;$('view-'+button.dataset.view).hidden=!active;});
    document.querySelectorAll('[data-measure]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.measure===state.measure)));
  }
  function render(){
    syncControls(); renderReviews(); renderCommunity(); renderEvidence(); renderCharts();
    $('dashboard-status').textContent=`${brandName(state.brand)} in focus · ${state.period} ${state.period===1?'week':'weeks'} of synthetic data · ${state.view==='reviews'?'Review intelligence':state.view==='community'?'Community pulse':'Evidence explorer'}`;
  }
  function clearEvidence(){Object.assign(state,{source:'all',sentiment:'all',search:'',flagged:false,topic:null,page:0});}
  function investigate(options){clearEvidence();Object.assign(state,options,{view:'evidence'});render();$('tab-evidence').focus();}
  function openRecord(id){
    const r=data.records.find(row=>row.id===id); if(!r)return;
    $('record-detail').innerHTML=`<h2 id="record-title">${r.id}</h2><p class="ds-record-meta">${brandName(r.brand)} · ${r.product} · ${r.source==='review'?'Retail review':'Community post'} · ${dateLabel(r.date)}</p><div class="ds-badges">${badge(r)}</div><blockquote>${escape(r.text)}</blockquote><dl class="ds-record-facts"><div><dt>Illustrative topic label</dt><dd>${escape(r.topic)}</dd></div><div><dt>Review signal</dt><dd>${r.flagged?escape(r.keyword)+' · manual review needed':'No simulated keyword flag'}</dd></div>${r.views!==null?`<div><dt>Fictional post views</dt><dd>${number(r.views)}</dd></div>`:''}</dl><p class="ds-record-note">Invented text and preassigned labels for this portfolio. A flag is not a verified incident. No customer record or original source URL is reproduced.</p>`;
    $('record-dialog').showModal();
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.view){state.view=button.dataset.view;render();}
    else if(button.dataset.measure){state.measure=button.dataset.measure;syncControls();renderCharts();$('review-trend-caption').textContent=state.measure==='share'?'Percent of each brand’s reviews labeled negative. Rates keep different volumes comparable.':'Number of each brand’s reviews labeled negative. Counts show the volume of feedback.';}
    else if(button.dataset.brand){state.brand=button.dataset.brand;state.page=0;render();$('view-'+state.view).querySelector(`button[data-brand="${state.brand}"]`)?.focus({preventScroll:true});}
    else if(button.dataset.topic){investigate({source:button.dataset.source,topic:button.dataset.topic});}
    else if(button.dataset.record){openRecord(button.dataset.record);}
    else if(button.dataset.investigate){
      const kind=button.dataset.investigate;
      investigate({source:kind==='community'?'community':'review',sentiment:kind==='negative'?'negative':'all',flagged:kind==='flagged'});
    }
  });
  document.querySelector('.ds-tabs').addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    const tabs=[...document.querySelectorAll('[data-view]')];let index=tabs.findIndex(t=>t.dataset.view===state.view);
    index=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
    event.preventDefault();state.view=tabs[index].dataset.view;render();tabs[index].focus();
  });
  $('brand-filter').addEventListener('change',event=>{state.brand=event.target.value;state.page=0;render();});
  $('period-filter').addEventListener('change',event=>{state.period=Number(event.target.value);state.page=0;render();});
  $('reset-demo').addEventListener('click',()=>{state=initial();render();});
  for(const [id,key] of [['evidence-source','source'],['evidence-sentiment','sentiment']])$(id).addEventListener('change',event=>{state[key]=event.target.value;state.page=0;renderEvidence();});
  $('evidence-search').addEventListener('input',event=>{state.search=event.target.value;state.page=0;renderEvidence();});
  $('evidence-flagged').addEventListener('change',event=>{state.flagged=event.target.checked;state.page=0;renderEvidence();});
  $('clear-evidence').addEventListener('click',()=>{clearEvidence();syncControls();renderEvidence();});
  $('previous-page').addEventListener('click',()=>{state.page--;renderEvidence();});
  $('next-page').addEventListener('click',()=>{state.page++;renderEvidence();});
  $('close-record').addEventListener('click',()=>$('record-dialog').close());
  $('record-dialog').addEventListener('click',event=>{if(event.target===$('record-dialog'))$('record-dialog').close();});
  $('export-csv').addEventListener('click',()=>{
    const fields=['id','date','brand','source','topic','sentiment','flagged','keyword','text'];
    const cell=value=>'"'+String(value??'').replace(/^[=+@-]/,"'$&").replace(/"/g,'""')+'"';
    const csv=[['synthetic_demo',...fields].map(cell).join(','),...filteredEvidence().map(r=>[true,...fields.map(f=>r[f])].map(cell).join(','))].join('\r\n');
    const url=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='fictional-consumer-insights.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  render();
  const widths=new Map();
  new ResizeObserver(entries=>{if(entries.some(entry=>{const width=Math.round(entry.contentRect.width);if(!width||widths.get(entry.target)===width)return false;widths.set(entry.target,width);return true;}))renderCharts();}).observe(document.querySelector('.ds-app'));
})();
