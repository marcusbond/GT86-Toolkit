# Anthropic Documentation: CLAUDE.md, Memory, Configuration — Raw Extract

Fetched 2026-02-23 from `code.claude.com/docs/en/`. All content below is extracted verbatim from Anthropic's published documentation. URLs that previously lived at `docs.anthropic.com` now redirect (301) to `code.claude.com`.

---

## Source 1: Memory (CLAUDE.md reference)

**URL:** https://code.claude.com/docs/en/memory

### Two kinds of memory

Claude Code has two kinds of memory that persist across sessions:

- **Auto memory**: Claude automatically saves useful context like project patterns, key commands, and your preferences. This persists across sessions.
- **CLAUDE.md files**: Markdown files you write and maintain with instructions, rules, and preferences for Claude to follow.

Both are loaded into Claude's context at the start of every session, though auto memory loads only the first 200 lines of its main file.

### Memory type hierarchy

| Memory Type | Location | Purpose | Use Case Examples | Shared With |
|---|---|---|---|---|
| **Managed policy** | macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md`, Linux: `/etc/claude-code/CLAUDE.md`, Windows: `C:\Program Files\ClaudeCode\CLAUDE.md` | Organization-wide instructions managed by IT/DevOps | Company coding standards, security policies, compliance requirements | All users in organization |
| **Project memory** | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Team-shared instructions for the project | Project architecture, coding standards, common workflows | Team members via source control |
| **Project rules** | `./.claude/rules/*.md` | Modular, topic-specific project instructions | Language-specific guidelines, testing conventions, API standards | Team members via source control |
| **User memory** | `~/.claude/CLAUDE.md` | Personal preferences for all projects | Code styling preferences, personal tooling shortcuts | Just you (all projects) |
| **Project memory (local)** | `./CLAUDE.local.md` | Personal project-specific preferences | Your sandbox URLs, preferred test data | Just you (current project) |
| **Auto memory** | `~/.claude/projects/<project>/memory/` | Claude's automatic notes and learnings | Project patterns, debugging insights, architecture notes | Just you (per project) |

CLAUDE.md files in the directory hierarchy above the working directory are loaded in full at launch. CLAUDE.md files in child directories load on demand when Claude reads files in those directories. Auto memory loads only the first 200 lines of `MEMORY.md`. **More specific instructions take precedence over broader ones.**

Note: CLAUDE.local.md files are automatically added to .gitignore.

### Auto memory

Auto memory is a persistent directory where Claude records learnings, patterns, and insights as it works. Unlike CLAUDE.md files that contain instructions you write for Claude, auto memory contains notes Claude writes for itself based on what it discovers during sessions.

Auto memory is being rolled out gradually. Opt in by setting `CLAUDE_CODE_DISABLE_AUTO_MEMORY=0`.

**What Claude remembers:**

- Project patterns: build commands, test conventions, code style preferences
- Debugging insights: solutions to tricky problems, common error causes
- Architecture notes: key files, module relationships, important abstractions
- Your preferences: communication style, workflow habits, tool choices

**Where auto memory is stored:**

Each project gets its own memory directory at `~/.claude/projects/<project>/memory/`. The `<project>` path is derived from the git repository root, so all subdirectories within the same repo share one auto memory directory. Git worktrees get separate memory directories. Outside a git repo, the working directory is used instead.

```
~/.claude/projects/<project>/memory/
├── MEMORY.md          # Concise index, loaded into every session
├── debugging.md       # Detailed notes on debugging patterns
├── api-conventions.md # API design decisions
└── ...                # Any other topic files Claude creates
```

MEMORY.md acts as an index of the memory directory. Claude reads and writes files in this directory throughout your session, using MEMORY.md to keep track of what's stored where.

**How it works:**

- The first 200 lines of MEMORY.md are loaded into Claude's system prompt at the start of every session. Content beyond 200 lines is not loaded automatically, and Claude is instructed to keep it concise by moving detailed notes into separate topic files.
- Topic files like debugging.md or patterns.md are not loaded at startup. Claude reads them on demand using its standard file tools when it needs the information.
- Claude reads and writes memory files during your session, so you'll see memory updates happen as you work.

**Environment variable control:**

```bash
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=1  # Force off
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=0  # Force on
```

### CLAUDE.md imports

CLAUDE.md files can import additional files using `@path/to/import` syntax:

```
See @README for project overview and @package.json for available npm commands for this project.

# Additional Instructions
- git workflow @docs/git-instructions.md
```

Both relative and absolute paths are allowed. Relative paths resolve relative to the file containing the import, not the working directory.

For private per-project preferences that shouldn't be checked into version control, prefer `CLAUDE.local.md`: it is automatically loaded and added to `.gitignore`.

If you work across multiple git worktrees, `CLAUDE.local.md` only exists in one. Use a home-directory import instead so all worktrees share the same personal instructions:

```
# Individual Preferences
- @~/.claude/my-project-instructions.md
```

Warning: The first time Claude Code encounters external imports in a project, it shows an approval dialog listing the specific files. Approve to load them; decline to skip them. This is a one-time decision per project: once declined, the dialog does not resurface and the imports remain disabled.

To avoid potential collisions, imports are not evaluated inside markdown code spans and code blocks.

Imported files can recursively import additional files, with a max-depth of 5 hops.

You can see what memory files are loaded by running `/memory` command.

### How Claude looks up memories

Claude Code reads memories recursively: starting in the cwd, Claude Code recurses up to (but not including) the root directory `/` and reads any CLAUDE.md or CLAUDE.local.md files it finds. This is especially convenient when working in large repositories where you run Claude Code in `foo/bar/`, and have memories in both `foo/CLAUDE.md` and `foo/bar/CLAUDE.md`.

Claude will also discover CLAUDE.md nested in subtrees under your current working directory. Instead of loading them at launch, they are only included when Claude reads files in those subtrees.

### Load memory from additional directories

The `--add-dir` flag gives Claude access to additional directories outside your main working directory. By default, CLAUDE.md files from these directories are not loaded.

To also load memory files (CLAUDE.md, .claude/CLAUDE.md, and .claude/rules/*.md) from additional directories, set the environment variable:

```bash
CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1 claude --add-dir ../shared-config
```

### Modular rules with `.claude/rules/`

For larger projects, you can organize instructions into multiple files using the `.claude/rules/` directory.

```
your-project/
├── .claude/
│   ├── CLAUDE.md           # Main project instructions
│   └── rules/
│       ├── code-style.md   # Code style guidelines
│       ├── testing.md      # Testing conventions
│       └── security.md     # Security requirements
```

All `.md` files in `.claude/rules/` are automatically loaded as project memory, with the same priority as `.claude/CLAUDE.md`.

**Path-specific rules:**

Rules can be scoped to specific files using YAML frontmatter with the `paths` field. These conditional rules only apply when Claude is working with files matching the specified patterns.

```markdown
---
paths:
  - "src/api/**/*.ts"
