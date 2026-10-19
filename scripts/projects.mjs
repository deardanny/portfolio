export { projectVisualHTML } from './visuals.mjs';
export const featuredIds = ['screening','teaming','tui','risk','basd','power'];
export const groups = [
  {id:'research',label:'Research & evaluation',description:'Language models, human decisions, and the evidence between them.'},
  {id:'applied',label:'Applied machine learning',description:'From language and predictive models to decisions people can use.'},
  {id:'systems',label:'Systems & prototypes',description:'Working tools for retrieval, discovery, and repeatable analysis.'}
];
export const projects = [
  {
    id:'screening',group:'research',title:'LLM-assisted literature screening',meta:'Carnegie Mellon University · Research',
    resourceStatus:'Research materials not public',
    status:'Research workflow',period:'2026',role:'Classifier development & evaluation',scope:'Systematic literature review',
    tags:['LLM evaluation','Human–AI agreement','Python'],signal:'κ ≈ 0.80',signalContext:'Agreement with human labels',
    desc:'Building a measurable second layer of review for research-paper screening.',
    question:'How can an LLM support consistent inclusion decisions without removing the judgment of human reviewers?',
    approach:'I translated a literature-review screening protocol into an LLM classification workflow, then compared its inclusion decisions with human-assigned labels. Cohen’s kappa makes agreement interpretable beyond raw matches by accounting for agreement expected by chance.',
    contribution:'Developed the screening classifier and evaluation workflow alongside my work as a human screener. I used disagreements and model-reported confidence to identify cases needing closer manual review, connecting model evaluation to the actual research process.',
    evidence:'The classifier reached approximately 0.80 Cohen’s kappa against human-assigned labels. The outcome is a way to inspect consistency and direct reviewer attention, rather than treating model output as a final screening authority.',
    context:'Agreement is not correctness: human and model labels can agree and still be wrong. Low-confidence decisions are routed for manual review, and confidence needs continued validation as the document mix changes.',
    takeaway:'Evaluation should determine where automation belongs in a workflow, not simply produce a headline score.',
    materials:'Research workflow described here; study materials are not distributed through this portfolio.'
  },
  {
    id:'teaming',group:'research',title:'Human–AI collaboration in Overcooked',meta:'Carnegie Mellon University · Research',
    resourceStatus:'Research code not public',
    status:'Ongoing research',period:'2026 — present',role:'Task design, environment changes & prompting',scope:'Collaborative game experiment',
    tags:['Human–AI teaming','Experiment design','LLM prompting'],signal:'Coordination & adaptation',signalContext:'Experimental task design',
    desc:'Designing shared tasks that make coordination with an AI teammate observable.',
    question:'How do people divide responsibilities, communicate, and adapt their strategies while working with an AI partner?',
    approach:'The study uses an existing Overcooked-style environment as a shared task. I modified kitchen layouts and rewards to create more meaningful choices about task allocation, and refined the LLM prompts used in the interaction. Different recipe rewards give coordination a concrete consequence in the game.',
    contribution:'Changed game maps, implemented onion-soup and tomato-soup rewards of 20 and 30 points, refined prompts, and contributed to experimental design. My work extends an inherited research platform and connects implementation decisions to the behaviors the study aims to observe.',
    evidence:'The current deliverable is a modified experimental environment and task design. It supports investigating coordination and adaptation; completed participant-study results are not yet available.',
    context:'Recipe rewards are experimental settings, not measured improvements in participant performance. The LLM component is prompting; no separate document-retrieval system is claimed.',
    takeaway:'A useful research platform needs tasks that reveal differences in behavior, not just a game that runs.',
    materials:'Experiment-design schematic; participant records and private research code are not included.'
  },
  {
    id:'tui',group:'research',title:'Normalizing hotel room descriptions',meta:'TUI Group × Carnegie Mellon University · Capstone',
    resourceStatus:'Client materials not public',
    status:'In progress',period:'Fall 2026',role:'ML contributor · team capstone',scope:'Text-to-catalog matching',
    tags:['NLP','Entity normalization','Retrieval','Data quality'],signal:'Free text → standard catalog',signalContext:'Industry capstone',
    desc:'Turning inconsistent supplier language into explainable room-type matches.',
    question:'How can a system map free-text room descriptions to a standard catalog while recognizing when there is not enough information?',
    approach:'The team is separating catalog meaning from historical mapping behavior. Exploratory analysis examines missing descriptions, class coverage, conflicting labels, and differences between mapped history and the unmapped backlog. Identical descriptions are grouped when preparing evaluation splits so repeated wording does not make validation artificially easy.',
    contribution:'Contributed exploratory analysis and the ML framing of the mapping problem. I examined where historical labels are unreliable and how incomplete descriptions should affect matching. This informs a comparison of catalog-based and historical-example retrieval, with explanations and an explicit option to leave a description unmapped.',
    evidence:'Completed work includes data-quality analysis, a description-level evaluation design, and a defined mapping scope. The next modeling step is to compare multilingual embeddings and retrieval paths; production matching accuracy is not yet established.',
    context:'The capstone is in progress; a live production system is outside the agreed scope. The examples on this page are invented and do not reproduce client records or catalog codes.',
    takeaway:'Knowing when a description cannot support a match is part of the classification problem.',
    materials:'Public method overview with synthetic examples; client data remains private.'
  },
  {
    id:'synthetic',group:'research',title:'Human vs. LLM survey responses',meta:'Carnegie Mellon University · A/B testing study',
    resourceStatus:'Course materials not public',
    status:'Exploratory study',period:'Spring 2026',role:'Treatment-effect analysis & limitations',scope:'38 human + 1,100 synthetic responses',
    tags:['Synthetic data','A/B testing','OLS','Evaluation'],signal:'38 human · 1,100 synthetic',signalContext:'Separate estimates by source',
    desc:'Examining what changes when synthetic respondents dominate an experiment.',
    question:'What can an experiment tell us when most survey responses are generated by an LLM rather than collected from people?',
    approach:'Our team tested a “Skip Ad with Premium” interface concept using a randomized survey. We analyzed 38 human responses separately from 1,100 Claude-generated responses, using OLS with robust standard errors, treatment-by-source interactions, and power analysis. Splitting the sources exposed a pattern hidden by the pooled estimate.',
    contribution:'Worked on average treatment effects, subgroup comparisons, presentation structure, and limitations. I helped frame the difference between matching respondents’ demographics and reproducing how people react to a treatment.',
    evidence:'On stated willingness to click Premium, the reported estimate was +0.011 Likert points for humans and +0.912 for synthetic respondents. These are estimates of stated intent, not observed clicks, paid subscriptions, or a real YouTube deployment.',
    context:'Synthetic-generation instructions included a treatment-direction cue, so the contrast is not an unbiased test of general LLM behavior. The human sample is too small to distinguish no effect from a modest effect. The pooled estimate is exploratory, not a validated upper bound on the human effect.',
    takeaway:'Synthetic data can make an estimate look precise without making it valid. Generation assumptions belong beside the result.',
    materials:'Figures transcribed from the course report; individual survey responses are not published.'
  },
  {
    id:'risk',group:'applied',title:'NLP for product issue monitoring',meta:'Kimberly-Clark · AI Labs',
    status:'Industry project',period:'2021 — 2025',role:'In-house platform development',scope:'20,000+ daily reviews and social posts',
    tags:['GPT-4o','Snowflake','Databricks','Power BI'],signal:'95% sentiment accuracy',signalContext:'Human-labeled reviews',
    desc:'Connecting large-scale consumer feedback to product-risk monitoring and action.',
    question:'How can product teams find emerging issues in thousands of daily reviews without reading every post themselves?',
    approach:'The platform combines sentiment classification, risk-keyword monitoring, brand and competitor comparisons, and review summaries. Snowflake and Databricks support processing, Azure Data Factory orchestrates the workflow, and Power BI lets marketing and manufacturing teams inspect signals and trace them back to feedback.',
    contribution:'Led development of the in-house platform and the transition from a vendor solution. I developed classification workflows, tested the move from RoBERTa to GPT-4o API prompting, and connected outputs to dashboards, manuals, and user training.',
    evidence:'Sentiment classification achieved 95% accuracy on human-labeled reviews, compared with 80% for RoBERTa and 60% for the vendor system. The workflow covered 100+ products and 20,000+ daily reviews and posts, with approximately 90% lower annual platform costs.',
    context:'Issue identification and notification to manufacturing shortened from approximately 90 days to 3 days. This describes detection and handoff, not full issue resolution. Sentiment accuracy is not the recall of every product-risk keyword.',
    takeaway:'The value of text classification comes from getting a useful signal to the person who can act on it.',
    resources:[
      {label:'Interactive dashboard',url:'/projects/risk/dashboard/'},
      {label:'GitHub',url:'https://github.com/deardanny/nlp-risk-dashboard'},
      {label:'Example notebook',url:'https://github.com/deardanny/nlp-risk-dashboard/blob/main/brand-classification_en.ipynb'}
    ],materials:'The interactive dashboard is an original portfolio demo with fictional brands, records, and figures. It illustrates the workflow rather than reproducing company screens or results. Sanitized methodology notebooks are public; the example notebook covers brand classification within the wider platform.'
  },
  {
    id:'basd',group:'applied',title:'Privacy-aware teacher feedback analysis',meta:'Butler Area School District · Internship',
    resourceStatus:'District materials not public',
    status:'Completed internship',period:'Summer 2026',role:'Data pipeline, NLP & dashboard development',scope:'50,000+ records · 25,000+ comments',
    tags:['Python','spaCy','Claude','Power BI'],signal:'25,000+ qualitative comments',signalContext:'Privacy-aware analysis',
    desc:'Making district-wide evaluation patterns visible while limiting identity exposure.',
    question:'How can inconsistent evaluation documents become a reliable basis for comparing patterns and identifying support needs across schools?',
    approach:'I standardized records from inconsistent templates, separated structured scores from free-text evidence, and used Claude Haiku and Sonnet for keyword and theme extraction. Before analysis, spaCy named-entity recognition and rules masked identifying information; identity mappings were maintained separately.',
    contribution:'Built preparation, masking, and analysis workflows and developed Power BI views for school-level comparisons. I connected the pipeline to the district’s evaluation criteria and presented findings to inform training and support priorities.',
    evidence:'The pipeline standardized more than 50,000 evaluation records and analyzed over 25,000 qualitative comments. The lowest-scoring evaluation area also had the most missing supporting evidence, giving the district a specific pattern to investigate.',
    context:'Records and comments are different units. The finding is an association, not evidence that missing comments caused lower scores. This case study contains no individual teacher evaluations.',
    takeaway:'Privacy handling and the meaning of an evaluation rubric are central design decisions, not finishing steps.',
    materials:'Workflow and aggregate findings only; identifiable education records are not included.'
  },
  {
    id:'crm',group:'applied',title:'Customer modeling & targeting experiments',meta:'Kimberly-Clark · AI Labs',
    status:'Industry project',period:'2021 — 2025',role:'Predictive modeling & campaign evaluation',scope:'Approximately 14,000 test participants',
    tags:['LightGBM','Hyperopt','MLflow','A/B testing'],signal:'+42% CTR in the strongest segment',signalContext:'Relative to random coupon targeting',
    desc:'Taking churn and purchase propensity models into a measurable CRM experiment.',
    question:'Does model-based audience selection improve engagement compared with randomly selected customers receiving the same type of offer?',
    approach:'I developed LightGBM churn and purchase propensity models with more than 20 behavioral and lifecycle features. Hyperopt supported tuning and MLflow tracked experiments in Databricks. Customer scores informed audience selection, while Power BI reporting supported ongoing CRM planning.',
    contribution:'Built customer models and worked with app marketers on an A/B test covering approximately 14,000 users. I connected predictive scores to coupon targeting and helped evaluate the resulting engagement.',
    evidence:'The best-performing model-targeted segment achieved 42% higher click-through rate than its randomly targeted comparison group. Both groups received coupons, making the comparison about audience selection rather than whether an offer was sent.',
    context:'The 42% increase is relative and applies to the strongest segment, not the average across all participants. The visualization indexes the comparison group to 100; it does not imply an absolute CTR of 100% or 142%.',
    takeaway:'An audience model earns its place through the decisions and experiments it supports, not a training metric alone.',
    resources:[
      {label:'GitHub',url:'https://github.com/deardanny/churn-prediction'},
      {label:'Modeling code',url:'https://github.com/deardanny/churn-prediction/blob/main/churn_prediction.py'}
    ],materials:'Related modeling code is public; customer and campaign-level records are excluded.'
  },
  {
    id:'power',group:'applied',title:'Power outage forecasting & generator allocation',meta:'Carnegie Mellon University · Team project',
    resourceStatus:'Course materials not public',
    status:'Completed course project',period:'Spring 2026',role:'Forecasting implementation & analysis',scope:'83 Michigan counties · 24h / 48h horizons',
    tags:['PyTorch','Seq2Seq LSTM','SARIMAX','XGBoost'],signal:'Forecast → deployment decision',signalContext:'Five mobile generators',
    desc:'Connecting weather-driven outage forecasts to the placement of limited backup power.',
    question:'Where should a utility pre-position five mobile generators before an outage event, given uncertainty about which counties will be affected?',
    approach:'The team combined county-level outage histories with weather features and compared persistence and historical baselines, SARIMAX, a Seq2Seq LSTM, and XGBoost. Lagged and rolling features capture recent conditions; chronological evaluation reflects the forward-looking task. Forecasts feed county prioritization under generator capacity constraints.',
    contribution:'Implemented forecasting models and analysis for the team project, and helped translate model comparison into a placement recommendation. My work connected data preparation, evaluation, and the final report rather than ending at a prediction table.',
    evidence:'Deliverables include a multi-model notebook, 24-hour and 48-hour prediction tasks across 83 counties, and a recommendation for five generators. Each generator is assumed to serve up to 1,000 households and cannot be relocated once deployed.',
    context:'The study uses an April–June 2023 window and does not establish performance across seasons. Weather availability differs between retrospective validation and the final scenario; the report’s final XGBoost forecasts are flat within each county. This page emphasizes the decision framework rather than operational accuracy.',
    takeaway:'Make the downstream resource constraint explicit—and distinguish a retrospective benchmark from a deployable forecast.',
    materials:'Course notebook and report; the diagram shows the task structure, not an observed outage trajectory.'
  },
  {
    id:'voc',group:'applied',title:'Finding themes in Korean customer complaints',meta:'Kimberly-Clark · AI Labs',
    status:'Industry analysis',period:'2023',role:'Korean text processing & topic modeling',scope:'Support tickets · Feb 2022–Feb 2023',
    tags:['KoNLPy','LDA','scikit-learn','pyLDAvis'],signal:'Category-specific topic models',signalContext:'Korean customer-service text',
    desc:'Turning recurring support conversations into interpretable complaint themes.',
    question:'Which recurring themes are difficult to see when customer-service tickets are reviewed one at a time?',
    approach:'The pipeline parses dates, cleans text, and uses KoNLPy’s Okt analyzer to extract Korean tokens. CountVectorizer represents unigrams and bigrams with domain stopwords. Separate LDA models within complaint categories produce topic mixtures, which can be inspected in pyLDAvis and assigned back to tickets.',
    contribution:'Developed the preprocessing and topic-modeling workflow. I used category-level models and vocabulary filtering to make outputs interpretable, then connected topic assignments to category and time-based exploration.',
    evidence:'The public notebook documents the methodology, including six topics per complaint category and highest-probability topic assignment. This is a distinct analysis of support tickets, complementing the review and social-post monitoring platform.',
    context:'Topic labels require interpretation and are not ground-truth classes. Phone-ticket summaries may omit useful detail. Public notebook outputs were cleared to protect company data; the illustrated example is synthetic and contains no measured topic frequencies.',
    takeaway:'Useful topics depend as much on text collection and category structure as on the model.',
    resources:[
      {label:'GitHub',url:'https://github.com/deardanny/voc-topic-modeling'},
      {label:'Topic notebook',url:'https://github.com/deardanny/voc-topic-modeling/blob/main/voc-lda-topic-modeling.ipynb'}
    ],materials:'Methodology notebook with company outputs removed; synthetic text example shown here.'
  },
  {
    id:'humanitarian',group:'applied',title:'Humanitarian Efficiency Radar',meta:'CMU Data Science Club Datathon · Team project',
    resourceStatus:'Repository not public',
    status:'Completed datathon',period:'January 2026',role:'Problem framing, communication & notebook assembly',scope:'UN pooled-fund project budgets',
    tags:['Regression','Anomaly detection','Plotly','Databricks'],signal:'123 projects flagged for review',signalContext:'15,664 projects analyzed',
    desc:'Making humanitarian budget anomalies explainable and practical to review.',
    question:'Which aid-project budgets look unusual relative to comparable projects, and how can a small review team focus its attention?',
    approach:'Our team benchmarked projects within fund-and-sector peer groups. A log-budget versus log-beneficiary regression produces residuals; within-group Z-scores identify unusually high or low budgets. Plotly views support exploring flagged cases and their context.',
    contribution:'Contributed the executive summary, problem framing, and final notebook assembly. I helped communicate why a statistical flag should trigger review rather than be treated as a verdict, and connected the analysis to an audit-capacity constraint.',
    evidence:'The final notebook reports 123 flagged projects among 15,664 analyzed projects—approximately 0.79%. The output is a short review list with a peer-relative explanation, not a finding that those projects were wasteful.',
    context:'Exceptional logistics, data-entry problems, or legitimate operating constraints can produce anomalies. A secondary classifier uses labels derived from the outlier rule; its score is not independently validated fraud-detection accuracy. Flagged budget exposure is not realized savings.',
    takeaway:'Give reviewers a manageable list and a defensible reason to look closer.',
    materials:'Team-method summary and aggregate notebook counts; the source repository remains private.'
  },
  {
    id:'fraud',group:'applied',title:'Cost-sensitive insurance fraud detection',meta:'Carnegie Mellon University · Two-person team project',
    resourceStatus:'Course materials not public',
    status:'Exploratory model study',period:'Spring 2026',role:'Model evaluation & cost-based analysis',scope:'15,420 claims · Class imbalance',
    tags:['XGBoost','Model evaluation','Data leakage','Decision costs'],signal:'Leakage diagnosis & decision costs',signalContext:'Insurance claim triage',
    desc:'Examining what changes when fraud models are judged by errors and their costs.',
    question:'How should a fraud-triage model be evaluated when missing fraud costs much more than investigating a false alarm?',
    approach:'We examined imbalanced claims, compared classifiers, and investigated identifiers carrying misleading predictive signal. The analysis contrasts an F1-oriented threshold with a cost objective assigning different penalties to missed fraud and false-alarm investigations.',
    contribution:'Co-developed the analysis in a two-person team. I worked on evaluation helpers and cost-based threshold analysis, making the consequences of each error explicit rather than selecting a model on accuracy alone.',
    evidence:'The notebook demonstrates identifier-leakage diagnosis, precision–recall analysis, model comparisons, and cost sensitivity. The assumptions are $15,000 per missed fraudulent claim and $500 per false alarm; these are modeling assumptions, not measured business losses.',
    context:'The final cost threshold was chosen on the same held-out set used to report its outcome. Reported recall and savings are therefore exploratory, not independent out-of-sample estimates. A deployment-quality evaluation would choose the threshold on training or validation predictions, then assess it once on an untouched test set.',
    takeaway:'A striking metric is less valuable than understanding how evaluation choices produced it.',
    materials:'Methods and evaluation lessons from the course notebook; no production deployment or realized savings are claimed.'
  },
  {
    id:'job-radar',group:'systems',title:'Job Radar: evidence-aware job discovery',meta:'Personal project · Automation',
    resourceStatus:'Repository not public',
    status:'Working personal tool',period:'2026',role:'Workflow design, integration & iteration',scope:'Multiple hiring sources · Five résumé variants',
    tags:['Python','TF-IDF','API integration','Automation'],signal:'Collect · verify · match · report',signalContext:'Personal discovery workflow',
    desc:'Building a repeatable discovery workflow that makes its recommendation criteria visible.',
    question:'How can job discovery become more useful than a keyword feed when eligibility, posting freshness, and evidence all matter?',
    approach:'Adapters collect postings from platforms including Greenhouse, Lever, Ashby, Workday, and SmartRecruiters. The pipeline normalizes descriptions and dates, checks role and eligibility criteria, and compares postings with résumé variants using TF-IDF similarity and skill coverage. LLM-assisted reporting turns qualified results into readable summaries.',
    contribution:'Built and iterated a personal workflow spanning collection, filtering, comparison, deduplication, and Discord reporting, using AI-assisted development. Added regression tests for date provenance, sponsorship wording, recommendation gates, and which URLs are recorded as already reported.',
    evidence:'The implementation handles missing evidence, keeps verification-needed results separate, and persists state. A posting can be withheld despite a strong text match when its date or eligibility evidence is insufficient.',
    context:'Similarity is an internal discovery aid, not an ATS score or a probability of an offer. Recommendations depend on posting evidence and require human review. Private profiles and integration credentials are not included here.',
    takeaway:'Abstaining when evidence is missing can matter more than ranking every candidate.',
    materials:'Private personal implementation; architecture and example decision paths are shown here.'
  },
  {
    id:'rag',group:'systems',title:'Research paper Q&A with retrieval',meta:'Personal project · NLP prototype',
    status:'Prototype',period:'2026',role:'Retrieval and generation pipeline',scope:'Question answering over an uploaded PDF',
    tags:['LangChain','Chroma','OpenAI embeddings','GPT-4o-mini'],signal:'PDF → retrieval → answer',signalContext:'Public prototype',
    desc:'Exploring a small, inspectable retrieval pipeline for asking questions about papers.',
    question:'How can a question-answering tool use an uploaded paper rather than relying only on a model’s prior knowledge?',
    approach:'PyPDF loads a document and a recursive splitter creates 1,000-character chunks with 200-character overlap. OpenAI embeddings index chunks in Chroma. For each question, the pipeline retrieves the three closest chunks and supplies them as context to GPT-4o-mini through LangChain.',
    contribution:'Implemented the PDF-to-answer pipeline and a command-line interface for interactive questions. The small implementation makes retrieval settings and the context passed to the model straightforward to inspect and change.',
    evidence:'The public repository contains the pipeline and an example question. It demonstrates loading, chunking, embedding, retrieval, and generation; it does not include a comparative evaluation of retrieval quality or answer faithfulness.',
    context:'A prompt asking the model to stay within context does not guarantee factual or complete answers. The next useful extension is an annotated question set, source-page attribution, and separate evaluation of retrieval coverage and answer support.',
    takeaway:'Retrieval supplies evidence. Whether an answer actually uses it remains an evaluation question.',
    resources:[
      {label:'GitHub',url:'https://github.com/deardanny/paper-rag-pipeline'},
      {label:'Pipeline code',url:'https://github.com/deardanny/paper-rag-pipeline/blob/main/app.py'}
    ],materials:'Public code and a method diagram; this portfolio does not upload documents to an API.'
  }
];
