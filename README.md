# Daniel Jang — Research & Applied ML

Personal portfolio at [hdjang.com](https://hdjang.com), published with GitHub Pages from `main`.

## Editing

- Update page content in `scripts/build.mjs` and project content/figures in `scripts/projects.mjs`.
- Update the shared appearance in `assets/site.css` and project figures in `assets/projects.css`.
- The portrait is `assets/portrait.jpg`. The résumé download is `Daniel_Jang_Resume.pdf`; its image preview and text transcript are stored separately.

Build the static pages with Node.js 22 or later:

```sh
node scripts/build.mjs
```

Preview from the repository root:

```sh
python3 -m http.server 8000
```

Commit both source and generated pages. Pages are ordinary HTML with real links; JavaScript is used only for responsive bar charts. Project context documents the scope of reported results.
