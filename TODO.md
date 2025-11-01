# TODO – ML Concept Designer

## UI Design
- [ ] Deliver remaining academic visuals (Attention node, RNN/LSTM/GRU family, residual connectors) and update assets per `ML_Visual_Vocabulary_v1.md`.
- [ ] Refresh sidebar thumbnails to match locked silhouettes and new marker tokens.
- [ ] Audit all design docs for UTF-8 issues; convert corrupt files (e.g., `docs/��1�>r�?����.md`, zh translations) to clean text.
- [ ] Schedule usability review with target ML users for wave 1 visuals.

## Frontend
- [ ] Replace legacy `boxNode` placeholders in `src/data/sidebarData.ts` with dedicated node types (`flattenNode`, `poolingNode`, `embeddingNode`, etc.) and align templates.
- [ ] Extend template catalog to showcase new nodes and common transformer/CNN patterns.
- [ ] Add SVG/Mermaid export pathway and surface in toolbar (`App.tsx`).
- [ ] Harden grouping UX (nested groups, resizing parent) and finalize LOD controls in `NodeView`.
- [ ] Fix zh translation encoding by re-authoring `src/i18n/locales/zh/translation.json`.

## Backend / Persistence
- [ ] Decide on storage strategy for shareable diagrams (e.g., Supabase/Firebase/serverless API) and outline auth requirements.
- [ ] Prototype save/load endpoints and hook optional cloud persistence into Zustand store.
- [ ] Plan for future real-time collaboration (conflict resolution, presence model).

## Data Model & Storage
- [ ] Introduce schema versioning and migration helpers in `src/data`.
- [ ] Create preset management (e.g., ResNet block) leveraging `MLComponentSchemas`.
- [ ] Keep sidebar/template defaults in sync with schema helpers via automated lint/check step.

## Testing & QA
- [ ] Set up Vitest + React Testing Library for stores, schema utilities, and critical components.
- [ ] Add Playwright/Cypress smoke tests covering drag/drop, grouping, export, and undo/redo flows.
- [ ] Implement visual regression snapshots for SVG nodes (Chromatic, Storybook, or Loki).
- [ ] Automate lint/build/test in CI once scripts exist.

## Documentation & Process
- [ ] Consolidate overlapping visual vocabulary docs (`ML_Visual_Vocabulary_v1.md`, `visual.md`) into a single canonical source.
- [ ] Add contributor guide describing schema updates, design-handoff workflow, and testing expectations.
- [ ] Track progress updates via automated script (`npm run progress:date`) tied to release cadence.

