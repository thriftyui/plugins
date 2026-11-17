// What the baseline's hooks share: reading the hook's input, the project's
// folder, and refusing a tool call with a reason. Claude Code passes a
// hook its input as JSON on stdin; a PreToolUse hook refuses a call by
// printing hookSpecificOutput with permissionDecision "deny"
// (code.claude.com/docs/en/hooks.md, PreToolUse decision control).

import { readFileSync } from 'node:fs'

/** The hook's input, or null when it cannot be read: a hook that cannot
 *  read its input leaves the call to the normal permission flow. */
export function input() {
  try {
    return JSON.parse(readFileSync(0, 'utf8'))
  } catch {
    return null
  }
}

/** The project's folder: Claude Code's CLAUDE_PROJECT_DIR, else the
 *  folder the hook runs in. */
export const ROOT = process.env.CLAUDE_PROJECT_DIR || process.cwd()

/** Refuses the tool call, telling Claude why. */
export function deny(reason) {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: reason } }))
  process.exit(0)
}

/** Every string inside a value, however deep. */
export function* strings(x) {
  if (typeof x === 'string') yield x
  else if (Array.isArray(x)) for (const v of x) yield* strings(v)
  else if (x && typeof x === 'object') for (const v of Object.values(x)) yield* strings(v)
}
