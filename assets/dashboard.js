(async () => {
  'use strict';
  const $=id=>document.getElementById(id);
  try {
    const {initialState,filterRecords,summarize,percentage,sortRecords,toCSV,sentimentOrder}=await import($('dashboard-script').dataset.model);
    const data=JSON.parse($('demo-data').textContent),defaults=initialState();
    let state=initialState(),measure='volume';
    const names=Object.fromEntries(data.brands.map(b=>[b.id,b.name]));
    const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const num=n=>n.toLocaleString('en-US');
    const pct=(n,total)=>Math.round(percentage(n,total));
    const dateLabel=d=>new Date(d+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'UTC'});
    const source=()=>state.view==='reviews'?'review':state.view==='community'?'community':state.evidenceSource;
    const rows=(omit=[])=>filterRecords(data.records,state,{source:source(),omit});
    const pick=(key,value,text,classes='',count=null)=>`<button type="button" class="${classes}" data-filter-key="${key}" data-filter-value="${esc(value)}" aria-pressed="${String(state[key]===value)}"${count===0&&state[key]!==value?' disabled':''}>${text}</button>`;
    const stack=list=>{const s=summarize(list);return `<span class="bi-stack" aria-hidden="true">${sentimentOrder.map(k=>`<i class="${k}" style="width:${percentage(s[k],s.total)}%"></i>`).join('')}</span>`;};
    const empty=text=>`<div class="bi-empty">${text}</div>`;
    function metrics(list) {
      const s=summarize(list),community=source()==='community';
      const items=[['Total '+(community?'posts':'reviews'),num(s.total),`${state.day?dateLabel(state.day):state.period*7+' days'} · current selection`],['Positive sentiment',s.total?pct(s.positive,s.total)+'%':'—',`${s.positive} positive / ${s.total} records`],[community?'Post views':'Average rating',community?num(s.views):s.rating===null?'—':s.rating.toFixed(2)+' / 5',community?'Sum of supplied view counts':'From reviews in this selection'],['Flagged records',num(s.flags),s.total?pct(s.flags,s.total)+'% of selected records':'No matching records']];
      $('analytics-metrics').innerHTML=items.map(([label,value,note],i)=>`<${i===3?'button type="button" data-filter-key="flagged" data-filter-value="true" aria-pressed="'+state.flagged+'"':'div'} class="bi-metric${i===3?' bi-flag-metric':''}"><span>${label}${i===3?'<b aria-hidden="true">↗</b>':''}</span><strong>${value}</strong><small>${note}</small></${i===3?'button':'div'}>`).join('');
    }
    function trend() {
      if(state.view==='evidence')return;
      const list=rows(['day']),dates=Array.from({length:state.period*7},(_,i)=>{const d=new Date(data.weeks[4-state.period]+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+i);return d.toISOString().slice(0,10);});
      const values=dates.map(date=>({date,...summarize(list.filter(r=>r.date===date))}));
      const width=Math.max(250,Math.round($('volume-chart').getBoundingClientRect().width)),height=220,left=35,right=12,top=16,bottom=28;
      const plotW=width-left-right,plotH=height-top-bottom,step=plotW/values.length;
      const max=measure==='negative'?100:Math.max(10,Math.ceil(Math.max(...values.map(v=>v.total))/10)*10);
      const y=v=>top+plotH*(1-v/max);
      let svg=`<svg viewBox="0 0 ${width} ${height}" role="group" aria-label="Daily ${source()==='review'?'review':'post'} ${measure==='volume'?'volume by sentiment':'negative sentiment rate'}. Select a day to filter.">`;
      for(const tick of [0,max/2,max])svg+=`<path class="bi-gridline" d="M${left} ${y(tick)}H${width-right}"/><text class="bi-axis" x="${left-7}" y="${y(tick)+3}" text-anchor="end">${Number.isInteger(tick)?tick:tick.toFixed(1)}${measure==='negative'?'%':''}</text>`;
      for(const [i,v] of values.entries()) {
        const x=left+i*step,tip=`${dateLabel(v.date)} · ${v.total} records · ${v.positive} positive / ${v.neutral} neutral / ${v.negative} negative`;
        svg+=`<g class="bi-day${state.day===v.date?' selected':''}${state.day&&state.day!==v.date?' dimmed':''}" data-filter-key="day" data-filter-value="${v.date}" data-tip="${tip}" tabindex="0" role="button" aria-label="${tip}" aria-pressed="${state.day===v.date}"><rect class="bi-day-hit" x="${x+1}" y="${top}" width="${Math.max(1,step-2)}" height="${plotH}" rx="2"/>`;
        if(measure==='volume') {let cumulative=0;for(const s of sentimentOrder){cumulative+=v[s];svg+=`<rect class="${s}" x="${x+step*.2}" y="${y(cumulative)}" width="${step*.6}" height="${v[s]/max*plotH}"/>`;}}
        else if(v.total)svg+=`<circle class="bi-negative-point" cx="${x+step/2}" cy="${y(percentage(v.negative,v.total))}" r="3"/>`;
        svg+='</g>';
        if(i===0||i===values.length-1||i%7===0)svg+=`<text class="bi-axis" x="${x+step/2}" y="${height-6}" text-anchor="${i===0?'start':i===values.length-1?'end':'middle'}">${dateLabel(v.date)}</text>`;
      }
      if(measure==='negative'){let connected=false;const path=values.map((v,i)=>{if(!v.total){connected=false;return '';}const command=connected?'L':'M';connected=true;return `${command}${left+(i+.5)*step} ${y(percentage(v.negative,v.total))}`;}).join(' ');svg+=`<path class="bi-negative-line" d="${path}"/>`;}
      $('volume-chart').innerHTML=svg+'</svg>';
    }
    function sentimentChart() {
      const list=rows(['sentiment']),s=summarize(list),positive=percentage(s.positive,s.total),neutral=percentage(s.neutral,s.total);
      $('sentiment-chart').innerHTML=`<div class="bi-sentiment-layout"><div class="bi-donut" style="--distribution:${s.total?`conic-gradient(var(--bi-positive) 0 ${positive}%,var(--bi-neutral) ${positive}% ${positive+neutral}%,var(--bi-negative) ${positive+neutral}% 100%)`:'var(--bi-line)'}" aria-hidden="true"><div><strong>${num(s.total)}</strong><span>records</span></div></div><div class="bi-sentiment-legend">${sentimentOrder.map(k=>pick('sentiment',k,`<span><i class="${k}"></i>${k}</span><strong>${pct(s[k],s.total)}%</strong><small>${s[k]}</small>`,'bi-sentiment-option',s[k])).join('')}</div></div><p class="bi-chart-note">Distribution before the sentiment selection</p>`;
    }
    function attributes() {
      const list=rows(['topic']),topics=source()==='community'?data.topics:data.attributes;
      $('attribute-panel').querySelector('h2').textContent=source()==='community'?'Conversation topics':'Product attributes';
      const stats=topics.map(topic=>({topic,list:list.filter(r=>r.topic===topic)})).sort((a,b)=>b.list.length-a.list.length);
      $('attribute-chart').innerHTML=`<div class="bi-attribute-head"><span>Topic</span><span>Volume</span><span>Sentiment mix</span><span>Neg.</span></div>${stats.map(t=>{const s=summarize(t.list);return pick('topic',t.topic,`<strong>${esc(t.topic)}</strong><span>${s.total}</span>${stack(t.list)}<b>${pct(s.negative,s.total)}%</b>`,'bi-attribute-row',s.total);}).join('')}`;
    }
    function brands() {
      const list=rows(['brand']),total=list.length;
      $('brand-chart').innerHTML=data.brands.map(b=>{const subset=list.filter(r=>r.brand===b.id),s=summarize(subset);return pick('brand',b.id,`<span class="bi-brand-label"><strong>${b.name}</strong><span>${num(s.total)} records <small>· ${pct(s.total,total)}% share</small></span></span>${stack(subset)}<span class="bi-brand-rates"><span>${pct(s.positive,s.total)}% positive</span><span>${pct(s.negative,s.total)}% negative</span></span>`,'bi-brand-row',s.total);}).join('');
    }
    function channels() {
      const list=rows(['channel']),keys=[...new Set(data.records.filter(r=>r.source===source()).map(r=>r.channel))],max=Math.max(...keys.map(k=>list.filter(r=>r.channel===k).length),1);
      $('channel-chart').innerHTML=keys.map(k=>{const count=list.filter(r=>r.channel===k).length;return pick('channel',k,`<span>${k}<b>${count}</b></span><i class="bi-bar-track" aria-hidden="true"><em style="width:${count/max*100}%"></em></i>`,'bi-channel-row',count);}).join('');
    }
    function ratingsAndTerms() {
      const community=source()==='community';$('rating-panel').hidden=community;$('terms-panel').hidden=!community;
      if(!community) {
        const list=rows(['rating']),max=Math.max(...[1,2,3,4,5].map(r=>list.filter(x=>x.rating===r).length),1);
        $('rating-chart').innerHTML=[5,4,3,2,1].map(r=>{const n=list.filter(x=>x.rating===r).length;return pick('rating',r,`<span>${r} <i aria-hidden="true">★</i></span><i class="bi-bar-track" aria-hidden="true"><em style="width:${n/max*100}%"></em></i><b>${n}</b>`,'bi-rating-row',n);}).join('');
      } else {
        const list=rows(['query']),terms=['battery','parts','storage','pet','quiet','filters','price','repair','charging','attachment','apartment'];
        const stats=terms.map(term=>({term,n:list.filter(r=>r.text.toLowerCase().includes(term)).length})).filter(t=>t.n).sort((a,b)=>b.n-a.n).slice(0,8);
        $('terms-chart').innerHTML=stats.length?`<div class="bi-terms">${stats.map(t=>pick('query',t.term,`${t.term}<span>${t.n}</span>`)).join('')}</div>`:empty('No matching terms.');
      }
    }
    function brief(list) {
      if(!list.length){$('analyst-brief').innerHTML=empty('No records in this selection. Clear a filter to continue.');return;}
      const keys=[...new Set(list.map(r=>r.topic))],stats=keys.map(topic=>({topic,...summarize(list.filter(r=>r.topic===topic))})).sort((a,b)=>percentage(b.negative,b.total)-percentage(a.negative,a.total)||b.total-a.total),top=stats[0],s=summarize(list);
      $('analyst-brief').innerHTML=`<div class="bi-insight-title"><span aria-hidden="true">✦</span><strong>${esc(top.topic)}</strong><span>${pct(top.negative,top.total)}% negative</span></div><p>${top.negative} of ${top.total} records on this topic are negative—the highest negative share in the current selection.</p><div class="bi-insight-facts"><span><b>${s.flags}</b> keyword flags</span><span><b>${keys.length}</b> topics represented</span></div><button type="button" class="bi-text-button" data-trace-topic="${esc(top.topic)}">Inspect ${top.negative?top.negative+' negative':top.total} records →</button><small>Signals prioritize review; they do not verify incidents.</small>`;
    }
    function table(list) {
      if(!list.length)return empty('No matching records. Broaden the period or clear a filter.');
      return `<div class="bi-table-scroll"><table class="bi-table"><caption class="sr-only">Source records in the current selection</caption><thead><tr><th>Date / ID</th><th>Feedback</th><th>Sentiment</th><th>Signal</th><th><span class="sr-only">Details</span></th></tr></thead><tbody>${list.map(r=>`<tr><td><strong>${dateLabel(r.date)}</strong><small>${r.id}</small></td><td><div class="bi-record-context">${names[r.brand]} <span>· ${esc(r.product)} · ${esc(r.channel)}</span></div><p>${esc(r.text)}</p><small class="bi-record-topic">${esc(r.topic)}${r.rating!==null?' · '+r.rating+'/5 stars':''}</small></td><td><span class="bi-badge ${r.sentiment}">${r.sentiment}</span></td><td>${r.flagged?`<span class="bi-signal">${esc(r.keyword)}</span>`:'<span class="bi-muted">—</span>'}</td><td><button class="bi-text-button" type="button" data-record="${r.id}" aria-label="Open record ${r.id}">Open ↗</button></td></tr>`).join('')}</tbody></table></div>`;
    }
    function evidence(list) {
      const sorted=sortRecords(list,state.sort),pages=Math.max(1,Math.ceil(sorted.length/10));state.page=Math.min(state.page,pages-1);
      $('evidence-count').textContent=`${num(list.length)} matching records${list.length?' · '+(state.page*10+1)+'–'+Math.min((state.page+1)*10,list.length):''}`;
      $('evidence-table').innerHTML=table(sorted.slice(state.page*10,(state.page+1)*10));
      $('page-status').textContent=`Page ${state.page+1} / ${pages}`;$('previous-page').disabled=state.page===0;$('next-page').disabled=state.page>=pages-1;
    }
    function sync() {
      const activeSource=source();
      const products=[...new Set(data.records.filter(r=>state.brand==='all'||r.brand===state.brand).map(r=>r.product))];
      if(state.product!=='all'&&!products.includes(state.product))state.product='all';
      const allChannels=[...new Set(data.records.filter(r=>activeSource==='all'||r.source===activeSource).map(r=>r.channel))];
      if(state.channel!=='all'&&!allChannels.includes(state.channel))state.channel='all';
      $('product-filter').innerHTML='<option value="all">All products</option>'+products.map(p=>`<option value="${esc(p)}">${esc(p)}</option>`).join('');
      $('channel-filter').innerHTML='<option value="all">All channels</option>'+allChannels.map(p=>`<option value="${esc(p)}">${esc(p)}</option>`).join('');
      for(const key of ['brand','product','channel','period'])$(key+'-filter').value=String(state[key]);
      $('evidence-source').value=state.evidenceSource;$('evidence-sentiment').value=state.sentiment;$('evidence-sort').value=state.sort;$('evidence-flagged').checked=state.flagged;
      if($('evidence-search').value!==state.query)$('evidence-search').value=state.query;
      document.querySelectorAll('[data-view]').forEach(b=>{const on=state.view===b.dataset.view;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;});
      $('analytics-view').hidden=state.view==='evidence';$('view-evidence').hidden=state.view!=='evidence';$('analytics-view').setAttribute('aria-labelledby','tab-'+(state.view==='community'?'community':'reviews'));
      $('page-heading').textContent={reviews:'Review analytics',community:'Social listening',evidence:'Record explorer'}[state.view];
      $('page-description').textContent={reviews:'Sentiment, product attributes and issues across retail feedback.',community:'Track conversations, compare brand visibility and trace emerging themes.',evidence:'Search and inspect the source records behind the current selection.'}[state.view];
      $('trend-title').textContent=state.view==='community'?'Conversation volume & sentiment':'Review volume & sentiment';
      document.querySelectorAll('[data-measure]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.measure===measure)));
    }
    function chips(list) {
      const labels={brand:'Brand',product:'Product',channel:'Channel',period:'Period',sentiment:'Sentiment',topic:'Topic',day:'Date',query:'Search',flagged:'Flagged',rating:'Rating'};
      $('active-filters').innerHTML=Object.entries(labels).filter(([k])=>state[k]!==defaults[k]).map(([k,label])=>`<button type="button" data-clear="${k}" aria-label="Remove ${label.toLowerCase()} filter">${label}: ${esc(k==='brand'?names[state[k]]:k==='period'?state.period+' weeks':k==='flagged'?'only':k==='day'?dateLabel(state.day):k==='rating'?state.rating+' stars':state[k])}<span aria-hidden="true">×</span></button>`).join('');
      $('dashboard-status').textContent=`${num(list.length)} records · ${state.brand==='all'?'All brands':names[state.brand]} · ${state.day?dateLabel(state.day):dateLabel(data.weeks[4-state.period])+' – Mar 1'}${state.view==='evidence'?'':' · Select a chart to filter'}`;
    }
    function render() {
      $('chart-tooltip').hidden=true;sync();const list=rows();chips(list);$('export-csv').disabled=!list.length;$('export-count').textContent='('+num(list.length)+')';
      if(state.view==='evidence')evidence(list);
      else {metrics(list);trend();sentimentChart();attributes();brands();channels();ratingsAndTerms();brief(list);$('preview-count').textContent=`Showing the ${Math.min(4,list.length)} newest of ${num(list.length)} matching records`;$('record-preview').innerHTML=table(sortRecords(list).slice(0,4));}
    }
    function changeFilter(key,value) {
      if(['rating','period'].includes(key))value=Number(value);if(key==='flagged')value=value==='true';
      state[key]=state[key]===value?defaults[key]:value;state.page=0;render();
      const next=[...document.querySelectorAll('[data-filter-key]')].find(e=>e.dataset.filterKey===key&&e.dataset.filterValue===String(value)&&e.getClientRects().length);
      (next||$(key+'-filter')||$('reset-demo')).focus({preventScroll:true});
    }
    function switchView(view) {
      const old=source();if(view==='evidence')state.evidenceSource=old;
      state.view=view;state.page=0;
      if(source()!==old){state.topic='';state.channel='all';state.rating=0;}
      render();
    }
    function openRecord(id) {
      const r=data.records.find(r=>r.id===id);if(!r)return;
      $('record-detail').innerHTML=`<h2 id="record-title">${r.id}</h2><p class="bi-dialog-meta">${names[r.brand]} · ${esc(r.product)} · ${dateLabel(r.date)}</p><span class="bi-badge ${r.sentiment}">${r.sentiment}</span>${r.flagged?'<span class="bi-signal">Review required</span>':''}<blockquote>${esc(r.text)}</blockquote><dl class="bi-record-facts"><div><dt>Dataset</dt><dd>${r.source==='review'?'Retail reviews':'Community posts'}</dd></div><div><dt>Channel</dt><dd>${r.channel}</dd></div><div><dt>Topic</dt><dd>${r.topic}</dd></div><div><dt>${r.rating===null?'Post views':'Star rating'}</dt><dd>${r.rating===null?num(r.views):r.rating+' / 5'}</dd></div><div><dt>Keyword signal</dt><dd>${r.keyword||'None'}</dd></div></dl><p class="bi-dialog-note">Synthetic record with preassigned annotations. A keyword flag requires review; it does not confirm an incident.</p>`;$('record-dialog').showModal();
    }
    document.addEventListener('click',event=>{
      const filter=event.target.closest('[data-filter-key]');if(filter){changeFilter(filter.dataset.filterKey,filter.dataset.filterValue);return;}
      const b=event.target.closest('button');if(!b)return;
      if(b.dataset.view)switchView(b.dataset.view);
      else if(b.dataset.measure){measure=b.dataset.measure;sync();trend();}
      else if(b.dataset.clear){state[b.dataset.clear]=defaults[b.dataset.clear];state.page=0;render();$('reset-demo').focus({preventScroll:true});}
      else if(b.dataset.record)openRecord(b.dataset.record);
      else if(b.dataset.traceTopic){const subset=rows().filter(r=>r.topic===b.dataset.traceTopic);state.topic=b.dataset.traceTopic;state.sentiment=subset.some(r=>r.sentiment==='negative')?'negative':'all';switchView('evidence');$('tab-evidence').focus();}
    });
    $('volume-chart').addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)&&e.target.matches('[data-filter-key]')){e.preventDefault();changeFilter('day',e.target.dataset.filterValue);}});
    document.querySelector('.bi-nav').addEventListener('keydown',e=>{if(!['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;const tabs=[...document.querySelectorAll('[data-view]')],i=tabs.findIndex(t=>t.dataset.view===state.view),next=e.key==='Home'?0:e.key==='End'?2:(i+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1)+3)%3;e.preventDefault();switchView(tabs[next].dataset.view);tabs[next].focus();});
    for(const key of ['brand','product','channel','period'])$(key+'-filter').addEventListener('change',e=>{state[key]=key==='period'?Number(e.target.value):e.target.value;if(key==='period'&&state.day&&state.day<data.weeks[4-state.period])state.day='';state.page=0;render();});
    $('reset-demo').addEventListener('click',()=>{const view=state.view;state=initialState();state.view=view;state.evidenceSource=view==='community'?'community':'review';measure='volume';render();});
    $('open-explorer').addEventListener('click',()=>{switchView('evidence');$('tab-evidence').focus();});
    $('evidence-source').addEventListener('change',e=>{state.evidenceSource=e.target.value;state.topic='';state.channel='all';state.rating=0;state.page=0;render();});
    $('evidence-sentiment').addEventListener('change',e=>{state.sentiment=e.target.value;state.page=0;render();});
    $('evidence-sort').addEventListener('change',e=>{state.sort=e.target.value;state.page=0;render();});
    $('evidence-flagged').addEventListener('change',e=>{state.flagged=e.target.checked;state.page=0;render();});
    $('evidence-search').addEventListener('input',e=>{state.query=e.target.value;state.page=0;render();});
    $('clear-evidence').addEventListener('click',()=>{Object.assign(state,{query:'',sentiment:'all',flagged:false,rating:0,topic:'',page:0});render();});
    $('previous-page').addEventListener('click',()=>{state.page--;evidence(rows());});$('next-page').addEventListener('click',()=>{state.page++;evidence(rows());});
    $('dataset-info').addEventListener('click',()=>$('dataset-dialog').showModal());$('close-dataset').addEventListener('click',()=>$('dataset-dialog').close());$('close-record').addEventListener('click',()=>$('record-dialog').close());
    for(const id of ['record-dialog','dataset-dialog'])$(id).addEventListener('click',e=>{if(e.target===$(id))$(id).close();});
    $('export-csv').addEventListener('click',()=>{const csv=toCSV(sortRecords(rows(),state.sort),names),url=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='consumer-insights-synthetic.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
    const tooltip=$('chart-tooltip');
    function showTooltip(target,x,y){tooltip.textContent=target.dataset.tip;tooltip.hidden=false;tooltip.style.left=Math.max(8,Math.min(x,innerWidth-300))+'px';tooltip.style.top=Math.max(8,y-50)+'px';}
    $('volume-chart').addEventListener('pointermove',e=>{const target=e.target.closest('[data-tip]');if(target)showTooltip(target,e.clientX+10,e.clientY);else tooltip.hidden=true;});
    $('volume-chart').addEventListener('pointerleave',()=>tooltip.hidden=true);
    $('volume-chart').addEventListener('focusin',e=>{if(e.target.dataset.tip){const r=e.target.getBoundingClientRect();showTooltip(e.target,r.left,r.top);}});
    $('volume-chart').addEventListener('focusout',()=>tooltip.hidden=true);
    render();let lastWidth=0;new ResizeObserver(entries=>{const width=Math.round(entries[0].contentRect.width);if(width&&width!==lastWidth){lastWidth=width;trend();}}).observe($('volume-chart'));
  } catch(error) {
    $('load-error').hidden=false;$('load-error').textContent='The dashboard could not load. Please refresh the page or return to the project overview.';console.error(error);
  }
})();
