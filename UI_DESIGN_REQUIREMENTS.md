# UI Design Requirements for ML Component Visual Vocabulary

## Current Issue

**Problem:** Many nodes (Flatten, Embedding, Normalization, Pooling, etc.) currently use generic shapes with only color differences, lacking distinctive **scientifically-recognized visual metaphors** that ML engineers would immediately recognize.

**Goal:** Each node type should have a **well-acknowledged, academically-standard visual representation** - similar to how everyone recognizes the S-curve of sigmoid or the shape of tanh.

---

## Existing Good Examples (Reference These)

### ✅ Sigmoid & Tanh Icons (GOOD - Recognizable curves)
These icons show the **actual mathematical curves** that ML engineers recognize:

**Sigmoid Icon:**
```
Circle + S-shaped curve (logistic function)
- Everyone knows this shape: σ(x) = 1/(1+e^(-x))
```

**Tanh Icon:**
```
Circle + Hyperbolic tangent curve
- Symmetric around origin, saturates at ±1
```

**Why these work:**
- Use **mathematical shape** as the visual identity
- Instantly recognizable to anyone who studies ML
- Academic papers use these exact curve shapes

---

## Components Needing Academic Visual Design

### Priority 1: Critical Operations (Need Immediate Redesign)

#### 1. **Flatten Node**
**Current:** Generic stack→bar
**Problem:** Not academically distinctive

**Academic Visual Standard:**
- **Textbooks show:** 3D tensor → flat 1D vector (like unrolling a cube into a line)
- **Papers show:** Multi-layer stack collapsing into single row
- **Recognizable metaphor:** "Unrolling" or "Vectorizing"

**Visual Requirements:**
```
Input side: 3D cube/stack with depth layers visible
   ↓ (transformation arrow)
Output side: Single horizontal bar/vector
```

**References to provide:**
- How conv feature maps (H×W×C) flatten to FC input
- ResNet diagrams showing reshape operations
- Any academic paper showing "flatten" or "reshape" operation

---

#### 2. **Embedding Node**
**Current:** Generic box (presumably - not verified)
**Problem:** No distinctive visual

**Academic Visual Standard:**
- **Textbooks show:** Lookup table / sparse indices → dense vectors
- **Word2Vec papers show:** One-hot vector → continuous embedding space
- **Transformer papers show:** Token IDs → embedding matrix lookup

**Visual Requirements:**
```
Input: Sparse representation (dotted/discrete points or indices)
   ↓
Embedding Matrix (grid/table shown as middle layer)
   ↓
Output: Dense vector representation (solid filled bars)
```

**Alternative metaphor:**
- Dictionary/lookup table icon
- Grid with highlighted row being extracted

**References to provide:**
- Word2Vec embedding visualization
- Transformer embedding layer diagrams
- NLP paper showing token → vector conversion

---

#### 3. **Pooling Node** (Already has 2 modes, but need improvement)
**Current:** Funnel mode (3 lines→circle→line) or Grid mode

**Academic Visual Standard:**
- **MaxPool papers show:** 2×2 or 3×3 grid with max value highlighted
- **Textbooks show:** Sliding window over feature map, selecting max/avg
- **Recognizable metaphor:** "Downsampling" with aggregation

**Visual Requirements (Enhanced):**
```
Option A (Grid-based - PREFERRED):
┌─┬─┐
├─┼─┤  →  ┌─┐
├─┼─┤     └─┘
└─┴─┘
(4 cells → 1 cell, with max/avg indicator)

Option B (Spatial downsampling):
Large feature map → Smaller feature map
(Show dimension change like 224×224 → 112×112)
```

**Type indicators:**
- **MaxPool:** Show "max" operation (↑ arrow or highlight brightest cell)
- **AvgPool:** Show averaging (≈ symbol or blur effect)
- **GlobalPool:** Show entire map → single value

**References to provide:**
- CNN architecture diagrams (AlexNet, VGG, ResNet)
- Pooling layer visualizations from CS231n
- Feature map downsampling illustrations

---

#### 4. **Normalization Node** (BatchNorm, LayerNorm, InstanceNorm)
**Current:** Parallelogram with distribution curves
**Problem:** Generic statistical diagram, not distinctive per normalization type

**Academic Visual Standard:**
- **BatchNorm papers show:** Mini-batch axis normalization
- **LayerNorm papers show:** Feature dimension normalization
- **Visual distinction:** Different axes being normalized

