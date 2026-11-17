# ThriftyUI's plugins for Claude Code

A Claude Code plugin marketplace with two plugins, free (MIT):

- **thriftyui** -- building with ThriftyUI, a React UI kit on Radix and
  Tailwind CSS: Claude looks each part up in the kit's docs, uses its
  semantic colour scales and blocks, and builds a screen from a picture.
- **baseline** -- a working discipline for any project: claims checked
  against sources or output, state kept in `handoff.md` and a journal from
  session to session, nothing deleted or sent out by accident.

Install, in Claude Code:

    /plugin marketplace add thriftyui/plugins
    /plugin install thriftyui@thriftyui-plugins
    /plugin install baseline@thriftyui-plugins

Either can be installed without the other. Thrifty Builder copies both
into each app it makes, in its `.claude/skills/`, where Claude Code loads
them as the project's own.

Each plugin's README says what it holds. The baseline's hooks need Node.js.
