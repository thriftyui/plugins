// PreToolUse (Agent, Task, Workflow): refuses subagents and workflows. The
// work is done in the session itself, where the person sees it, and is not
// handed to other agents. A PreToolUse hook matches any tool name, Agent
// and Workflow among them, and refuses a call with permissionDecision
// "deny" (code.claude.com/docs/en/hooks.md, PreToolUse); Task is the Agent
// tool's name before Claude Code 2.1.63 (code.claude.com/docs/en/sub-agents.md).

import { deny } from './lib.mjs'

deny('Subagents and workflows are not used here. Do the work in this session, with your own tools.')
