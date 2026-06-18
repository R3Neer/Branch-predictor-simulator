# UI Style Reference Notes

Reference project inspected read-only:

```text
D:\OneDrive\Documentos Samuel\Tablas procesador segmentado
```

These notes capture style and interaction ideas from `Pipeline Table Editor` for a future redesign of this branch predictor simulator. They are observations, not implemented requirements.

## Overall Direction

- The reference UI feels like a focused desktop tool rather than a dashboard.
- The screen is dominated by the work artifact: a large editable table.
- Configuration lives in a narrow left sidebar.
- The main workspace is mostly uninterrupted.
- There are no nested cards, no decorative sections, and very little explanatory copy.
- The app relies on visible controls and direct manipulation instead of descriptive text blocks.
- The visual language is calm, technical, and dense without feeling cramped.

## Layout

- Primary layout:
  - fixed/narrow left control sidebar, about `320px`,
  - main workspace takes all remaining width,
  - full viewport height,
  - no top marketing/header band.
- Sidebar contains:
  - app title and short subtitle,
  - compact fields,
  - import/export controls,
  - destructive actions at the bottom of their local group.
- Workspace contains:
  - one large table shell,
  - rounded outer border,
  - subtle table shadow,
  - sticky table headers,
  - wide horizontal canvas with explicit scrolling.
- For our simulator, likely target layout:
  - left sidebar: template, variant, mode, predictor config, source controls, import/export,
  - main workspace: branch sequence, simulation controls, dynamic table,
  - secondary details: statistics/checking/calculations shown as drawers, collapsible sections, or tabs rather than always-visible stacked panels.

## Visual Tokens

Reference token patterns:

- Background: cool pale gray (`#eef2f6`) instead of pure white.
- Surface: white.
- Soft surface: very light slate (`#f8fafc`).
- Text: dark slate (`#17202a`).
- Muted text: slate gray (`#64748b`).
- Border: cool gray-blue (`#d7dee8`).
- Strong border: `#b8c2d0`.
- Accent: teal (`#006c7a`).
- Accent soft: pale cyan (`#d9f3f6`).
- Danger: restrained red (`#b42318`).
- Shadows:
  - table: `0 10px 32px rgba(15, 23, 42, 0.08)`,
  - floating menus/modals: `0 18px 45px rgba(15, 23, 42, 0.14)`.

Useful transfer:

- Keep current simulator from becoming one-note blue/slate by using neutral surfaces with teal accent and small warm/semantic colors for prediction states.
- Prefer a tokenized MUI theme with named semantic colors rather than ad hoc component colors.
- Dark mode exists in the reference through CSS tokens, but copying dark mode is not necessary for the immediate redesign.

## Typography

- Font stack: `"Segoe UI", Roboto, Arial, Helvetica, sans-serif`.
- Title:
  - around `20px`,
  - strong weight,
  - tight line-height.
- Sidebar labels:
  - `12px`,
  - bold,
  - uppercase,
  - subtle letter spacing,
  - muted color.
- Table headers:
  - `12px`,
  - heavy weight,
  - muted blue-gray.
- Cell/table content:
  - compact and readable,
  - monospace or syntax-highlighted text only where code-like data benefits from it.

For our simulator:

- Use compact headings inside panels.
- Avoid large dashboard headings once inside the app.
- Prefer uppercase field labels in the sidebar, but keep table column labels normal and scannable.

## Controls

- Buttons are compact:
  - min height around `34-38px`,
  - radius `8px`,
  - one-line labels,
  - subtle hover border and shadow.
- Icon buttons are square:
  - around `34px`,
  - radius `10px`,
  - used for structural commands such as collapse/sidebar.
- Menus:
  - floating surface,
  - `10px` radius,
  - `6px` padding,
  - menu rows around `34px`,
  - hover with soft accent background.
- Export is a single primary row that opens a compact menu rather than many always-visible export buttons.

For our simulator:

- Consolidate `CSV`, `Markdown`, and `YAML` into an `Export` menu.
- Keep `Step`, `Back`, `Run all`, and `Reset` close to the table.
- Make destructive/clearing actions visually quieter but distinctly red.
- Use disabled states heavily to reduce clutter before a trace exists.

## Table Design

- The table is the main visual object.
- Outer table shell:
  - `1px` border,
  - `12px` radius,
  - white surface,
  - subtle shadow,
  - overflow handled inside the shell.
- Header:
  - sticky,
  - pale blue-gray background,
  - compact height around `48px`.
- Rows:
  - fixed-ish height around `60px`.
- Columns:
  - fixed sizing is preferred for stable layout,
  - horizontal scrolling is explicit and polished.
- Empty cells use soft gray filled pills/inputs instead of blank void.
- State cells use color-coded rounded pills with border.

For our simulator:

- Keep TanStack Table, but visually make it the main table shell.
- Predictor-specific cells should be visually classified:
  - prediction/hit/miss,
  - counter before/after,
  - history,
  - aliasing,
  - actual outcome.
- Avoid showing the table as just another card among many cards.
- Use horizontal scrolling as a first-class feature, not a fallback.

## State Colors

Reference stage colors:

- IF: pale green.
- ID: pale blue.
- EX: pale yellow.
- MEM: pale violet.
- WB: pale mint.
- Invalid: pale red with stronger red border/text.
- Selected/focus states use orange/teal/blue rings.

Possible simulator mapping:

- Taken / not taken:
  - Taken: warm yellow or green, depending on final legend.
  - Not taken: cool blue/gray.
