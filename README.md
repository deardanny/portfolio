# Daniel Jang — Research & Applied ML

Personal portfolio at [hdjang.com](https://hdjang.com), hosted on Cloudflare Workers.

## Live site and repository snapshot

This repository contains an earlier version of the portfolio. The live site has newer project content and dashboard interfaces; visit [hdjang.com](https://hdjang.com) for the current portfolio.

Production updates are uploaded separately to Cloudflare. Commits to this repository do not automatically deploy to `hdjang.com`.

## Editing this repository snapshot

- Update page content in `scripts/build.mjs`, project copy and the six featured IDs in `scripts/projects.mjs`, and project figures in `scripts/visuals.mjs`.
- Add verified public links through each project's `resources` array. Projects without public resources use `resourceStatus` to explain availability. Links appear on the homepage/index and at the top of the case study; do not link private repositories or restricted Drive files.
- `scripts/outputs.mjs` contains twelve project-specific interactive reconstructions and report views, styled by `assets/outputs.css`. Existing `data-switch` controls in `assets/site.js` switch pre-rendered examples. Keep fictional fixtures, concept previews and reported results clearly labeled; never imply the new portfolio interface was the original deliverable. Index thumbnails are decorative summaries.
- Update the shared appearance in `assets/site.css` and project figures in `assets/projects.css`.
- `assets/site.js` handles the project filters and figure selectors. `assets/charts.js` draws the responsive result charts.
- The build adds content versions to CSS and JavaScript URLs so returning visitors receive updated styling and interactions after deployment.
- The portrait is `assets/portrait.jpg`. The résumé download is `Daniel_Jang_Resume.pdf`; its image preview and text transcript are stored separately.
- The consumer-insights demo lives at `/projects/risk/dashboard/`. `scripts/dashboard-data.mjs` creates entirely fictional fixtures, `scripts/dashboard.mjs` builds the page and case-study preview, and `assets/dashboard.js`/`assets/dashboard.css` provide the analytics workspace. `assets/dashboard-model.mjs` is shared browser/validation logic for intersecting filters, aggregations, sorting and CSV export. Charts omit only their own dimension to keep comparison choices available; KPIs, record lists and exports use the full filter intersection. Summary previews use deterministic templates, not a live AI service. Never put company manuals, screenshots, original text, or source data in these files.

Build the static pages with Node.js 22 or later:

```sh
node scripts/build.mjs
node scripts/validate.mjs
```

Preview from the repository root:

```sh
python3 -m http.server 8000
```

This repository snapshot features six projects on the homepage and thirteen case studies in the full index, across research, applied machine learning, and systems. Each case study includes a visual, the author's contribution, results, and scope. Figures distinguish measured results, assumptions, and illustrative examples.

Commit both source and generated pages. Pages use ordinary HTML and real links. All projects remain accessible without JavaScript; interactive figures display their first panel, and the two result charts have text fallbacks. Validation checks project counts, required case-study sections, figure captions, internal links, local assets, and sitemap coverage. Before publishing, also check category filters, selector interactions, and desktop/mobile layouts in a browser.
