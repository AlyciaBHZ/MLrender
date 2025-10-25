# ML Component Data Layer - Usage Guide

This directory contains the centralized configuration system for all ML node components in the diagram editor.

## Overview

The data layer consists of three main files:

1. **`designTokens.ts`** - Node dimensions, colors, and visual specifications
2. **`componentSchemas.ts`** - ML parameter definitions for the PropertiesPanel
3. **`index.ts`** - Centralized exports for easy importing

## File Structure

```
src/data/
├── index.ts                 # Central export file
├── designTokens.ts          # Node size/color configuration
├── componentSchemas.ts      # ML parameter schemas
├── sidebarData.ts           # Sidebar catalog (existing)
├── templates.ts             # Node templates (existing)
└── README.md               # This file
```

---

## 1. Design Tokens (`designTokens.ts`)

### Purpose
Defines default dimensions, colors, and aspect ratios for all ML components, ensuring academic visual grammar compliance.

### Key Features
- ✅ **Phase 3 Audit Compliant** - FC: 80×120 (vertical), MLP: 160×80 (horizontal)
- ✅ **Color Integration** - Uses `NodeRoleColor` from `@/ui/tokens`
- ✅ **Aspect Ratios** - Shape conveys function (FC vertical, MLP horizontal)
- ✅ **Always-Visible Elements** - LOD exceptions for critical identifiers

### Data Structure

```typescript
export interface NodeSizeConfig {
  width: number;
  height: number;
  fillColor: string;
  minWidth: number;
  minHeight: number;
}

export const NodeSizes: Record<string, NodeSizeConfig> = {
  FC_LAYER: {
    width: 80,
    height: 120,
    fillColor: '#4169E1', // NodeRoleColor.fc
    minWidth: 80,
    minHeight: 120,
  },
  // ... more components
};
```

### Usage Examples

#### 1. Get Initial Node Data for Drag-and-Drop

```typescript
import { getInitialNodeData } from '@/data';

const Sidebar = () => {
  const onDragStart = (componentKey: string) => {
    const nodeData = getInitialNodeData(componentKey);
    // nodeData contains: type, data (width, height, color, label), position, style
  };
};
```

#### 2. Validate Node Dimensions on Resize

```typescript
import { validateNodeDimensions } from '@/data';

const NodeResizeHandler = (type: string, newWidth: number, newHeight: number) => {
  const validated = validateNodeDimensions(type, newWidth, newHeight);
  // Ensures dimensions meet minimum requirements
  return validated;
};
```

#### 3. Map Component Key to React Flow Type

```typescript
import { getNodeTypeFromKey } from '@/data';

const createNode = (componentKey: string) => {
  const nodeType = getNodeTypeFromKey(componentKey);
  // FC_LAYER → 'fc', CONV_LAYER → 'conv', etc.
};
```

---

## 2. Component Schemas (`componentSchemas.ts`)

### Purpose
Defines professional ML/DL parameters for each component type, used by PropertiesPanel for dynamic form rendering.

### Key Features
- ✅ **20+ Component Schemas** - Complete coverage (FC, Conv, Pool, Dropout, etc.)
- ✅ **Professional ML Terminology** - Follows PyTorch/TensorFlow conventions
- ✅ **Rich Field Types** - number, string, select, boolean, range
- ✅ **Validation Support** - Min/max constraints, options, placeholders
- ✅ **i18n Ready** - All fields have `i18nKey` for internationalization

### Schema Field Structure

```typescript
export interface SchemaField {
  type: 'number' | 'string' | 'select' | 'boolean' | 'range';
  label: string;
  i18nKey: string;
  default: any;
  options?: string[] | number[];
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  placeholder?: string;
}
```

### Usage Examples

#### 1. Render PropertiesPanel Dynamically

```typescript
import { MLComponentSchemas } from '@/data';

const PropertiesPanel = ({ selectedNode }: { selectedNode: Node }) => {
  const schema = MLComponentSchemas[selectedNode.data.componentType] || MLComponentSchemas.DEFAULT;

  return (
    <div>
      {Object.entries(schema).map(([paramName, field]) => (
        <FormField
          key={paramName}
          type={field.type}
          label={field.label}
          defaultValue={field.default}
          options={field.options}
          min={field.min}
          max={field.max}
          hint={field.hint}
          placeholder={field.placeholder}
          onChange={(value) => updateNodeParam(selectedNode.id, paramName, value)}
        />
      ))}
    </div>
  );
};
```

