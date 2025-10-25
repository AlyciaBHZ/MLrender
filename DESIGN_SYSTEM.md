# ML Concept Designer - Academic Design System

This document describes the academic-style visual design system implemented for ML architecture diagram nodes, following conventions from papers published in CVPR, NeurIPS, ICLR, and other top-tier ML conferences.

## Design Philosophy

The node designs follow these principles from academic literature:
1. **Shape conveys function** - Different layer types use distinct geometric shapes
2. **3D perspective shows dimensionality** - Spatial operations use 3D representations
3. **Visual metaphors** - Shapes reflect the mathematical operations (e.g., trapezoid for downsampling)
4. **Consistent color palette** - Each node category has a dedicated color scheme
5. **Minimal but informative** - Clean designs with essential visual cues

## Node Type Reference

### 1. Fully Connected (FC) Layer
**Shape:** Vertical rectangle with parallel vertical lines
**Color:** Royal Blue (#4169E1)
**Academic Convention:** Used in papers to show dense/linear transformations
**Visual Elements:**
- Vertical orientation (standard for FC layers)
- Parallel lines representing neuron connections
- Top/bottom connection points (vertical flow)

**File:** `src/nodes/FCNode.tsx`

---

### 2. Convolutional Layer
**Shape:** 3D Cuboid with perspective
**Color:** Dark Orange (#FF8C00)
**Academic Convention:** Standard representation from AlexNet, VGG, ResNet papers
**Visual Elements:**
- 3D box showing spatial dimensions (H × W × C)
- Grid pattern on front face (convolution kernels)
- Gradient fill showing depth
- Isometric perspective

**File:** `src/nodes/ConvNode.tsx`

---

### 3. Activation Function
**Shape:** Diamond (rotated square)
**Color:** Lime Green (#32CD32)
**Academic Convention:** Diamond shape distinguishes non-linear operations
**Visual Elements:**
- Diamond orientation (45° rotation)
- Internal curve representing activation function
- Centered label for function name (ReLU, Sigmoid, etc.)

**File:** `src/nodes/ActivationNode.tsx`

---

### 4. Pooling Layer
**Shape:** Trapezoid (wider top, narrower bottom)
**Color:** Light Sea Green (#20B2AA)
**Academic Convention:** Trapezoid visually represents spatial downsampling
**Visual Elements:**
- Inverted trapezoid showing size reduction
- Grid pattern showing pooling windows
- Downward arrow indicating dimension reduction
- Label indicating pooling type (Max, Avg)

**File:** `src/nodes/PoolingNode.tsx`

---

### 5. Normalization Layer
**Shape:** Parallelogram (skewed rectangle)
**Color:** Medium Purple (#9370DB)
**Academic Convention:** Parallelogram represents data transformation/normalization
**Visual Elements:**
- Skewed shape suggesting distribution shift
- Horizontal lines showing data centering
- μ,σ symbols (mean and standard deviation)
- Bidirectional arrows showing normalization

**File:** `src/nodes/NormalizationNode.tsx`

---

### 6. Tensor/Data
**Shape:** 3D Stacked rectangles
**Color:** Cadet Blue (#5F9EA0)
**Academic Convention:** Stacked layers show multi-dimensional arrays
**Visual Elements:**
- Multiple offset rectangles (showing depth)
- Grid on front layer (matrix structure)
- Gradient opacity from back to front
- Configurable depth parameter

**File:** `src/nodes/TensorNode.tsx`

---

### 7. Multi-Layer Perceptron (MLP)
**Shape:** Neural network diagram with connected neurons
**Color:** Dark Orchid (#8B4789)
**Academic Convention:** Classic neural network visualization
**Visual Elements:**
- Multiple layers of circles (neurons)
- Connection lines between layers
- Input → Hidden → Output labels
- Dashed container border

**File:** `src/nodes/MLPNode.tsx`

---

## Color Palette

The color scheme follows academic conventions where warm colors represent transformations and cool colors represent data/structure:

```typescript
{
  // Core layers
  fc: '#4169E1',           // Royal blue
  conv: '#FF8C00',         // Dark orange
  pool: '#20B2AA',         // Light sea green

  // Operations
  activation: '#32CD32',   // Lime green
  norm: '#9370DB',         // Medium purple

  // Advanced
  attention: '#DC143C',    // Crimson
  rnn: '#8B4789',          // Dark orchid

  // Data & I/O
  data: '#4682B4',         // Steel blue
  tensor: '#5F9EA0',       // Cadet blue

  // Utility
  dropout: '#A9A9A9',      // Dark gray
  loss: '#B22222',         // Firebrick
  group: '#708090',        // Slate gray
}
```

**File:** `src/ui/tokens.ts`

---

## Visual Hierarchy

### Border Weights
- **Primary nodes** (Conv, FC): 2.5px stroke
- **Secondary nodes** (Activation, Norm): 2px stroke
- **Container nodes** (Group, MLP): 1.5px dashed stroke

### Sizing Standards
- **Minimum widths:** 80-160px depending on complexity
- **Minimum heights:** 100-160px for 3D visualizations
- **Aspect ratios:** Maintained for geometric consistency

### Handle Design
- **Shape:** Small squares (3×3px) for orthogonal connections
- **Color:** Matches node color
- **Border:** 2px white border for contrast
- **Position:** Strategically placed based on flow direction

---

## Academic References

This design system is inspired by visualization conventions from:

1. **CNN Architectures** (AlexNet, VGG, ResNet)
   - 3D cuboids for convolutional layers
   - Trapezoids for pooling operations

2. **Attention Mechanisms** ("Attention is All You Need")
   - Distinct shapes for different operations
   - Clear separation of layer types

3. **Neural Network Diagrams** (Classic papers)
   - Connected neurons for MLP visualization
   - Vertical rectangles for fully connected layers

4. **Data Flow Diagrams** (TensorFlow, PyTorch docs)
   - Stacked rectangles for tensors
   - Directional flow indicators

---

## Implementation Notes

### SVG-Based Rendering
All node shapes use SVG for:
- Scalability at any zoom level
- Precise geometric control
- Gradient and pattern support
- Crisp rendering on high-DPI displays

### React Flow Integration
- Uses `NodeResizer` for dynamic sizing
- `Handle` components for connections
- `selected` state for visual feedback
- `data` props for customization

### Performance Considerations
- Memoized styles prevent unnecessary re-renders
- Inline SVG avoids external asset loading
- Minimal DOM elements per node
- Efficient gradient definitions

---

## Usage Example

```typescript
// Using the academic-style FCNode
const node = {
  id: '1',
  type: 'fc',
  data: {
    label: 'Dense 512',
    formulaLabel: 'W x + b',
    color: '#4169E1'
  },
  position: { x: 100, y: 100 }
};
```

---

## Future Enhancements

Potential additions to the design system:
1. **Attention Node** - Specialized visualization for attention mechanisms
2. **RNN/LSTM Node** - Recurrent connection indicators
3. **Residual Connection** - Distinct edge style for skip connections
4. **Dropout Visualization** - Dashed/transparent effect
5. **Loss Function Node** - Target-style circular design

---

## Accessibility

All nodes include:
- `aria-label` attributes for screen readers
- Sufficient color contrast (WCAG AA compliant)
- Focus indicators for keyboard navigation
- Semantic data attributes for testing

---

## Credits

Design system created following conventions from:
- CVPR, NeurIPS, ICLR paper diagrams
- TensorFlow and PyTorch documentation
- Neural Network visualization literature
- Classic ML textbooks (Goodfellow, Bishop)

Last updated: 2025-10-15
