---
title: "SDF erosion for rock breakup"
num: "R/05"
art: pat-e
date: 2026-10-20
topics: [OPENVDB, SDF]
summary: "Eroding a VDB signed distance field with noise to pre-break rocks with believable edges."
summaryShort: "Eroding a VDB SDF with noise to pre-break rocks with believable edges."
sample: true
---

## Goal

Rock pieces with weathered, uneven edges instead of the clean cuts from a plain fracture.

## Setup

1. Convert the rock to an SDF with VDB from Polygons.
2. Push the surface in with layered noise in a Volume Wrangle.
3. Smooth lightly with VDB Smooth SDF, then convert back to polygons.

```vex
// Volume Wrangle on the SDF: positive values push the surface inward
float n = abs(noise(v@P * chf("freq"))) * chf("depth");
f@surface += n;
```

## Notes

Keep the voxel size small enough that the noise frequency is at least a few voxels wide, or the erosion turns into stair steps.

_Replace this sample with your own before/after renders._
