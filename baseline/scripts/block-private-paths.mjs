// PreToolUse: keeps the user's home folder, and with it the name on their account, out of what
// leaves the machine or goes into a project's history. A path like /Users/<name>/... says who
// someone is, and Claude can paste one into a request or a file without meaning to.
//
// Refused: a web fetch, a web search or an MCP tool whose input holds it (an upload tool takes a
// local path to read, so it passes); curl, wget or gh with it in what they send; git commit when
// it is in the lines being added or the message; git push when it is in what is not yet pushed.
// A local command that only mentions it passes, as does a local path curl or gh only reads from
// or writes to.

import { execFileSync } from 'node:child_process'
import { homedir, userInfo } from 'node:os'
import { deny, input, ROOT, strings } from './lib.mjs'

const escape = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function homePattern() {
  const parts = new Set([escape(homedir())])
  let name = ''
  try {
    name = userInfo().username
  } catch {
    // No account name to go on: the folder alone.
  }
  if (name) for (const base of ['/Users/', '/home/', 'C:\\\\Users\\\\', 'C:/Users/']) parts.add(escape(base.replaceAll('\\\\', '\\')) + escape(name))
  return new RegExp(`(?:${[...parts].join('|')})(?![\\w.-])`, 'i')
}

const HOME = homePattern()

/** What curl, wget or gh only read from or write to here, taken out of the command: moving to a
 *  folder, files named with an option. What is left is what they send. */
const withoutLocalPaths = (command) =>
  command
    .replace(/(?:^|[;&|]\s*)cd\s+("[^"]*"|'[^']*'|\S+)/g, ' ')
    .replace(/\s(?:-C|--output|-o|-O|--output-document|--body-file|--notes-file|--repo-dir|--upload-file|-T|--cacert|--cert|--key|--config|-K)[\s=]+("[^"]*"|'[^']*'|\S+)/g, ' ')
    .replace(/\s[^\s=]*=?@("[^"]*"|'[^']*'|\S+)/g, ' ')
    .replace(/>{1,2}\s*("[^"]*"|'[^']*'|\S+)/g, ' ')

const git = (cwd, ...args) => {
  try {
    return execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8', timeout: 10000, stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 })
  } catch {
    return ''
  }
}

/** The files whose added lines in a diff hold the home folder. */
function filesHolding(diff) {
  const found = new Set()
  let file = ''
  for (const line of diff.split('\n')) {
    if (line.startsWith('+++ ')) file = line.slice(4).replace(/^b\//, '')
    else if (line.startsWith('+') && HOME.test(line)) found.add(file)
  }
  return [...found]
}

const data = input()
if (data) {
  const tool = String(data.tool_name ?? '')
  const ti = data.tool_input ?? {}
  if (tool === 'WebFetch' || tool === 'WebSearch' || (tool.startsWith('mcp__') && !/upload/i.test(tool))) {
    if (HOME.test([...strings(ti)].join(' ')))
      deny(`The user's home folder must not be sent to an outside service (it is in the input of ${tool}). Take it out, or use a path from the project.`)
  } else if (tool === 'Bash') {
    const command = String(ti.command ?? '')
    const cwd = command.match(/^\s*cd\s+("[^"]+"|'[^']+'|\S+)\s*&&/)?.[1]?.replace(/^["']|["']$/g, '') ?? (typeof data.cwd === 'string' ? data.cwd : ROOT)
    if (/(?:^|[\s;&|(])(curl|wget|gh)(?=\s)/.test(command) && HOME.test(withoutLocalPaths(command))) {
      deny("The user's home folder must not be sent to an outside service (it is in what this command sends). Take it out, or use a path from the project.")
    }
    if (/(?:^|[\s;&|(])git(?:\s+-\S+(?:\s+\S+)?)*\s+commit(?=\s|$)/.test(command)) {
      const all = /\scommit(?:\s+\S+)*?\s+(?:-a\b|-am\b|--all\b)/.test(command)
      const files = filesHolding(git(cwd, 'diff', all ? 'HEAD' : '--cached', '-U0'))
      if (files.length) deny(`The user's home folder is in what this commit adds: ${files.slice(0, 8).join(', ')}. Use a path from the project, or ~, and stage it again.`)
      if (HOME.test(withoutLocalPaths(command))) deny("The user's home folder is in this commit's message. Take it out.")
    }
    if (/(?:^|[\s;&|(])git(?:\s+-\S+(?:\s+\S+)?)*\s+push(?=\s|$)/.test(command)) {
      const files = filesHolding(git(cwd, 'diff', '@{upstream}..HEAD', '-U0'))
      if (files.length) deny(`The user's home folder is in what this push would send: ${files.slice(0, 8).join(', ')}. Take it out in a new commit first.`)
    }
  }
}
