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
preview: my-post        # optional, rnd + resources: homepage card illustration
draft: true             # optional: hides the post
---
```

Resources also take `type: "HDA · SOP"`, `version: "v1.0"`, `houdini: "20.5+"`, `license` and `download` (a link, or a file path such as `yfx_orient_from_v.hda` placed next to the Markdown file).

### Card image (`cover:`)

The image card at the top of the post page and the post's homepage cards (latest update, mobile carousel, R&D gallery, resource card) show **the first image in the post** automatically. To pick a different one, add `cover: my-image.jpg` (path relative to the Markdown file, like in the body); `cover: false` turns it off. Posts without images fall back to `preview:` / `art`.

### Homepage card previews (`preview:`)

On the homepage, R&D cards and Resource cards can show an illustration instead of a plain pattern. `preview:` names a file in `src/_includes/previews/` (without the extension):

| Section | File | Shown in |
|---|---|---|
| R&D | `src/_includes/previews/rnd/<preview>.svg` | R&D gallery (desktop) and swipe cards (mobile), 150px tall |
| Resources | `src/_includes/previews/resources/<preview>.html` | Top of the resource card, desktop only, 180px tall |

- No `preview:` → R&D cards fall back to the `art` pattern; Resource cards show no preview area.
- R&D SVGs: use `viewBox="0 0 300 150"` with `preserveAspectRatio="xMidYMid slice"`, no fixed width/height, and colour with the theme variables (`var(--ember)`, `var(--cool)`, `var(--ink)`, `var(--ink-2)`, `var(--ink-3)`, `var(--line-2)`, `var(--bg)`) so they work in dark and light mode. Copy one of the existing files as a starting point.
- Resource previews are a small HTML fragment. Ready-made styles: `pv-grid pv-hda` (node graph: `.node`, `.node.hot`, `.wire`, `.wire.hot`), `pv-fade pv-vex` (code that fades out; escape `<` as `&lt;`), `pv-py` (shelf `.shelf` + dialog `.dlg`). See the three files in `previews/resources/`.
- The "R/0x · PREVIEW" / "PREVIEW" label is added automatically.

Remove `sample: true` once a post has real content; it shows a SAMPLE chip.

Write the body in normal Markdown. Code fences take a language: ` ```vex `, ` ```python `, ` ```hscript `. Images can sit next to the Markdown file: `![Wedge grid](wedge.jpg)`.

## Resume PDF

Upload your resume as `src/resume.pdf` (exactly this name). The "Resume [PDF]" button in the About section then downloads it as `Eunyoung-Kim-Resume.pdf`; the file is also at `/resume.pdf`. To update it, upload a new `resume.pdf` over the old one. Without the file, the button just scrolls to About.

## Site icon

The logo mark lives in `src/favicon.svg` (browser tab), with PNG/ICO copies for bookmarks and phones: `src/favicon.ico`, `src/apple-touch-icon.png`, `src/icons/*.png`. If the logo changes, regenerate all of them and bump `?v=2` in `src/_includes/layouts/base.njk` (and `site.webmanifest`) so browsers drop the cached icon.

## Files

- `src/index.njk`: homepage (lists are generated from the posts)
- `src/_includes/previews/`: homepage card illustrations (`rnd/*.svg`, `resources/*.html`)
- `src/_includes/layouts/`: `base.njk` (nav, footer), `post.njk` (detail page), `list.njk` (section page)
- `src/_data/kinds.json`: section names, colours and blurbs
- `src/assets/`: `styles.css` + `main.js` (homepage), `pages.css` + `pages.js` (list and detail pages)

## Preview locally

```bash
npm install
npm start        # http://localhost:8080
```
