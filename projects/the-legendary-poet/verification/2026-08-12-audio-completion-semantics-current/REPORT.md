# Current Verification — audio completion semantics

Date: 2026-08-12

## Scope and source authority

Read-only audit of `FedorMilovanov/TheLegendaryPoet` at exact `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`.

Product mutation: **none**.

No competing open Product issue was found for the completion-semantics mechanism in this wave.

## 1. CONFIRMED — 97% position is persisted and presented as “fully listened”

`AudioPlayerProvider` runs completion logic from ordinary `timeupdate`:

```ts
if (audio.duration > 30 && audio.currentTime / audio.duration >= 0.97) {
  persistCompleted(track.id);
}
```

This check does not require:

- the native `ended` event;
- continuous playback through the ending;
- reaching the final two seconds;
- or any distinction between natural playback and a seek into the last 3%.

A reader can therefore drag/seek directly to 97%, trigger a time update, pause/leave, and persist the track as completed.

The Archive does not present that state as an approximate threshold. `ListeningArchiveItem` maps `completed` to:

- progress `1` / visual 100%;
- text `Прослушано полностью`;
- a detail path with no resume position;
- play action described as `Слушать ... снова`.

The internal threshold and reader-facing claim therefore have different semantics.

### Root cause

**A heuristic engagement threshold is stored as a categorical factual completion state.** The state name/UI copy implies full playback while the producer means only “position reached 97% at least once”.

### Disposition

New active root: **`TLP-AUDIO-COMPLETION-001` / P3**.

Required terminal outcome must choose one honest contract:

- if `completed` means actual completion, set it from `ended` or a precisely defined near-end natural-playback rule that cannot be satisfied by arbitrary seeking, and keep reader copy `Прослушано полностью`;
- if 97% is intentionally the product’s engagement threshold, rename/present it as an approximate completion state rather than 100% factual playback.

Required regression:

1. seek directly to 97% without ending — must not show `Прослушано полностью` under a strict-completion contract;
2. normal playback reaches end — completion persists and Archive shows the completed state;
3. resume position and restart behavior remain deterministic after actual completion.

## 2. LATENT — listening state has no master-version identity

`docs/MUSIC_RELEASE_WORKFLOW.md` explicitly supports **replacing a master** while preserving the release record. A replacement updates MP3 bytes, SHA-256, duration and waveform.

The audio-session store, however, keys positions and completion only by stable `track.id`; it does not bind state to the master SHA/version.

If a published master is replaced under the same ID, an old position or `completed` flag can therefore be interpreted as state for the new bytes. A shorter new master can also receive an old position that is near/past its meaningful location before clamping.

This is a real release invariant gap, but this wave did **not** establish that one of the current published masters has already been replaced under the same stable ID while reader session state existed.

### Disposition

Do **not** create another active row from this without a current replacement witness. Record it as a latent release/session invariant related to future repair of `TLP-AUDIO-SESSION-001` / `TLP-AUDIO-RELEASE-001`:

- session state should carry or reconcile against a master identity (for example expected audio SHA/version) when replacement is supported;
- replacement validation should define whether previous positions/completion are migrated, reset or invalidated.

## 3. Audit-harness impact

Existing **`TLP-AUDIT-004`** should gain an exact completion regression that distinguishes:

- seek-to-97%;
- natural near-end playback;
- native `ended`;
- Archive’s categorical `Прослушано полностью` state.

Master-version migration should become a required fixture when/if the replacement invariant is promoted or fixed as part of audio session/release work.

## Root-cause consolidation

| Finding | Disposition |
|---|---|
| 97% timeupdate persists `completed` | new `TLP-AUDIO-COMPLETION-001` / P3 |
| Archive displays completed as 100% / `Прослушано полностью` | same root |
| Seek can satisfy 97% threshold | same root |
| Session state keyed by id across supported master replacement | latent invariant; not promoted without current replacement witness |
| Missing exact completion regression | existing `TLP-AUDIT-004` |

## Checkpoint

- Product source: unchanged.
- Source anchor: `d59cceccb0c49af59b1be38d4c547a6240b3005a`.
- New roots: 1 P3.
- Existing root strengthened: `TLP-AUDIT-004`.
- Latent only: master-version identity gap.
