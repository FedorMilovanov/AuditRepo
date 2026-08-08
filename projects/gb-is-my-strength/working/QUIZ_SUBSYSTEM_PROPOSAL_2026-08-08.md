# Quiz Subsystem: Deep Audit & Educational Architecture Proposal

**Date:** 2026-08-08
**Context:** Product relies on interactive `quiz` components (e.g., `GillLearningSheet.astro`, `KodDaVinchiSectionQuiz.astro`) for elaborative learning and user engagement. 

## 1. Technical Health (Verified)
The technical foundation of the quiz system has been largely repaired in previous waves:
- **`QUIZ-OPTION-INNERHTML` (XSS):** Fixed. Quiz options are now rendered safely via DOM dataset/classList without raw `innerHTML` injection.
- **Keyboard A11y:** Fixed (`QUIZ-ANSWERED-STILL-KEYBOARD`). Buttons receive `disabled=!0` upon selection.
- **Dead Code:** `quiz-memory` global payload (~6KB) has been evaluated and scheduled for removal/lazy-loading.
- **Current Defect (In `MASTER`):** The only remaining structural defect is the `panelQuiz aria-labelledby=tabQuiz` orphan on 42 routes (when `hasQuiz=false`). This is actively tracked under `SYS-READER-CONTROL-SEMANTICS` and does not require a new matrix row.

## 2. Content & Epistemic Certainty
- **`GILL-AUDIT-006` (Contested claims as facts):** Fixed. Historically, the quiz assessment layer possessed a higher "epistemic certainty" than the article body (presenting scholarly disputes as absolute facts). The editorial lane (Product #269) has cleaned these assertions.

## 3. Educational & Gamification Architecture (The Gap)
The current UI/CSS layer contains advanced educational features that are **dormant or incomplete** in the JS/Data layer:

### A. Persistent Mastery (Streak & Progress)
- **Symptom:** Quizzes are currently stateless. If a user refreshes the page, their progress is lost. The site already has a robust `localStorage` engine for Favorites (`gb-favorites-v1`) and Highlights, but lacks `gb-quiz-progress-v1`.
- **Dormant Code:** `floating-cluster.css` contains unused `.quiz-mastery`, `.quiz-mastery__seg`, and `.quiz-mastery__lbl` classes designed for an animated multi-segment progress bar.
- **Proposal:** Implement a lightweight local store for quiz mastery. Render the `.quiz-mastery` UI to show the user's progress across sessions.

### B. Confidence Calibration UI (`glsQuizCalib`)
- **Symptom:** The DOM contains a hidden calibration meter: `<div class="quiz-calib" id="glsQuizCalib" hidden title="Совпадение уверенности с результатом">`.
- **Pedagogical Value:** Asking users "How confident are you?" before revealing the answer dramatically improves memory retention (Elaborative Interrogation).
- **Proposal:** Unhide this UI and wire it to a simple pre-answer prompt (e.g., "Confidence: Low / High"). Compare confidence with correctness to populate the `.quiz-calib__bar`.

### C. Difficulty Weighting & Question Pooling
- **Symptom:** Questions are hardcoded (e.g., `gbs-book-prototype.html:943`), meaning replayability is zero. Every question has the same weight.
- **Proposal:** Introduce a schema attribute `difficulty: 1|2|3` in the quiz JSON payload. Visually denote difficult questions (e.g., 🌶️) and grant higher "streak" rewards for answering them correctly on the first try. Implement a basic randomizer to select 3 questions from a larger pool.

## Disposition
These are **not current defects**, but high-value pedagogical improvements. They have been added to `WORK_QUEUE.md` for Product Owner consideration.
