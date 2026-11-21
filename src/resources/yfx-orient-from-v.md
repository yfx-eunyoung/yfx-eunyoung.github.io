---
title: "yfx_orient_from_v"
type: "HDA · SOP"
version: "v1.0"
houdini: "20.5+"
license: "Free to use"
download: ""
date: 2026-11-15
topics: [HDA, SOP]
summary: "Velocity-aligned orient and speed-based pscale for instancing debris, spray and splashes."
summaryShort: "Velocity-aligned orient and speed-based pscale for instancing."
sample: true
---

Sets `p@orient` from velocity and scales `pscale` by speed, ready for Copy to Points.

## Parameters

| Parameter | What it does |
|---|---|
| **Max speed** | Speed that maps to the largest scale |
| **Scale range** | `pscale` multiplier at zero and max speed |
| **Up vector** | Fallback axis when motion is nearly vertical |

## Core VEX

```vex
vector fwd = normalize(v@v);
vector up  = abs(fwd.y) > 0.99 ? set(1,0,0) : set(0,1,0);
p@orient   = quaternion(maketransform(fwd, up));
f@pscale  *= fit(length(v@v), 0, chf("vmax"), 0.4, 1.2);
```

## Changelog

- **v1.0** — first release.

_The download link appears here once the HDA file is added._
