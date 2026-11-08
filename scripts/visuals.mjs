function legacyVisualHTML(p) {
    const figures = {
      screening: {
        title:'A second check on screening decisions', label:'RESEARCH WORKFLOW',
        body:`<div class="rp-source">Research papers</div>
          <div class="rp-parallel"><div class="rp-node"><strong>Human review</strong><span>Inclusion labels</span></div><div class="rp-node"><strong>LLM screening</strong><span>Inclusion labels</span></div></div>
          <div class="rp-converge" aria-hidden="true"></div>
          <div class="rp-agreement"><strong>κ ≈ 0.80</strong><span>Cohen’s kappa · Human–LLM agreement</span></div>
          <div class="rp-review-route"><span>Low-confidence LLM decisions</span><span aria-hidden="true">→</span><span>Manual review</span></div>`,
        caption:'Agreement measures consistency between human and LLM labels. It is not an accuracy score.'
      },
      teaming: {
        title:'Designing a shared task', label:'EXPERIMENT DESIGN',
        body:`<div class="rp-team"><div class="rp-node"><strong>Human</strong><span>Teammate</span></div><span class="rp-connector" aria-hidden="true">↔</span><div class="rp-node rp-task"><strong>Shared kitchen</strong><span>Coordinate · Cook · Deliver</span></div><span class="rp-connector" aria-hidden="true">↔</span><div class="rp-node"><strong>AI</strong><span>Teammate</span></div></div>
          <p class="rp-team-caption">Role coordination and strategy adaptation</p>
          <div class="rp-design-levers"><span>Map layouts</span><span>Reward structure</span><span>LLM prompts</span></div>
          <p class="rp-rewards-title">Configured recipe rewards</p>
          <div class="rp-reward"><span>Onion soup</span><div class="rp-reward-track" aria-hidden="true"><div class="rp-reward-bar" style="width:66.6667%"></div></div><span class="rp-reward-value">20 pts</span></div>
          <div class="rp-reward"><span>Tomato soup</span><div class="rp-reward-track" aria-hidden="true"><div class="rp-reward-bar" style="width:100%"></div></div><span class="rp-reward-value">30 pts</span></div>`,
        caption:'Task schematic based on modifications to an existing Overcooked environment. Study preparation is ongoing; the rewards are design parameters, not participant outcomes.'
      },
      risk: {
        title:'Sentiment classification performance', label:'HUMAN-LABELED REVIEWS',
        body:`<svg class="rp-chart" data-chart="risk" role="img" aria-label="Sentiment accuracy: vendor system 60 percent, RoBERTa 80 percent, GPT-4o 95 percent."></svg>
          <div class="rp-inline-pipeline"><span>Consumer feedback</span><span aria-hidden="true">→</span><span>NLP signals & summaries</span><span aria-hidden="true">→</span><span>Power BI</span></div>`,
        caption:'Reported accuracy on human-labeled reviews. The production workflow processes 20,000+ reviews and social posts per day across 100+ products.'
      },
      education: {
        title:'From evaluation records to themes', label:'PRIVACY-AWARE WORKFLOW',
        body:`<div class="rp-data-source"><div><strong>50,000+</strong><span>Evaluation records standardized</span></div><div><strong>25,000+</strong><span>Qualitative comments analyzed</span></div></div>
          <div class="rp-pipeline"><div class="rp-node"><strong>Prepare</strong><span>Standardize records</span></div><div class="rp-node"><strong>Mask PII</strong><span>spaCy NER + rules</span></div><div class="rp-node"><strong>Find themes</strong><span>Claude Haiku / Sonnet</span></div><div class="rp-node"><strong>Compare</strong><span>Power BI reporting</span></div></div>
          <div class="rp-privacy-note"><strong>Identity mappings stored separately</strong><span>Text analysis uses masked comments</span></div>`,
        caption:'The counts refer to different units: evaluation records and qualitative comments. The case study presents the method and aggregate findings.'
      },
      crm: {
        title:'Engagement in the best-performing segment', label:'COUPON TARGETING EXPERIMENT',
        body:`<div class="rp-experiment"><div><strong>Model-based selection</strong><span>LightGBM · Behavioral features</span></div><div><strong>Random selection</strong><span>Comparison group</span></div></div>
          <svg class="rp-chart" data-chart="crm" role="img" aria-label="Click-through rate index for the best-performing segment: random targeting 100, model targeting 142, a 42 percent relative increase."></svg>`,
        caption:'CTR is indexed to random targeting = 100. The 42% relative increase applies to the best-performing segment. Both groups received coupons; approximately 14,000 users participated in the full test.'
      }
    };
    const f=figures[p.id];
    return `<figure class="rp-figure" aria-labelledby="rp-figure-${p.id}"><div class="rp-figure-head"><h2 id="rp-figure-${p.id}">${f.title}</h2><span class="rp-figure-label">${f.label}</span></div>${f.body}<figcaption>${f.caption}</figcaption></figure>`;
  }

