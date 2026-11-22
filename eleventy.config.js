import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import loadLanguages from "prismjs/components/index.js";

const KINDS = ["notes", "rnd", "resources"];

export default function (eleventyConfig) {
  // Static files copied as-is
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.svg": "favicon.svg" });
  // Favicons for browsers/bookmarks that don't use the SVG (Safari, iOS home screen, old Chrome bookmarks)
  eleventyConfig.addPassthroughCopy({ "src/favicon.ico": "favicon.ico", "src/apple-touch-icon.png": "apple-touch-icon.png", "src/icons": "icons", "src/site.webmanifest": "site.webmanifest" });
  eleventyConfig.addPassthroughCopy({ "src/.nojekyll": ".nojekyll" });
  // Resume: drop src/resume.pdf in and the homepage "Resume [PDF]" button downloads it
  eleventyConfig.addPassthroughCopy({ "src/resume.pdf": "resume.pdf" });
  // Images and downloads that live next to posts (e.g. src/rnd/lava-crust/wedge.jpg)
  eleventyConfig.addPassthroughCopy("src/**/*.{jpg,jpeg,png,gif,webp,avif,mp4,webm,hda,hdanc,otl,zip,vfl,py}", { mode: "html-relative" });

  // Code highlighting, with a small VEX grammar on top of C
  eleventyConfig.addPlugin(syntaxHighlight, {
    init({ Prism }) {
      loadLanguages(["c", "python", "bash"]);
      Prism.languages.vex = Prism.languages.extend("c", {
        keyword: /\b(?:break|continue|do|else|export|for|foreach|forpoints|function|if|illuminance|import|return|while|const)\b/,
        "class-name": /\b(?:bsdf|dict|float|int|matrix|matrix2|matrix3|string|vector|vector2|vector4|void)\b/,
        variable: /[fivpsud234]?@[A-Za-z_]\w*/,
      });
      Prism.languages.vfl = Prism.languages.vex;
      Prism.languages.hscript = Prism.languages.extend("bash", {});
    },
  });

  // RSS feed of every post, all three sections
  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed.xml",
    collection: { name: "posts", limit: 30 },
    metadata: {
      language: "en",
      title: "YFXLabs — Somewhere Between Nodes",
      subtitle: "Houdini tips, R&D breakdowns and resources from a Senior FX TD.",
      base: "https://yfx-eunyoung.github.io/",
      author: { name: "Eunyoung Kim", email: "eeeeeunyoung@gmail.com" },
    },
  });

  const byDateDesc = (a, b) => b.date - a.date;
  for (const kind of KINDS) {
    eleventyConfig.addCollection(kind, (api) =>
      api.getFilteredByGlob(`src/${kind}/*.md`).filter((p) => !p.data.draft).sort(byDateDesc)
    );
  }
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob(KINDS.map((k) => `src/${k}/*.md`)).filter((p) => !p.data.draft).sort(byDateDesc)
  );

  // Filters
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("tagline", (topics) => (topics || []).join(" · "));
  eleventyConfig.addFilter("head", (arr, n) => (arr || []).slice(0, n));
  eleventyConfig.addFilter("newestFirst", (arr) => [...(arr || [])].sort(byDateDesc));
  eleventyConfig.addFilter("absUrl", (url) => new URL(url, "https://yfx-eunyoung.github.io/").href);
  eleventyConfig.addFilter("readMinutes", (html) => {
    const words = String(html || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 220));
  });
  // Previous / next post inside the same section (collections are newest first)
  eleventyConfig.addFilter("neighbours", (collection, url) => {
    const i = (collection || []).findIndex((p) => p.url === url);
    if (i < 0) return {};
    return { newer: collection[i - 1], older: collection[i + 1] };
  });
  // Chip label shown on cards: "N/ 001", "R/01", "T/ HDA · SOP"
  eleventyConfig.addFilter("codeLabel", (p) => {
    const d = p.data || p;
    if (d.kind === "notes") return `N/ ${d.num}`;
    if (d.kind === "rnd") return d.num;
    return `T/ ${d.type}`;
  });
  eleventyConfig.addFilter("toJson", (v) => JSON.stringify(v).replace(/</g, "\\u003c"));

  // Wrap fenced code blocks in the site's code frame (file label + copy button)
  eleventyConfig.addTransform("codeFrames", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    return content.replace(/<pre class="language-([\w-]+)"[^>]*>([\s\S]*?)<\/pre>/g, (m, lang) => {
      const label = { vex: "VEX", vfl: "VEX", python: "Python", py: "Python", bash: "Shell", hscript: "HScript", c: "C", cpp: "C++", json: "JSON" }[lang] || lang.toUpperCase();
      return `<div class="code post-code"><div class="code-bar"><span>${label}</span><button type="button" class="btn code-copy" data-post-copy>Copy</button></div>${m}</div>`;
    });
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
}
