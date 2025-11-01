# ML Concept Designer (ML-CD)

Interactive editor for machine learning diagrams built with React, TypeScript, Vite, Tailwind, React Flow, and Zustand. Create clean, academic-style figures (BioRender-for-ML vibe) with drag-and-drop components, LaTeX labels, alignment, grouping, and export.

## Getting Started
- Prerequisites: Node.js 18+
- Install: `npm install`
- Dev server: `npm run dev` (opens at `http://localhost:5173`)
- Build: `npm run build`

## Current Tasks (P3.2 / P3.3 / P5.1)
- Date: 2025-10-14
- P3.2 Alignment (F_ALIGN): [x] Done — toolbar controls in `src/components/Toolbar.tsx`
- P3.3 Grouping (F_GROUP): [ ] TODO — refine UX, nested grouping rules
- P5.1 Export (F_EXPORT): [ ] TODO — more formats (SVG/Mermaid), shareable links

Tips:
- When updating this section, run `npm run progress:date` to refresh the date line.
- Use "Update:" notes concisely to record feature increments.

## Core Tech Stack
- React 18 + TypeScript 5
- Vite 5 + @vitejs/plugin-react
- Tailwind CSS 3 + PostCSS + Autoprefixer
- React Flow 11 (DnD canvas + nodes/edges)
- Zustand 4 (state)
- html-to-image (PNG export)

## Features
- Resizable nodes, custom edges, properties panel, quick panel
- i18n (English/Chinese) with react-i18next
- Grid + snap-to-grid, minimap, fit/center, keyboard shortcuts
- LaTeX formula labels via KaTeX (CDN) with fallback
- JSON save/load; CSV export/import (nodes/edges)

## Key Files
- `src/diagram/DiagramCanvas.tsx` — React Flow canvas and interactions
- `src/diagram/DiagramState.ts` — nodes/edges store, undo/redo, grouping
- `src/nodes/*` — node components (FC/Conv/Data/Circle/Tensor/Activation/etc.)
- `src/edges/*` — custom edges (simple/residual)
- `src/components/*` — Sidebar/Toolbar/PropertiesPanel UI
- `src/sheets/*` — CSV import/export
- `src/data/*` — design tokens + parameter schemas

## Notable Updates
- P1.1 (F_RES): Node resizing with `@reactflow/node-resizer`
- P1.2 (F_LATEX): `formulaLabel` rendering via KaTeX; PropertiesPanel input
- P1.3 (F_EDGE_PROP): Edge color/label/arrow/residual settings
- P2.1 (F_I18N): i18next integration with en/zh locales
- P2.2 (F_GRID): Snap to grid + dot background
- P2.3 (F_CODE): Node refactors, consistent data types and min sizes
- P3.1 (F_UNDO): Undo/redo stacks, toolbar buttons + shortcuts
- P3.2 (F_ALIGN): Align/distribute actions in toolbar
- P3.3 (F_GROUP): Group/ungroup actions; group node type
- CSV Schema: `formula` column persisted for nodes

## Vision & Roadmap (excerpt)
- More ML components (CNN/RNN/Transformer), data/process/operators
- Additional exports (SVG/Mermaid), shareable URLs
- Prompt-to-diagram exploration

## Internationalization
- Locale files: `src/i18n/locales/en/translation.json`, `src/i18n/locales/zh/translation.json`
- Initialize in `src/i18n/index.ts` (English is the fallback)

## LaTeX Notes
- KaTeX assets are included via CDN in `index.html`
- `MathText` component renders `data.formulaLabel`; falls back to text

## CSV Schema
- Nodes header: `id,type,label,formula,color,shape,width,height,x,y`
- Edges header: `id,source,target,type,stroke,arrow,residual`

---
This README was cleaned for UTF-8 and clarity. Older garbled text was removed; see commit history for prior updates.
