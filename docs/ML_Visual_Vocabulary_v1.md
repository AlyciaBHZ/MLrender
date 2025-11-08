# ML Visual Vocabulary v1

Academic-grade iconography for the first wave of ML‑CD node types. Each entry pairs a conceptual sketch with implementation notes so designers and engineers can keep visuals consistent across the app, sidebar thumbnails, and exports.

## Design Principles
1. **Shape conveys function** – Users should infer the operation from silhouette alone.
2. **Conference-ready styling** – Clean strokes, restrained palette, readable at 60–80 px.
3. **Annotation-friendly** – Reserve negative space for KaTeX labels, parameter tags, and NodeMarker badges.

## Components

### 1. Flatten
- **Concept:** 3‑D tensor collapsing into a 1‑D vector.
- **Visual cues:** stacked cube with depth shading → rightward arrow → horizontal bar segmented into cells.
- **Implementation notes:** use warm palette (#F5B700/#F27970/#5AB5E7), keep arrow centered along midline, reserve space for shape label (e.g., `[C×H×W] → [C·H·W]`).

### 2. Embedding
- **Concept:** sparse token IDs mapped into dense vectors.
- **Visual cues:** dotted circles (tokens) feeding into a matrix gradient block, then into horizontal vectors (headcount = embedding dim).
- **Implementation notes:** depict at least three token samples; color-code source tokens vs embedded outputs; show parameter tags (`dim`, `vocab`) near the matrix.

### 3. Pooling (Max/Avg/Global)
- **Concept:** spatial downsampling over convolutional features.
- **Visual cues:** 2×2 input grid → single highlighted cell or average symbol with downward arrow.
- **Implementation notes:** badge glyphs: `⊕` (max), `∑/4` (avg), globe icon (global). Display `kernel`, `stride`, `type` on the base label.

### 4. Normalization (Batch/Layer/Instance/Group)
- **Concept:** distribution reshaping with mean/variance control.
- **Visual cues:** overlaid Gaussian curves (dashed input, solid output) aligned to a vertical mean line and variance brackets.
- **Implementation notes:** annotate epsilon, groups when relevant; keep palette in teals to differentiate from regularization nodes.

### 5. Dropout
- **Concept:** stochastic neuron masking.
- **Visual cues:** grid of neurons with a dotted overlay; randomly crossed-out cells to indicate drop events.
- **Implementation notes:** show keep probability (`p=0.5`) badge; use animated perforation pattern when selected.

### 6. Attention (Multi-head)
- **Concept:** Q/K/V projections and head fan-out.
- **Visual cues:** three parallel channels labeled Q/K/V feeding a softmax ring, splitting into multi-head arrows that recombine.
- **Implementation notes:** highlight `numHeads`, `embedDim`, `dropout`; NodeMarker uses crimson (#DC143C) accent.

### 7. RNN/LSTM/GRU
- **Concept:** recurrent cell with gates and optional bidirectionality.
- **Visual cues:** capsule silhouette containing arrows, gate icons (F/I/O or U/R), optional double-headed arrow for bi-directional mode.
- **Implementation notes:** indicate `cellType`, `hiddenSize`, `numLayers`, `bidirectional`, `dropout`. Colors shift to dark orchid (#8B4789).

## Usage Guidelines
- Sidebar previews, template thumbnails, and on-canvas nodes should stay visually identical (same corner radius, stroke weight, color tokens).
- When adding new components, duplicate this structure: concept, cues, notes, and palette references.
- Source of truth for palettes and silhouettes lives in `docs/DESIGN_SYSTEM.md` and `src/ui/tokens.ts`.
