// SessionStart: puts the baseline in front of Claude at every start,
// resume and clear -- its rules (rules/core.md, beside this script), then
// the project's state: handoff.md and the last entry of the open journal
// volume (the highest-numbered journals/journal-NN.md). What a SessionStart
// hook prints is added to Claude's context before the first prompt
// (code.claude.com/docs/en/hooks.md, SessionStart). A plugin cannot ship
// rule files (Claude Code loads no CLAUDE.md from a plugin), so the rules
// come this way, and update with the plugin.
//
// A project not yet set up -- no handoff.md -- gets the rules and a line
// saying /baseline:init sets it up.
//
// In parts: a hook's stdout is "capped at 10,000 characters", and past it
// Claude sees a preview of the first 2,000 and a file it is not asked to
// read; "Claude Code measures each string on its own, even when several
// hooks run for the same event" (code.claude.com/docs/en/hooks.md, Add
// context for Claude). So hooks/hooks.json registers this script PARTS
// times, `--part 1` to `--part PARTS`, and each prints its own piece of the
// whole, at most SIZE characters, split between lines; a part with nothing
// left prints nothing. What does not fit in all of them is named, to read.

import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ROOT } from './lib.mjs'

const PARTS = 8
const SIZE = 9000
const part = Number(process.argv[process.argv.indexOf('--part') + 1]) || 1

const read = (p) => {
  try {
    return readFileSync(p, 'utf8')
  } catch {
    return null
  }
}
const noComments = (t) => t.replace(/<!--[\s\S]*?-->/g, '')

const parts = []
const rules = read(join(dirname(fileURLToPath(import.meta.url)), '..', 'rules', 'core.md'))
if (rules) parts.push('[baseline] The rules this project works by (the baseline plugin):\n\n' + rules.trim())

const handoff = read(join(ROOT, 'handoff.md'))
if (handoff === null) {
  parts.push('[baseline] This project is not set up for the baseline yet: no handoff.md. /baseline:init sets it up, with the user\'s go.')
} else {
  parts.push('[baseline] State, from disk: handoff.md and the last journal entry. They stand in for reading them at the start.')
  parts.push('--- handoff.md ---\n' + (noComments(handoff).trim() || '(empty)'))
  let volumes = []
  try {
    volumes = readdirSync(join(ROOT, 'journals')).filter((n) => /^journal-\d+\.md$/.test(n))
  } catch {
    // No journals folder.
  }
  if (!volumes.length) parts.push('--- journal ---\n(no journals/journal-NN.md found)')
  else {
    const open = volumes.sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0])).at(-1)
    const body = noComments(read(join(ROOT, 'journals', open)) ?? '')
    const starts = [...body.matchAll(/^## /gm)].map((m) => m.index)
    parts.push(starts.length ? `--- last entry of journals/${open} ---\n${body.slice(starts.at(-1)).trim()}` : `--- journals/${open} ---\n(no entries yet)`)
  }
}
// The whole, split between lines into pieces of at most SIZE characters (a
// line longer than that is cut).
const pieces = []
let piece = ''
for (const line of parts.join('\n\n').split('\n')) {
  const l = line.slice(0, SIZE)
  if (piece && piece.length + l.length + 1 > SIZE) {
    pieces.push(piece)
    piece = ''
  }
  piece += (piece ? '\n' : '') + l
}
if (piece) pieces.push(piece)
const shown = Math.min(pieces.length, PARTS)
if (part <= shown) {
  const head = `[baseline] Session start, part ${part} of ${shown}.`
  const rest = part === shown && pieces.length > PARTS ? '\n\n[baseline] The rest did not fit: read handoff.md and the journal\'s last entry yourself.' : ''
  process.stdout.write(`${head}\n\n${pieces[part - 1]}${rest}\n`)
}
