# Current-head reverify — theme-toggle focus indicator

Date: 2026-09-29<br>
Product under test: `FedorMilovanov/gb-is-my-strength` `main`<br>
Exact Product HEAD: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`<br>
Live `releaseSha` / `controlPlaneSha`: same SHA, read from `/deployments/current.json` on 2026-09-29<br>
Disposition: **admit one bounded direct defect** for `.theme-toggle`; narrow historical candidate `KBD-03`, do not include the search button in this row.

## Current-source confirmation

At the exact current Product HEAD, `css/mobile-hotfix.css` contains later, `!important` declarations that set `.theme-toggle` to `outline: 0`, `border: none`, transparent background, and no box shadow. A second selector repeats the removal in `:focus` states. The same stylesheet's generic `:focus-visible` rule supplies a 2px outline, but the later `!important` declarations defeat it.

On the home page, `src/components/home/HomePageHead.astro` loads `site.css`, `home.css`, `command-palette.css`, then `mobile-hotfix.css`. `css/home.css:666–670` explicitly gives `.mobile-controls > button:focus-visible` a 2px outline; the later hotfix's `outline: 0 !important` removes that authored indicator. For the theme toggle itself, current CSS supplies no keyboard-focus change to icon color/shape as an alternative: the icon color is inherited, while its explicit transform rule is for `:hover`.

The mechanism directly establishes that the keyboard-focused theme toggle on `/` has no authored visible focus indicator. `mobile-hotfix.css` is also loaded by the article index and other page heads; the historical report counted 88 generated routes linking it, but this reverify does not treat that route count as 88 direct browser reproductions.

## Evidence boundary / narrowing of KBD-03

The archived Product audit is `../incoming/arena-agent-visual-playwright/2026-09-23/REPORT.md`, anchored at this same Product SHA. Its KBD-03 narrative reports missing outlines on `/`, `/articles/`, `/hard-texts/genesis-6/`, and `/izbrannoe/`. However, the packaged `evidence/kbd4.mjs` visits only `/` and queries only `button[aria-label="Поиск по всему сайту"]`; it does not focus/test the theme toggle or navigate the other three routes. Its screenshots were directed to `/tmp/aud/` and are not included in the retained evidence package. Treat that historical runtime claim as directly supporting only the search-button probe on `/`, not as a four-route theme-toggle reproduction.

The search button is **not** admitted here: `css/command-palette.css` changes its color and opacity on `:focus`, so absence of an outline alone does not prove absence of every visible focus cue. The old probe recorded border, outline and background, but not color/opacity or a retained screenshot. A separate current browser check would be needed to classify that case. By contrast, the theme toggle has no focus-state color/shape change in the current source, and the current CSS cascade expressly defeats the homepage's authored `:focus-visible` outline.

Fresh Playwright Chromium `153.0.8010.0` sequential-Tab probes were run on the local production-like build of the exact current/live SHA. In normal rendering, `/`, `/articles/`, `/hard-texts/genesis-6/` and `/izbrannoe/` reached `.theme-toggle` (Tab stops 11, 9, 11 and 11); each matched `:focus-visible` while computed outline style was `none`, box shadow was `none`, border was `none`, and background was transparent. Current source adds no focus-specific icon color/shape treatment; the measurements do not include an unfocused screenshot pixel-diff.

The same four-route check with Chromium `forcedColors: active` again reached each toggle at the same Tab stop; all four matched `:focus-visible` but computed `outline-style:none`, `outline-width:0px`, `box-shadow:none`, and `border-style:none`. The home-page screenshot shows no visible focus ring in forced-colors mode. This extends the current defect evidence across forced colors; it does not expand the issue to the search button. JSON evidence is in `evidence/2026-09-29-theme-focus-timeline-reverify.json` and `evidence/2026-09-29-theme-focus-forced-colors-reverify.json`; the forced-colors screenshot is `evidence/2026-09-29-theme-focus-forced-colors.png`. These are local exact-SHA browser results, not remote live-host navigation. The search-button scope remains untested and unadmitted.

## Scope and closure boundary

`GBS-THEME-TOGGLE-FOCUS-INDICATOR-MISSING` is limited to visible `.theme-toggle` controls where the hotfix stylesheet is loaded. Close after resulting-main browser proof shows a persistent, high-contrast `:focus-visible` indicator on the home page and representative non-home layouts that load the same stylesheet (including the previously reported article index, Genesis 6 and favorites routes), while hover and pointer styling remain unchanged. Also verify forced-colors behavior. The broader `.gb-nav-search-icon` claim remains unadmitted pending a probe that checks actual focused-vs-unfocused color/opacity and retained pixels.

## Duplicate / in-flight check

The current open Product PRs #2142–#2145 do not modify this CSS or the theme-toggle focus contract. Searches for open issues `theme toggle focus indicator outline` and `focus visible header button` returned no matches.
