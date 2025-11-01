# ML-CD Visual & Component Spec (Draft)

This document captures the visual language and UI conventions used by ML-CD. It complements the code in `src/ui`, `src/data`, and `src/styles`.

## 1) Project & Goal
- Provide a fast, consistent way to sketch ML architectures.
- Balance clarity (academic figures) with practical UI affordances.

## 2) Design Goals
- Consistent visual grammar across components (shapes, colors, ports).
- Minimal cognitive load: defaults that look good; sensible min sizes.
- Accessibility: legible labels, sensible contrast, keyboard support.
- Export-friendly visuals (PNG now; future SVG/Mermaid).

## 3) Color & Tokens
- Colors are driven by CSS variables (HSL) defined in `src/styles/tailwind.css`.
  - `--mlcd-canvas`, `--mlcd-grid-dot`, `--mlcd-stroke`, `--mlcd-label`, etc.
- Tailwind maps semantic tokens in `tailwind.config.js` (e.g., `mlcd.canvas`).
- Node role palette: see `src/ui/tokens.ts` (`NodeRoleColor`).

## 4) Components & Shapes
- Core layers: FC/MLP (rectangles), Conv/Pool (rectangles), Activations (circles/diamonds), Tensor (tensor glyph), Group (dashed rectangle).
- Ports/handles: use React Flow `Handle` with accessible hit areas; selected states increase stroke width.
- Labels: `data.label` (text) and `data.formulaLabel` (KaTeX) — formula takes precedence when provided.

## 5) Canvas & Grid
- Canvas background color via `--mlcd-canvas`.
- Dot grid via React Flow `<Background>` with `--mlcd-grid-dot` color.
- Snap to grid is toggleable (default on); grid size adjustable (5–100 px).

## 6) CSV Export/Import
- Nodes CSV header: `id,type,label,formula,color,shape,width,height,x,y`.
- Edges CSV header: `id,source,target,type,stroke,arrow,residual`.
- Mapping logic in `src/sheets/mapping.ts` and helpers in `src/sheets/*`.

## 7) Internationalization
- i18n powered by i18next; English/Chinese locales in `src/i18n/locales/*`.
- See `src/i18n/index.ts` for initialization and override behavior.

## 8) Future
- Additional components (Embedding/Attention/Norm details), advanced grouping, export formats, and improved layout/edge routing.