---

# API Development Rules

- All API endpoints must include input validation
- Use the standard error response format
- Include OpenAPI documentation comments
```

Rules without a `paths` field are loaded unconditionally and apply to all files.

**Glob patterns supported:**

| Pattern | Matches |
|---|---|
| `**/*.ts` | All TypeScript files in any directory |
| `src/**/*` | All files under `src/` directory |
| `*.md` | Markdown files in the project root |
| `src/components/*.tsx` | React components in a specific directory |

Multiple patterns supported:

```markdown
---
paths:
  - "src/**/*.ts"
  - "lib/**/*.ts"
  - "tests/**/*.test.ts"
---
```

Brace expansion supported:

```markdown
---
paths:
  - "src/**/*.{ts,tsx}"
  - "{src,lib}/**/*.ts"
---
```

**Subdirectories:** Rules can be organized into subdirectories. All `.md` files are discovered recursively.

```
.claude/rules/
├── frontend/
│   ├── react.md
│   └── styles.md
├── backend/
│   ├── api.md
│   └── database.md
└── general.md
```

**Symlinks:** The `.claude/rules/` directory supports symlinks, allowing shared common rules across multiple projects. Circular symlinks are detected and handled gracefully.

**User-level rules:** You can create personal rules in `~/.claude/rules/`:

```
~/.claude/rules/
├── preferences.md    # Your personal coding preferences
└── workflows.md      # Your preferred workflows
```

User-level rules are loaded before project rules, giving project rules higher priority.

**Best practices for `.claude/rules/`:**

- Keep rules focused: Each file should cover one topic
- Use descriptive filenames: The filename should indicate what the rules cover
- Use conditional rules sparingly: Only add `paths` frontmatter when rules truly apply to specific file types
- Organize with subdirectories: Group related rules

### Memory best practices (from Anthropic)

- **Be specific**: "Use 2-space indentation" is better than "Format code properly".
- **Use structure to organize**: Format each individual memory as a bullet point and group related memories under descriptive markdown headings.
- **Review periodically**: Update memories as your project evolves.

---

## Source 2: Best Practices

**URL:** https://code.claude.com/docs/en/best-practices

### Core constraint

Most best practices are based on one constraint: Claude's context window fills up fast, and performance degrades as it fills. The context window holds your entire conversation, including every message, every file Claude reads, and every command output.

### Writing an effective CLAUDE.md

Run `/init` to generate a starter CLAUDE.md file based on your current project structure, then refine over time.

CLAUDE.md is a special file that Claude reads at the start of every conversation. Include Bash commands, code style, and workflow rules. This gives Claude persistent context **it can't infer from code alone**.

There's no required format for CLAUDE.md files, but keep it short and human-readable. Example:

```markdown
# Code style
- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible (eg. import { foo } from 'bar')

