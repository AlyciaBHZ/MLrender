# UI Design Lock: ML‑CD Node Visuals, Ports, and LOD

This document locks the visual system so engineering can implement without churn. It reflects the agreed spec.

## 1) Silhouette & Color (per family)

- Data/Input/Output: rounded-rect + side chevrons — `mlcd.data`
- Tensor: stacked slices, front grid — `mlcd.tensor` (alt: `mlcd.tensor-alt`)
- Dense/MLP: vertical lines / mini-bars — `mlcd.linear`
- Conv: cuboid + front grid + kernel badge — `mlcd.linear-alt`
- Pool: 2×2 cell + glyph (∧ / ≈ / ⦿) — `mlcd.pool`
- Activation: diamond (default), circle alt — `mlcd.activation-g` (alt: `mlcd.activation-o`)
- Norm: bell curve + dashed center — `mlcd.norm`
- Dropout: perforated/dotted mask — `mlcd.aux`
- Embedding: matrix → vector — `mlcd.data-alt`
- Flatten: stack → bar — `mlcd.tensor-alt`
- Attention: QKᵀV or heads fan — `mlcd.attn`
- RNN/LSTM/GRU: loop arrow badge — `mlcd.rnn`
- Loss: red circle with L/∑ — `mlcd.loss`
- Optimizer: gear-in-circle — `mlcd.optimizer`
- Group: dashed container — `mlcd.data-neutral`

Tokens added: `mlcd.data-alt`, `mlcd.tensor-alt`, `mlcd.attn` (see `tailwind.config.js`, `src/styles/tailwind.css`).

## 2) Port Conventions

- Default: left IN (square), right OUT (square).
- Aux ports (top/bottom): allowed for Tensor, Conv, Attention.
- Gate handles = diamond; Function handles = round.
- Residual edges default dashed (already in `ResidualEdge`).

Handle classes are exported in `src/nodes/common/ports.ts`:
- `HANDLE_SQUARE`, `HANDLE_ROUND`, `HANDLE_DIAMOND`.

## 3) LOD Rules

- Always visible: type ribbon, corner marker, main label.
- Hide details when: node.height < 64px OR zoom < 0.5.
- Ultra-simple when: node.height < 48px OR zoom < 0.35 (silhouette only).

Constants exported in `src/ui/spec.ts` (`LOD_RULES`).

## 4) Semantic Colors

- Default: semantic colors locked ON (users can switch to custom).
- Constant: `SEMANTIC_COLORS_LOCKED_DEFAULT = true` in `src/ui/spec.ts`.

## 5) Engineering Notes

- Node family defaults (silhouette, colors) are tracked in `FAMILY_VISUALS` (`src/ui/spec.ts`).
- PropertiesPanel should expose visual controls: shape variant (where applicable), visual density/LOD, type ribbon toggle, color mode (semantic/custom).
- Sidebar should use thumbnails that reflect the silhouettes above.
- CSV export/import should include: `shapeVariant`, `visualDensity`, `lod`, `semanticColor`, `typeRibbon`.

