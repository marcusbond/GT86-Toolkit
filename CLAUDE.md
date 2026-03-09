# GT86 Toolkit

## What is this
Pre-purchase health check for GT86 buyers. Web app (React). Mocked data for now, real adapter later.

## Context
- Mentoring project, teaching product thinking and build quality through doing
- Mentee on Windows + VS Code
- POC wireframe at `poc/index.html` is the visual spec, not the codebase
- Product discovery and UX spec in `docs/`

## Status
[x] Discovery
[x] UX / IA
[x] POC wireframe
[ ] React build

## Architecture
- Four layers: connection, protocol, knowledge, UI. Each independent. See `docs/architecture.md`
- Mock data is first-class, not an afterthought. Supports scenarios (clean car, faults, cleared codes, mileage anomaly)
- GT86 knowledge base (fault code context, normal ranges) is a data structure, not scattered conditionals
- Connection layer is swappable (mock / Web Bluetooth / Web Serial)

## Build rules
- Small commits, one thing each. Reasoning in the commit message.
- Build one slice at a time. Review before moving on.
- Extract shared patterns when you can see them repeated, not before.
- Error states from day one. Adapter not found, car not responding, unexpected data.
- POC wireframe is reference for layout and content. Build fresh in React.

## Code style
- React with hooks, functional components
- 2-space indent
- Named exports

## Open decisions
- Reg plate input: before the scan or after? Needed for DVLA lookup.
- See `docs/discovery.md` for remaining open questions
