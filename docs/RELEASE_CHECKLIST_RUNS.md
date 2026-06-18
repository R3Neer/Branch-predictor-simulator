# Release Checklist Runs

This file records completed release checklist executions.

## 2026-06-18

Result: passed.

Environment:

- Windows PowerShell.
- Local Vite dev server at `http://127.0.0.1:5173`.
- Chromium through Playwright for the manual UI pass.

Commands:

- `npm.cmd install`: passed, no package changes, 0 vulnerabilities.
- `npm.cmd test`: passed, 108 tests.
- `npm.cmd run test:e2e`: passed, 6 tests.
- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed, no large bundle warning.
- `npm.cmd audit`: passed, 0 vulnerabilities.
- `npm.cmd run dev`: passed; app opened locally.

Manual UI Pass:

- Loaded official templates 1, 2, 3, 4, 5, and 7.
- Confirmed exercise 6 is not exposed as a v1 template.
- Tested every visible v1 variant with step, back, run all, reset, solution reveal, and statistics calculation.
- Confirmed Exam mode hides prediction, hit/miss, counter, history, index calculation, and aliasing details.
- Confirmed Solution mode reveals trace-derived values.
- Exported Markdown, CSV, and YAML.
- Confirmed YAML export excludes derived statistics, table projections, calculation views, and correction reports.
- Imported exported YAML into a fresh session.
- Confirmed imported YAML restores sequence, predictor configuration, mode, and initial step state.
- Confirmed mobile header tabs stay in viewport.
- Confirmed the mobile simulation table scrolls horizontally.

Template Results:

| Template | Variant | Steps | Hits | Misses | Hit rate | Miss rate | Memory bits | Used entries | Aliasing events |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Exercise 1: 2-bit predictor | 2-bit predictor | 6 | 1 | 5 | 16.67% | 83.33% | 2 | 1 | 0 |
| Exercise 2: two-level (1,1) and (1,2) | Two-level predictor (1,1) | 15 | 9 | 6 | 60.00% | 40.00% | 9 | 6 | 0 |
| Exercise 2: two-level (1,1) and (1,2) | Two-level predictor (1,2) | 15 | 3 | 12 | 20.00% | 80.00% | 15 | 6 | 0 |
| Exercise 3: (3,2) predictor, 512 entries, 9 LSBs | Predictor (3,2) | 15 | 10 | 5 | 66.67% | 33.33% | 8192 | 9 | 0 |
| Exercise 4: correlated (2,2) with B1/B2 | Correlated (2,2) | 12 | 8 | 4 | 66.67% | 33.33% | 18 | 4 | 0 |
| Exercise 5: gshare | gshare 256 entries | 16 | 5 | 11 | 31.25% | 68.75% | 520 | 9 | 0 |
| Exercise 7: T-T-NT pattern with predictor (2,2) | Predictor (2,2) | 13 | 8 | 5 | 61.54% | 38.46% | 10 | 4 | 0 |

Export sizes from the release pass:

- Markdown: 1689 bytes.
- CSV: 1161 bytes.
- YAML: 2058 bytes.

Mobile table scroll evidence:

- Visible width: 356 px.
- Scrollable content width: 1402 px.
