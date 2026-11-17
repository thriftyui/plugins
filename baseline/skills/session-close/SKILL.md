---
name: session-close
description: File the session's journal entry and update handoff.md at session end. Use when the user says to wrap up, close, end, or hand off the session, or asks to file the journal.
---

# Session close

Two writes: append the journal entry, then update `handoff.md`.

Run when the user says yes to closing, or asks for it. Before the writes,
list what this session started that still runs -- dev servers, watchers,
background shells, with their ports -- and offer to stop them; leave alone
what another session or project started.

1. **Audit first.** Re-check every status claim against output actually
   seen this session: a computed or tested result against `runs/` (with no
   run in the log it files as `open`, whatever was said in conversation);
   anything shown working against the check that showed it. What was not
   seen is not filed as done.
2. **Append to the open journal volume**, the highest-numbered
   `journals/journal-NN.md`. Newest last. Never edit or reorder prior
   entries; a correction is a new entry. Then add the entry's anchor to
   that volume's line in `journals/journal-index.md`.

   **A new volume** starts when the open one has passed 400 lines: mark
   the old volume's row closed with its last date in the index, create
   `journal-NN+1.md` with a one-line heading, add its row as open, and file
   the entry there. The index table:

   ```
   | Volume | Dates | File | Entries |
   |---|---|---|---|
   | 01 | 2026-10-01 -- 2026-10-08 (closed) | journals/journal-01.md | `2026-10-01`, ... |
   | 02 | 2026-10-08 -- open | journals/journal-02.md | ... |
   ```

```
## YYYY-MM-DD -- <subject>

Three sentences at most: what was made, found or decided; for a
computed result, the numbers with the parameters that produced them
and the label.

- <path> -- one clause on what it holds now
```

Same-day entries get a letter suffix (`YYYY-MM-DD-b` for the second; an
existing unlettered entry counts as `a` and is left alone). What earns a
line is what exists nowhere else: numbers with their parameters, negative
results, a frame discarded and why, a decision the user made. Not in
entries: code-diff recitation, pass language for output not seen.

3. **Update `handoff.md`** in two parts:
   - **Current state -- rewritten from scratch:** open line, next task,
     blocked if anything is, pointer to the entry just filed. Carrying
     stale state forward is the failure mode; the prior state is in the
     entry that just landed.
   - **Standing decisions -- carried forward:** decisions the user made
     that still hold, one short paragraph each with its date. A decision
     made this session is added; one the user has reversed moves to
     `.archive/` with a line in `.archive/PENDING-USER-REVIEW.md`, never
     silently dropped.

4. Confirm in one line: entry anchor plus next task.

Not part of closing: running one more test, editing prior entries,
archiving anything the user did not ask to archive.
