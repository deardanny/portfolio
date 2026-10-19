export const projects = [
    {id:'screening',title:'LLM-assisted literature screening',meta:'CMU · Research',desc:'Adding a human–AI agreement check to systematic literature review.',question:'How can an LLM provide a systematic second check on human decisions when screening research papers?',approach:'Compare LLM inclusion decisions with human-assigned labels, measure agreement with Cohen’s kappa, and route low-confidence cases for manual review.',contribution:'Developed the LLM screening classifier and evaluation workflow as part of research on human–AI collaboration.',evidence:'Approximately 0.80 Cohen’s kappa against human-assigned labels. This measures agreement, not classification accuracy or proof that every shared decision is correct.',status:'Research workflow. A second layer of review supports human judgment.'},
    {id:'teaming',title:'Human–AI collaboration in Overcooked',meta:'CMU · Ongoing research',desc:'Designing tasks, rewards, and prompts to study coordination with AI teammates.',question:'How do people coordinate roles and adapt their strategies while working with an AI teammate?',approach:'Adapt an existing Overcooked research environment by changing layouts, reward structures, and the prompts given to LLM teammates.',contribution:'Modified the game maps, introduced different rewards for onion and tomato soup, refined LLM prompts, and contributed to experimental design.',evidence:'Implemented task and environment changes for a planned study of coordination and adaptation. No completed participant-study outcomes are claimed.',status:'Ongoing research and experimental preparation, according to the latest project notes.'},
    {id:'risk',title:'NLP for product issue monitoring',meta:'Kimberly-Clark · Industry',desc:'Turning consumer reviews into sentiment, risk signals, and concise summaries.',question:'How can product teams identify emerging issues within large volumes of consumer feedback?',approach:'Combine GPT-4o sentiment classification and prompt design with keyword monitoring, review summaries, and Power BI reporting. The pipeline processes 20,000+ reviews and social posts daily across 100+ products.',contribution:'Led development of the in-house NLP platform, replacing a vendor solution and connecting text analysis to marketing and manufacturing workflows.',evidence:'95% sentiment accuracy on human-labeled reviews, compared with 80% for RoBERTa and 60% for the vendor system. Annual platform costs decreased by approximately 90%.',status:'Issue identification and notification to manufacturing shortened from approximately 90 days to 3 days. This is not the time required to fully resolve a product issue.',url:'https://github.com/deardanny/nlp-risk-dashboard',link:'View public code'},
    {id:'basd',title:'Privacy-aware teacher feedback analysis',meta:'B.A.S.D. · Summer 2026',desc:'Structuring qualitative evaluation comments while limiting identity exposure.',question:'How can inconsistent evaluation records and free-text comments support useful comparisons across schools?',approach:'Standardize 50,000+ records, extract themes from 25,000+ comments with Claude Haiku and Sonnet, and compare patterns in Power BI.',contribution:'Built data preparation and text analysis workflows, including spaCy NER, rule-based PII masking, and separate identity mappings.',evidence:'The lowest-scoring evaluation area also had the most missing supporting evidence. Findings were presented to inform teacher training and support priorities.',status:'Completed summer internship. The case study describes methods and aggregate findings without including individual evaluation records.'},
    {id:'crm',title:'Customer modeling & targeting experiments',meta:'Kimberly-Clark · Applied ML',desc:'Connecting churn and purchase propensity models to CRM decisions.',question:'Does model-based audience selection improve engagement compared with randomly selected coupon recipients?',approach:'Build LightGBM models with 20+ behavioral and lifecycle features; use Hyperopt for tuning and MLflow for experiment tracking on Databricks.',contribution:'Developed customer-level models and automated monthly Power BI reporting; worked with marketers on an A/B test covering approximately 14,000 users.',evidence:'The best-performing model-targeted segment achieved 42% higher click-through rate than its random-targeting comparison group. Both groups received coupons.',status:'The 42% result applies to the best-performing segment, not the entire test population.',url:'https://github.com/deardanny/churn-prediction',link:'View related public code'}
  ];

export function projectVisualHTML(p) {
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
      basd: {
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