#### 2. Get Default Parameters on Node Creation

```typescript
import { getDefaultMLParams } from '@/data';

const createFCNode = () => {
  const defaultParams = getDefaultMLParams('FC_LAYER');
  // Returns: { inputDim: 512, outputDim: 128, activation: 'ReLU', useBias: true }

  return {
    id: generateId(),
    type: 'fc',
    data: {
      ...defaultParams,
      label: 'FC Layer',
      color: NodeRoleColor.fc,
    },
  };
};
```

#### 3. Validate Parameter Value

```typescript
import { validateParameter } from '@/data';

const onParameterChange = (nodeType: string, paramName: string, value: any) => {
  const validated = validateParameter(nodeType, paramName, value);
  // Automatically clamps to min/max, validates against options, etc.
  updateNode(nodeId, { [paramName]: validated });
};
```

#### 4. Get Field Metadata for Tooltips/Hints

```typescript
import { getSchemaField } from '@/data';

const ParameterInput = ({ nodeType, paramName }: { nodeType: string; paramName: string }) => {
  const field = getSchemaField(nodeType, paramName);

  return (
    <div>
      <label>{field?.label}</label>
      <input type={field?.type} placeholder={field?.placeholder} />
      {field?.hint && <span className="hint">{field.hint}</span>}
    </div>
  );
};
```

---

## 3. Integration Examples

### Complete Node Creation Flow

```typescript
import { getInitialNodeData, getDefaultMLParams } from '@/data';

const createNodeFromSidebar = (componentKey: string) => {
  // Step 1: Get base node structure with dimensions/colors
  const baseData = getInitialNodeData(componentKey);

  // Step 2: Get ML parameter defaults
  const mlParams = getDefaultMLParams(componentKey);

  // Step 3: Merge and create complete node
  return {
    ...baseData,
    id: generateUniqueId(),
    data: {
      ...baseData.data,
      ...mlParams,
    },
  };
};

// Example: Create FC Layer node
const fcNode = createNodeFromSidebar('FC_LAYER');
/*
{
  id: 'fc-1',
  type: 'fc',
  position: { x: 0, y: 0 },
  style: { width: 80, height: 120 },
  data: {
    width: 80,
    height: 120,
    color: '#4169E1',
    label: 'FC LAYER',
    formulaLabel: '',
    inputDim: 512,
    outputDim: 128,
    activation: 'ReLU',
    useBias: true,
  },
}
*/
```

### PropertiesPanel Update Flow

```typescript
import { MLComponentSchemas, validateParameter } from '@/data';

const PropertiesPanel = ({ selectedNode, onUpdate }: PropertiesPanelProps) => {
  const componentType = selectedNode.data.componentType || 'FC_LAYER';
  const schema = MLComponentSchemas[componentType];

  const handleChange = (paramName: string, value: any) => {
    // Validate value against schema constraints
    const validated = validateParameter(componentType, paramName, value);

    // Update node data
    onUpdate(selectedNode.id, {
      ...selectedNode.data,
      [paramName]: validated,
    });
  };

  return (
    <form>
      {Object.entries(schema).map(([paramName, field]) => {
        const currentValue = selectedNode.data[paramName] ?? field.default;

        switch (field.type) {
          case 'number':
            return (
              <NumberInput
                key={paramName}
                label={field.label}
                value={currentValue}
                min={field.min}
                max={field.max}
                onChange={(v) => handleChange(paramName, v)}
                hint={field.hint}
              />
            );

          case 'select':
            return (
              <SelectInput
                key={paramName}
                label={field.label}
                value={currentValue}
                options={field.options || []}
                onChange={(v) => handleChange(paramName, v)}
                hint={field.hint}
              />
            );

          case 'boolean':
            return (
              <Checkbox
                key={paramName}
                label={field.label}
                checked={currentValue}
                onChange={(v) => handleChange(paramName, v)}
                hint={field.hint}
              />
            );

          case 'range':
            return (
              <RangeSlider
                key={paramName}
                label={field.label}
                value={currentValue}
                min={field.min}
                max={field.max}
                step={field.step}
                onChange={(v) => handleChange(paramName, v)}
                hint={field.hint}
              />
            );

          case 'string':
          default:
            return (
              <TextInput
                key={paramName}
                label={field.label}
                value={currentValue}
                placeholder={field.placeholder}
                onChange={(v) => handleChange(paramName, v)}
                hint={field.hint}
              />
            );
        }
      })}
    </form>
  );
};
```

