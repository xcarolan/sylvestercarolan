#!/usr/bin/env node
/**
 * Content guard for content/posts/*.md
 *
 * Catches the two formatting defects that have slipped in from automated
 * publishing (Decap CMS and postiz.audrahub.com):
 *
 *   1. Paragraphs separated by a single newline. Markdown treats a lone
 *      newline as a soft break, so the two blocks are rendered as one dense
 *      paragraph. Only a blank line starts a new paragraph.
 *   2. Images with empty alt text (see CLAUDE.md accessibility guardrails).
 *
 * Usage:
 *   node build-tools/check-content.js [dir]   # defaults to content/posts
 *   CONTENT_CHECK=warn node build-tools/check-content.js
 *
 * Exits 1 when errors are found, unless CONTENT_CHECK=warn.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const postsDir = path.resolve(rootDir, process.argv[2] || 'content/posts')
const warnOnly = process.env.CONTENT_CHECK === 'warn'

const SENTENCE_END = /[.!?]["'\u2019\u201d)\]]?$/
const STRUCTURAL_START = /^\s*([-*+>#|]|\d+[.)]|```|~~~|<!--|\[[^\]]+\]:)/

function isStructural(line) {
  if (STRUCTURAL_START.test(line)) return true
  if (/^( {4,}|\t)/.test(line)) return true // indented code block
  if (/^\s*!\[[^\]]*\]\([^)]*\)\s*$/.test(line)) return true // image-only line
  return false
}

/**
 * A prose line that begins a new sentence is a strong signal that the author
 * meant a new paragraph. A lowercase continuation is most likely a hard-wrapped
 * line inside the same paragraph, which renders correctly and is left alone.
 */
function startsNewSentence(line) {
  return /^[["'\u2018\u201c(]?[A-Z0-9]/.test(line)
}

function lineStates(lines) {
  let inFence = false
  return lines.map((line) => {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      return { blank: !line.trim(), fenced: true, prose: false }
    }
    return {
      blank: !line.trim(),
      fenced: inFence,
      prose: !inFence && !!line.trim() && !isStructural(line),
    }
  })
}

function checkFile(absPath, problems) {
  const file = path.relative(rootDir, absPath)
  const raw = fs.readFileSync(absPath, 'utf8')
  const { data, content } = matter(raw)
  const draft = data.draft === true
  const prefixLines =
    raw.slice(0, raw.length - content.length).split('\n').length - 1
  const lines = content.split(/\r?\n/)
  const states = lineStates(lines)
  const at = (i) => i + prefixLines + 1

  lines.forEach((line, i) => {
    if (states[i].fenced) return

    const mdImage = line.match(/!\[([^\]]*)\]\(([^)]*)\)/)
    if (mdImage && mdImage[1].trim() === '') {
      problems.push({
        severity: 'warning',
        file,
        line: at(i),
        message: 'Image has empty alt text',
        detail: `Add a description: ![what the image shows](${mdImage[2]})`,
      })
    }

    const imgTag = line.match(/<img\b[^>]*>/i)
    if (imgTag && !/\balt\s*=\s*["'][^"']+["']/i.test(imgTag[0])) {
      problems.push({
        severity: 'warning',
        file,
        line: at(i),
        message: 'Image has missing or empty alt text',
        detail: 'Add a non-empty alt attribute.',
      })
    }
  })

  for (let i = 1; i < lines.length; i++) {
    const prevState = states[i - 1]
    const curState = states[i]
    if (!prevState.prose || !curState.prose) continue

    const prevText = lines[i - 1].trim()
    const curText = lines[i].trim()
    if (/\S {2,}$/.test(lines[i - 1]) || /\s\\$/.test(lines[i - 1])) continue
    if (!SENTENCE_END.test(prevText)) continue
    if (!startsNewSentence(curText)) continue

    // Drafts are not published, so they warn instead of blocking the build.
    problems.push({
      severity: draft ? 'warning' : 'error',
      file,
      line: at(i),
      message: 'Paragraph runs on into the next line',
      detail:
        'A single newline is a markdown soft break, so this text merges into ' +
        'the paragraph above. Insert a blank line before it.',
      snippet: `...${prevText.slice(-50)}  <newline>  ${curText.slice(0, 60)}...`,
      draft,
    })
  }
}

const files = fs
  .readdirSync(postsDir)
  .filter((f) => f.endsWith('.md'))
  .sort()
  .map((f) => path.join(postsDir, f))

const problems = []
for (const file of files) checkFile(file, problems)

const errors = problems.filter((p) => p.severity === 'error')
const warnings = problems.filter((p) => p.severity === 'warning')

for (const p of problems) {
  const kind = p.severity === 'error' ? 'error' : 'warn '
  const draft = p.draft ? ' (draft)' : ''
  console.log(`${p.file}:${p.line}  ${kind}  ${p.message}${draft}`)
  console.log(`  ${p.detail}`)
  if (p.snippet) console.log(`  near: ${p.snippet}`)
  console.log()
}

if (problems.length === 0) {
  console.log(`Content check: ${files.length} posts look good.`)
} else {
  console.log(
    `Content check: ${errors.length} error(s), ${warnings.length} warning(s) ` +
      `across ${files.length} posts.`,
  )
}

if (errors.length > 0) {
  if (warnOnly) {
    console.log(
      '\nCONTENT_CHECK=warn is set — reporting only, build continues.',
    )
  } else {
    console.log(
      '\nFailing the build. Fix the errors above, or run with ' +
        'CONTENT_CHECK=warn to publish anyway.',
    )
    process.exit(1)
  }
}
