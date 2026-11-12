/** Browser tooling: prefer the Arena /tmp/launch-helper.js recipe when present,
 *  otherwise use the persistent copy of the same recipe in the lab. */
let impl;
try {
  impl = await import('file:///tmp/launch-helper.js');
} catch {
  impl = await import('./browser-recipe.mjs');
}
export const launch = impl.launch;
export const BROWSER_META = impl.BROWSER_META;
