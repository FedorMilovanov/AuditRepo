# EVIDENCE: KEYBOARD ESCAPE EVENT CASCADE, MARKER DOUBLE-CLICK & DOM RE-CREATION AUDIT

**Project:** `gb-is-my-strength`  
**Date:** 2026-07-19  
**Source HEAD:** `32ae0d7d62bee81737a9aae1f136946d047fe4fb`  
**Auditor:** `arena-auditor-karty-verification`  
**Subsystem:** Keyboard Focus Management, Escape Key Event Propagation, Double-Click Zoom Gestures, and DOM Lifecycle Garbage Collection

---

## 1. Escape Key Event Cascade Analysis (`ENGINE-P1-27`)

`karty/_engine/map-engine.js` contains two uncoordinated Escape key listeners registered on `document`:

```js
// Listener 1 (Line 2237): Photo Modal Close
document.addEventListener('keydown', e => { 
  if (e.key === 'Escape') photoModal.classList.remove('me-photo-modal--open'); 
});

// Listener 2 (Line 2441-2443): Global Map Engine Shortcuts
_on(document, 'keydown', function kh(e) {
  if (e.key === 'Escape') { close(); return; } // Closes place panel
});
```

**Flaw:** Neither listener invokes `e.stopPropagation()`. When a photo modal is open over a place panel:
1. Listener 1 runs and closes `photoModal`.
2. Listener 2 runs on the same event and executes `close()`, closing the parent place panel.
3. The user loses both the photo view and the place panel context in a single keypress.

---

## 2. Unconstrained Double-Click Marker Zoom (`ENGINE-P1-29`)

In `map-engine.js` line 1524:
```js
g.addEventListener('dblclick', (e) => {
  e.preventDefault();
  e.stopPropagation();
  flyTo(place.x, place.y, Math.min(view.w, 450), 600);
});
```

**Flaw:** Double-clicking a place marker forces the camera width `w` to `450` without checking the active story bounds or editorial initial viewport. In maps with spread out markers (e.g. Pavel or Kingdoms), `w=450` violently zooms in and cuts off adjacent route places.

---

## 3. DOM Node Re-creation & Garbage Collector Pressure (`QUAL-P2-04`)

Analysis of `renderMarkers()` execution in `map-engine.js`:
- `renderMarkers()` calls `markersG.innerHTML = ''`, completely destroying all existing SVG DOM elements.
- It then executes **54 `document.createElementNS` calls** per pass to rebuild markers, active rings, stage badges, core dots, leader lines, label backgrounds, and text elements.
- Every place selection, story switch, or search clear triggers a full `renderMarkers()` pass.
- **Impact:** Memory allocations spike on every interaction, and custom runtime state (e.g. toggled layer opacities) is wiped because state is not persisted on the data model (`ENGINE-P1-24`).
