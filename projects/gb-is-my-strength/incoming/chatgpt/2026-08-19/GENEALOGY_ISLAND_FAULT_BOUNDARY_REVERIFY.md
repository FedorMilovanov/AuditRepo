# GENEALOGY-NO-ERROR-BOUNDARY — current reverify / reframe

## Disposition

**Keep the underlying resilience concern, but narrow the current MASTER wording.**

The current route does not lose its entire page when the React genealogy island cannot mount. It does, however, have a large client-only interactive region with no SSR content, no Astro fallback slot and no React error boundary/recovery owner.

- Project: `gb-is-my-strength`
- Current Product boundary: `01894214765d7ab6e51a7eea1fb7f239c6591af8`
- Product mutation: none
- MASTER mutation: none
- Runtime crash reproduced: **no**
- Source/fallback boundary: **directly proven**

## Current composition

`src/pages/rodosloviye/index.astro` mounts the interactive tree as:

```astro
<div
  id="genealogy-tree"
  class="genealogy-interactive-wrap"
  style="width: 100%; height: 85vh; min-height: 650px; ..."
>
  <GenealogyTree client:only="react" persons={persons} eras={eras} />
</div>
```

Important properties:

- `client:only="react"` means the React component itself is not server-rendered;
- the wrapper reserves a large visible region (`85vh`, minimum `650px`);
- there is no Astro `slot="fallback"` content in that island;
- current genealogy source contains no `ErrorBoundary`, `componentDidCatch` or `getDerivedStateFromError` owner around `GenealogyTree`;
- no dedicated repository browser/error-injection contract was found for genealogy island failure/recovery.

Therefore a client bundle/load/hydration/render failure has no local recovery presentation inside the interactive region.

## The whole page is not blank

Current `RodosloviyeBody.astro` renders meaningful native/static content **outside** the React island before that region:

- breadcrumb;
- H1 and description;
- a three-item summary;
- explanatory prose;
- links to the interactive tree, App and Karty.

The copy explicitly says that the static text preserves the meaning of the section for reading/search even though the full version contains the interactive tree.

Thus the accurate failure boundary is:

```text
native page content survives
+ interactive 85vh/650px island has no rendered fallback/recovery
```

not:

```text
entire /rodosloviye/ page becomes blank
```

## What is directly current vs hypothetical

Direct current facts:

1. The tree is client-only.
2. Its large wrapper has no fallback slot/content.
3. The React component has no local error boundary.
4. No dedicated fault-injection/recovery contract exists in current repository source.
5. The native static page content remains independently rendered.

Not proven in this pass:

- a naturally occurring production exception in `GenealogyTree`;
- a specific browser/network incident causing the island to fail;
- data corruption currently triggering a render throw.

Therefore this row should remain a **resilience/fault-containment** issue, not be presented as a reproduced current crash.

## Better closure boundary

A durable repair does not have to be “add an ErrorBoundary class” specifically. The product contract should be:

- client-only interactive failure does not leave a large unexplained blank region;
- the user gets a meaningful fallback/retry/static alternative;
- an internal React render error is contained to the island;
- the native/static page remains usable;
- a regression witness deliberately makes the island fail and verifies the fallback.

Possible implementation shapes include a React error boundary, an Astro fallback/placeholder plus hydration-failure handling, or another single-owned recovery mechanism. The behavior contract matters more than the class name.

## Suggested MASTER wording

Instead of:

```text
GenealogyTree.tsx React island has no ErrorBoundary; a runtime throw yields a blank/uncerrored surface.
```

prefer a bounded formulation such as:

```text
/rodosloviye/ mounts GenealogyTree as a client-only React island inside an 85vh/min-650px interactive region with no SSR/fallback content and no local render-error recovery owner. Native summary/prose outside the island survives, so this is an interactive-surface fault-containment defect, not whole-page blanking. No natural runtime crash has been reproduced yet.
```

## Boundary

- Do not promote this to a reproduced runtime crash without a browser/error witness.
- Do not delete the concern merely because static prose exists; the advertised interactive tree has no failure presentation.
- Do not describe the entire page as blank.
- No MASTER edit is made here because concurrent matrix ownership remains elsewhere.
