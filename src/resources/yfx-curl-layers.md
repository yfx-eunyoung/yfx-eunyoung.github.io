---
title: "yfx_curl_layers"
type: "VEX"
version: "v0.3"
houdini: "19.5+"
license: "Free to use"
download: ""
date: 2026-11-08
topics: [VEX]
summary: "Layered curl noise with per-octave falloff, ready to drop into a POP Wrangle."
summaryShort: "Layered curl noise with per-octave falloff for a POP Wrangle."
sample: true
---

Paste into a POP Wrangle and create the spare parameters with the button next to the code field.

```vex
vector p   = v@P * chf("freq");
vector acc = 0;
float  amp = 1;
for (int i = 0; i < chi("octaves"); i++) {
    acc += amp * curlnoise(p + i * 13.7);
    p   *= 2.0;
    amp *= chf("falloff");
}
v@v += acc * chf("strength") * @TimeInc;
```

## Changelog

- **v0.3** — falloff per octave.
- **v0.2** — scales by `@TimeInc`.
- **v0.1** — first version.
