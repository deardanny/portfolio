// Original synthetic fixtures for the public portfolio demo. No source records.
export const brands = [{id:'a',name:'Brand A'},{id:'b',name:'Brand B'},{id:'c',name:'Brand C'}];
export const weeks = ['2026-02-02','2026-02-09','2026-02-16','2026-02-23'];
export const attributes = ['Cleaning performance','Battery life','Noise','Build quality','Value'];
export const topics = ['Small-space storage','Pet-friendly homes','Repairability','Quiet routines','Value shopping'];
const reviewText = {
  'Cleaning performance': {
    positive:['The vacuum picked up the crumbs in one pass. The floor felt clean afterward.','It handles the entryway rug and hard floor without changing settings.'],
    neutral:['It works well on the kitchen floor; the thicker rug takes a second pass.','The pickup is about what I expected for everyday dust.'],
    negative:['Small pieces stayed along the edge even after a few passes.','It pushed the larger crumbs around instead of collecting them.']
  },
  'Battery life': {
    positive:['One charge covered the living room and both bedrooms.','The battery lasted through my usual cleaning routine.'],
    neutral:['I can finish the smaller rooms if I stay on the standard setting.','The battery is fine for a quick clean, but I recharge between floors.'],
    negative:['The battery ran out before I finished the second room.','Runtime drops quickly when I use the stronger setting.']
  },
  Noise: {
    positive:['The lower setting is quiet enough for a short evening clean.','The motor sounds softer than I expected.'],
    neutral:['The sound is noticeable, though it is fine for daytime use.','The normal setting is manageable; the highest setting is much louder.'],
    negative:['The high-pitched sound makes longer cleaning sessions tiring.','It is too loud for the quiet morning routine I had in mind.']
  },
  'Build quality': {
    positive:['The handle and dust-bin latch feel solid and easy to use.','Emptying the bin is simple, and the parts fit back together neatly.'],
    neutral:['The body is light, although the attachments need a firm push.','Assembly was straightforward; I have only used it for a few days.'],
    negative:['The dust-bin latch feels loose after repeated use.','One attachment does not stay in place as securely as I expected.']
  },
  Value: {
    positive:['The included attachments make it a useful everyday purchase.','For my small apartment, the features are worth the price.'],
    neutral:['It is a reasonable option, but I would wait for a promotion.','The price is similar to the other models I considered.'],
    negative:['The replacement accessories cost more than I expected.','I wanted a longer runtime at this price.']
  }
};
const communityText = {
  'Small-space storage': ['I am comparing compact vacuums that fit beside a narrow utility shelf.','Does the wall mount work well in a small apartment? Storage matters as much as power for me.'],
  'Pet-friendly homes': ['I am looking for a brush that is easy to clear after picking up pet hair.','The pet-hair attachment is the part I am comparing most closely.'],
  Repairability: ['Can the battery be replaced separately? I want to keep the vacuum for several years.','I would like clearer information about spare parts and replacing the dust-bin latch.'],
  'Quiet routines': ['I want to clean a little in the evening without disturbing the rest of the household.','Does the quiet setting still pick up crumbs on a hard floor?'],
  'Value shopping': ['I am comparing the standard kit with the extra-attachment bundle.','The lowest sticker price is not everything; replacement filters also matter to me.']
};
const reviewVolumes = [[32,40,46,54],[38,40,42,44],[30,32,34,36]];
const postVolumes = [[14,18,26,34],[18,20,20,22],[12,14,16,18]];
export function makeDemoData() {
  const records=[];
  brands.forEach((brand,b)=>weeks.forEach((start,w)=>{
    for(const source of ['review','community']) {
      const volume=(source==='review'?reviewVolumes:postVolumes)[b][w];
      for(let i=0;i<volume;i++) {
        const date=new Date(`${start}T12:00:00Z`); date.setUTCDate(date.getUTCDate()+i%7);
        let topic=(source==='review'?attributes:topics)[(i+b+w)%5];
        if(source==='review'&&b===0&&w>=2&&i%4===0)topic='Battery life';
        if(source==='community'&&w===3&&i%3===0)topic='Repairability';
        const score=(i*37+b*13+w*19)%100;
        const threshold=source==='review'&&b===0&&topic==='Battery life'&&w>=2?61:18+b*5+w*2;
        const sentiment=score<threshold?'negative':score<threshold+15?'neutral':'positive';
        let flagged=sentiment==='negative'&&(topic==='Battery life'||topic==='Build quality'||topic==='Repairability')&&i%3===0;
        let text=source==='review'?reviewText[topic][sentiment][i%2]:(sentiment==='positive'?'I have been happy with this model. ':sentiment==='negative'?'My experience with this model has been disappointing. ':'')+communityText[topic][i%2];
        let keyword='';
        if(flagged){
          if(topic==='Battery life'){text=['The charging adapter felt unusually warm, so I stopped charging and contacted support.','The adapter became warm during charging. I unplugged it and asked support to check it.','I noticed unusual warmth near the charging adapter and paused use while waiting for guidance.'][Math.floor(i/3)%3];keyword='warm adapter';}
          else if(topic==='Build quality'){text=['The latch cracked during normal use. I stopped using the attachment and asked for a replacement.','A crack appeared on the dust-bin latch, so I contacted support before using it again.','The attachment latch cracked. I set that part aside and requested a replacement.'][Math.floor(i/3)%3];keyword='cracked latch';}
          else {text='A charging interruption made me check the replacement-battery options before using it again.';keyword='charging interruption';}
        }
        records.push({id:`${source==='review'?'R':'P'}-${brand.id.toUpperCase()}-${w+1}-${String(i+1).padStart(3,'0')}`,brand:brand.id,source,week:w,date:date.toISOString().slice(0,10),topic,sentiment,flagged,keyword,text,product:`Series ${b+1}`,views:source==='community'?60+((i*113+b*79+w*211)%1900):null});
      }
    }
  }));
  return {brands,weeks,attributes,topics,records};
}
export const demoData=makeDemoData();