---

## 4. Component Schema Reference

### FC_LAYER (Fully Connected Layer)

```typescript
{
  inputDim: { type: 'number', default: 512, min: 1 },
  outputDim: { type: 'number', default: 128, min: 1 },
  activation: { type: 'select', default: 'ReLU', options: ['None', 'ReLU', 'Sigmoid', 'Tanh', 'GELU', 'SiLU'] },
  useBias: { type: 'boolean', default: true },
}
```

### MLP_LAYERS (Multi-Layer Perceptron)

```typescript
{
  layerWidths: { type: 'string', default: '512:256:128:64', hint: 'Colon-separated layer sizes' },
  activation: { type: 'select', default: 'GELU', options: ['ReLU', 'GELU', 'Tanh', 'SiLU', 'Leaky ReLU'] },
  dropout: { type: 'range', default: 0.1, min: 0.0, max: 0.9, step: 0.05 },
  showConnections: { type: 'boolean', default: true },
}
```

### CONV_LAYER (Convolutional Layer)

```typescript
{
  inChannels: { type: 'number', default: 3, min: 1 },
  outChannels: { type: 'number', default: 64, min: 1 },
  kernelSize: { type: 'select', default: 3, options: [1, 3, 5, 7, 11] },
  stride: { type: 'number', default: 1, min: 1, max: 8 },
  padding: { type: 'select', default: 'same', options: ['valid', 'same', 'none'] },
  dilation: { type: 'number', default: 1, min: 1, max: 8 },
  groups: { type: 'number', default: 1, min: 1 },
}
```

### POOLING (Pooling Layer)

```typescript
{
  poolType: { type: 'select', default: 'max', options: ['max', 'avg', 'global'] },
  poolSize: { type: 'select', default: 2, options: [2, 3, 4, 5] },
  stride: { type: 'number', default: 2, min: 1, max: 8 },
  visualization: { type: 'select', default: 'funnel', options: ['funnel', 'grid'] },
}
```

### DROPOUT (Dropout Regularization)

```typescript
{
  dropoutRate: { type: 'range', default: 0.5, min: 0.0, max: 0.95, step: 0.05 },
  visualizeDropped: { type: 'boolean', default: true },
  seed: { type: 'string', default: '', placeholder: 'Leave empty for node ID' },
}
```

### ACTIVATION (Activation Functions)

```typescript
{
  activationType: { type: 'select', default: 'relu', options: ['relu', 'sigmoid', 'tanh', 'softmax', 'leaky_relu', 'gelu', 'silu'] },
  alpha: { type: 'number', default: 0.01, min: 0.0, max: 1.0, step: 0.01, hint: 'For Leaky ReLU' },
}
```

### DATA (Input/Output Data Node)

```typescript
{
  ioType: { type: 'select', default: 'input', options: ['input', 'output'] },
  dataSource: { type: 'select', default: 'CSV', options: ['CSV', 'Image', 'Audio', 'Text', 'Video', 'Custom'] },
  shape: { type: 'string', default: '(N, 784)', placeholder: '(N, 784)' },
  direction: { type: 'select', default: 'right', options: ['left', 'right'] },
}
```

### TENSOR (Tensor Node)

```typescript
{
  shape: { type: 'string', default: '[B, C, H, W]', placeholder: '[B, C, H, W]' },
  dtype: { type: 'select', default: 'float32', options: ['float16', 'float32', 'float64', 'int32', 'int64', 'bool'] },
  depth: { type: 'range', default: 5, min: 3, max: 8, step: 1, hint: 'Visual layers in 3D stack' },
}
```

---

## 5. Best Practices

### DO ✅

1. **Always import from `@/data` index**
   ```typescript
   import { NodeSizes, MLComponentSchemas, getInitialNodeData } from '@/data';
   ```

2. **Use `getDefaultMLParams` for new nodes**
   ```typescript
   const params = getDefaultMLParams('FC_LAYER');
   ```

3. **Validate all user inputs**
   ```typescript
   const validated = validateParameter(nodeType, paramName, value);
   ```

