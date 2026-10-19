// Shared analytics for the synthetic portfolio workspace. No network or model calls.
export const sentimentOrder = ['positive','neutral','negative'];
export const initialState = () => ({view:'reviews',brand:'all',product:'all',channel:'all',period:4,sentiment:'all',topic:'',day:'',query:'',flagged:false,rating:0,evidenceSource:'review',sort:'newest',page:0});
export function filterRecords(rows,state,{source='all',omit=[]}={}) {
  const ignore=new Set(omit),query=state.query.trim().toLowerCase();
  return rows.filter(r=>
    (source==='all'||r.source===source)&&r.week>=4-state.period&&
    (ignore.has('brand')||state.brand==='all'||r.brand===state.brand)&&
    (ignore.has('product')||state.product==='all'||r.product===state.product)&&
    (ignore.has('channel')||state.channel==='all'||r.channel===state.channel)&&
    (ignore.has('sentiment')||state.sentiment==='all'||r.sentiment===state.sentiment)&&
    (ignore.has('topic')||!state.topic||r.topic===state.topic)&&
    (ignore.has('day')||!state.day||r.date===state.day)&&
    (ignore.has('flagged')||!state.flagged||r.flagged)&&
    (ignore.has('rating')||!state.rating||r.rating===state.rating)&&
    (ignore.has('query')||!query||`${r.id} ${r.text} ${r.topic} ${r.keyword}`.toLowerCase().includes(query)));
}
export function summarize(rows) {
  const counts=Object.fromEntries(sentimentOrder.map(s=>[s,rows.filter(r=>r.sentiment===s).length]));
  const rated=rows.filter(r=>r.rating!==null);
  return {total:rows.length,...counts,flags:rows.filter(r=>r.flagged).length,rating:rated.length?rated.reduce((n,r)=>n+r.rating,0)/rated.length:null,views:rows.reduce((n,r)=>n+(r.views||0),0)};
}
export const percentage=(n,total)=>total?n/total*100:0;
export function sortRecords(rows,order='newest') {
  return [...rows].sort((a,b)=>(order==='oldest'?a.date.localeCompare(b.date):order==='flagged'?Number(b.flagged)-Number(a.flagged):0)||b.date.localeCompare(a.date)||a.id.localeCompare(b.id));
}
export function toCSV(rows,brandNames) {
  const fields=['id','date','brand','product','channel','source','topic','sentiment','rating','flagged','keyword','text'];
  const cell=value=>'"'+String(value??'').replace(/^[=+@-]/,"'$&").replace(/"/g,'""')+'"';
  return [['synthetic_data',...fields].map(cell).join(','),...rows.map(r=>[true,...fields.map(f=>f==='brand'?brandNames[r.brand]:r[f])].map(cell).join(','))].join('\r\n');
}
