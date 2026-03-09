# Code quality

## Structure
- Keep the four layers separate: connection, protocol, knowledge, UI
- Each layer exports a clear interface. No reaching past the layer below.
- GT86 knowledge is data (lookup tables, range definitions), not scattered if-statements

## React
- Functional components with hooks
- Named exports, one component per file
- Props for data, hooks for state and effects
- No prop drilling past two levels. If it goes deeper, rethink the structure.

## Testing
- Mock scenarios are the test fixtures. If a scenario renders correctly, the slice works.
- Test the protocol layer in isolation. It's pure input/output, no side effects.

## Error handling
- Every connection attempt can fail. Show a clear message, not a blank screen.
- Unexpected OBD2 responses happen. Parse defensively, surface "couldn't read this" rather than crashing.
- The user is standing next to a car they might buy. A crashed app is worse than a missing data point.
