# Writing Effective CLAUDE.md Files

Distilled from Anthropic's published documentation (fetched 2026-02-23). Raw extracts in `anthropic-docs-raw-extract.md`. Nothing here that isn't backed by those docs.

---

## The One Constraint

Context window fills up fast. Performance degrades as it fills. Everything below follows from this.

## File Discovery

- Claude recurses **up** from cwd toward `/`, loading every `CLAUDE.md` and `CLAUDE.local.md` at launch
- Child directory CLAUDE.md files load **on demand** — only when Claude reads files in that subtree
- `.claude/rules/*.md` auto-load at same priority as `.claude/CLAUDE.md`
- Rules can be path-scoped via YAML frontmatter: `paths: ["src/api/**/*.ts"]`
- Import syntax: `@path/to/file`, resolves relative to the importing file, max 5 hops

## Precedence

**"More specific instructions take precedence over broader ones."**

From most to least specific:
1. Child directory CLAUDE.md (on demand)
2. `CLAUDE.local.md` (personal, project-specific)
3. `./CLAUDE.md` or `./.claude/CLAUDE.md` (project, shared)
4. `.claude/rules/*.md` (same level as project CLAUDE.md)
5. Parent directory CLAUDE.md files (loaded upward from cwd)
6. `~/.claude/CLAUDE.md` (user-level, all projects)
7. Managed policy (org-wide)

Overall hierarchy: CLAUDE.md > settings.json > system prompt.

## What Goes In

Things Claude **can't infer from reading your code**:

- Build/test/lint commands
- Code style rules that differ from language defaults
- Branch naming, PR conventions, repo etiquette
- Architectural decisions specific to the project
- Environment quirks (required env vars, setup steps)
- Common gotchas and non-obvious behaviors

## What Stays Out

- Anything Claude can figure out by reading code
- Standard language conventions it already knows
- Detailed API docs (link instead)
- Information that changes frequently
- Long explanations or tutorials
- File-by-file codebase descriptions
- Self-evident practices ("write clean code")

## How to Write Directives

**Be specific.** "Use 2-space indentation" not "Format code properly."

**Explain why.** `NEVER use ellipses` is less effective than explaining the TTS reason behind it. Claude generalizes from the explanation.

**Bullet points under headings.** One directive per bullet. Group related directives under descriptive markdown headings.

**Prefer general over prescriptive.** "Think thoroughly" often beats a hand-written step-by-step plan. Claude's reasoning frequently exceeds what you'd prescribe.

**Tell it what to do, not what not to do.** "Write smoothly flowing prose paragraphs" works better than "Do not use markdown."

## On Emphasis

Anthropic says: emphasis markers like "IMPORTANT" or "YOU MUST" can improve adherence.

But also: Opus 4.5/4.6 are more responsive to instructions than previous models. Aggressive language ("CRITICAL: You MUST") can cause **overtriggering**. Dial back to normal language where previous models needed shouting.

No published evidence that bold, caps, or heading levels systematically change instruction weight.

## On Length

This is the load-bearing finding:

- **"Bloated CLAUDE.md files cause Claude to ignore your actual instructions."**
- **"If Claude keeps doing something you don't want despite having a rule, the file is probably too long and the rule is getting lost."**
- **"If Claude asks questions answered in CLAUDE.md, the phrasing might be ambiguous."**

The test for every line: "Would removing this cause Claude to make mistakes?" If not, cut it.

Fix for over-specified files: ruthlessly prune. If Claude already does it correctly without the instruction, delete it or convert it to a hook.

## CLAUDE.md vs Skills

CLAUDE.md loads every session. Skills load on demand.

Domain knowledge or workflows that are only sometimes relevant should be skills, not CLAUDE.md. Skill descriptions sit in context (2% of window budget); full content loads only when invoked.

## Context Survival

- Instructions from early in conversation can get lost during compaction
- Persistent rules belong in CLAUDE.md, not conversation
- Add a "Compact Instructions" section to CLAUDE.md to control what survives compaction
- `/clear` between unrelated tasks to reset context

## Structure Recommendations

No required format. Keep it short, human-readable.

```markdown
# Code style
- Use ES modules (import/export), not CommonJS (require)
- Destructure imports when possible

# Workflow
- Typecheck after code changes
- Run single tests, not the full suite
```

For larger projects, use `.claude/rules/` with one file per topic:
```
.claude/rules/
├── code-style.md
├── testing.md
└── security.md
```

Path-scope rules that only apply to specific file types. Leave rules without `paths` frontmatter for unconditional loading.

## Maintenance

Treat CLAUDE.md like code:
- Review when things go wrong
- Prune regularly
- Test changes by observing whether Claude's behavior actually shifts
