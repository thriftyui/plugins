# baseline

A working discipline for Claude Code, for any project.

- **Rules, at every start.** A start-of-session hook gives Claude the rules
  (`rules/core.md`: claims checked against a source or output that was
  read, the model's knowledge treated as dated, plans before multi-file
  work, nothing removed without your sign-off), then the project's
  `handoff.md` and the last journal entry.
- **Sessions.** `/baseline:session-close` files the session's journal
  entry and rewrites the handoff; `/baseline:init` sets a project up
  (handoff, journal, `research/`, `ideas/`, auto memory off and deleting
  commands denied in `.claude/settings.json`), asking first.
- **Skills.** `investigation` (research with sources and locators),
  `ideas` (your ideas kept verbatim), and `protect-people` (users, developers,
  sensitive data and intellectual property, before an app has real users).
- **Safety catches**, hooks that act whatever Claude decides: no deleting
  commands, no emoji in files, no subagents or workflows, your home folder kept out of requests and
  commits, your email address never sent to a web
  fetch, a search or an MCP tool, a source file past 600 lines pointed out
  so it is split by job before it grows into a monolith, and test, build,
  typecheck and lint runs logged with their output in `runs/`.

Its one setting, `private_emails`, lists addresses to keep private besides
your git `user.email` (`/plugin configure baseline@thriftyui-plugins`).

The hooks need Node.js; without it the start-of-session hook says so.
