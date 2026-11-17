// PreToolUse (Bash): refuses commands that delete. Deletion is the user's:
// Claude moves what it would delete to .archive/ and lists it for the user
// to review; the user deletes. This is the catch behind that rule, whatever
// Claude decides.

import { deny, input } from './lib.mjs'

const REASON =
  "Deletion is disabled here. Move the file to .archive/ instead, and only with the user's sign-off. To delete for good, the user runs the command themselves."

// Deleting commands, matched as the command a part of the line runs -- a
// boundary before and a space or the end after -- so ./farm or rm.txt pass.
const B = String.raw`(?:^|[\s;&|(])`
const PATTERNS = [
  String.raw`${B}(?:/usr/bin/|/bin/|command\s+|\\)?rm(?:\s|$)`,
  String.raw`${B}rmdir(?:\s|$)`,
  String.raw`${B}unlink(?:\s|$)`,
  String.raw`${B}git\s+rm(?:\s|$)`,
  String.raw`${B}find\s.*(?:-delete|-execdir\s+rm|-exec\s+rm)`,
  String.raw`${B}shred(?:\s|$)`,
  String.raw`${B}srm(?:\s|$)`,
  String.raw`${B}trash(?:\s|$)`,
  String.raw`${B}xargs\s+(?:-\S+\s+)*(?:/usr/bin/|/bin/)?rm(?:\s|$)`,
].map((p) => new RegExp(p))

const data = input()
const cmd = String(data?.tool_input?.command ?? '')
if (PATTERNS.some((p) => p.test(cmd))) deny(REASON)
