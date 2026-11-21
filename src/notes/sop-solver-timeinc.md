---
title: "Drive SOP Solver motion with @TimeInc"
num: "001"
date: 2026-11-18
topics: [VEX, SOLVERS]
summary: "Substeps change the per-step delta. Scale by @TimeInc and the result stays the same at any substep count."
sample: true
---

A SOP Solver runs its network once per substep. If a wrangle inside it adds a fixed amount every cook, doubling the substeps doubles the motion.

## The fix

Multiply anything that accumulates over time by `@TimeInc`, the length of the current step in seconds.

```vex
// Point Wrangle inside the SOP Solver
@P += v@v * @TimeInc;     // move by velocity, not by a fixed offset
f@age += @TimeInc;        // age in seconds, independent of substeps
```

## Check it

Cache the same setup at 1 and 4 substeps and compare a point's position on the same frame. With `@TimeInc` they match; without it they drift apart.

> Rates in your parameters should now read as "per second". A value tuned without `@TimeInc` will need to be multiplied by your frame rate.
