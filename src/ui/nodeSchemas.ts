// Minimal, extensible node schema registry for PropertiesPanel rendering
// Integrated with centralized MLComponentSchemas from @/data

import { MLComponentSchemas, validateParameter, type SchemaField } from '@/data';

export type FieldType = 'string' | 'number' | 'select' | 'boolean' | 'color' | 'range';

export type FieldOption = { label: string; value: string };

export interface FieldSpec {
  key: string;
  label: string;
  type: FieldType;
  min?: number;
  max?: number;
  step?: number;
  options?: FieldOption[];
  hint?: string;
  placeholder?: string;
}

export interface NodeSchema {
  type: string;
  fields: FieldSpec[];
}

export const NodeSchemas: Record<string, NodeSchema> = {
  activationNode: {
    type: 'activationNode',
    fields: [
      {
        key: 'activationType',
        label: 'Activation Type',
        type: 'select',
        options: [
          { label: 'ReLU', value: 'relu' },
          { label: 'Sigmoid', value: 'sigmoid' },
          { label: 'Tanh', value: 'tanh' },
          { label: 'GELU', value: 'gelu' },
          { label: 'SiLU/Swish', value: 'silu' },
          { label: 'Leaky ReLU', value: 'leaky_relu' },
          { label: 'Softmax', value: 'softmax' },
        ],
      },
      { key: 'shape', label: 'Shape', type: 'select', options: [ { label: 'Diamond', value: 'diamond' }, { label: 'Circle', value: 'circle' } ] },
    ],
  },
  convNode: {
    type: 'convNode',
    fields: [
      { key: 'kernel', label: 'Kernel', type: 'number', min: 1, max: 15, step: 1 },
      { key: 'stride', label: 'Stride', type: 'number', min: 1, max: 8, step: 1 },
      { key: 'padding', label: 'Padding', type: 'number', min: 0, max: 8, step: 1 },
      { key: 'dilation', label: 'Dilation', type: 'number', min: 1, max: 8, step: 1 },
      { key: 'channels', label: 'Channels', type: 'number', min: 1, max: 4096, step: 1 },
    ],
  },
  fcNode: {
    type: 'fcNode',
    fields: [
      { key: 'units', label: 'Units', type: 'number', min: 1, max: 4096, step: 1 },
      { key: 'bias', label: 'Bias', type: 'boolean' },
    ],
  },
  tensorNode: {
    type: 'tensorNode',
    fields: [
      { key: 'dims', label: 'Dims (e.g., H×W×C)', type: 'string' },
    ],
  },
};

/**
 * Convert MLComponentSchema to FieldSpec format for PropertiesPanel
 */
function convertSchemaFieldToFieldSpec(paramName: string, schemaField: SchemaField): FieldSpec {
  const fieldSpec: FieldSpec = {
    key: paramName,
    label: schemaField.label,
    type: schemaField.type as FieldType,
    hint: schemaField.hint,
    placeholder: schemaField.placeholder,
  };

  if (schemaField.min !== undefined) fieldSpec.min = schemaField.min;
  if (schemaField.max !== undefined) fieldSpec.max = schemaField.max;
  if (schemaField.step !== undefined) fieldSpec.step = schemaField.step;

  if (schemaField.options) {
    fieldSpec.options = schemaField.options.map((opt) => ({
      label: String(opt),
      value: String(opt),
    }));
  }

  return fieldSpec;
}

/**
 * Get node schema for PropertiesPanel, with fallback to centralized MLComponentSchemas
 */
export function getNodeSchema(nodeType?: string): NodeSchema | undefined {
  if (!nodeType) return undefined;

  // First check legacy NodeSchemas
  if (NodeSchemas[nodeType]) {
    return NodeSchemas[nodeType];
  }

  // Map node types to schema keys
  const schemaKeyMap: Record<string, string> = {
    'fcNode': 'FC_LAYER',
    'mlpNode': 'MLP_LAYERS',
    'convNode': 'CONV_LAYER',
    'poolingNode': 'POOLING',
    'flattenNode': 'FLATTEN',
    'activationNode': 'ACTIVATION',
    'dropoutNode': 'DROPOUT',
    'dataNode': 'DATA',
    'tensorNode': 'TENSOR',
    'neuronNode': 'NEURON',
    'normalizationNode': 'BATCH_NORM',
    'embeddingNode': 'EMBEDDING',
    'boxNode': 'DEFAULT',
    'circleNode': 'DEFAULT',
    'groupNode': 'GROUP',
  };

  const schemaKey = schemaKeyMap[nodeType];
  if (!schemaKey) return undefined;

  const mlSchema = MLComponentSchemas[schemaKey];
  if (!mlSchema) return undefined;

  // Convert MLComponentSchema to NodeSchema format
  const fields: FieldSpec[] = Object.entries(mlSchema).map(([paramName, schemaField]) =>
    convertSchemaFieldToFieldSpec(paramName, schemaField)
  );

  return {
    type: nodeType,
    fields,
  };
}

/**
 * Validate parameter value using centralized validation
 */
export function validateField(nodeType: string, paramName: string, value: any): any {
  const schemaKeyMap: Record<string, string> = {
    'fcNode': 'FC_LAYER',
    'mlpNode': 'MLP_LAYERS',
    'convNode': 'CONV_LAYER',
    'poolingNode': 'POOLING',
    'flattenNode': 'FLATTEN',
    'activationNode': 'ACTIVATION',
    'dropoutNode': 'DROPOUT',
    'dataNode': 'DATA',
    'tensorNode': 'TENSOR',
    'neuronNode': 'NEURON',
    'normalizationNode': 'BATCH_NORM',
    'boxNode': 'DEFAULT',
    'circleNode': 'DEFAULT',
    'groupNode': 'GROUP',
  };

  const schemaKey = schemaKeyMap[nodeType];
  if (!schemaKey) return value;

  return validateParameter(schemaKey, paramName, value);
}
