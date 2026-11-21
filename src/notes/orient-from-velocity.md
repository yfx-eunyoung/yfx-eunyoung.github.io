---
title: "Velocity-aligned orient in four lines"
num: "002"
date: 2026-11-10
topics: [VEX, INSTANCING]
summary: "Build p@orient from velocity so instanced debris points where it travels, with a safe fallback for vertical motion."
sample: true
---

Copy to Points aligns each copy's +Z axis to the point's orientation. Build that orientation from velocity and debris faces the way it moves.

```vex
vector fwd = normalize(v@v);
vector up  = abs(fwd.y) > 0.99 ? set(1,0,0) : set(0,1,0);
p@orient   = quaternion(maketransform(fwd, up));
f@pscale  *= fit(length(v@v), 0, chf("vmax"), 0.4, 1.2);
```

## Why the `up` swap

When velocity is almost straight up or down, it is nearly parallel to the world Y axis and the frame flips. Switching to X for those points keeps the orientation stable.

## Notes

- Points with zero velocity get an undefined direction. Filter them out or give them a default `orient` first.
- The packaged version, with an up-vector option and smoothing, is [yfx_orient_from_v](/resources/yfx-orient-from-v/).
