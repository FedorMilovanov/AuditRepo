# W39 isolated browser laboratory

ART HOLD. This is not a production route and does not change the Vite build.
The source is the exact current W39c actor and W28 house. Both SHA-256 digests
and lengths are verified before the loopback server starts. No model copies,
external CDN, private path exposure in the manifest, or public deployment.

## Local operator launch

From this directory, with existing project dependencies installed:

    $env:HOREB_EVIDENCE_ROOT='H:\HOREB_ArtPipeline\evidence'
    node serve.mjs

Open http://127.0.0.1:5197 in an operator-selected browser. Ctrl+C stops the
server. Do not launch a browser or leave a server running from an agent
without the shared workstation admission and ownership checks.

## Reproducible loader and matrix test

    python ..\source\probe_w39g_browser_witness.py $env:HOREB_EVIDENCE_ROOT
    node --max-old-space-size=700 test-loader.mjs

These commands are create-only for their reports; reconcile existing output
before rerunning. The test uses Three.js r187 GLTFLoader/AnimationMixer with
stubbed image bitmaps in Node (not texture decoding or WebGL). Independent
Python vertex witnesses cover body, linen, face meshes and all 92 basket
descendants. The exact transform is:

    worldBasket = animatedTrack * translate(0, settleDeltaM, 0) * originalWorldBasket

The original house remains unchanged; only the basket anchor is moved.
The cutaway camera hides non-study meshes explicitly; the house camera restores
the full model. The action is one-shot and clamps at the end; manual restart
does not pretend that the clip is a continuous return-to-rest loop.

## Actual browser gate (not yet executed)

Run only with positive cross-process admission, fresh resource counters,
owned browser process tree, and external deadline/watchdog under
LOCAL_EXECUTION_RESOURCE_PROTOCOL.md. The environment flag merely records
that the external admission was established; it is not a lock or scheduler.

    $env:HOREB_BROWSER_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'
    $env:HOREB_W39_ADMISSION='confirmed'
    node test-browser.mjs

The gate uses one browser with sequential 1440x900 desktop and 390x844 touch
viewport tests, real texture decode and WebGL, seek, pause, replay, camera and
shadow controls. The latter is touch emulation, not physical Android.
The local server and owned browser close in finally; a supervising watchdog
is still required. No foreground tabs, no production deployment.

## Remaining limits

The W39c GLB still contains dense diagnostic pose morphs: 62 body and 74 linen.
W39i defaults to a hybrid evaluator: the original mixer drives the original
weights; body/linen relative position and normal targets are preblended into
dynamic Float32 attributes before native GPU skinning. Small facial morphs
remain native. No original asset rewrite or new binary. For A/B inspection,
reload the page with ?morph=native to use the original Three.js path.

Run the additional CPU contract (create-only report):

    node --max-old-space-size=700 test-hybrid.mjs

Real GLTFLoader/AnimationMixer with bitmap stubs: 17 poses, every body/linen
vertex compared against native Three.js CPU skinning (559419 comparisons),
max world position error 6.085e-8 m, max local normal component error 2.981e-8,
exact weights. Backward seek and unchanged-weight no-op verified.
For the 4096 texture packing example below, remaining GPU morph arrays total
143360 bytes (~0.137 MiB), with 789768 bytes of dynamic position/normal
attributes. CPU retains 54261936 bytes of expanded target arrays; updates may
transfer up to 789768 bytes per changed frame. Reported uploads are requested
dirty attribute bytes, not measured GPU bus traffic. Local Node-only median
preblend 1.43 ms, p95 2.14 ms across 114 samples; excludes skinning/render,
texture decode and upload. No mobile FPS or measured GPU memory claim.
Native browser comparison remains to be performed. The browser test checks
hybrid mode and its calculated GPU budget; no actual browser run yet.

The estimated WebGL array-texture allocation at maxTextureSize=4096 is
76,296,192 bytes (~72.8 MiB), excluding source data, textures, other geometry,
driver allocations and shadow maps. This is a calculation, not measured GPU
memory or a mobile performance result. Actual texture quality, browser
compatibility, camera composition, weight transfer, grasp and handling are
unaccepted. Do not mark the scene complete from the loader test.
