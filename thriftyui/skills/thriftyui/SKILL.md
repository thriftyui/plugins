---
name: thriftyui
description: Build UI with ThriftyUI, a React kit on Radix Primitives and Radix Colors with Tailwind CSS 4 -- look a part up before writing one, import it from its entry, colours as the kit's semantic scales, blocks copied and changed, UI text plain. Use when writing or changing UI in a project that uses the thriftyui package (imports from 'thriftyui/...'), or when the user asks for a component, block, layout or theme with ThriftyUI.
allowed-tools: Bash(node "${CLAUDE_SKILL_DIR}/scripts/info.mjs")
---

# Building with ThriftyUI

The app's parts, colours and layout come from the kit, the package
`thriftyui`.

## Current project

```json
!`node "${CLAUDE_SKILL_DIR}/scripts/info.mjs"`
```

The project's facts, read as this skill loaded (run the same command again
to refresh). What each changes:

- **`kit`** -- `workspace`: the app has its own copy in `kit/`; a part the
  kit lacks, meant to be reused, is built there under `kit/CLAUDE.md`.
  `npm`: the kit is the package; the app's own parts go in `src/`.
- **`docs`** -- where every page is: the app's copy (`kit/docs/llms.txt`,
  or `.thrifty-builder/docs/llms.txt` in an app on the npm package) lists
  them, else the site's. `docs/<page>` below means that page, in whichever place.
- **`palette`** -- `radix`: only the semantic scales exist (`bg-accent-9`);
  `tailwind` or `shadcn`: Tailwind's palette is back as well. Absent: ask
  before choosing colours.
- **`template`** -- what the app was made from; its page is
  `docs/templates/<template>.md` (`extension`: `docs/extensions.md`).
- **`blocks`** -- blocks already in `src/blocks/`: change these, don't copy
  them in again. **`library`** -- the paid blocks Thrifty Builder has put in
  `.thrifty-builder/library/`: copy from there first (Blocks and layout).
- **`stack`** -- `router`, `desktop: tauri`, `extension: chrome`: where pages,
  windows and popups go. **`packageManager`** -- use it for any install.

## Parts

- **The thriftyui MCP server**, when connected (this plugin starts it), does
  the same lookups as tools: `list` and `search` find a page, `page` reads
  it, `paid_block` gets a block that comes with Thrifty Builder for someone
  who bought it. Use them in place of reading the files below.
- **Look the part up before writing UI.** `docs/llms.txt`, then its page
  (`docs/components/<name>.md`): usage, props, keys, and what it leaves to
  the app. A part the kit has is used, not written again.
  ```tsx
  <div className="fixed inset-0 grid place-items-center bg-black/50">...</div>   // wrong
  <Dialog><DialogContent>...</DialogContent></Dialog>                          // right
  ```
- **An empty list is Empty, not a centred paragraph.**
  ```tsx
  <p className="py-12 text-center text-neutral-11">No messages</p>   // wrong
  <Empty><EmptyHeader><EmptyTitle>No messages</EmptyTitle></EmptyHeader></Empty>   // right
  ```
- **A part comes styled; give it only what is the app's own.** A heading is
  Heading, at its level; a dialog's title sits bare in its DialogHeader.
  ```tsx
  <h1 className="text-2xl font-semibold tracking-tight">Accounts</h1>   // wrong
  <Heading level={1} size={2}>Accounts</Heading>                        // right
  <DialogTitle className="flex-1 self-center px-4 text-sm font-semibold">Rename</DialogTitle>   // wrong
  <DialogTitle>Rename</DialogTitle>                                                            // right
  ```
- **Import each part from its own entry.**
  `import { Dialog, DialogContent } from 'thriftyui/dialog'`.
- **A part with a Radix primitive takes all of Radix's props.** Its page
  lists only what ThriftyUI adds or changes; the rest is Radix's.
