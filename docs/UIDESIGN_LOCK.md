# UI Design Lock: ML‑CD Node Visuals, Ports, and LOD

This document locks the agreed visual system so engineering can implement without churn.

## 1. Silhouette & Color Families
- **Data/Input/Output:** rounded rectangle with side chevrons → `mlcd.data`
- **Tensor:** stacked slices with a front grid → `mlcd.tensor` (alt `mlcd.tensor-alt`)
- **Dense/MLP:** vertical bars / mini histograms → `mlcd.linear`
- **Convolution:** cuboid with front kernel badge → `mlcd.linear-alt`
- **Pooling:** 2×2 cell with glyph (max/avg/global) → `mlcd.pool`
- **Activation:** diamond default, circle alternate → `mlcd.activation-g` / `mlcd.activation-o`
- **Normalization:** bell curve plus dashed center line → `mlcd.norm`
- **Dropout:** perforated mask motif → `mlcd.aux`
- **Embedding:** matrix feeding a vector → `mlcd.data-alt`
- **Flatten:** stacked volume collapsing to a bar → `mlcd.tensor-alt`
- **Attention:** Q-K-V triad or multi-head fan-out → `mlcd.attn`
- **RNN/LSTM/GRU:** loop-arrow badge → `mlcd.rnn`
- **Loss:** red disc with “L”/ℓ glyph → `mlcd.loss`
- **Optimizer:** gear-in-circle → `mlcd.optimizer`
- **Group:** dashed container → `mlcd.data-neutral`

Token additions: `mlcd.data-alt`, `mlcd.tensor-alt`, `mlcd.attn`. See `tailwind.config.js` and `src/styles/tailwind.css`.

## 2. Port Conventions
- Default port layout: left IN (square), right OUT (square).
- Auxiliary ports (top/bottom) allowed for Tensor, Conv, Attention.
- Gate handles use the diamond style; function handles use the round style.
- Residual edges default to dashed styling (see `ResidualEdge`).

Shared handle classes live in `src/nodes/common/ports.ts` (`HANDLE_SQUARE`, `HANDLE_ROUND`, `HANDLE_DIAMOND`).

## 3. Level of Detail (LOD)
- Always visible: type ribbon, corner marker, main label.
- Hide detail when `height < 64px` or `zoom < 0.5`.
- Collapse to silhouette-only when `height < 48px` or `zoom < 0.35`.

Constants exported from `src/ui/spec.ts` (`LOD_RULES`).

## 4. Semantic Colors
- Semantic palette is enabled by default (`SEMANTIC_COLORS_LOCKED_DEFAULT = true` in `src/ui/spec.ts`).
- Users can opt into custom colors, but lock remains on for new nodes/templates.

## 5. Engineering Notes
- Node family defaults (silhouettes, colors) live in `FAMILY_VISUALS` (`src/ui/spec.ts`).
- PropertiesPanel must expose: shape variant (if applicable), visual density/LOD, type ribbon toggle, color mode (semantic/custom).
- Sidebar thumbnails should reflect the silhouettes above.
- CSV import/export must persist `shapeVariant`, `visualDensity`, `lod`, `semanticColor`, and `typeRibbon`.
