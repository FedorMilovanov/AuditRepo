# Evidence — GENEALOGY-CHILDREN-UNRESOLVED

## Meta
- Project: gb-is-my-strength
- Agent: arena-bugverifikator
- Date: 2026-08-19
- Anchor: Product main `cb3681e1a85b5f8919c9dc537f812a842bbe9235`
- Evidence types: verified-source
- Suggested status: `candidate` → ready for verification wave admission as `current-local` or fold into genealogy integrity SYS

## Claim
`data/genealogy/genealogy.json` lists **59** `children[]` entries whose IDs are absent from `persons[]`. Runtime layout/nav silently drops them. Dataset `_status` overclaims integrity («children arrays consistent», «0 orphan references») while only parent-direction orphans were cleared.

## Method
```text
persons = genealogy.json.persons           # 156
byId = {p.id: p for p in persons}
missing = [(parent.id, child) for parent in persons for child in parent.children or [] if child not in byId]
# => 59 rows, 58 unique child ids
```

## High-value missing IDs (not exhaustive)
| Missing id | Listed under parent |
|---|---|
| ishmael | abram |
| haran, nahor_haran | terah |
| dinah | leah |
| joktan | eber |
| gershom, eliezer_moses | moses |
| nadab, abihu, ithamar | aaron |
| eliab, abindab, shammah, … | jesse |
| Table-of-Nations stubs | cush, mizraim, canaan, javan, aram, gomer, … |

## Full unique missing id set (58)
```
abihu
abindab
amorite
anamim
arkite
arvadite
ashkenaz
caphtorim
casluhim
chelubai
dinah
dodanim
eliab
eliezer_moses
eliphaz_esau
elishah
elisheba
gershom
gether
girgashite
hamathite
hanoch_cain
haran
havilah_gen10
hebron
heth
hivite
hul
ishmael
ithamar
izhar
jebusite
jerahmeel
joktan
kittim
lehabim
ludim
mash
nadab
nahor_haran
naphtuhim
others_jesse
pathrusim
raamah
reuel_esau
rippath
sabtah
sabteca
seba
shammah
sidon
sinite
tarshish
togarmah
uz_aram
uzziel
zemarite
zerah
```

## Runtime behavior
- `src/components/genealogy/layout.ts`: descendant expansion and link creation gated on id membership in the person set — dangling children never become nodes/links.
- `GenealogyTree.tsx`: ArrowDown uses `person.children?.filter(c => byId.has(c))`.
- No throw observed from this alone (supports keeping separate `GENEALOGY-NO-ERROR-BOUNDARY` as hardening).

## Related MASTER rows
- `GENEALOGY-ID-INVALID-SPACE` (leading space on ` lud_shem`) — still true; orthogonal but same file.
- `GENEALOGY-NO-ERROR-BOUNDARY` — still true; hardening.

## Suggested repair shapes (owner chooses)
1. **Data-complete:** author missing person records for narrative-critical IDs; keep nation stubs only if typed.
2. **Data-trim:** remove unresolved children entries; fix `_status` text to match the real invariant.
3. **Schema:** introduce explicit `childStubs: string[]` vs resolved `children: id[]` so aspirational names cannot pretend to be graph edges.
4. **Harness:** integrity script must fail on dangling children, not only missing parents.

## What this does not prove
Does not prove every Table-of-Nations name must be a full interactive node. It does prove the current integrity attestation is false and major patriarchal children are absent from the graph.