- **Setting the kit up** in a project without it: `docs/getting-started.md`
  (Tailwind first, then `thriftyui/theme.css`, and `@source` pointed at the
  kit's files).

| Need | Part |
|---|---|
| A modal, a confirm before something that cannot be undone | Dialog, AlertDialog |
| A panel from an edge on a phone | Sheet |
| A short message after an action | Toast |
| Nothing to show yet | Empty |
| Loading | Spinner, Skeleton |
| A note in the page | Callout |
| One of a few views | Tabs, SegmentedControl |
| On or off; one or several of a set | Toggle, Switch, ToggleGroup |
| A list that opens an item in its place | ListDetail |
| Pick from a list; search it | Select, Combobox, Command |
| A menu from a button or a right-click | DropdownMenu, ContextMenu |
| A labelled field with its error | Field, Form |
| Rows of data | Table, DataTable, Pagination |
| A date | Calendar, DatePicker |
| A page with columns; sections along the bottom on a phone | Page, Column, NavBar |
| A growing list of posts | Feed |
| A chat | Conversation, Message, Composer (`thriftyui/chat`) |

## Colours and theme

- **Semantic scales, never a fixed colour.** `neutral`, `accent`, `danger`,
  `success`, `warning`, 12 steps each, each step for a use
  (`docs/colors/radix.md`).
  ```tsx
  <Heart className="text-[#ff4d6d]" />  // wrong: a fixed colour
  <Heart className="text-danger-9" />   // right
  ```
- **A state changes the text or icon, never adds a box.** Chosen, current,
  pressed: semibold and the chosen colour; nothing drawn behind it.
  ```tsx
  className="aria-[current=page]:bg-neutral-5"                                         // wrong
  className="aria-[current=page]:font-semibold aria-[current=page]:text-chosen-text"   // right
  ```
- **Hover changes the text, not the ground.**
  ```tsx
  className="hover:bg-neutral-3"     // wrong
  className="hover:text-neutral-12"  // right
  ```
- **The palette is the user's.** One of three, never mixed: Radix's scales,
  Tailwind's palette, or a shadcn theme (`docs/guides/theming.md`), as
  `palette` above says. `bg-rose-500` works only in a Tailwind or shadcn
  theme. To change the theme, ask; don't rewrite it.

## Blocks and layout

- **A block is copied, not rebuilt.** Its page (`docs/blocks/<name>.md`)
  holds its whole source and what the app connects it to; copy it into
  `src/blocks/` and change it there.
  ```
  Writing a music player from scratch "like the Music block"   // wrong
  docs/blocks/music.md's source into src/blocks/Music.tsx      // right
  ```
- **A paid block comes from the library.** Its page has no source. The MCP
  server's `paid_block` gives it, or says where it is. When
  `library` above lists it, it is in `.thrifty-builder/library/`: the tier's
  blocks (`blocks/`) with the files they import (`studio/`,
  `docs/colors/`). Copy the block and those files into `src/`, keep their
  paths relative to each other, and change them there. The library folder
  is left out of git; what goes into `src/` is the app's.
- **A layout is a template.** `docs/templates/<name>.md`, made of the kit's
  Page, and Column where it has columns.

## UI text

What people read on screen: buttons, headings, labels, empty states,
errors, notifications. The person's own wording comes first; these are
the defaults where they have not said.

- **A button says what it does.**
  ```tsx
  <Button>Let's go!</Button>      // wrong
  <Button>Save changes</Button>   // right
  ```
- **A heading names the thing.**
  ```tsx
  <h1>Your financial journey starts here</h1>   // wrong
  <h1>Accounts</h1>                              // right
  ```
- **An empty state says what is missing and what to do; an error, what
  happened and what to try.**
  ```tsx
  <EmptyTitle>Nothing to see here... yet!</EmptyTitle>                     // wrong
  <EmptyTitle>No messages</EmptyTitle>
  <EmptyDescription>Messages you send and receive appear here.</EmptyDescription>  // right
  ```
  ```tsx
  <ToastTitle>Oops! Something went wrong.</ToastTitle>      // wrong
  <ToastTitle>Not saved</ToastTitle>
  <ToastDescription>The connection dropped. Try again.</ToastDescription>  // right
  ```
- **No emoji, exclamation marks or filler** ("seamlessly", "effortlessly",
  "unlock", "supercharge") in what the app shows.
- **The standard name for a thing,** the one its users already know:
  Settings, not "Control Center"; Sign in, not "Enter the portal".

## Where a new part goes

- Only for this app: `src/`.
- Reusable, and the kit lacks it: where `kit` above is `workspace`,
  `kit/src/`, under `kit/CLAUDE.md`, seen in `kit/playground/`, then used
  from the app; otherwise the project's own shared components,
  following the kit's conventions (Radix first, the semantic scales, a
  part's `className` last).

## Checks

- `npm run typecheck` passes.
- The page seen working -- Thrifty Builder's Preview (App), or the app's dev
  server in a browser -- light and dark, and at a phone's width; the keys
  its parts' pages list, pressed.
