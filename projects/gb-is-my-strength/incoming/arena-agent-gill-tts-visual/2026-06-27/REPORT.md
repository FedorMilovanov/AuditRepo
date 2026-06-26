# Gill + TTS + visual bugs — owner screenshots verified, root-caused, partial fixes pushed

## Meta
- Agent: arena-agent-gill-tts-visual
- Date: 2026-06-27
- Production HEAD audited: `1a288da5`
- Build: production-like dist (Node 22) + Playwright; reference probe cross-checked
- Owner screenshots: 4 (desktop rail, mobile reading, mobile TOC sheet)

## Owner-reported bugs — all verified on production main 1a288da5

### TTS-01 — Play reads in ENGLISH (P0 functional) → FIXED (pushed)
Root cause: `speakNextChunk()` set `u.lang='ru-RU'` but never assigned a voice → browser used its
default (English) voice. Fix: added `pickRuVoice()` + `u.voice=ttsState.voice` (Google ru > cloud > any ru).
Lane: `lane/tts-russian-voice-and-pause-2026-06-27`. Verified: unit picks 'Google русский (ru-RU)'.

### TTS-02 — Play can't be paused / stuck on Play (P0 functional) → FIXED (pushed, same lane)
Root cause: the `.gb-ember` click handler only toggled the speed panel (`stopPropagation`) and never
called `handlePlayClick`, so play/pause was unreachable. Fix: ember click now drives handlePlayClick
(play→pause→resume); speed pill opens on start / closes on pause. Verified Playwright (stubbed synth):
state idle→playing→paused.

### GILL-thumbnails — mini-images inside roman-numeral cells (P1 visual) → ROOT-CAUSED
The legacy `.gbs2-thumb img{display:none}` is OVERRIDDEN by the global reset
`img{max-width:100%;height:auto;display:block}` (later in cascade) → thumbnails render behind the
roman numerals in the desktop rail AND mobile. Confirmed: 4 visible imgs in rail, parent .gbs2-thumb,
computed display:block.
Clean fix = v16 convergence (removes gbs2-thumb entirely). See GILL-converge lane.

### GILL-mobileTOC — "колхозная замена" roman numerals (P1 visual) → ROOT-CAUSED
Legacy mobile TOC (`gbs2-sheet`) renders numerals in dark-red rounded SQUARES. Reference probe
(`gb-floating-cluster-probe-v16-reference.html`) uses NO box — `.toc-item__num{font-family:serif-display;
font-size:24px;font-style:italic;font-weight:600;color:var(--gb-accent-gold)}` (part: 14px, rail: 18px).
The v16 floating-cluster.css ALREADY matches these exactly — but parts still use legacy gbs2-sheet.
Clean fix = v16 convergence (uses toc-item__num/toc-part-item__num).

### GILL-naming — "Исторический контекст is the FIRST part, not Gill Часть 1" (UX)
The series order is: I=Исторический контекст, II=Часть I.Человек, III=Часть II.Учёный, IV=Часть III.Наследие,
V=Справочник. So "Часть I. Человек" is the SECOND series item (II). The v16 rail/TOC already number it
correctly (II). Recommend keeping consistent labels everywhere: series-position roman (I..V) + part name.

## Status of fixes
- TTS-01/02 → fixed-current, pushed (lane/tts-russian-voice-and-pause-2026-06-27). Affects ALL premium pages.
- GILL-A/B (vertical title) → P0 hotfix pushed earlier (lane/gill-mobile-head-fix) AND another agent's
  3e477231 also addresses it on main.
- GILL thumbnails + mobile-TOC + naming → the clean fix is v16 convergence:
  - lane/gill-part1-v16-converge-2026-06-27 (Part I pilot, + GILL-F v16 mobile responsive layer).
  - STILL NEEDS: replicate v16 to chast-2/chast-3/spravochnik, then merge all.

## CRITICAL note for owner/integrator
The owner is seeing these bugs on PRODUCTION because the convergence lanes are NOT merged to main yet.
Main still serves legacy gbs2 Gill (thumbnails + dark-red-box TOC). The fixes exist on branches and are
verified, but need merge + replication to parts 2/3/spravochnik for the full topо result.

## Recommended order
1. Merge TTS lane (pure win, all pages). 
2. Confirm Part I v16 pilot (desktop+mobile) is топово.
3. Replicate v16 to parts 2/3/spravochnik (same template, per-part TOC data).
4. Merge the v16 convergence + responsive layer together. Remove legacy gbs2-thumb/gbs2-sheet for Gill.
