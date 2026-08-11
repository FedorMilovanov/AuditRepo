# Current Verification — analytics consent control lifecycle

Date: 2026-08-12

## Scope and source authority

Read-only audit of `FedorMilovanov/TheLegendaryPoet` at exact `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`.

Product mutation: **none**.

This wave creates no new ID. The findings extend existing **`TLP-ANALYTICS-CONSENT-001`** from cross-tab/provider state authority to the reader-facing control lifecycle.

This report deliberately avoids jurisdiction-specific legal conclusions; it records the current Product behavior and its own privacy-copy contract.

## 1. CONFIRMED — the normal UI offers the analytics choice only while consent is unset

`AnalyticsConsentBanner` initializes from `getAnalyticsConsent()` and returns `null` whenever:

```ts
!hasConfiguredAnalytics() || consent !== null
```

The only reader controls that call `setAnalyticsConsent(...)` are rendered inside that banner:

- `Без аналитики` → `denied`;
- `Разрешить` → `granted`.

After either choice, local component state is set to that value and the banner disappears.

Thus the normal consent surface is a **one-time unresolved-state chooser**, not a persistent/reopenable preference control.

## 2. PrivacyPage describes reset by deleting site data, not an in-app choice editor

The Privacy page advertises in SEO description that it explains how consent is managed.

Its analytics section says:

- GA4/Yandex load only after explicit consent;
- the decision is stored in the browser;
- the decision **may be reset by deleting site data**.

The page renders no Allow/Deny/reset button, analytics settings link, or other application-owned consent editor.

Therefore a reader who changes their mind after a normal first choice must leave the application’s preference UI and manipulate browser/site storage to make the banner reappear.

This is especially relevant to the already-confirmed cross-tab/revocation root: the Product needs a normal way to produce a later `denied` decision before later-deny propagation/teardown can be a complete user workflow.

## 3. Relationship to existing `TLP-ANALYTICS-CONSENT-001`

The existing root already owns:

- cross-tab consent convergence;
- later denial authority over initialized analytics;
- provider disable/revoke/teardown;
- blocked-storage effective-vs-persisted truth.

This wave adds the missing control-plane piece:

**a browser-wide consent state needs a browser-wide reader-accessible editor, not only an initial banner.**

A later-deny backend/runtime path without a normal UI that can express later deny would remain incomplete.

## 4. Required terminal outcome under the existing root

Add one durable reader entry point to inspect/change analytics preference whenever analytics is configured. Suitable Product placements include the Privacy page and/or a persistent Footer/settings entry.

The control should:

- display the current effective state (`granted`, `denied`, or unresolved);
- allow `granted → denied` and `denied → granted` without requiring site-data deletion;
- propagate the new state to all open tabs;
- apply provider enable/disable semantics immediately and honestly;
- distinguish a storage persistence failure from an effective current-session choice;
- remain usable with keyboard/screen readers and not conflict with the modal overlay stack;
- update Privacy copy so the documented management path matches the actual UI.

Deleting site data can remain a browser-level reset option, but should not be the only normal way to revisit a voluntary application preference.

## 5. Audit-harness impact

Strengthen **`TLP-AUDIT-004`** with one complete user journey instead of only synthetic consent events:

1. unresolved consent → choose Allow;
2. verify banner closes and analytics starts only after the choice;
3. navigate to the persistent consent/settings control;
4. switch to Deny;
5. verify all open tabs converge and no further Product/provider tracking is emitted;
6. switch back to Allow if the product supports re-grant;
7. simulate blocked localStorage and verify the UI distinguishes current-session choice from failed persistence;
8. test the same flow while Command/Immersive overlays are available so consent controls respect overlay ownership.

## Root-cause consolidation

| Finding | Disposition |
|---|---|
| banner only exists for `consent === null` | existing `TLP-ANALYTICS-CONSENT-001` |
| Privacy page offers no in-app consent editor | same root |
| only documented reset is deleting site data | same root / Product control gap |
| cross-tab deny has no provider teardown | existing same root |
| no complete UI-driven revoke/regain regression | strengthen `TLP-AUDIT-004` |
| jurisdiction-specific compliance verdict | explicitly outside this report |

## Checkpoint

- Product source: unchanged.
- Source anchor: `d59cceccb0c49af59b1be38d4c547a6240b3005a`.
- New roots: **0**.
- Existing roots strengthened: `TLP-ANALYTICS-CONSENT-001`, `TLP-AUDIT-004`.
