// PreToolUse: never sends the user's email address to an outside service.
// Claude can put an address into a request without meaning to (an API's
// mailto= parameter, say); this refuses it before it goes.
//
// Whose addresses: the project's git user.email, and any the user gave the
// plugin (its "private_emails" setting: CLAUDE_PLUGIN_OPTION_PRIVATE_EMAILS,
// comma-separated). With none, everything passes.
//
// Refused: a web fetch, a web search or an MCP tool whose input holds an
// address, plain, URL-encoded or its part before the @; a Bash command that
// holds one and reaches the network. A local command that only mentions it
// -- a search through a draft -- passes: nothing leaves the machine.

import { execFileSync } from 'node:child_process'
import { deny, input, ROOT, strings } from './lib.mjs'

function addresses() {
  const out = []
  try {
    const own = execFileSync('git', ['-C', ROOT, 'config', 'user.email'], { encoding: 'utf8', timeout: 5000, stdio: ['ignore', 'pipe', 'ignore'] }).trim()
    if (own) out.push(own)
  } catch {
    // No git, or no address set.
  }
  out.push(...String(process.env.CLAUDE_PLUGIN_OPTION_PRIVATE_EMAILS ?? '').split(','))
  return [...new Set(out.map((a) => a.trim()).filter((a) => a.includes('@')))]
}

// A command that reaches the network: one of these as the command a part
// of the line runs (not a folder named mail), a URL, or code that opens a
// connection.
const NETWORK = /(?:^|[\s;&|(])(curl|wget|gh|ssh|scp|sftp|rsync|nc|ncat|telnet|mail|sendmail|mutt)(?=\s|$)|https?:\/\/|git\s+push|urllib|requests\.|http\.client|fetch\(|socket/i

const escape = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const data = input()
if (data) {
  const tool = String(data.tool_name ?? '')
  const ti = data.tool_input ?? {}
  const text = [...strings(ti)].join(' ').toLowerCase()
  // Each address, plain or URL-encoded; and its part before the @ as a
  // word of its own -- not inside a path, where it is often the user's own
  // folder (/Users/<name>) or a file's name.
  const whole = addresses().flatMap((a) => [a, a.replace('@', '%40'), a.replace('@', '%2540')].map((n) => n.toLowerCase()))
  const locals = addresses().map((a) => new RegExp(`(?<![\\w./-])${escape(a.split('@')[0].toLowerCase())}(?![\\w/-])`))
  if (whole.some((n) => text.includes(n)) || locals.some((r) => r.test(text))) {
    const reason = `The user's email address must not be sent to an outside service (it is in the input of ${tool}). Take it out -- an API's mailto= parameter, say; the request works without it.`
    if (tool === 'Bash') {
      if (NETWORK.test(String(ti.command ?? ''))) deny(reason)
    } else if (tool === 'WebFetch' || tool === 'WebSearch' || tool.startsWith('mcp__')) deny(reason)
  }
}
