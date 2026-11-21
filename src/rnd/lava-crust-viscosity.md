---
title: "Lava crust: viscosity from temperature"
num: "R/01"
art: pat-a
date: 2026-11-20
topics: [FLIP, VISCOSITY]
summary: "A cooling ramp maps temperature to viscosity, so the crust stiffens while the core keeps flowing."
summaryShort: "A cooling ramp maps temperature to viscosity, so the crust stiffens while the core keeps flowing."
sample: true
---

## Goal

Lava whose surface slows down and folds while the hot core keeps moving underneath, without splitting it into two sims.

## Setup

1. FLIP particles carry a `temperature` attribute, seeded hot at the source.
2. The FLIP Solver has viscosity on and reads it per particle from the `viscosity` attribute.
3. A POP Wrangle in the particle stream cools the particles and maps temperature to viscosity.

```vex
// cool over time, faster near the surface (surface = 1 at the top layer)
float rate = chf("cool_rate") * mix(0.2, 1.0, f@surface);
f@temperature = max(0, f@temperature - rate * @TimeInc);

// cold → stiff, hot → runny
float t = fit(f@temperature, chf("t_cold"), chf("t_hot"), 0, 1);
f@viscosity = chf("visc_max") * chramp("visc_from_temp", 1 - t);
```

## Wedges

Wedge `cool_rate` and the shape of the ramp first. The ramp decides how sharp the crust edge is; the rate decides how thick it gets.

## What didn't work

A linear ramp gave a crust that looked like a uniform skin. A steep knee near the cold end gave the folding look.

_Replace this sample with your own setup, wedge results and renders._
