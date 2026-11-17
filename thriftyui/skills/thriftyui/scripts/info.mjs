#!/usr/bin/env node
// The project's facts for the thriftyui skill, as JSON: where the kit comes
// from, where its docs are, which palette the app uses, what it was made
// from, its blocks, and its stack. Run in the project's root (or given it as
// the first argument). It only reads; what it cannot find it leaves out.

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.argv[2] ?? process.cwd()
const at = (...p) => join(root, ...p)
const json = (...p) => {
  try {
    return JSON.parse(readFileSync(at(...p), 'utf8'))
  } catch {
    return undefined
  }
}
const text = (...p) => {
  try {
    return readFileSync(at(...p), 'utf8')
  } catch {
    return ''
  }
}
// A folder's components: its .tsx files named as components are (Wallet.tsx),
// not its helpers (bottomTabs.ts) or tests.
const names = (...p) => {
  try {
    return readdirSync(at(...p))
      .filter((f) => /^[A-Z]\w*\.tsx$/.test(f))
      .map((f) => f.replace(/\.tsx$/, ''))
      .sort()
  } catch {
    return []
  }
}

const pkg = json('package.json') ?? {}
const deps = { ...pkg.dependencies, ...pkg.devDependencies }
const out = {}

// The kit: the app's own copy (an npm workspace in kit/), or the package
// from npm.
const own = json('kit', 'package.json')
if (own?.name === 'thriftyui') out.kit = { from: 'workspace', path: 'kit/', version: own.version }
else if (deps.thriftyui) out.kit = { from: 'npm', version: json('node_modules', 'thriftyui', 'package.json')?.version ?? deps.thriftyui }

out.docs = ['kit/docs/llms.txt', '.thrifty-builder/docs/llms.txt'].find((p) => existsSync(at(...p.split('/')))) ?? 'https://www.thriftyui.com/llms.txt'

// The palette: Thrifty Builder's pick, else what the stylesheet imports --
// shadcn.css for a shadcn theme, Tailwind's own theme.css brought back for
// its palette, the kit's theme.css alone for Radix's scales.
const picks = json('.thrifty-builder', 'theme.json')
const css = text('src', 'index.css')
if (picks?.palette) out.palette = picks.palette
else if (/thriftyui\/shadcn\.css/.test(css)) out.palette = 'shadcn'
else if (/tailwindcss\/theme\.css/.test(css)) out.palette = 'tailwind'
else if (/thriftyui\/theme\.css/.test(css)) out.palette = 'radix'

const app = json('.thrifty-builder', 'app.json')
if (app?.template) out.template = app.template

const blocks = names('src', 'blocks')
if (blocks.length) out.blocks = blocks
if (existsSync(at('.thrifty-builder', 'library'))) out.library = names('.thrifty-builder', 'library', 'blocks')

const stack = {}
if (deps.vite) stack.bundler = 'vite'
if (deps['react-router']) stack.router = 'react-router'
if (existsSync(at('src-tauri'))) stack.desktop = 'tauri'
if (existsSync(at('extension')) || existsSync(at('manifest.json')) || existsSync(at('public', 'manifest.json'))) stack.extension = 'chrome'
for (const [k, d] of [['react', 'react'], ['tailwind', 'tailwindcss'], ['icons', 'lucide-react']]) if (deps[d]) stack[k] = k === 'icons' ? 'lucide-react' : deps[d]
if (Object.keys(stack).length) out.stack = stack

const lock = [['package-lock.json', 'npm'], ['pnpm-lock.yaml', 'pnpm'], ['yarn.lock', 'yarn'], ['bun.lock', 'bun'], ['bun.lockb', 'bun']].find(([f]) => existsSync(at(f)))
if (lock) out.packageManager = lock[1]

process.stdout.write(JSON.stringify(out, null, 2) + '\n')
