# Appearance Update Log

This log captures detailed UI/UX and visual refinements for ML Concept Designer (ML‑CD). The project-level status lives in `PROJECT_PROGRESS.md`; this file records the granular design work this sprint delivered.

## P7.0 – Core UX Stabilization
- **Sidebar scroll lock (F_SCROLL)**  
  `src/components/Sidebar.tsx` now wraps its content with `h-full min-h-0 overflow-y-auto overscroll-contain` so scrolling stays inside the sidebar rather than moving the entire page/canvas.
- **Lasso selection (F_LASSO)**  
  `src/diagram/DiagramCanvas.tsx` enables `selectionOnDrag`, sets `selectionMode=SelectionMode.Partial`, disables `panOnDrag`, and keeps `panOnScroll` for trackpad users.
- **Toolbar simplification (F_ALIGN_UI)**  
  Align/Distribute actions are consolidated into a dropdown (`src/components/AlignmentDropdown.tsx`, `src/components/Toolbar.tsx`) to reduce visual noise.
- **Canvas overlay & onboarding**  
  Empty canvas messaging uses i18n strings, shows a prominent onboarding hint, and template insertion now fires a toast (`src/diagram/DiagramCanvas.tsx`, translations).

## P7.0 – Alignment & Grouping Hardening
- **Alignment engine (F_ALIGN)**  
  `src/diagram/alignment.ts` now calculates in absolute coordinates (parent-aware), clamps width/height, honors snap settings, and pin-distributes using node centers and endpoints.
- **Group selection crash fix (F_GROUP)**  
  `src/diagram/DiagramState.ts`, `src/diagram/grouping.ts`, and `src/nodes/GroupNode.tsx` insert children parent-first, share grouping utilities, drop invalid SVG decorations, and fix collapse glyphs.

## P7.1 – Wave 1 Foundations
- **Schema-driven PropertiesPanel**  
  `src/ui/nodeSchemas.ts` + `src/components/PropertiesPanel.tsx` render activation/conv/fc/tensor schemas with select/number/string/boolean inputs and write changes back to node data.
- **Group-created toast**  
  The store emits `mlcd-group-created`; DiagramCanvas listens and shows a “Group created” toast for quick UX feedback.
- **Build & component cleanup**  
  Removed unused React imports, fixed mojibake in `ActivationNode`, and re-validated the build pipeline.

### Update: Conv Schema Wiring
- ConvNode now mirrors schema values: the front face prints normalized kernel text, side labels list channels/stride/dilation/padding, and NodeView base styling standardizes shadows (`src/nodes/ConvNode.tsx`, `src/nodes/common/NodeView.tsx`, `src/nodes/FCNode.tsx`).

### Update: NodeView Motifs & Port Styles
- `NodeView` exposes `shadowColor`/`elevation` so every node shares the same depth cues.
- Shared port classes in `src/nodes/common/ports.ts` keep handle sizing, shape, and hover states consistent across node families.

## Upcoming (Wave 1 Visuals)
- Finish migrating FC/MLP and Conv nodes onto the shared NodeView silhouette.
- Add sidebar previews for Conv/MLP nodes (mini SVGs).
- Extend schemas with Conv dilation/channels and FC bias toggles.
- Finalize NodeView token hooks (gradients, headers, marker placements).

## Notes
- **Localization:** zh locale keeps technical node names in English; only category labels and UI chrome are translated.
- **Accessibility:** icon buttons include `title`/`aria-label`; dropdowns and collapsible sections report `aria-expanded`.
