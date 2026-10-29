# mp3telegrambot audit — wave 4 media runtime correctness

**Source anchor:** `FedorMilovanov/mp3telegrambot@df1d6c675106c50147ed0045dddfbc25c8f546da`

## Scope

Audio/video postconditions, duration authority, FFmpeg/FFprobe process ownership, silence/stream probes, transactional output paths and whether green CI necessarily executes a real media round trip. Product heads/owners were re-read first; `main` remained unchanged and no new human repair owner was visible.

## Verified behavior

Current source has systemic protection rather than filename-only success claims:

- conversion and final-delivery boundaries verify non-empty output, probeability, duration and expected stream properties;
- FFmpeg/FFprobe calls use owned argv-only process execution with timeout/cancellation cleanup;
- clips/Shorts output publication uses temporary paths and postcondition checks before replacement;
- duration policy distinguishes source, selected window and public encoded duration;
- LiveDub QA checks companion audio, silence/tail and output stream conditions;
- 129 focused media/postcondition tests passed locally.

No static point defect in conversion arithmetic or delivery selection was admitted. Credentialed/audible behavior remains part of the real-runtime canary residual.

## `MP3-MEDIA-INTEGRATION-OPTIONAL-001`

The strongest media integration test generates and probes actual FFmpeg media, but it is module-level `skipif` when either `ffmpeg` or `ffprobe` is absent. Primary CI invokes the test without installing or explicitly preflighting those executables. A skip is a successful pytest outcome, so a moving runner image can lose one or both tools while the media job remains green and all mock/contract tests continue to pass.

This was reproduced in the clean exact-lock audit environment: the focused suite reported 129 PASS and one SKIP, specifically `test_livedub_audio_media_integration.py` because FFmpeg/FFprobe were unavailable. An attempted temporary npm static-binary bootstrap was rejected by TLS/redirect delivery in the sandbox; no certificate verification was weakened and no Product conclusion is based on that delivery failure.

Exact-main Ubuntu and Windows jobs are green and list the integration test, but job success alone does not distinguish execution from this explicit skip. Thus current evidence supports strong deterministic contracts, not a guaranteed rendered/audible CI witness.

**Closure boundary:** provision or verify an approved FFmpeg/FFprobe version before the integration step, fail the required media lane when either executable is absent, print version/hash provenance, and retain generated-file probes for streams, duration, silence/tail and decodability. If a platform intentionally lacks the tools, mark that platform lane explicitly non-authoritative rather than silently converting the witness to PASS.

## Disposition

No media rollback is justified. One assurance/control-plane gap is admitted so future green CI cannot silently stop exercising real encoded bytes.