**Visual Requirements:**
```
BatchNorm:
- Show multiple samples (mini-batch) being normalized together
- Visual: Vertical columns → all normalized to same distribution
- Axis indicator: "batch axis" or B×C×H×W with B highlighted

LayerNorm:
- Show single sample, features normalized
- Visual: Horizontal features → normalized within sample
- Axis indicator: Feature/channel dimension highlighted

Formula (common to all):
(x - μ) / σ  (can keep this)
```

**Alternative approach:**
- Show **3D tensor** with different axes highlighted for different norm types
- BatchNorm: Normalize across batch dimension (vertical)
- LayerNorm: Normalize across feature dimension (horizontal)
- InstanceNorm: Normalize per sample per channel

**References to provide:**
- BatchNorm paper (Ioffe & Szegedy 2015)
- LayerNorm paper (Ba et al. 2016)
- Diagrams showing which axes are normalized
- Transformer architecture (uses LayerNorm)

---

#### 5. **Attention/Self-Attention Node**
**Current:** Probably generic box
**Problem:** Attention is THE most important mechanism in modern ML

**Academic Visual Standard (CRITICAL):**
- **Transformer paper shows:** Q, K, V matrices → attention weights → output
- **Recognizable metaphor:** "Weighted focus" or "Query-Key matching"
- **Visual iconography:** Bipartite graph showing attention connections

**Visual Requirements:**
```
Preferred Design (Bipartite Attention):
Input Sequence:  [A] [B] [C]
                  ↓↘↙ ↓↘↙ ↓↘↙  (attention weights)
Output Sequence: [A'] [B'] [C']

Alternative Design (Query-Key-Value):
Q → ┐
K → ├─→ Attention → Output
V → ┘
```

**Multi-Head Attention:**
- Show multiple parallel attention mechanisms
- Visual: Multiple smaller attention blocks in parallel

**Self-Attention:**
- Show sequence attending to itself (circular/reflexive connections)

**References to provide:**
- "Attention Is All You Need" paper (Vaswani et al. 2017)
- Illustrated Transformer blog post
- Attention weight heatmaps
- Any modern NLP/Vision paper showing attention diagrams

---

#### 6. **RNN/LSTM/GRU Node**
**Current:** Unknown (probably generic box)
**Problem:** Recurrent connections are distinctive

**Academic Visual Standard:**
- **RNN papers show:** Loop/cycle showing temporal recurrence
- **LSTM papers show:** Cell state with gates (forget, input, output)
- **Recognizable metaphor:** "Memory flow through time"

**Visual Requirements:**
```
RNN:
┌───┐
│ h │ ← (self-loop showing recurrence)
└───┘
  ↑ x_t (input)

LSTM:
Show 3-4 gates as small circles/boxes:
- Forget gate (×)
- Input gate (+)
- Output gate (σ)
- Cell state (C_t) flowing through

GRU (simplified):
2 gates (update, reset)
```

**References to provide:**
- Colah's blog "Understanding LSTM Networks"
- Original LSTM paper diagrams
- RNN unrolling visualization
- GRU architecture diagram

---

### Priority 2: Supporting Operations

#### 7. **Dropout Node**
**Current:** Unknown
**Need:** Show neurons being "dropped" (crossed out or faded)

**Visual:**
```
○ ○ ○ ○ ○  →  ○ ⊗ ○ ⊗ ○
(some neurons crossed out randomly)
```

---

#### 8. **Concatenate/Merge Node**
**Visual:** Multiple input streams merging into single output
```
─┐
─┤→
─┘
```

---

#### 9. **Split/Fork Node**
**Visual:** Single input splitting into multiple outputs
```
  ┌─
→─┼─
  └─
```

---

#### 10. **Residual Connection** (Skip Connection)
**Current:** Dashed edge in edge types
**Need:** Also visual node representation for "Add" operation

**Visual:**
```
Main path: ─────→
              ⊕  (addition circle)
Skip path: ─────↗
```

---

## Design Specifications for UI Designer

### Canvas & Context
- **Canvas size:** Nodes are typically 80-200px wide, 60-150px tall
- **SVG-based:** All visuals are SVG paths/shapes
- **Viewbox:** Usually 100-150 units wide, 60-120 units tall
- **Style:** Minimalist, academic, monochromatic with accent color
- **Color:** Each node has a `color` prop (single accent color)
- **Text:** Minimal - node type label + optional formula

### Design Constraints
1. **Recognizability:** ML engineers should recognize the operation instantly
2. **Scalability:** Must work at small sizes (80×60px minimum)
3. **Distinctiveness:** Each node type must be visually unique even in grayscale
4. **Academic accuracy:** Follow conventions from papers/textbooks
5. **Simplicity:** Avoid decorative elements, focus on operation metaphor

