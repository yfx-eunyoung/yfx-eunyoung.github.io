# yfx-eunyoung.github.io

Source for **https://yfx-eunyoung.github.io** (YFXLabs). Built with [Eleventy](https://www.11ty.dev/) and deployed by GitHub Actions on every push to `main`.

## Add a post

Create one Markdown file in the right folder. The homepage, the section list, the detail page and the RSS feed update on their own.

| Folder | Section | URL |
|---|---|---|
| `src/notes/` | FX Notes | `/notes/<file-name>/` |
| `src/rnd/` | R&D Breakdown | `/rnd/<file-name>/` |
| `src/resources/` | Resources | `/resources/<file-name>/` |

Copy an existing file and change the top block:

```yaml
---
title: "Drive SOP Solver motion with @TimeInc"
num: "001"              # notes: "001", rnd: "R/01"
date: 2026-11-18        # newest date shows first
topics: [VEX, SOLVERS]
summary: "One or two sentences for cards and search results."
summaryShort: "Optional shorter text for mobile cards."
art: pat-a              # rnd only: pat-a … pat-e card pattern
draft: true             # optional: hides the post
---
```

Resources also take `type: "HDA · SOP"`, `version: "v1.0"`, `houdini: "20.5+"`, `license` and `download` (a link, or a file path such as `yfx_orient_from_v.hda` placed next to the Markdown file).

Remove `sample: true` once a post has real content; it shows a SAMPLE chip.

Write the body in normal Markdown. Code fences take a language: ` ```vex `, ` ```python `, ` ```hscript `. Images can sit next to the Markdown file: `![Wedge grid](wedge.jpg)`.

## Files

- `src/index.njk`: homepage (lists are generated from the posts)
- `src/_includes/layouts/`: `base.njk` (nav, footer), `post.njk` (detail page), `list.njk` (section page)
- `src/_data/kinds.json`: section names, colours and blurbs
- `src/assets/`: `styles.css` + `main.js` (homepage), `pages.css` + `pages.js` (list and detail pages)

## Preview locally

```bash
npm install
npm start        # http://localhost:8080
```
