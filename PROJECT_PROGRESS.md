# ML Concept Designer Progress (as of 2025-10-31)

## UI Design
- Academic visual system established; 13 core nodes reworked with conference-style motifs and shared `NodeView` scaffolding (`DESIGN_SYSTEM.md`, `IMPLEMENTATION_STATUS.md`, `REFINEMENT_LOG.md`, `VISUAL_VOCABULARY_IMPLEMENTATION.md`).
- Visual vocabulary wave 1 shipped (Flatten, Embedding, Pooling, Normalization, Dropout) with documented specs (`ML_Visual_Vocabulary_v1.md`, `VISUAL_VOCABULARY_IMPLEMENTATION.md`).
- Sidebar/catalog icons and tokens aligned with locked silhouettes (`docs/UIDESIGN_LOCK.md`, `src/ui/spec.ts`).
- Issues/Risks: remaining high-priority visuals (Attention, RNN/LSTM/GRU, Residual edges) still pending; several design documents contain mojibake and need UTF-8 cleanup; Chinese i18n strings display encoding artifacts.

## Frontend Application
- React 18 + Vite SPA delivering diagram canvas, undo/redo, grouping, templating, and quick adjustments (`src/App.tsx`, `src/diagram/DiagramCanvas.tsx`, `src/components/Toolbar.tsx`, `src/components/QuickPanel.tsx`).
- Drag-and-drop sidebar wired to centralized schema system; PropertiesPanel renders parameter forms with validation from `src/data` (`INTEGRATION_COMPLETE.md`, `SCHEMA_INTEGRATION_LOG.md`, `src/components/Sidebar.tsx`, `src/ui/nodeSchemas.ts`, `src/components/PropertiesPanel.tsx`).
- Autosave to localStorage plus JSON/CSV import-export and PNG export (`src/App.tsx`, `src/sheets/export.ts`, `src/sheets/import.ts`).
- React Flow alignment, distribution, grouping, and toast/onboarding flows functioning (`src/diagram/alignment.ts`, `src/diagram/grouping.ts`, `APPEARANCE_LOG.md`).
- Issues/Risks: some sidebar catalog entries still reference legacy `boxNode` variants instead of specialized nodes; template library missing new visuals; export to SVG/shareable links not yet implemented; zh translations corrupted; need UX polish for nested grouping and advanced LOD controls.

## Backend / Services
- No backend services exist yet; all persistence is client-side. Roadmap still calls for shareable URLs and potentially collaborative features (`README.md`, `VISUAL_VOCABULARY_IMPLEMENTATION.md` next steps).
- Need architecture decision for future storage (serverless endpoint, Supabase/Firebase, or custom API) and auth strategy before enabling multi-user features.

## Data Model & Storage
- Centralized design tokens and ML parameter schemas live under `src/data`, providing defaults, validation, and helper APIs (`SCHEMA_INTEGRATION_LOG.md`, `src/data/designTokens.ts`, `src/data/componentSchemas.ts`, `src/data/index.ts`).
- Diagram persistence limited to in-memory Zustand store plus localStorage/CSV/JSON interchange; no migration/versioning yet.
- Outstanding gaps: schema versioning, preset management, remote persistence strategy, and ensuring sidebar/template data stays in sync with schema defaults.

## Testing & Quality Assurance
- No automated tests in repo; build relies on manual verification and documented checklists (`IMPLEMENTATION_STATUS.md`, `VISUAL_VOCABULARY_IMPLEMENTATION.md`, `ERROR_FIXES_COMPLETE.md` testing sections).
- Manual QA items remain unchecked (e.g., zoom-level verification for new nodes, drag/drop validation of Flatten/Embedding/Normalization nodes).
- Next steps: add component/unit coverage (Vitest/RTL) for schema utilities and stores, introduce E2E smoke flows (Playwright/Cypress) for drag/drop and export operations, and create visual regression plan for SVG nodes.

## Documentation & Localization
- Extensive design and implementation logs exist but several Markdown files contain mojibake (`APPEARANCE_LOG.md`, `docs/��1�>r�?����.md`, zh locale files), risking miscommunication.
- Need pass to consolidate overlapping specs (`ML_Visual_Vocabulary_v1.md` vs `visual.md`) and provide English+clean Chinese copies, plus authoring guidelines for future contributions.