- Hit:
  - green or teal success.
- Miss:
  - red/pink warning.
- Prediction hidden in Exam:
  - soft blank/placeholder cell, no text.
- Aliasing:
  - violet or amber, but only when meaningfully present.
- Counter states:
  - compact bit pills, not long prose.

Important: colors should support scanning, not decorate every cell equally.

## Sidebar Patterns

- The sidebar is not a card; it is a fixed control surface.
- Fields are grouped as simple vertical sections.
- Labels are short and uppercase.
- Inputs are full width.
- Button groups are grid-based and predictable.
- The sidebar can collapse, but collapse is optional for our immediate redesign.

For our simulator sidebar:

- Suggested groups:
  - Session: template, variant, mode.
  - Source: source type tabs and editor actions.
  - Predictor: config summary/edit JSON.
  - Answers: check/calculate controls.
  - Import/export: compact menu and YAML import.
- Avoid placing every textarea permanently visible at the same priority.
- Put rare or bulky surfaces behind disclosure.

## Source Editing

Reference uses syntax-colored assembly input inside table rows.

For our simulator:

- Do not copy inline editing directly unless needed.
- Use a focused source editor area with tabs:
  - Didactic C,
  - RISC-V,
  - Manual sequence.
- Show one primary source editor at a time by default.
- Preserve the generated/derived source relationship with clear but compact status text.
- Avoid three large textareas stacked at the top of the first viewport.

## Export And Import

Reference pattern:

- Export button opens a menu.
- Import JSON has a textarea plus a load action.
- Status feedback is a small floating pill at the bottom.

For our simulator:

- Use one `Export` menu for Markdown, CSV, and YAML.
- YAML import can live in a collapsible sidebar section.
- Exported content should appear in a copyable drawer/modal only after explicit export.
- Consider a small status toast for “Export generated”, “Session imported”, and validation errors.

## Responsive Behavior

Reference is desktop-first:

- `body` has desktop `min-width: 980px`,
- below `900px`, layout stacks,
- sidebar becomes top block,
- workspace remains scrollable.

For our simulator:

- Desktop should be the best-supported mode.
- Tablet/mobile should stack cleanly but still allow horizontal table scrolling.
- Avoid cramming all controls above the table on mobile.
- Mode tabs/header must stay inside viewport.
- The table should keep stable column sizes and scroll horizontally.

## Accessibility And Interaction

Reference patterns:

- `:focus-visible` ring is explicit and consistent.
- Menus use `aria-hidden`.
- Buttons have visible hover/focus states.
- Status feedback is non-blocking.

For our simulator:

- Keep the global focus ring recently added.
- Preserve accessible names for buttons, tabs, selects, and textareas.
- If export/check/import move into menus or drawers, keep keyboard access as a first-class constraint.

## What Not To Copy Directly

- Do not copy the framework-free DOM architecture; this simulator already uses React, MUI, Zustand, and TanStack Table.
- Do not copy pipeline-stage cell semantics directly.
- Do not add context menus unless they clearly reduce visible clutter.
- Do not add inline editing everywhere before the core simulator workflow is simpler.
- Do not introduce image export just because the reference has PNG export; image export remains out of v1.
- Do not force desktop `min-width: 980px` if it harms the responsive work already done.

## Redesign Hypothesis For This Simulator

The current UI feels messy mainly because too many surfaces compete at once:

- three source editors are visible together,
- configuration and statistics occupy a tall side column,
- exports/imports/checking/calculations are all present as large blocks,
- the table is important but does not dominate the app enough.

A reference-inspired redesign should:

1. Make the dynamic simulation table the central artifact.
2. Move session/config/import/export/checking into a compact left sidebar.
3. Show one source editor at a time.
4. Convert export actions into a menu.
5. Convert statistics/calculations into explicit result panels or drawers.
6. Use color-coded compact pills for trace values.
7. Keep Exam/Solution leakage rules visually obvious but not verbose.
8. Keep desktop dense and calm, with mobile stacking as a supported fallback.

## Candidate Implementation Steps

1. Define simulator UI tokens in the MUI theme:
   - background, surface, surface soft, border, accent, muted text, table header, state colors.
2. Replace the current dashboard layout with:
   - fixed-width left sidebar,
   - main workspace with source tabs, controls, table shell, and optional result panel.
3. Make source editors tabbed:
   - Didactic C,
   - RISC-V,
   - Manual sequence.
4. Convert export controls to one menu.
5. Move YAML import into a collapsible sidebar section.
6. Rework the table visual presentation:
   - shell,
   - sticky headers,
   - compact rows,
   - semantic cell pills,
   - horizontal scroll polish.
7. Move statistics/checking into explicit actions:
   - Exam: answer/check area,
   - Solution: calculate/reveal area.
8. Run visual QA again on desktop, tablet, and mobile.

## Reference Files Read

- `README.md`
- `app/src/styles.css`
- `app/src/styles/tokens.css`
- `app/src/styles/base.css`
- `app/src/styles/sidebar.css`
- `app/src/styles/table.css`
- `app/src/styles/table-layout.css`
- `app/src/styles/instruction-rows.css`
- `app/src/styles/stage-cells.css`
- `app/src/styles/overlays.css`
- `app/src/styles/responsive.css`
- `app/src/main.ts`

Reference screenshots reviewed:

- `app/docs/screenshots/editor-overview.png`
- `app/docs/screenshots/export-menu.png`
- `app/docs/screenshots/context-menu.png`
- `app/docs/screenshots/validation-and-autocomplete.png`
