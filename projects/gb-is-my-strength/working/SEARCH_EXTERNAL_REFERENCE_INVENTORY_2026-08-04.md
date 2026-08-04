# Search external reference inventory — 30+ links

**Date:** 2026-08-04  
**Purpose:** external standards/reference pack used to sanity-check search audit expectations. These links are not Product evidence by themselves; Product findings remain based on source/dist/probe artifacts.

## ARIA combobox/listbox/dialog references

1. https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/
2. https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/combobox/aria1.1pattern/listbox-combo.html
3. https://www.w3.org/TR/2021/NOTE-wai-aria-practices-1.2-20211129/examples/
4. https://www.digitala11y.com/combobox-role/
5. https://getaccessguard.com/posts/how-to-build-accessible-custom-dropdowns-comboboxes-that-actually-work
6. https://github.com/davidtheclark/react-aria-modal
7. https://accessibility.arizona.edu/web-apps/aria-patterns
8. https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html
9. https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/js/dialog.js
10. https://testparty.ai/blog/modal-dialog-accessibility
11. https://www.uxpin.com/studio/blog/keyboard-navigation-patterns-complex-widgets/

## WCAG / touch target / focus references

12. https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
13. https://dequeuniversity.com/resources/wcag2.1/2.5.5-target-size
14. https://css-tricks.com/looking-at-wcag-2-5-5-for-better-target-sizes/
15. https://www.siteimprove.com/blog/motor-impairments-and-mobile-ui-the-touch-target-problem/
16. https://accessiblewebsiteservices.com/mobile-accessibility-tip-touch-target-size-affect-indexing/
17. https://govtnz.github.io/web-a11y-guidance/ka/accessible-ux-best-practices/keyboard-a11y/keyboard-focus/visible-focus-indicators.html
18. https://www.webability.io/glossary/focus-indicator
19. https://www.wcag.com/designers/2-4-13-focus-appearance/
20. https://www.accessitree.com/wcag-ultimate-guide/ensure-focus-indicators-are-sufficiently-large-and-contrasting/
21. https://testparty.ai/blog/wcag-focus-visible-guide
22. https://blog.logrocket.com/ux-design/all-accessible-touch-target-sizes/
23. https://www.nadcab.com/blog/apple-human-interface-guidelines-explained
24. https://www.remoteopenclaw.com/skills/ehmo/platform-design-skills/ios-design-guidelines

## SearchAction / schema references

25. https://schema.org/docs/actions.html
26. https://developer.yoast.com/features/schema/pieces/searchaction/
27. https://www.karpi.studio/schema-glossary-terms/search-url
28. https://www.andrewkeir.com/seo/documentation/searchaction-schema
29. https://aeo-expert.nl/en/blog/website-schema-with-searchaction-your-own-search-box-in-google
30. https://localwebadvisor.com/wiki/what-is-sitelinks-searchbox
31. https://spotupp.com/what-is-sitelinks-search-box-structured-data/
32. https://www.superwebtricks.com/sitelinks-search-box/

## Pagefind references

33. https://pagefind.app/docs/sub-results/
34. https://pagefind.app/docs/components/results/
35. https://pagefind.app/docs/search-config/
36. https://pagefind.app/docs/components/config/
37. https://pagefind.app/docs/ranking/
38. https://github.com/Pagefind/pagefind/blob/main/docs/content/docs/js-api-filtering.md
39. https://gist.github.com/Hugos68/0b51b654dbed91fb3866788672d261e8

## URL/query references

40. https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
41. https://github.com/mdn/content/blob/main/files/en-us/web/api/urlsearchparams/index.md?plain=1
42. https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
43. https://timdeschryver.dev/blog/til-urlsearchparams
44. https://codeshack.io/references/javascript/urlsearchparams/

## Usage notes

- Official/high-authority anchors preferred for implementation decisions: W3C/WAI, WCAG, Schema.org, MDN, Pagefind docs.
- Blog/vendor links were used only as secondary sanity checks and examples, not as canonical requirements.
- SearchAction sources are mixed on current Google rich-result value; the AuditRepo finding does not depend on SEO benefit. It depends on the simpler truthfulness contract: if JSON-LD advertises a URL template, that URL should not be a dead/ordinary homepage state.
