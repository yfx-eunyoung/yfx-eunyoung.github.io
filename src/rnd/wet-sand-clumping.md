---
title: "Wet sand that clumps, then crumbles"
num: "R/04"
art: pat-d
date: 2026-10-28
topics: [VELLUM, GRAINS]
summary: "Wedging attraction weight and friction until clumps hold their shape and break on impact."
summaryShort: "Wedging attraction and friction until clumps hold, then break on impact."
sample: true
---

## Goal

Wet sand that holds together as clumps when it falls, then breaks apart where it hits.

## Setup

Vellum grains with attraction between grains, scaled per point. Points start fully sticky, and the scale drops where impact is strong.

```vex
// POP Wrangle each step: lower a per-point attraction scale on hard impacts
// (wire f@attract into your grain attraction setup)
float hit = fit(length(v@v - v@last_v) / @TimeInc, chf("a_min"), chf("a_max"), 0, 1);
f@attract *= 1 - hit;
v@last_v = v@v;
```

## Wedges

A 3 × 3 wedge of attraction strength and friction. Too little attraction and the sand pours like dry grains; too much and clumps bounce like rubber.

_Replace this sample with your own wedge grid and notes._
