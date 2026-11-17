# thriftyui

Building with ThriftyUI (www.thriftyui.com) in Claude Code.

- `/thriftyui:thriftyui` -- loads by itself when Claude writes UI in a
  project that uses the `thriftyui` package. It first reads the project's
  facts (`scripts/info.mjs`: where the kit comes from, its palette, its
  blocks, its stack), then: look a part up before writing one, import it
  from its entry, colours as the kit's semantic scales, blocks copied and
  changed, UI text plain unless you have said otherwise, a
  reusable part kept with the kit's conventions.
- `/thriftyui:from-a-picture` -- a screenshot or design built with the kit:
  taken apart, matched to the kit's parts, planned with you, then built.

- The `thriftyui` MCP server (`.mcp.json`; `mcp/server.mjs`, built from
  the repository's `mcp/`) -- tools for Claude: `list`, `search` and `page`
  for the docs, to anyone; `paid_block` for a block that comes with Thrifty
  Builder, to someone who bought it, by the licence Thrifty Builder keeps on
  their Mac. Claude Code asks once before starting it. Needs Node 20 or
  later.

The docs come from the project's `kit/docs/` in an app made by Thrifty
Builder, and from www.thriftyui.com (`/llms.txt`, each page as Markdown)
anywhere else.
