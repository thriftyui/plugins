// PostToolUse (Write, Edit): a source file grown past LIMIT lines -- a sign it does more than one
// job -- is pointed out to Claude, with what to do: split it by job, each part in a file of its
// own, re-checked as it moves. It never refuses; the file is written as asked. Generated,
// vendored and lock files are left alone.

import { existsSync, readFileSync } from 'node:fs'
import { input } from './lib.mjs'

const LIMIT = 600
const SOURCE = /\.(ts|tsx|js|jsx|mjs|cjs|rs|py|swift|go|kt|java|rb|css|scss|vue|svelte)$/i
const SKIP = /(^|\/)(node_modules|dist|build|target|vendor|\.next|coverage)\/|\.min\.|(^|\/)[^/]*lock[^/]*$|\.d\.ts$/i

const data = input()
const path = data?.tool_input?.file_path
if (typeof path === 'string' && SOURCE.test(path) && !SKIP.test(path) && existsSync(path)) {
  const lines = readFileSync(path, 'utf8').split('\n').length
  if (lines > LIMIT) {
    const say =
      `[baseline] ${path} is ${lines} lines, past ${LIMIT}: likely more than one job in one file. ` +
      'Before adding more, split it by job -- a part, a hook, a set of rules -- into files of their own, ' +
      "each move re-checked by the project's tests or checks; say so to the user if it cannot be split now."
    process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: say } }))
  }
}
