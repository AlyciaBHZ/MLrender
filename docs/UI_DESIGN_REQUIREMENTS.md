# UI Design Requirements – ML Visual Vocabulary

## Problem Statement
Flatten, Embedding, Normalization, Pooling, Dropout, Attention, and RNN nodes previously reused generic rectangles or circles distinguished only by color. That breaks the expectation that each ML component should carry an academically recognized visual metaphor (similar to how sigmoid/tanh curves instantly communicate their functions).

## Goals
1. **Recognizable at a glance** – Follow silhouettes seen in CVPR/NeurIPS/ICLR papers.
2. **Parameter-aware** – Reserve space for kernel/stride/head counts/etc.
3. **Export-ready** – Icons must read clearly at 60–80 px in PNG/SVG outputs.

## Reference Icons (keep as benchmarks)
- **Sigmoid:** circular badge with S-shaped curve (`σ(x) = 1/(1+e^{-x})`).
- **Tanh:** circular badge with symmetric curve clamped to ±1.

These succeed because they render the actual mathematical shape users expect.

## Component Requirements

### 1. Flatten
- **Metaphor:** 3‑D tensor unrolled into a single vector.
- **Shape:** stacked cube (depth visible) → arrow → horizontal bar segmented into cells.
- **Labels:** `[C×H×W] → [C·H·W]`.

### 2. Embedding
- **Metaphor:** sparse token IDs mapped to dense vectors.
- **Shape:** dotted token bubbles feeding into a gradient matrix, exiting as horizontal vectors.
- **Labels:** `vocab`, `embedDim`, optional `dropout`.

### 3. Pooling
- **Metaphor:** downsampling window.
- **Shape:** 2×2 grid with highlighted cell and downward arrow.
- **Glyphs:** `⊕` (max), `AVG` or `∑/N` (avg), globe icon (global).
- **Labels:** `kernel`, `stride`, `type`.

### 4. Normalization
- **Metaphor:** distribution reshaping.
- **Shape:** dashed Gaussian (input) + solid Gaussian (output) over a central mean line with variance brackets.
- **Labels:** `ε`, `groups` (when relevant), `normType`.

### 5. Dropout
- **Metaphor:** neurons masked randomly.
- **Shape:** grid of nodes with perforated overlay; some nodes crossed out.
- **Labels:** `p = keep probability`, optional `seed`.

### 6. Attention
- **Metaphor:** Q/K/V projections and multi-head softmax.
- **Shape:** three channels labeled Q/K/V into a softmax lens that fans out across multiple heads before recombining.
- **Labels:** `numHeads`, `embedDim`, `dropout`.

### 7. RNN / LSTM / GRU
- **Metaphor:** recurrent capsule with gate indicators.
- **Shape:** rounded capsule containing gate icons (F/I/O or U/R) plus loop arrow; optional double arrow for bidirectionality and stack badge for `numLayers`.
- **Labels:** `cellType`, `hiddenSize`, `numLayers`, `bidirectional`, `dropout`.

## Delivery Checklist
- Sidebar thumbnails, template previews, and canvas nodes must share the same silhouettes.
- NodeView should expose type ribbons, corner markers, and semantic palette hooks for every new component.
- CSV/JSON schema must include `shapeVariant`, `visualDensity`, `semanticColor`, and component-specific params.
- QA review: verify readability at 50 %, 100 %, 200 % zoom levels and in exported PNGs.
