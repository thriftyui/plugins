---
name: init
description: Set a project up for the baseline -- handoff.md, journals/, research/, ideas/, a CLAUDE.md if it has none, and Claude Code's auto memory turned off with deleting commands denied in .claude/settings.json. Use when the user asks to set up the baseline, or when the baseline's session start says the project is not set up and the user agrees.
---

# Set a project up for the baseline

What it writes changes the project, so: list the files below, say which
already exist (those are left alone, never overwritten), and wait for the
user's go. Then write only the missing ones.

1. **`handoff.md`**:

   ```
   # Handoff

   ## Project

   <the project's name>: <one line on what it is, from its README or the
   user>. What it holds: `CLAUDE.md`.

   ## Current state

   - Set up for the baseline on <today>; nothing filed yet.
   - Last entry: none yet (`journals/journal-01.md`).

   ## Standing decisions

   (none yet)
   ```

2. **`journals/journal-01.md`** -- `# <name> journal, volume 01` -- and
   **`journals/journal-index.md`**:

   ```
   # Journal index

   | Volume | Dates | File | Entries |
   |---|---|---|---|
   | 01 | <today> -- open | journals/journal-01.md | |
   ```

3. **`research/README.md`** -- "Investigations: a question, its sources
   (the maker's own first, with a locator and how much of it was read),
   and what was found." **`ideas/README.md`** -- "The user's ideas as they
   arrived, verbatim and dated, before anything is built from them."

4. **`CLAUDE.md`**, only if there is none: the project's name and what it
   is, its stack and commands as found in the project (package.json, a
   README), its files, and a line: "How Claude works here: the baseline
   plugin (its rules load at every start), and `.claude/rules/` for this
   project's own."

5. **`.claude/settings.json`** -- merged into what is there, never
   replacing it: `"autoMemoryEnabled": false` (state is kept in the files
   above), and in `permissions.deny` the commands that delete or rewrite
   history -- `Bash(rm *)`, `Bash(rmdir *)`, `Bash(git rm *)`,
   `Bash(git reset --hard*)`, `Bash(git push --force*)`,
   `Bash(git clean -f*)`, `Bash(git branch -D*)`,
   `Bash(git checkout -- *)`. A plugin cannot set these; the project's
   settings do.

6. **`.gitignore`** -- ask whether run logs belong in git; if not, add
   `runs/`.

Then say what was written, and that the next session starts with the
handoff in front of Claude.
