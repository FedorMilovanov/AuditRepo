# FALSE POSITIVE: AUDIT-P2-NODE-REGEX

**Source:** arena-agent-audit-1 intake (2026-07-05)
**Rejected by:** Arena Agent verifier (independent session, 2026-07-05)
**Verdict:** FABRICATED EVIDENCE — hallucinated code

## Claim

The intake claimed `audit-pro.js:250-253` contains:

```javascript
mustScript(scripts, 'engines', scripts => scripts?.engines?.node,
  '"node":">=22.12.0"'
);
```

## Reality

- **Actual line 250:** `const SITE_CSS_MIN_BYTES = 200_000;`
- `grep -c 'mustScript' scripts/audit-pro.js` = **0** (function does not exist)
- `grep -c '22.12' scripts/audit-pro.js` = **0**
- `grep -c 'engines' scripts/audit-pro.js` = **1** (only in "search engines" context, line 1767)

## Conclusion

The evidence block was fabricated. The function `mustScript`, the line numbers, and the code snippet are all imaginary. This is a hallucination, not a misinterpretation.

**No action required on source repo.**
