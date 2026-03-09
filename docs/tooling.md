# Tooling

Decisions on the build toolchain and why.

## Stack

| Tool | Purpose | Why this one |
|---|---|---|
| Vite | Build / dev server | Fast, minimal config, industry standard for new React projects. CRA is deprecated. Next.js adds SSR complexity we don't need — this is a single-flow app with no SEO requirement. |
| React | UI framework | Already decided. Functional components, hooks. |
| TypeScript | Language | Industry default for React. Strict mode from day one. Tooling, docs, and community examples all assume TS — fighting it creates friction. |
| Tailwind CSS v4 | Styling | Industry standard utility-first CSS. Co-located styling, no naming debates, transferable skill. |
| Vitest | Testing | Native Vite integration, same config. Fast. Good for testing protocol and knowledge layers in isolation (pure input/output). |
| ESLint | Linting | Standard. Catches bugs and enforces consistency. |
| Prettier | Formatting | Standard. Removes formatting debates. 2-space indent to match existing code style. |
| npm | Package manager | Ships with Node. No extra install for the mentee on Windows. |

## Not using (and why)

| Tool | Why not |
|---|---|
| Create React App | Deprecated. No longer maintained. |
| Next.js | SSR, file-based routing, server components — all complexity we don't need. Connect → Scan → Report is one flow. |
| Storybook | Overhead for a project this size. Revisit if component count grows. |
| Zustand / Redux | React hooks are enough for this flow. Add state management when we feel the pain, not before. |
| Husky / lint-staged | Useful but premature. Add when there's CI or a second contributor. |
| CSS Modules / CSS-in-JS | Tailwind covers it. No reason to add another styling approach. |

## Project structure

```
GT86-Toolkit/
├── docs/                  # project-wide docs (stays at root)
├── poc/                   # visual spec (stays at root)
├── web/                   # React app
│   ├── src/
│   │   ├── connection/    # mock / bluetooth / serial
│   │   ├── protocol/      # OBD2 command + response parsing
│   │   ├── knowledge/     # GT86 context, fault lookups, ranges
│   │   ├── components/    # React UI (the fourth layer)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.ts
├── CLAUDE.md
└── ...
```

### Why `web/` not root

The repo already has docs, the POC wireframe, and the old iOS project. The React app lives in `web/` to keep concerns separate. Docs stay at the root because they describe the whole project, not just the web app.

### Layer boundaries

`connection/`, `protocol/`, and `knowledge/` have zero React imports. They're pure TypeScript. Only `components/` knows about React. The architecture is enforced by directory structure, not just documentation.

### Path aliases

`@/` maps to `src/`. Cleaner imports (`@/connection/mock` instead of `../../../connection/mock`).

## TypeScript config

`strict: true` from day one. Easier to start strict than to tighten later. Catches real bugs — null checks, missing returns, implicit any.
