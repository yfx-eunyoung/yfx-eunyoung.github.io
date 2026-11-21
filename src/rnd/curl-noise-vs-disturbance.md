---
title: "Curl noise vs. disturbance"
num: "R/02"
art: pat-b
preview: curl-noise-vs-disturbance
date: 2026-11-12
topics: [PYRO, SHAPING]
summary: "Same source, two shaping strategies: where each one breaks up the plume, and what it costs."
summaryShort: "Same source, two shaping strategies: where each one breaks up the plume."
sample: true
---

## Goal

Compare two ways of breaking up a pyro plume from the same source and the same solver settings.

## Setup

- **A:** Pyro Solver disturbance only, driven by temperature.
- **B:** Curl noise added to velocity, masked by density.

```vex
// Volume Wrangle on vel, version B
vector n = curlnoise(v@P * chf("freq") + @Time * chf("speed"));
v@vel += n * chf("amp") * f@density * @TimeInc;
```

## Comparison

| | Disturbance | Curl noise |
|---|---|---|
| Detail scale | Small, close to voxel size | Set by frequency |
| Shape control | Low | High |
| Cost | Cheap | A little more |

_Replace this sample with your own renders and timings._
