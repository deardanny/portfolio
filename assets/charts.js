(() => {
  let chartObserver;
  function drawCharts(site) {
    chartObserver?.disconnect();
    const draw = svg => {
      const isRisk=svg.dataset.chart==='risk';
      const data=isRisk?[{label:'Vendor',value:60},{label:'RoBERTa',value:80},{label:'GPT-4o',value:95,highlight:true}]:[{label:'Random',value:100},{label:'Model',value:142,highlight:true}];
      const width=Math.round(svg.getBoundingClientRect().width);
      if(!width)return;
      const left=86, right=34, top=32, row=51, bottom=49;
      const height=top+data.length*row+bottom, plotWidth=width-left-right;
      const upper=isRisk?100:Math.ceil(Math.max(...data.map(d=>d.value))/50)*50;
      const ticks=[0,upper/2,upper];
      svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
      svg.setAttribute('height',height);
      svg.replaceChildren();
      const el=(tag,attrs,content)=>{const node=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,v));if(content!==undefined)node.textContent=content;svg.append(node);return node;};
      el('title',{},isRisk?'Sentiment accuracy by model':'Best-performing segment: click-through rate index');
      el('text',{x:0,y:16,class:'axis-title','data-axis':'y'},isRisk?'Model':'Targeting');
      el('rect',{x:left,y:top,width:plotWidth,height:row*data.length,class:'rp-chart-frame','data-chart-frame':''});
      ticks.forEach(value=>{
        const x=left+plotWidth*value/upper;
        if(value>0&&value<upper)el('line',{x1:x,x2:x,y1:top,y2:top+data.length*row,class:'rp-gridline'});
        el('text',{x,y:top+data.length*row+19,'text-anchor':value===0?'start':value===upper?'end':'middle',class:'rp-chart-tick'},value);
      });
      data.forEach((d,i)=>{
        const y=top+i*row+row/2;
        el('text',{x:0,y:y+4},d.label);
        el('rect',{x:left,y:y-7,width:plotWidth*d.value/upper,height:14,class:d.highlight?'rp-bar':'rp-baseline'});
        el('text',{x:left+plotWidth*d.value/upper+6,y:y+4,class:'rp-value'},d.value+(isRisk?'%':''));
      });
      el('text',{x:width-right,y:height-5,'text-anchor':'end',class:'axis-title','data-axis':'x'},isRisk?'Accuracy (%)':'CTR index');
    };
    chartObserver=new ResizeObserver(entries=>entries.forEach(entry=>draw(entry.target)));
    site.querySelectorAll('[data-chart]').forEach(svg=>{draw(svg);chartObserver.observe(svg);});
  }

 drawCharts(document);
})();
