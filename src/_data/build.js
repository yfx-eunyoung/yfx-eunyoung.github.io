// Build stamp appended to CSS/JS URLs (?v=...) so a deploy never mixes new HTML with cached old assets.
export default function () {
  return { v: Date.now().toString(36) };
}
