---
name: investigation
description: How to find something out and file it in research/ -- a question, its sources with locators and how much was read, findings apart from guesses. Use when looking something up that work will rest on (a library's behaviour, a service's terms, a technique), when building from a real thing's documentation, or when writing or reading a file in research/.
---

# Investigation

How to find something out, whatever it is for: how a mechanism works, a
technique outside what Claude knows, which library fits, what a service
allows. It is "claims about the world are checked" put to work. When a
question needs something run to answer it, it is run and its output logged
in `runs/`. It is also where the sources for anything built from a real
thing are filed.

## A question, written down

Each investigation is a file in `research/`, starting from the question in
plain words and why it is being asked (which work it serves). A question
that drifts becomes a new file; the first one stays as asked.

## Sources

Every source is recorded where it is used, with its locator (page,
section, URL and date), and with how much of it was read: `full text`,
`sections: <which>`, `abstract only`, or `second hand: via <source>`.
`second hand` supports nothing about what the source says. A source
recalled and never opened is not a source: it is opened, or the claim
waits. Claude's own recollection is not a source at all.

## Findings apart from guesses

A finding cites the source it rests on. A guess is written as one and
marked `[CONJECTURE]`. Where sources disagree, both are kept with their
locators and the disagreement is recorded as a finding; it is not settled
by choosing the more convenient one.

## Open until answered

A question that could not be answered this session stays marked `open`,
with what was tried (the queries, the sources consulted) and what would
settle it. "Nothing found" is recorded with the search that found nothing.

## What it is not

Not a licence to stop the work to search. The user's direction decides
when a question is worth investigating; the search does not decide the
direction.
