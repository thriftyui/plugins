---
name: from-a-picture
description: Builds a component, a block or a whole screen from a picture of an existing app or design, with ThriftyUI. Use when the user gives a screenshot or image and asks to build it, or something like it.
---

# From a picture

A picture of an app or a design, built with the kit. Work in this order;
show the user the plan (step 6) and wait for their go before building.

The kit's docs: `docs/<page>` below is `kit/docs/<page>` in an app made by
Thrifty Builder, which has its own copy of the kit in `kit/`; in any other
project it is the ThriftyUI site's page, `https://www.thriftyui.com/<page>`
(the list: `https://www.thriftyui.com/llms.txt`; every page is Markdown).

## 1. Look, and name what it is

Read the picture. Say what it is:

- a **component** -- one control or part (a date field, a card);
- a **block** -- a part of a screen made of several components (a sign-in
  form, a music player);
- a **screen** -- a layout holding several blocks.

What it is decides where the work goes (step 4).

## 2. Take it apart

By area, top to bottom and start to end. For each area: what is in it,
and what it does -- what can be pressed, typed in, scrolled, opened; what
only shows something.

A picture cannot show what a screen reader needs. For each piece, note
it: counts said in words ("921 replies"), each image described, each
button with an icon alone named, no state shown by colour alone, the
headings and landmarks of the screen.

## 3. Match each piece to the kit

Read `docs/llms.txt`, then the page of each part or block that may
fit. Write a table:

| Area | Piece | Kit part or block | Note |

A part the kit has is used. A block (`docs/blocks/`) is copied into
`src/blocks/` and changed there.

Icons are the kit's set, Lucide (lucide-react): match each icon in the
picture to a Lucide icon by name (lucide.dev), not drawn or imported from
elsewhere.

Parts keep the kit's look: where the picture's look differs (a column's
ground and edge, how a chosen row is marked, a button's shape), say so in
the table's Note. Restyle by className to the picture's look only when the
user asks for it.

## 4. List the gaps, and where each goes

A gap is a piece no part or block covers. For each:

- its pattern: the W3C ARIA Authoring Practices pattern it follows
  (the docs name many; the W3C's site for the rest), or the Radix
  primitive it wraps;
- where it goes: when other screens or apps would want it, the kit --
  `kit/src/`, under `kit/CLAUDE.md`, in an app made by Thrifty Builder; in
  any other project, the project's own folder of shared components; `src/`
  when only this app would.

## 5. The layout, the theme, what is not shown, the identity

- The layout: the template it is closest to (`docs/templates/`) and
  what differs.
- The theme: light or dark as the picture is; the nearest neutral and
  accent among the kit's semantic scales (`docs/colors/radix.md`), a
  Tailwind theme (`docs/colors/tailwind.md`), or, for a picture of a
  shadcn app, a shadcn theme (`docs/colors/shadcn.md`); set as
  `docs/guides/theming.md` says. Name what still differs.
- What the picture does not show -- a phone's layout, the other pages its
  navigation names, hover, focus, empty, loading and error states -- is
  invented: say so in the plan, and list it in the report. The code says
  what it does, not how it came about.
- The original's names, logos, marks, and real people's and companies'
  content are the original's. Build the structure; use the app's own name
  and a placeholder mark, and invented sample content in plain words (the
  `thriftyui` skill, "UI text").

## 6. The plan, to the user

The table, the gaps and where each goes, the layout, the theme, what
will be invented, and the order of building. File it in
`research/<what is being built>.md` (or where the project keeps its plans),
so a later session builds on the file, then show it to the user. Wait for go.

## 7. Build, in this order

1. Each new shared part. Where the app has its own copy of the kit (`kit`
   is `workspace` in the `thriftyui` skill's facts): `kit/src/`, under
   `kit/CLAUDE.md` (its sources filed in `research/`, its test, its
   export), seen in `kit/playground/`; and its page, `kit/docs/components/<name>.md`, as the
   other pages are (what it is, its usage, its parts and props, its keys),
   with its line in `kit/docs/llms.txt` under Components -- so the next
   session finds it. In any other project: the project's shared components
   folder, following the kit's conventions (Radix first, the semantic
   scales, `className` last).
2. Each block: `src/blocks/`; its sample content in `src/sample/`, one
   file per kind.
3. The screen: `src/`, from the blocks and the kit's parts.

## 8. Check

- `npm run typecheck`; `npm test -w kit` when an app's own kit changed.
- Each new part's roles and keys, as its pattern lists them.
- What step 2 noted for a screen reader, done: counts in words, images
  described, icon buttons named, nothing by colour alone.
- The screen running -- Thrifty Builder's Preview (App), or the app's dev
  server in a browser -- light and dark, and at a phone's width.
- Beside the picture: what differs, and why.

## 9. Report

What was built (the table, updated); what differs from the picture and
why, the kit's look among it; what was invented; what the screen needs
from the app's server to do real work -- posting, saving, loading more,
searching -- as a list of each function, what it does, and what it would
call; and what is left. Add the report to the research file.
