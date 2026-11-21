---
title: "yfx_cache_versioner"
type: "PYTHON"
version: "v0.2"
houdini: "20.0+"
license: "Free to use"
download: ""
date: 2026-11-01
topics: [PYTHON, SHELF]
summary: "Shelf tool that bumps the version on every selected File Cache in one click."
summaryShort: "Bumps the version on every selected File Cache in one click."
sample: true
---

Select File Cache nodes, click the shelf button, and each one moves to its next version.

```python
import hou

for node in hou.selectedNodes():
    if not node.type().name().startswith("filecache"):
        continue
    parm = node.parm("version")
    if parm is not None:
        parm.set(parm.eval() + 1)
```

## Install

1. Right-click a shelf → **New Tool**.
2. Paste the code into the **Script** tab.

## Changelog

- **v0.2** — skips nodes that aren't File Caches.
- **v0.1** — first version.