# Workflow
- Be sure to typecheck when you're done making a series of code changes
- Prefer running single tests, and not the whole test suite, for performance
```

CLAUDE.md is loaded every session, so only include things that apply broadly. For domain knowledge or workflows that are only relevant sometimes, use skills instead. Claude loads them on demand without bloating every conversation.

**Keep it concise. For each line, ask: "Would removing this cause Claude to make mistakes?" If not, cut it. Bloated CLAUDE.md files cause Claude to ignore your actual instructions!**

#### What to include vs exclude

| Include | Exclude |
|---|---|
| Bash commands Claude can't guess | Anything Claude can figure out by reading code |
| Code style rules that differ from defaults | Standard language conventions Claude already knows |
| Testing instructions and preferred test runners | Detailed API documentation (link to docs instead) |
| Repository etiquette (branch naming, PR conventions) | Information that changes frequently |
| Architectural decisions specific to your project | Long explanations or tutorials |
| Developer environment quirks (required env vars) | File-by-file descriptions of the codebase |
| Common gotchas or non-obvious behaviors | Self-evident practices like "write clean code" |

**If Claude keeps doing something you don't want despite having a rule against it, the file is probably too long and the rule is getting lost. If Claude asks you questions that are answered in CLAUDE.md, the phrasing might be ambiguous. Treat CLAUDE.md like code: review it when things go wrong, prune it regularly, and test changes by observing whether Claude's behavior actually shifts.**

**You can tune instructions by adding emphasis (e.g., "IMPORTANT" or "YOU MUST") to improve adherence.**

Check CLAUDE.md into git so your team can contribute. The file compounds in value over time.

CLAUDE.md files can import additional files using `@path/to/import` syntax:

```markdown
See @README.md for project overview and @package.json for available npm commands.

