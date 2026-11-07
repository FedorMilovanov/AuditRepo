/**
 * Cross-experience topic links. These connect corresponding reader/atlas sections,
 * NOT a claim that every title is an etymologically identical Hebrew lexeme.
 * Canonical future owner: shared gb-is-my-strength content data after integration.
 * Keep this source identical in both standalone prototypes (verified by QA).
 */
export const TOPIC_PAIRS = [
  ["yhwh", "yhwh"],
  ["elohim", "elohim"],
  ["el", "el"],
  ["adonai", "adonai"],
  ["ehyeh-asher-ehyeh", "ehyeh"],
  ["yhwh-yireh", "yireh"],
  ["yhwh-rophekha", "rapha"],
  ["yhwh-nissi", "nissi"],
  ["yhwh-mekaddishkem", "mekoddishkem"],
  ["yhwh-roi", "ro-i"],
  ["yhwh-shalom", "shalom"],
  ["yhwh-tsidkenu", "tsidkenu"],
  ["yhwh-shammah", "shammah"],
  ["yhwh-sabaoth", "sabaoth"],
  ["el-shaddai", "el-shaddai"],
  ["el-elyon", "el-elyon"],
  ["el-olam", "el-olam"],
  ["el-roi", "el-roi"],
  ["el-bethel", "el-bethel"],
  ["el-qanna", "el-qanna"],
  ["qedosh-israel", "qedosh-yisrael"],
  ["attiq-yomin", "atiq-yomin"],
  ["immanuel", "immanuel"],
  ["abba-ho-pater", "abba"],
] as const;

export const atlasToReader = new Map<string, string>(TOPIC_PAIRS);
export const readerToAtlas = new Map<string, string>(TOPIC_PAIRS.map(([atlas, reader]) => [reader, atlas]));
