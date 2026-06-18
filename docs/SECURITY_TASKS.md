# Security Tasks

Synchronization date: 2026-06-18.

This file tracks dependency security work separately from v1 feature implementation. Do not run forced audit fixes without a dedicated decision.

## Current `npm audit` Summary

Command:

```powershell
npm.cmd audit --json
```

Initial result:

- Total vulnerabilities: 7.
- Critical: 1.
- High: 2.
- Moderate: 3.
- Low: 1.

After targeted overrides:

- Total vulnerabilities: 4.
- Critical: 1.
- High: 1.
- Moderate: 2.
- Low: 0.

## Findings

| Package | Severity | Path | Current decision |
| --- | --- | --- | --- |
| `vitest` | Critical | Direct dev dependency through `vitest`, `vite-node`, and `vite` | Needs planned major upgrade validation; audit suggests `vitest@4.1.9` |
| `vite` | High | Direct dev dependency and transitive through Vitest | Needs planned major upgrade validation; audit suggests `vite@8.0.16` |
| `esbuild` | Moderate | Transitive through Vite | Covered by the Vite upgrade path |
| `dompurify` | Resolved | Transitive through Monaco | Overridden to `3.4.11` |
| `monaco-editor` | Low | Transitive `dompurify` exposure | Review whether Monaco is still needed before v1 |
| `form-data` | Resolved | Transitive dependency | Overridden to `4.0.6` |

## V1 Policy

- Prefer targeted upgrades or npm `overrides`.
- Keep all gates green after any dependency change:
  - `npm.cmd test`
  - `npm.cmd run test:e2e`
  - `npm.cmd run lint`
  - `npm.cmd run build`
- Do not use `npm audit fix --force` unless a separate major-upgrade task explicitly approves it.

## Next Actions

1. Evaluate a dedicated Vite/Vitest major upgrade branch after v1 feature hardening.
2. Consider removing Monaco before v1 if plain text editors remain enough and Monaco is not used by the UI.
3. Re-run `npm.cmd audit` after each dependency block and update this file.