### Deliverable Format

For each node type, please provide:

#### 1. **Conceptual Sketch**
- Hand-drawn or digital sketch showing the core visual metaphor
- Annotate which part represents input, operation, output

#### 2. **SVG Markup** (Preferred) OR **Figma/Design File**
```xml
<svg viewBox="0 0 120 80">
  <defs>
    <!-- Gradients, filters if needed -->
  </defs>

  <g id="main-visual">
    <!-- Core shapes representing the operation -->
  </g>

  <text><!-- Type label --></text>
</svg>
```

#### 3. **Reference Images**
- Screenshot from academic paper showing this operation
- Link to textbook diagram
- Any well-known visualization of this operation

#### 4. **Visual Rationale**
- Short explanation (2-3 sentences) of why this visual metaphor is appropriate
- What aspect of the operation does it emphasize?

---

## Reference Materials to Provide

Please provide to the UI designer:

### 1. **Academic Papers with Diagrams:**
- AlexNet, VGG, ResNet (conv + pooling)
- Batch Normalization (Ioffe & Szegedy 2015)
- Layer Normalization (Ba et al. 2016)
- Attention Is All You Need (Vaswani et al. 2017)
- LSTM/GRU original papers

### 2. **Educational Resources:**
- CS231n lecture slides (CNN visualizations)
- Colah's blog (LSTM, attention)
- Distill.pub articles (interactive ML visualizations)
- Deep Learning book (Goodfellow et al.) - architecture diagrams

### 3. **Existing Tools (for inspiration):**
- NN-SVG (neural network diagram generator)
- TensorBoard graph visualizations
- Netron (neural network visualizer)
- Draw.io ML shapes library

### 4. **Visual Grammar Examples:**
- How do papers show "flatten"? (unrolling, reshaping)
- How do papers show "attention"? (bipartite graphs, heatmaps)
- How do papers show "recurrence"? (loops, unrolled diagrams)
- How do papers show "normalization"? (distribution shifts)

---

## Current Implementation Notes

### Existing Node Structure (for designer reference):
```typescript
// Each node is a React component with SVG visualization
<div className="node-container">
  <svg viewBox="0 0 Width Height">
    <defs>
      <!-- Gradients, filters, markers -->
    </defs>

    <g data-selected={selected}>
      <!-- Main visual here -->
    </g>

    <text>Type Label</text>
    <text>Node Label</text>
  </svg>
</div>
```

### Visual Elements Available:
- SVG paths, rects, circles, polygons
- Linear/radial gradients
- Drop shadows (filters)
- Dashed/dotted lines
- Text (formulas, labels)
- Markers (arrows)
- Opacity, stroke-width control

### Color System:
- Primary color (from node data)
- Gradients use color with varying opacity
- Shadows use color with low opacity
- Text: gray scale (#6b7280, #374151)

---

## Priority Ranking

**Immediate Priority (Week 1):**
1. Attention/Self-Attention (most critical for modern ML)
2. Flatten (very common operation)
3. Embedding (essential for NLP/Transformers)

**High Priority (Week 2):**
4. Normalization types (BatchNorm vs LayerNorm distinction)
5. RNN/LSTM/GRU (temporal models)
6. Pooling (improve current design)

**Medium Priority (Week 3+):**
7. Dropout visualization
8. Concat/Split/Merge nodes
9. Residual/Skip connection nodes

---

## Questions for UI Designer

1. Do you need access to the codebase to see existing node implementations?
2. What design tool do you prefer? (Figma, Sketch, Illustrator, hand-drawn + SVG)
3. Do you have access to academic papers, or should we provide PDF excerpts?
4. Preferred timeline for initial mockups? (suggest: 3-5 nodes in first batch)
5. Do you want a video call to walk through the current UI and explain the context?

---

## Success Criteria

A successful design will:
- ✅ Be immediately recognizable to ML engineers
- ✅ Follow academic/industry conventions from papers
- ✅ Work at small sizes (80×60px)
- ✅ Be visually distinct from all other node types
- ✅ Use minimal visual elements (not cluttered)
- ✅ Incorporate the mathematical essence of the operation
- ✅ Match the existing visual style (minimalist, SVG-based)

---

## Contact & Iteration

After receiving initial designs:
1. We'll implement 1-2 as prototypes
2. Review with team + test with ML engineers
3. Iterate based on feedback
4. Scale to remaining node types

**Expected output:** SVG code + reference images + design rationale for each node type.
