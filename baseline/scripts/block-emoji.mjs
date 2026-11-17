// PreToolUse (Write, Edit): refuses emoji and pictographic glyphs --
// checkmarks, crosses, stars -- in what Claude writes into files. Status is
// plain words ("done", "pending", "open"). Mathematical Unicode passes:
// arrows (U+2190-U+21FF), technical symbols, operators, Greek letters. The
// ranges are written as numbers, so this file stays plain ASCII.

import { deny, input } from './lib.mjs'

const RANGES = [
  [0x1f000, 0x1faff], // emoji, pictographs, supplemental symbols
  [0x2600, 0x26ff], // miscellaneous symbols
  [0x2700, 0x27bf], // dingbats: checkmarks, crosses
  [0x2b00, 0x2bff], // symbols and arrows: stars
  [0xfe00, 0xfe0f], // variation selectors: emoji presentation
  [0x200d, 0x200d], // zero-width joiner: emoji sequences
]

const REASON =
  'Emoji and pictographic glyphs are not allowed in files (checkmarks, crosses and stars too). Use plain words for status ("done", "pending", "open"). Mathematical Unicode is fine.'

const data = input()
const ti = data?.tool_input ?? {}
const text = ['content', 'new_string', 'new_str'].map((k) => String(ti[k] ?? '')).join(' ')
for (const ch of text) {
  const c = ch.codePointAt(0)
  if (RANGES.some(([lo, hi]) => c >= lo && c <= hi)) deny(REASON)
}
