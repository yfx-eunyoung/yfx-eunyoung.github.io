---
title: "Version caches in the path, not the filename"
num: "003"
date: 2026-11-02
topics: [CACHING, PIPELINE]
summary: "Put the version in a folder so each take lives in its own directory and old versions can be removed in one go."
sample: true
---

When the version is part of the filename, every take sits in the same folder and cleaning up means pattern-matching thousands of files. Put it in the folder instead.

```hscript
$HIP/geo/$OS/v`padzero(3, ch("version"))`/$OS.$F4.bgeo.sc
```

## What you get

- One folder per take: `v001/`, `v002/` and so on.
- Deleting an old version is deleting one folder.
- Readers downstream only change one number to switch takes.

Bump the version on many caches at once with [yfx_cache_versioner](/resources/yfx-cache-versioner/).
