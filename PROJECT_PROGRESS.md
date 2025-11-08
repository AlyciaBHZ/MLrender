# ML Concept Designer Progress (as of 2025-11-08)

## Current Snapshot
### UI / Visual System
- Academic visual system established; 13 baseline nodes share `NodeView` scaffolding and academic motifs (see `docs/DESIGN_SYSTEM.md` for canonical references).
- Attention and unified RNN/LSTM/GRU nodes follow the same standards with KaTeX labels, parameter readouts, and NodeMarker integration; residual connectors and advanced markers remain open.
- Visual vocabulary wave 1 (Flatten, Embedding, Pooling, Normalization, Dropout) is fully specified (`docs/ML_Visual_Vocabulary_v1.md`, `docs/VISUAL_VOCABULARY_IMPLEMENTATION.md`), but sidebar thumbnails/icons still lag behind locked silhouettes (`docs/UIDESIGN_LOCK.md`, `src/ui/spec.ts`).

- React 18 + Vite SPA delivers drag/drop canvas, undo/redo, grouping, templating, quick adjustments, and academic-quality nodes (`src/App.tsx`, `src/diagram/DiagramCanvas.tsx`, `src/components/Toolbar.tsx`, `src/components/QuickPanel.tsx`).
- Sidebar catalog, PropertiesPanel, and schema utilities stay in sync through the centralized schema system (`src/components/Sidebar.tsx`, `src/ui/nodeSchemas.ts`, `src/components/PropertiesPanel.tsx`, `src/data/componentSchemas.ts`).
- Autosave to localStorage plus JSON/CSV import/export and PNG export provide offline persistence; SVG/Mermaid export and shareable links remain roadmap items (`src/sheets/export.ts`, `src/sheets/import.ts`).
- React Flow alignment, distribution, grouping, onboarding overlays, and toast flows function, but some catalog entries still reference `boxNode` placeholders and nested grouping UX needs polish (`docs/APPEARANCE_LOG.md`, `src/diagram/grouping.ts`).

### Backend / Services
- Still client-only; roadmap calls for shareable URLs and collaboration, but no backend stack selected yet (`README.md`, `docs/VISUAL_VOCABULARY_IMPLEMENTATION.md`).
- Need architecture decision (Supabase/Firebase/serverless/custom) plus auth/persistence strategy before multi-user features.

- Centralized design tokens and ML parameter schemas live under `src/data` with helper APIs (`src/data/designTokens.ts`, `src/data/componentSchemas.ts`, `src/data/index.ts`).
- Diagram persistence limited to Zustand + localStorage/CSV/JSON; schema versioning, preset management, and automated sidebar/template sync still pending.

### Testing & QA
- Vitest + Testing Library stack with 36 schema-focused tests (`src/data/__tests__/componentSchemas.test.ts`, `test/setup.ts`); all green via `npm test`.
- Manual QA still required for zoom behavior, drag/drop of new nodes, grouping edge cases, and PNG export validation.
- Next additions: store/alignment/grouping unit tests, Playwright/Cypress smoke flows, and SVG visual regression coverage.

- Root docs trimmed to `README.md`, this file, and `agents.md`; detailed specs live under `docs/`.
- Chinese localization strings and several historical design docs still contain mojibake and need UTF-8 cleanup before translation syncing.

## Timeline of Key Work
- **2025-10-15 — Academic node refinements locked.** All 13 node types adopted the academic motifs defined in `docs/DESIGN_SYSTEM.md`, completing the visual overhaul.
- **2025-10-22 — Schema integration shipped.** Sidebar, DiagramCanvas, and PropertiesPanel began sharing the centralized schemas in `src/data/componentSchemas.ts`, unifying defaults/validation across the app.
- **Late Oct 2025 — Visual vocabulary wave 1 + UX hardening.** `docs/VISUAL_VOCABULARY_IMPLEMENTATION.md`, `docs/ML_Visual_Vocabulary_v1.md`, and `docs/UI_DESIGN_REQUIREMENTS.md` define academically recognizable icons for Flatten/Embedding/Pooling/Normalization/Dropout; `docs/APPEARANCE_LOG.md` covers P7-series UX polish (sidebar scroll lock, lasso selection, onboarding overlay, alignment/distribution engine rewrite, grouping crash fixes, schema-driven PropertiesPanel).
- **2025-10-31 — Progress checkpoint.** `PROJECT_PROGRESS.md` (previous edition) captured remaining gaps: Attention/RNN visuals, template refresh, SVG/export work, zh translation cleanup, and lack of automated tests.
- **2025-11-07 — Priority actions push.** (Former `IMPLEMENTATION_SUMMARY.md`/`PRIORITY_ACTIONS_COMPLETE.md`): UTF-8 verification finished, Attention and RNN/LSTM/GRU nodes added, and 36-schema unit tests landed; remaining immediate work is E2E smoke tests and template refresh.
- **2025-11-08 — Documentation consolidation.** Duplicate status/TODO reports trimmed, `agents.md` added for operating rules, and root-level markdown reduced to this file + README to keep guidance centralized.

## Resolved Challenges Log
- **React Flow + React hook violations:** Earlier hook-order bugs in `PropertiesPanel` and deprecated React Flow APIs were resolved during the schema integration push, restoring stable renders.
- **Alignment/grouping instability:** `docs/APPEARANCE_LOG.md` P7.0 entries cover the alignment engine rewrite (absolute-space calculations, distribution pinning) plus grouping crash fixes (parent-first insertion, helper consolidation).
- **Schema coherence:** Sidebar, DiagramCanvas, and PropertiesPanel now consume the same helpers from `src/data/componentSchemas.ts`, so defaults/validation stay aligned.
- **Visual clarity:** `docs/DESIGN_SYSTEM.md`, `docs/VISUAL_VOCABULARY_IMPLEMENTATION.md`, and `docs/ML_Visual_Vocabulary_v1.md` lock academic metaphors, ensuring each node communicates its function.
- **Encoding hygiene:** UTF-8 sweep completed (2025-11-07) so current docs render cleanly; remaining mojibake is limited to older reference material awaiting rewrite.

## Pending Issues
- **Visual assets:** residual/skip-edge symbols, sidebar thumbnails, and template thumbnails need to match locked silhouettes; additional node variants (Attention derivatives, RNN presets) must be reflected in catalog/template data.
- **Export & sharing:** only JSON/CSV/PNG exist; SVG/Mermaid export plus shareable links/cloud persistence remain unsolved.
- **Grouping UX:** nested groups, resizing parent containers, and Level-of-Detail controls still need design + implementation polish.
- **Localization:** `src/i18n/locales/zh/translation.json` requires a clean UTF-8 rewrite; historical Chinese design notes need reconciling.
- **Backend/persistence:** choose storage/auth approach for shareable diagrams, add schema versioning/presets, and keep sidebar/template defaults in sync automatically.
- **Testing:** add Zustand store/alignment/grouping unit tests, Playwright/Cypress smoke tests, and visual regression coverage; establish CI once scripts stabilize.

## Documentation & Setup Notes
- Keep only `README.md`, `PROJECT_PROGRESS.md`, and `agents.md` at the repo root; all other markdown references (design specs, historical logs, setup notes) now live under `docs/`.
- When updating instructions or setup guidance, append to the relevant `docs/*.md` file rather than creating new documents.
- Use `agents.md` as the operating prompt before every session to avoid regenerating redundant reports.
