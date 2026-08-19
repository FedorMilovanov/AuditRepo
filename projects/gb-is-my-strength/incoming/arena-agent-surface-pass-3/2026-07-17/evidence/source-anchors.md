# Source mechanism anchors

Product anchor: `cb3681e1a85b5f8919c9dc537f812a842bbe9235`.

## Runtime fallback controls

`js/floating-cluster-controller.js:1284-1295` detects absence of a rendered mobile ember, clones the scoped rail control cluster, adds `gb-mobile-fallback-controls`, and mounts it for mobile use.

`css/floating-cluster.css:2895-2917` gives that clone a near-white `rgba(253,252,249,.94)` panel in light theme. Lines 2929-2942 size cloned controls but do not assign a light-surface foreground.

`css/series-samizdat.css:25` defines rail text `--gbs2-rtext:#e7dff0`, appropriate to the dark rail. Cloned `.gbs2-ctl` elements retain that pale color after moving to the light fallback panel.

## Landing canvas/text

`series-samizdat.css` changes `--color-canvas`/`--bg` to `#efe7d7`. Landing metadata and card text retain inherited global or translucent values. Live effective pairs are captured in `live-baptisty-axe.json`: `#5d7cb3/#efe7d7`, `#78716c/#efe7d7`, and `#6a6a6a/#efe7d7`.