# Additional Instructions
- Git workflow: @docs/git-instructions.md
- Personal overrides: @~/.claude/my-project-instructions.md
```

You can place CLAUDE.md files in several locations:

- **Home folder (`~/.claude/CLAUDE.md`)**: Applies to all Claude sessions
- **Project root (`./CLAUDE.md`)**: Check into git to share with your team, or name it `CLAUDE.local.md` and `.gitignore` it
- **Parent directories**: Useful for monorepos where both `root/CLAUDE.md` and `root/foo/CLAUDE.md` are pulled in automatically
- **Child directories**: Claude pulls in child CLAUDE.md files on demand when working with files in those directories

### The over-specified CLAUDE.md (failure pattern)

From the "Avoid common failure patterns" section:

> **The over-specified CLAUDE.md.** If your CLAUDE.md is too long, Claude ignores half of it because important rules get lost in the noise.
> **Fix**: Ruthlessly prune. If Claude already does something correctly without the instruction, delete it or convert it to a hook.

### On emphasis and adherence

From the best practices page: **"You can tune instructions by adding emphasis (e.g., 'IMPORTANT' or 'YOU MUST') to improve adherence."**

This is the only published statement from Anthropic about formatting affecting instruction weight in CLAUDE.md files.

### Context management and compaction

- Run `/clear` between unrelated tasks to reset context
- Claude Code automatically compacts conversation history when you approach context limits
- Run `/compact <instructions>` for controlled compaction, e.g., `/compact Focus on the API changes`
- Customize compaction behavior in CLAUDE.md with instructions like `"When compacting, always preserve the full list of modified files and any test commands"` to ensure critical context survives summarization

---

## Source 3: Settings & Configuration

**URL:** https://code.claude.com/docs/en/settings

### Settings precedence (highest to lowest)

1. **Managed** — Cannot be overridden
2. **Command line arguments** — Temporary session overrides
3. **Local** — Project-specific personal overrides (`.claude/settings.local.json`)
4. **Project** — Team-shared settings (`.claude/settings.json`)
5. **User** — Personal global settings (`~/.claude/settings.json`)

### Configuration file locations

| Scope | Location |
|---|---|
| User | `~/.claude/settings.json` |
| Project | `.claude/settings.json` |
| Local | `.claude/settings.local.json` |
| Managed (macOS) | `/Library/Application Support/ClaudeCode/managed-settings.json` |
| Managed (Linux) | `/etc/claude-code/managed-settings.json` |
| Managed (Windows) | `C:\Program Files\ClaudeCode\managed-settings.json` |

### CLAUDE.md file locations (from settings page)

| Feature | User | Project | Local |
|---|---|---|---|
| **CLAUDE.md** | `~/.claude/CLAUDE.md` | `CLAUDE.md` or `.claude/CLAUDE.md` | `CLAUDE.local.md` |

### How Settings Files Interact with CLAUDE.md

Hierarchy of instruction sources:

1. **CLAUDE.md files** (highest)
   - `CLAUDE.local.md` (local overrides)
   - `.claude/CLAUDE.md` or `CLAUDE.md` (project shared)
   - `~/.claude/CLAUDE.md` (user global)

2. **Settings.json files** (configuration)
   - Manage permissions, environment variables, tool behavior

3. **System prompt** (lowest)
   - Claude Code's internal prompt

Higher-level configs override lower-level ones.

### Key environment variables for CLAUDE.md behavior

- `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD` — Load CLAUDE.md from additional dirs (`1`)
- `CLAUDE_CODE_DISABLE_AUTO_MEMORY` — Disable auto memory (`1` to disable, `0` to force on)
- `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` — Context capacity % for auto-compaction (1-100)

---

## Source 4: How Claude Code Works

**URL:** https://code.claude.com/docs/en/how-claude-code-works

### What Claude can access

When you run `claude` in a directory, Claude Code gains access to:

- **Your project.** Files in your directory and subdirectories, plus files elsewhere with your permission.
- **Your terminal.** Any command you could run.
- **Your git state.** Current branch, uncommitted changes, and recent commit history.
- **Your CLAUDE.md.** A markdown file where you store project-specific instructions, conventions, and context that Claude should know every session.
- **Extensions you configure.** MCP servers, skills, subagents, and Claude in Chrome.

### Context window behavior

Claude's context window holds your conversation history, file contents, command outputs, CLAUDE.md, loaded skills, and system instructions. As you work, context fills up. Claude compacts automatically, but instructions from early in the conversation can get lost. **Put persistent rules in CLAUDE.md**, and run `/context` to see what's using space.

**When context fills up:**

Claude Code manages context automatically as you approach the limit. It clears older tool outputs first, then summarizes the conversation if needed. Your requests and key code snippets are preserved; **detailed instructions from early in the conversation may be lost.** Put persistent rules in CLAUDE.md rather than relying on conversation history.

To control what's preserved during compaction, add a "Compact Instructions" section to CLAUDE.md or run `/compact` with a focus.

### Sessions are independent

Each new session starts with a fresh context window, without the conversation history from previous sessions. Claude can persist learnings across sessions using auto memory, and you can add your own persistent instructions in CLAUDE.md.

### Skills vs CLAUDE.md for context management

Skills load on demand. Claude sees skill descriptions at session start, but the full content only loads when a skill is used. For skills you invoke manually, set `disable-model-invocation: true` to keep descriptions out of context until you need them.

Subagents get their own fresh context, completely separate from your main conversation. Their work doesn't bloat your context. When done, they return a summary.

---

## Source 5: Skills

**URL:** https://code.claude.com/docs/en/skills

### Skills vs CLAUDE.md

CLAUDE.md is loaded every session. Skills load on demand.

**When loaded into context:**

| Frontmatter | You can invoke | Claude can invoke | When loaded into context |
|---|---|---|---|
| (default) | Yes | Yes | Description always in context, full skill loads when invoked |
| `disable-model-invocation: true` | Yes | No | Description not in context, full skill loads when you invoke |
| `user-invocable: false` | No | Yes | Description always in context, full skill loads when invoked |

In a regular session, skill descriptions are loaded into context so Claude knows what's available, but full skill content only loads when invoked.

### Skill precedence

When skills share the same name across levels, higher-priority locations win: **enterprise > personal > project**. Plugin skills use a `plugin-name:skill-name` namespace, so they cannot conflict with other levels.

### Skill character budget

Skill descriptions are loaded into context so Claude knows what's available. If you have many skills, they may exceed the character budget. The budget scales dynamically at 2% of the context window, with a fallback of 16,000 characters. Override with `SLASH_COMMAND_TOOL_CHAR_BUDGET` environment variable.

---

## Consolidated: Instruction Precedence / Hierarchy

Synthesised from all sources above. These are the precedence rules as documented by Anthropic:

### CLAUDE.md file precedence (more specific wins)

1. CLAUDE.md files in child directories (loaded on demand when Claude reads files in those subtrees)
2. `CLAUDE.local.md` in project root (personal project-specific overrides)
3. `./CLAUDE.md` or `./.claude/CLAUDE.md` (project-level, shared)
4. `.claude/rules/*.md` (same priority as `.claude/CLAUDE.md`)
5. Parent directory CLAUDE.md files (loaded at launch, recursing up from cwd to root)
6. `~/.claude/CLAUDE.md` (user-level, applies to all projects)
7. `~/.claude/rules/*.md` (user-level rules, loaded before project rules, project rules have higher priority)
8. Managed policy CLAUDE.md (organization-wide, system-level path)

Key statement: **"More specific instructions take precedence over broader ones."**

### Settings precedence (from settings.json docs)

1. Managed (cannot be overridden)
2. Command line arguments
3. Local (`.claude/settings.local.json`)
4. Project (`.claude/settings.json`)
5. User (`~/.claude/settings.json`)

### Overall instruction source hierarchy (from settings page)

1. CLAUDE.md files (highest)
2. Settings.json files
3. System prompt (lowest)

### Loading behavior

- **At launch:** All CLAUDE.md and CLAUDE.local.md files in the directory hierarchy above the working directory are loaded in full.
- **On demand:** CLAUDE.md files in child directories are only included when Claude reads files in those subtrees.
- **Auto memory:** Only the first 200 lines of MEMORY.md are loaded at launch. Topic files are read on demand.
- **Skills:** Descriptions loaded at session start. Full content loaded only when invoked.
- **Rules (`.claude/rules/*.md`):** All unconditional rules loaded at launch. Path-specific rules loaded when working with matching files.

---

## Consolidated: What Anthropic says about emphasis/formatting

The only published statement on formatting affecting instruction weight:

> "You can tune instructions by adding emphasis (e.g., 'IMPORTANT' or 'YOU MUST') to improve adherence."
> — Best Practices page

No documentation found on:
- Bold/caps systematically changing instruction weight
- Position in file (early vs late) affecting adherence
- Markdown heading levels affecting priority
- Any formal instruction weighting system based on formatting