const node = (title, text) => `<div class="rp-node"><strong>${title}</strong><span>${text}</span></div>`;
const pipeline = items => `<div class="rp-pipeline">${items.map(([a,b])=>node(a,b)).join('')}</div>`;
const switches = (id,label,items) => `<div class="figure-explorer" data-switch><label class="figure-control" hidden>${label}<select data-panel-select>${items.map((x,i)=>`<option value="${id}-${i}">${x.label}</option>`).join('')}</select></label><div class="figure-panels" aria-live="polite">${items.map((x,i)=>`<section class="figure-panel" id="${id}-${i}" data-panel${i?' hidden':''} aria-label="${x.label}">${x.body}</section>`).join('')}</div></div>`;
const effectRow = (label,n,value) => `<div class="effect-row"><span>${label}<small>n = ${n}</small></span><div class="effect-track" aria-hidden="true"><i style="left:${value<0?50+value*50:50}%;width:${Math.abs(value)*50}%"></i></div><strong>${value>=0?'+':''}${value.toFixed(3)}</strong></div>`;

export function projectVisualHTML(p) {
  if(['screening','teaming','risk','education','crm'].includes(p.id)) return legacyVisualHTML(p);
  const figures = {
    hospitality: {
      title:'What information supports a match?',label:'SYNTHETIC EXAMPLES',
      body:switches('room','Explore a description',[
        {label:'Room type and attributes',body:`<blockquote class="sample-text">“Double room with a balcony and sea view”</blockquote><div class="token-row"><span>Type: double room</span><span>Outdoor: balcony</span><span>View: sea</span></div>${pipeline([['Parse','Separate type and attributes'],['Retrieve','Find catalog candidates'],['Check','Compare required attributes'],['Propose','Candidate + explanation']])}<p class="figure-result">A room-type candidate can be considered, subject to the catalog’s rules.</p>`},
        {label:'Bed information only',body:`<blockquote class="sample-text">“Two twin beds, non-smoking”</blockquote><div class="token-row"><span>Beds: two twins</span><span>Smoking: no</span><span class="missing-token">Room type: missing</span></div>${pipeline([['Parse','Recognize bed details'],['Check','Room type not specified'],['Abstain','Do not infer a room type'],['Review','Request more information']])}<p class="figure-result">Useful attributes do not necessarily establish the room type. Leave the match unresolved.</p>`},
        {label:'Ambiguous wording',body:`<blockquote class="sample-text">“Superior accommodation, garden side”</blockquote><div class="token-row"><span>Grade: superior</span><span>Position: garden side</span><span class="missing-token">Room type: unclear</span></div>${pipeline([['Parse','Keep the original meaning'],['Retrieve','Find possible candidates'],['Compare','Identify unresolved meaning'],['Review','Explain the ambiguity']])}<p class="figure-result">Preserve the distinction between a view, a location, and a room type.</p>`}
      ]),caption:'Invented examples showing possible routing decisions, not live model predictions or client records. The capstone is in progress.'
    },
    synthetic: {
      title:'The estimate changes with the response source',label:'REPORTED STUDY ESTIMATES',
      body:switches('effect','Survey outcome',[
        ['Would click Premium',0.011,0.912],['Would consider subscribing',-0.056,0.651],['Premium worth paying',0.106,0.821]
      ].map(([label,human,llm])=>({label,body:`<h3 class="figure-subtitle">${label}</h3><div class="effect-chart" aria-label="${label}: human effect ${human}, synthetic effect ${llm} Likert points">${effectRow('Human',38,human)}${effectRow('Synthetic',1100,llm)}<div class="effect-axis"><span>−1</span><span>0</span><span>+1</span></div><p class="axis-caption">Estimated difference in Likert points · treatment minus control</p></div>`})))+`<p class="figure-caution">Generation instructions included a treatment-direction cue. The human sample is underpowered.</p>`,
      caption:'Point estimates from the final course report, shown without confidence intervals. The synthetic responses are generated observations, not additional human participants; the contrast is exploratory.'
    },
    power: {
      title:'From a forecast horizon to a placement decision',label:'TASK & DECISION FRAMEWORK',
      body:switches('forecast','Prediction horizon',[24,48].map(hours=>({label:`Next ${hours} hours`,body:`<div class="time-strip"><div class="time-history">Observed history<small>Outages + weather</small></div><div class="time-future">Next 24 hours<small>Forecast</small></div><div class="${hours===48?'time-future':'time-inactive'}">Hours 25–48<small>${hours===48?'Forecast':'Outside this horizon'}</small></div></div><div class="model-grid">${node('Baselines','Persistence · historical mean')}${node('Time-series models','SARIMAX · Seq2Seq LSTM')}${node('Boosted trees','XGBoost · lagged features')}</div><div class="allocation"><span class="generator-symbols" aria-label="Five generators">${Array.from({length:5},()=>'<i aria-hidden="true">G</i>').join('')}</span><p><strong>5 generators · up to 1,000 households each</strong><span>Prioritize counties using the ${hours}-hour forecast. Placement is fixed for the event.</span></p></div>`}))),
      caption:'Method schematic, not a forecast plot. Capacity is an assignment assumption; actual coverage depends on location and demand. The study does not demonstrate operational performance with future weather forecasts.'
    },
    voc: {
      title:'From a complaint to an interpretable theme',label:'SYNTHETIC TEXT EXAMPLE',
      body:`<blockquote class="sample-text" lang="ko">“배송이 늦고 상자가 파손되어 도착했어요.”<small lang="en">“The delivery was late and the box arrived damaged.”</small></blockquote><div class="token-row" aria-label="Illustrative tokens"><span lang="ko">배송</span><span lang="ko">늦다</span><span lang="ko">상자</span><span lang="ko">파손</span></div>${pipeline([['Prepare','Korean tokenization'],['Represent','Unigrams + bigrams'],['Model','LDA within a category'],['Interpret','Inspect words and tickets']])}<div class="topic-lenses">${node('Possible theme','Delivery timing')}${node('Possible theme','Package condition')}</div>`,
      caption:'An explanatory example, not output from the trained model. Topic frequencies and actual customer text are not reproduced; the public notebook contains the methodology with outputs cleared.'
    },
    humanitarian: {
      title:'A small review queue, with context',label:'FINAL NOTEBOOK COUNTS',
      body:`<div class="rp-data-source"><div><strong>15,664</strong><span>Projects analyzed</span></div><div><strong>123</strong><span>Flagged for review</span></div><div><strong>0.79%</strong><span>Flagging rate, rounded</span></div></div><div class="review-share" role="img" aria-label="123 of 15,664 projects, approximately 0.79 percent, were flagged"><span style="width:${123/15664*100}%"></span></div><div class="share-labels"><span>Flagged projects</span><span>All analyzed projects</span></div>${pipeline([['Group peers','Same fund and sector'],['Fit benchmark','Log budget vs. beneficiaries'],['Score residuals','Within-group Z-score'],['Review','Explain unusual budgets']])}<div class="z-bands"><span>Below −3<br><strong>Review</strong></span><span>−3 to +3<br><strong>Within the rule’s bounds</strong></span><span>Above +3<br><strong>Review</strong></span></div>`,
      caption:'A statistical flag is a request for contextual review, not proof of fraud or inefficiency. The proportion shows observed notebook counts; the Z-score band shows the decision rule.'
    },
    fraud: {
      title:'Different mistakes carry different assumed costs',label:'MODELING ASSUMPTIONS',
      body:`<div class="cost-grid"><div class="cost-cell"><span>Missed fraudulent claim</span><strong>$15,000</strong><small>Assumed cost per false negative</small></div><div class="cost-cell"><span>False-alarm investigation</span><strong>$500</strong><small>Assumed cost per false positive</small></div></div><p class="cost-equation">Expected cost = $15,000 × missed fraud + $500 × false alarms</p><div class="evaluation-path"><p class="path-label">Implemented study</p>${pipeline([['Train','Fit the models'],['Evaluate','Score held-out claims'],['Choose threshold','Minimize cost on those claims'],['Interpret','Exploratory estimate']])}<p class="path-label">Evaluation improvement</p>${pipeline([['Train','Fit the models'],['Validate','Choose the cost threshold'],['Freeze','Fix model and threshold'],['Test once','Independent assessment']])}</div>`,
      caption:'The cost ratio is 30:1, an explicit assumption. The diagram distinguishes the existing threshold-selection procedure from a proposed independent evaluation; it does not show realized savings.'
    },
    'job-radar': {
      title:'A strong match still needs supporting evidence',label:'WORKFLOW EXAMPLES',
      body:switches('posting','Explore a decision path',[
        {label:'Evidence supports a recommendation',body:`<div class="token-row"><span>Recent posting date</span><span>Role and level match</span><span>Eligibility evidence</span></div>${pipeline([['Collect','Normalize source fields'],['Verify','Check required evidence'],['Compare','Résumé and skill match'],['Report','Summary for human review']])}<p class="figure-result">Eligible for reporting. Only actually reported URLs are marked as seen.</p>`},
        {label:'Missing posting-date evidence',body:`<div class="token-row"><span>Strong text match</span><span class="missing-token">Publication date unknown</span></div>${pipeline([['Collect','Source gives an update date'],['Check','Update ≠ publication'],['Hold','Needs verification'],['Revisit','Keep it eligible for recheck']])}<p class="figure-result">Withhold the recommendation until freshness can be verified.</p>`},
        {label:'Eligibility wording is inconclusive',body:`<div class="token-row"><span>Matching skills</span><span class="missing-token">Sponsorship question only</span></div>${pipeline([['Read','Check actual wording'],['Distinguish','Question ≠ commitment'],['Hold','Needs verification'],['Review','Look for role-specific support']])}<p class="figure-result">A question on an application form does not establish sponsorship availability.</p>`}
      ]),caption:'Illustrative paths reflecting implemented filters. No live postings, personal résumé text, or acceptance probabilities are displayed.'
    },
    rag: {
      title:'What reaches the language model?',label:'RETRIEVAL ARCHITECTURE',
      body:`<div class="chunk-demo"><div><span>Chunk 1 · 1,000 characters</span><i>200-character overlap</i></div><div><i>Shared text</i><span>Chunk 2 · 1,000 characters</span></div></div>${pipeline([['Load & split','PDF → overlapping chunks'],['Embed & index','OpenAI → Chroma'],['Retrieve','Top 3 chunks per question'],['Generate','Context → GPT-4o-mini']])}<div class="retrieval-context"><p class="path-label">Context sent with the question</p><div><span>Retrieved passage 1</span><span>Retrieved passage 2</span><span>Retrieved passage 3</span></div><p>“Answer the question based only on the following context.”</p></div>`,
      caption:'Architecture diagram based on the public implementation. Three retrieved passages supply context; this is not a guarantee that an answer is supported or that retrieval found every relevant passage.'
    }
  };
  const f=figures[p.id];
  if(!f) throw new Error(`Missing figure: ${p.id}`);
  return `<figure class="rp-figure" aria-labelledby="rp-figure-${p.id}"><div class="rp-figure-head"><h2 id="rp-figure-${p.id}">${f.title}</h2><span class="rp-figure-label">${f.label}</span></div>${f.body}<figcaption>${f.caption}</figcaption></figure>`;
}
