// PostToolUse and PostToolUseFailure (Bash): appends test, typecheck, build
// and lint runs, with their whole output, to runs/YYYY-MM-DD.log in the
// project. A run is:
//   - cargo test, run, bench, build or check, or a cargo tool's own build
//     or check (`cargo tauri build`);
//   - a package script that checks or builds: pnpm, npm, yarn or bun
//     [options] [run] <script>, the script test, typecheck, build, lint or
//     check, or a name starting with one ("test:unit"); or a script that
//     runs a tool, given one of those as its first word (`npm run tauri
//     build`, `npx vite build`: Tauri's own build, missed before, 2026-10-28);
//   - a checker itself, directly or through npx, bunx, pnpm exec or pnpm
//     dlx: tsc, vitest, jest, playwright, eslint, pytest;
//   - node --test.
// The discipline says no result is claimed before its output is seen; a
// later session cannot tell a seen result from a claimed one without a
// record. This makes the record.
//
// What it gets right:
//   1. Only a command that runs one counts: heredoc bodies and quoted
//      strings are taken out, and a part of the line counts only when a
//      runner is what it invokes -- not a grep for "cargo test".
//   2. Output piped through head, tail or grep before it reaches the log is
//      a fragment; the entry says so.
//   3. A run that fails arrives as PostToolUseFailure; it is logged too,
//      marked as failed.
//   4. Truncation is judged on the pipe the run feeds, not the whole line.
// Silent; never stops work.

import { appendFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { input, ROOT } from './lib.mjs'

const SUBCOMMANDS = ['test', 'run', 'bench', 'build', 'check']
const SCRIPTS = ['test', 'typecheck', 'build', 'lint', 'check']
const TOOLS = ['tsc', 'vitest', 'jest', 'playwright', 'eslint', 'pytest', 'Rscript', 'julia', 'lake']
const MANAGERS = ['pnpm', 'npm', 'yarn', 'bun']
const VALUE_OPTIONS = ['--filter', '-F', '-C', '--dir', '--prefix', '--workspace', '-w', '--cwd']
const TRUNCATORS = ['head', 'tail', 'grep', 'sed', 'awk', 'cut', 'wc', 'tr', 'sort', 'uniq', 'jq', 'rg']
const HEREDOC = /<<-?\s*(['"]?)([A-Za-z_][A-Za-z0-9_]*)\1/
const ENV_ASSIGN = /^[A-Za-z_][A-Za-z0-9_]*=\S*$/
const QUOTED = /'[^']*'|"(?:\\.|[^"\\])*"/gs

/** The command without its heredoc bodies: their contents are data. */
function stripHeredocs(command) {
  const lines = command.split('\n')
  const out = []
  for (let i = 0; i < lines.length; ) {
    const line = lines[i++]
    out.push(line)
    const m = HEREDOC.exec(line)
    if (!m) continue
    while (i < lines.length && lines[i].trim() !== m[2]) i++
    i++
  }
  return out.join('\n')
}

const commands = (c) => c.split(/\|\||&&|[;\n]/).map((s) => s.trim()).filter(Boolean)
const stages = (c) => c.split('|').map((s) => s.trim()).filter(Boolean)

/** The words of a part of the line, past variable settings and wrappers. */
function words(segment) {
  const toks = segment.split(/\s+/).filter(Boolean)
  while (toks.length && (ENV_ASSIGN.test(toks[0]) || ['env', 'time', 'nice', 'exec'].includes(toks[0]))) toks.shift()
  return toks
}

const isScript = (n) => SCRIPTS.some((s) => n === s || n.startsWith(s + ':'))

function isRun(toks) {
  if (!toks.length) return false
  const head = toks[0].split('/').pop()
  if (head === 'cargo') return toks.length >= 2 && (SUBCOMMANDS.includes(toks[1]) || (toks.length >= 3 && isScript(toks[2])))
  if (TOOLS.includes(head)) return true
  if (head === 'node') return toks.includes('--test')
  if (head === 'npx' || head === 'bunx') {
    const rest = toks.slice(1).filter((t) => !t.startsWith('-'))
    return rest.length > 0 && (TOOLS.includes(rest[0].split('@')[0]) || (rest.length >= 2 && isScript(rest[1])))
  }
  if (MANAGERS.includes(head)) {
    const rest = []
    for (let i = 1; i < toks.length; i++) {
      if (VALUE_OPTIONS.includes(toks[i])) i++
      else if (!toks[i].startsWith('-')) rest.push(toks[i])
    }
    if (!rest.length) return false
    if (head === 'pnpm' && (rest[0] === 'exec' || rest[0] === 'dlx')) return rest.length >= 2 && TOOLS.includes(rest[1].split('@')[0])
    if (rest[0] === 'test' || rest[0] === 't') return true
    if (rest[0] === 'run') return rest.length >= 2 && (isScript(rest[1]) || (rest.length >= 3 && isScript(rest[2])))
    // pnpm, yarn and bun run a script by its bare name; npm does not.
    return head !== 'npm' && (isScript(rest[0]) || (rest.length >= 2 && isScript(rest[1])))
  }
  return false
}

/** [is a run, its output piped into something that cuts it]. */
function classify(command) {
  const cleaned = stripHeredocs(command).replace(QUOTED, "''")
  for (const cmd of commands(cleaned)) {
    const segs = stages(cmd)
    for (let i = 0; i < segs.length; i++) {
      if (isRun(words(segs[i]))) return [true, segs.slice(i + 1).some((s) => TRUNCATORS.includes(words(s)[0]))]
    }
  }
  return [false, false]
}

/** A Bash result's text: an object of stdout and stderr, or a string. */
function textOf(r) {
  if (typeof r === 'string') return r
  if (!r || typeof r !== 'object') return ''
  const parts = []
  const out = ['stdout', 'output', 'content'].map((k) => r[k]).find((v) => typeof v === 'string' && v)
  if (out) parts.push(out)
  if (typeof r.stderr === 'string' && r.stderr.trim()) parts.push('[stderr]\n' + r.stderr)
  if (r.interrupted) parts.push('[interrupted before completion]')
  return parts.join('\n')
}

const data = input()
const command = String(data?.tool_input?.command ?? '')
const [run, truncated] = classify(command)
if (data && run) {
  const event = String(data.hook_event_name ?? 'PostToolUse')
  let body = textOf(data.tool_response)
  if (event !== 'PostToolUse') {
    // A failure's fields are taken wherever output could be.
    body = [body, ...['error', 'tool_error', 'output'].map((k) => textOf(data[k]))].filter((p) => p && p.trim()).join('\n')
    if (!body.trim()) body = `(no output field found; payload keys: ${Object.keys(data).sort().join(', ')})`
  }
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const day = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  const header = ['='.repeat(72), `${day}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`, `cwd: ${data.cwd ?? ROOT}`]
  if (event !== 'PostToolUse') header.push(`EXIT NON-ZERO (${event}): the command failed. For a test run this is a failed assertion or a build error; read the output below to tell which.`)
  if (truncated) header.push('TRUNCATED: output was piped before it reached the log. This entry is a fragment, not a record of the run. Run it again without the pipe before citing any result from it.')
  const entry = [...header, '$ ' + command.replaceAll('\n', '\n  '), '-'.repeat(72), body.trim() ? body : '(no output captured)', '']
  try {
    mkdirSync(join(ROOT, 'runs'), { recursive: true })
    appendFileSync(join(ROOT, 'runs', `${day}.log`), entry.join('\n') + '\n')
  } catch {
    // A log that cannot be written never stops the work.
  }
}
