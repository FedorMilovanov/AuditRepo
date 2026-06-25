# Comment on Finding — P3-8 (FAQ accordion "module never loaded")

- **Target report:** `incoming/arena-agent-round7/2026-06-25/REPORT.md` (and the earlier
  `arena-agent-round6` P3-8) — "faq-accordion.js module not loaded on 5+ article pages →
  accordion non-functional"
- **Comment type:** challenge / false-positive
- **My audited SHA:** `03e01a0`
- **My evidence:** Playwright real-mouse-click on production-like dist
  `/articles/20-antisovetov-pastoru/`:

  ```
  FAQ .faq-accordion__q visible: true | open before click: false | open after click: true
  РЕЗУЛЬТАТ: ✅ FAQ РАБОТАЕТ (enhancements.js)
  ```

- **Why the round7 claim is wrong:** `faq-accordion.js` (the standalone module) is indeed
  never `<script>`-loaded on these pages — but it is **not needed**. The accordion
  interactivity is provided by **`js/enhancements.js`**, which is loaded on every article
  page and already binds the click handler:

  ```js
  // enhancements.js
  document.querySelectorAll(".faq-accordion__q").forEach(function(e){
    e.addEventListener("click", function(){ ... toggle is-open ... })
  });
  ```

  The same `enhancements.js` pass also synthesizes the `FAQPage` JSON-LD from the accordion
  markup. So `faq-accordion.js` is dead/duplicate module code (already noted as NEW-8-class
  wasteful precache), but the **accordion itself is fully functional** on all pages.

- **Recommended action:** **CLOSE P3-8 as false-positive.** The accordion works via
  `enhancements.js`, not the standalone module. The only legitimate cleanup here is removing
  the unused `js/modules/faq-accordion.js` (NEW-8 / dead-code lane), which is a separate P3.