4. **Use schema hints for tooltips**
   ```typescript
   const field = getSchemaField(nodeType, paramName);
   <Tooltip>{field?.hint}</Tooltip>
   ```

5. **Respect minimum dimensions**
   ```typescript
   const { width, height } = validateNodeDimensions(type, newWidth, newHeight);
   ```

### DON'T ❌

1. **Don't hardcode dimensions**
   ```typescript
   // ❌ Bad
   const fcNode = { width: 100, height: 140 };

   // ✅ Good
   const fcNode = getInitialNodeData('FC_LAYER');
   ```

2. **Don't skip parameter validation**
   ```typescript
   // ❌ Bad
   node.data.dropoutRate = userInput;

   // ✅ Good
   node.data.dropoutRate = validateParameter('DROPOUT', 'dropoutRate', userInput);
   ```

3. **Don't duplicate schema definitions**
   ```typescript
   // ❌ Bad
   const defaultInputDim = 512; // Duplicates schema

   // ✅ Good
   const { inputDim } = getDefaultMLParams('FC_LAYER');
   ```

---

## 6. Adding New Components

### Step 1: Add to `designTokens.ts`

```typescript
export const NodeSizes = {
  // ... existing components
  MY_NEW_LAYER: {
    width: 120,
    height: 100,
    fillColor: NodeRoleColor.custom,
    minWidth: 120,
    minHeight: 100,
  },
};
```

### Step 2: Add to `componentSchemas.ts`

```typescript
export const MLComponentSchemas = {
  // ... existing schemas
  MY_NEW_LAYER: {
    parameterName: {
      type: 'number',
      label: 'Parameter Label',
      i18nKey: 'schema.mynew.param',
      default: 10,
      min: 1,
      max: 100,
      hint: 'Helpful description',
    },
  },
};
```

### Step 3: Add to `sidebarData.ts`

```typescript
{
  type: 'mynewNode',
  label: 'My New Layer',
  Icon: MyIcon,
  data: {
    label: 'My New Layer',
    ...getDefaultMLParams('MY_NEW_LAYER'),
  },
}
```

### Step 4: Create Node Component

```typescript
export type MyNewNodeData = {
  label?: string;
  color?: string;
  formulaLabel?: string;
  parameterName?: number; // Match schema
};

export default function MyNewNode({ data, selected }: NodeProps<MyNewNodeData>) {
  const parameterName = data?.parameterName ?? 10; // Use schema default
  // ... component implementation
}
```

---

## 7. Troubleshooting

### Issue: Node has wrong dimensions
**Solution**: Check that `designTokens.ts` matches the Phase 3 audit requirements (FC: 80×120, MLP: 160×80, etc.)

### Issue: PropertiesPanel not showing parameters
**Solution**: Ensure `componentSchemas.ts` has a schema entry for the node type

### Issue: Parameter validation not working
**Solution**: Use `validateParameter()` helper function, don't validate manually

### Issue: Default values not applying
**Solution**: Call `getDefaultMLParams()` during node creation

### Issue: i18n keys not resolving
**Solution**: Ensure `i18nKey` in schema matches your i18n translation files

---

## 8. Migration Guide

### Migrating Existing Nodes

If you have existing nodes without schema integration:

```typescript
// Before
const oldNode = {
  id: 'fc-1',
  type: 'fc',
  data: {
    width: 100,
    height: 140,
    // Missing ML parameters
  },
};

// After (with schema integration)
import { getInitialNodeData, getDefaultMLParams } from '@/data';

const newNode = {
  ...getInitialNodeData('FC_LAYER'),
  id: 'fc-1',
  data: {
    ...getInitialNodeData('FC_LAYER').data,
    ...getDefaultMLParams('FC_LAYER'),
  },
};
```

---

## Summary

The ML Component Data Layer provides:

✅ **Centralized Configuration** - Single source of truth for all component specs
✅ **Type Safety** - Full TypeScript support with interfaces
✅ **Academic Compliance** - Phase 3 audit standards (aspect ratios, LOD, etc.)
✅ **Professional ML Params** - PyTorch/TensorFlow conventions
✅ **Validation** - Automatic parameter clamping and type checking
✅ **i18n Ready** - All labels have translation keys
✅ **Easy Integration** - Helper functions for common tasks

For questions or issues, please refer to the implementation files or create an issue in the project repository.
