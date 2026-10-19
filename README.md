# Daniel Jang — Research & Applied ML

Personal portfolio at [hdjang.com](https://hdjang.com), published with GitHub Pages from `main`.

## Editing

- Update page content in `scripts/build.mjs`, project copy and the six featured IDs in `scripts/projects.mjs`, and project figures in `scripts/visuals.mjs`.
- Update the shared appearance in `assets/site.css` and project figures in `assets/projects.css`.
- `assets/site.js` handles the project filters and figure selectors. `assets/charts.js` draws the responsive result charts.
- The build adds content versions to CSS and JavaScript URLs so returning visitors receive updated styling and interactions after deployment.
- The portrait is `assets/portrait.jpg`. The résumé download is `Daniel_Jang_Resume.pdf`; its image preview and text transcript are stored separately.

Build the static pages with Node.js 22 or later:

```sh
node scripts/build.mjs
node scripts/validate.mjs
```

Preview from the repository root:

```sh
python3 -m http.server 8000
```

The homepage features six projects; the full index contains thirteen case studies across research, applied machine learning, and systems. Each case study includes a visual, the author's contribution, results, and scope. Figures distinguish measured results, assumptions, and illustrative examples.

Commit both source and generated pages. Pages use ordinary HTML and real links. All projects remain accessible without JavaScript; interactive figures display their first panel, and the two result charts have text fallbacks. Validation checks project counts, required case-study sections, figure captions, internal links, local assets, and sitemap coverage. Before publishing, also check category filters, selector interactions, and desktop/mobile layouts in a browser.
