/**
 * ML Component Parameter Schemas
 *
 * Defines professional ML/DL parameters for each node type, used by PropertiesPanel
 * for dynamic form rendering and parameter validation.
 *
 * Academic Standards:
 * - Parameter names follow PyTorch/TensorFlow conventions
 * - Defaults align with industry best practices (e.g., Adam lr=0.001)
 * - Hints provide guidance for ML engineers
 */

/**
 * Schema field definition for a single parameter
 */
export interface SchemaField {
  type: 'number' | 'string' | 'select' | 'boolean' | 'range';
  label: string;
  i18nKey: string; // Internationalization key for PropertiesPanel
  default: any;
  options?: string[] | number[]; // For type: 'select'
  min?: number; // For type: 'number' or 'range'
  max?: number; // For type: 'number' or 'range'
  step?: number; // For type: 'range'
  hint?: string; // Tooltip/help text
  placeholder?: string; // Input placeholder
}

/**
 * Complete schema for a component (collection of fields)
 */
export interface ComponentSchema {
  [parameterName: string]: SchemaField;
}

/**
 * Complete ML Component Schema Registry
 *
 * Keys match component types from designTokens.ts
 */
export const MLComponentSchemas: Record<string, ComponentSchema> = {
  // ==================== CORE COMPUTATION LAYERS ====================

  /**
   * Fully Connected Layer (FC/Dense)
   * Academic: Single linear transformation y = Wx + b
   */
  FC_LAYER: {
    inputDim: {
      type: 'number',
      label: 'Input Dimension',
      i18nKey: 'schema.fc.inputDim',
      default: 512,
      min: 1,
      hint: 'Number of input features',
    },
    outputDim: {
      type: 'number',
      label: 'Output Dimension',
      i18nKey: 'schema.fc.outputDim',
      default: 128,
      min: 1,
      hint: 'Number of output neurons',
    },
    activation: {
      type: 'select',
      label: 'Activation',
      i18nKey: 'schema.fc.activation',
      default: 'ReLU',
      options: ['None', 'ReLU', 'Sigmoid', 'Tanh', 'GELU', 'SiLU'],
      hint: 'Post-activation function',
    },
    useBias: {
      type: 'boolean',
      label: 'Use Bias',
      i18nKey: 'schema.fc.bias',
      default: true,
      hint: 'Include bias term (b)',
    },
  },

  /**
   * Multi-Layer Perceptron (MLP)
   * Academic: Stacked FC layers with intermediate activations
   */
  MLP_LAYERS: {
    layerWidths: {
      type: 'string',
      label: 'Layer Widths',
      i18nKey: 'schema.mlp.widths',
      default: '512:256:128:64',
      hint: 'Colon-separated layer sizes (e.g., 512:256:128)',
      placeholder: '512:256:128:64',
    },
    activation: {
      type: 'select',
      label: 'Hidden Activation',
      i18nKey: 'schema.mlp.activation',
      default: 'GELU',
      options: ['ReLU', 'GELU', 'Tanh', 'SiLU', 'Leaky ReLU'],
      hint: 'Activation between layers',
    },
    dropout: {
      type: 'range',
      label: 'Dropout Rate',
      i18nKey: 'schema.mlp.dropout',
      default: 0.1,
      min: 0.0,
      max: 0.9,
      step: 0.05,
      hint: 'Dropout probability (0 = disabled)',
    },
    showConnections: {
      type: 'boolean',
      label: 'Show Inter-Layer Connections',
      i18nKey: 'schema.mlp.connections',
      default: true,
      hint: 'Visualize neuron connections',
    },
  },

  /**
   * Convolutional Layer (Conv2D)
   * Academic: 2D spatial convolution with learnable kernels
   */
  CONV_LAYER: {
    inChannels: {
      type: 'number',
      label: 'Input Channels',
      i18nKey: 'schema.conv.in',
      default: 3,
      min: 1,
      hint: 'Number of input feature maps (e.g., 3 for RGB)',
    },
    outChannels: {
      type: 'number',
      label: 'Output Channels',
      i18nKey: 'schema.conv.out',
      default: 64,
      min: 1,
      hint: 'Number of learned filters',
    },
    kernelSize: {
      type: 'select',
      label: 'Kernel Size (k×k)',
      i18nKey: 'schema.conv.kernel',
      default: 3,
      options: [1, 3, 5, 7, 11],
      hint: 'Receptive field size',
    },
    stride: {
      type: 'number',
      label: 'Stride',
      i18nKey: 'schema.conv.stride',
      default: 1,
      min: 1,
      max: 8,
      hint: 'Step size for kernel sliding',
    },
    padding: {
      type: 'select',
      label: 'Padding',
      i18nKey: 'schema.conv.padding',
      default: 'same',
      options: ['valid', 'same', 'none'],
      hint: '"same" preserves spatial dims',
    },
    dilation: {
      type: 'number',
      label: 'Dilation',
      i18nKey: 'schema.conv.dilation',
      default: 1,
      min: 1,
      max: 8,
      hint: 'Spacing between kernel elements',
    },
    groups: {
      type: 'number',
      label: 'Groups',
      i18nKey: 'schema.conv.groups',
      default: 1,
      min: 1,
      hint: 'Grouped convolution (1 = standard)',
    },
  },

  /**
   * Pooling Layer (MaxPool2D, AvgPool2D, GlobalPool)
   * Academic: Spatial downsampling with aggregation
   */
  POOLING: {
    poolType: {
      type: 'select',
      label: 'Pool Type',
      i18nKey: 'schema.pool.type',
      default: 'max',
      options: ['max', 'avg', 'global'],
      hint: 'Aggregation function',
    },
    poolSize: {
      type: 'select',
      label: 'Pool Size (k×k)',
      i18nKey: 'schema.pool.size',
      default: 2,
      options: [2, 3, 4, 5],
      hint: 'Window size for pooling',
    },
    stride: {
      type: 'number',
      label: 'Stride',
      i18nKey: 'schema.pool.stride',
      default: 2,
      min: 1,
      max: 8,
      hint: 'Usually equals pool size',
    },
    visualization: {
      type: 'select',
      label: 'Visualization Style',
      i18nKey: 'schema.pool.viz',
      default: 'funnel',
      options: ['funnel', 'grid'],
      hint: 'Funnel (default) or grid→single',
    },
  },

  /**
   * Flatten Layer
   * Academic: Reshapes multi-dimensional tensor to 1D vector
   */
  FLATTEN: {
    // Flatten has no configurable parameters (deterministic operation)
    startDim: {
      type: 'number',
      label: 'Start Dimension',
      i18nKey: 'schema.flatten.start',
      default: 1,
      min: 0,
      hint: 'Dimension to start flattening from (0 = include batch)',
    },
    endDim: {
      type: 'number',
      label: 'End Dimension',
      i18nKey: 'schema.flatten.end',
      default: -1,
      min: -1,
      hint: '-1 means last dimension',
    },
  },

  // ==================== ACTIVATION FUNCTIONS ====================

  /**
   * Activation Function Node
   * Academic: Element-wise non-linear transformation
   */
  ACTIVATION: {
    activationType: {
      type: 'select',
      label: 'Activation Type',
      i18nKey: 'schema.act.type',
      default: 'relu',
      options: ['relu', 'sigmoid', 'tanh', 'softmax', 'leaky_relu', 'gelu', 'silu'],
      hint: 'Non-linear function',
    },
    alpha: {
      type: 'number',
      label: 'Alpha (for Leaky ReLU)',
      i18nKey: 'schema.act.alpha',
      default: 0.01,
      min: 0.0,
      max: 1.0,
      step: 0.01,
      hint: 'Negative slope coefficient',
    },
  },

  // Convenience aliases for specific activations
  SIGMOID_TANH: {
    activationType: {
      type: 'select',
      label: 'Function',
      i18nKey: 'schema.act.type',
      default: 'sigmoid',
      options: ['sigmoid', 'tanh'],
    },
  },

  SOFTMAX_RELU: {
    activationType: {
      type: 'select',
      label: 'Function',
      i18nKey: 'schema.act.type',
      default: 'softmax',
      options: ['softmax', 'relu', 'leaky_relu'],
    },
  },

  GELU: {
    activationType: {
      type: 'select',
      label: 'GELU Variant',
      i18nKey: 'schema.gelu.variant',
      default: 'gelu',
      options: ['gelu', 'silu'],
      hint: 'GELU or SiLU (Swish)',
    },
  },

  // ==================== NORMALIZATION & REGULARIZATION ====================

  /**
   * Batch Normalization
   * Academic: Normalizes mini-batch statistics, γx̂ + β
   */
  BATCH_NORM: {
    numFeatures: {
      type: 'number',
      label: 'Number of Features',
      i18nKey: 'schema.bn.features',
      default: 64,
      min: 1,
      hint: 'Should match previous layer output',
    },
    momentum: {
      type: 'range',
      label: 'Momentum',
      i18nKey: 'schema.bn.momentum',
      default: 0.1,
      min: 0.0,
      max: 1.0,
      step: 0.01,
      hint: 'Running mean/var update rate',
    },
    epsilon: {
      type: 'number',
      label: 'Epsilon (ε)',
      i18nKey: 'schema.bn.epsilon',
      default: 1e-5,
      min: 1e-8,
      max: 1e-3,
      hint: 'Numerical stability constant',
    },
    affine: {
      type: 'boolean',
      label: 'Affine Transform',
      i18nKey: 'schema.bn.affine',
      default: true,
      hint: 'Learn γ and β parameters',
    },
  },

  /**
   * Layer Normalization
   * Academic: Normalizes across features (not batch)
   */
  LAYER_NORM: {
    normalizedShape: {
      type: 'string',
      label: 'Normalized Shape',
      i18nKey: 'schema.ln.shape',
      default: '[512]',
      hint: 'Feature dimensions to normalize (e.g., [512] or [64, 32])',
      placeholder: '[512]',
    },
    epsilon: {
      type: 'number',
      label: 'Epsilon (ε)',
      i18nKey: 'schema.ln.epsilon',
      default: 1e-5,
      min: 1e-8,
      max: 1e-3,
    },
    elementwiseAffine: {
      type: 'boolean',
      label: 'Elementwise Affine',
      i18nKey: 'schema.ln.affine',
      default: true,
    },
  },

  /**
   * Dropout Regularization
   * Academic: Randomly zeros activations during training
   */
  DROPOUT: {
    dropoutRate: {
      type: 'range',
      label: 'Dropout Rate (p)',
      i18nKey: 'schema.dropout.rate',
      default: 0.5,
      min: 0.0,
      max: 0.95,
      step: 0.05,
      hint: 'Probability of dropping each element',
    },
    visualizeDropped: {
      type: 'boolean',
      label: 'Visualize Dropped Neurons',
      i18nKey: 'schema.dropout.visualize',
      default: true,
      hint: 'Show dashed circles for dropped neurons',
    },
    seed: {
      type: 'string',
      label: 'Random Seed',
      i18nKey: 'schema.dropout.seed',
      default: '',
      hint: 'Optional seed for deterministic pattern (uses node ID if empty)',
      placeholder: 'Leave empty for node ID',
    },
  },

  // ==================== DATA & I/O ====================

  /**
   * Input/Output Data Node
   * Academic: Data source/sink with shape annotations
   */
  DATA: {
    ioType: {
      type: 'select',
      label: 'I/O Type',
      i18nKey: 'schema.data.io',
      default: 'input',
      options: ['input', 'output'],
      hint: 'Input (green) or Output (red)',
    },
    dataSource: {
      type: 'select',
      label: 'Data Source',
      i18nKey: 'schema.data.source',
      default: 'CSV',
      options: ['CSV', 'Image', 'Audio', 'Text', 'Video', 'Custom'],
      hint: 'Type of data',
    },
    shape: {
      type: 'string',
      label: 'Tensor Shape',
      i18nKey: 'schema.data.shape',
      default: '(N, 784)',
      hint: 'Dimensions (e.g., (N, 784) or (B, 3, 224, 224))',
      placeholder: '(N, 784)',
    },
    direction: {
      type: 'select',
      label: 'Flow Direction',
      i18nKey: 'schema.data.direction',
      default: 'right',
      options: ['left', 'right'],
      hint: 'Arrow direction in parallelogram',
    },
  },

  INPUT_DATA: {
    dataSource: {
      type: 'select',
      label: 'Data Source',
      i18nKey: 'schema.data.source',
      default: 'Image',
      options: ['CSV', 'Image', 'Audio', 'Text', 'Video', 'Custom'],
    },
    shape: {
      type: 'string',
      label: 'Input Shape',
      i18nKey: 'schema.data.shape',
      default: '(B, 3, 224, 224)',
      placeholder: '(B, 3, 224, 224)',
    },
  },

  OUTPUT_DATA: {
    shape: {
      type: 'string',
      label: 'Output Shape',
      i18nKey: 'schema.data.shape',
      default: '(B, 1000)',
      placeholder: '(B, 1000)',
    },
    outputType: {
      type: 'select',
      label: 'Output Type',
      i18nKey: 'schema.data.outputType',
      default: 'Logits',
      options: ['Logits', 'Probabilities', 'Classes', 'Features'],
    },
  },

  /**
   * Tensor Node
   * Academic: Multi-dimensional array with shape/dtype
   */
  TENSOR: {
    shape: {
      type: 'string',
      label: 'Tensor Shape',
      i18nKey: 'schema.tensor.shape',
      default: '[B, C, H, W]',
      hint: 'Symbolic shape (e.g., [B, C, H, W] or [N, D])',
      placeholder: '[B, C, H, W]',
    },
    dtype: {
      type: 'select',
      label: 'Data Type',
      i18nKey: 'schema.tensor.dtype',
      default: 'float32',
      options: ['float16', 'float32', 'float64', 'int32', 'int64', 'bool'],
    },
    depth: {
      type: 'range',
      label: 'Visual Depth (Layers)',
      i18nKey: 'schema.tensor.depth',
      default: 5,
      min: 3,
      max: 8,
      step: 1,
      hint: 'Number of stacked layers in visualization',
    },
  },

  // ==================== OBJECTIVE & OPTIMIZATION ====================

  /**
   * Loss Function
   * Academic: Optimization objective L(ŷ, y)
   */
  LOSS: {
    lossType: {
      type: 'select',
      label: 'Loss Function',
      i18nKey: 'schema.loss.type',
      default: 'CrossEntropy',
      options: [
        'CrossEntropy',
        'MSE',
        'BCE',
        'MAE',
        'Huber',
        'KLDiv',
        'CTC',
        'Custom',
      ],
      hint: 'Training objective',
    },
    reduction: {
      type: 'select',
      label: 'Reduction',
      i18nKey: 'schema.loss.reduction',
      default: 'mean',
      options: ['none', 'mean', 'sum'],
      hint: 'How to aggregate batch losses',
    },
    labelSmoothing: {
      type: 'range',
      label: 'Label Smoothing',
      i18nKey: 'schema.loss.smoothing',
      default: 0.0,
      min: 0.0,
      max: 0.3,
      step: 0.01,
      hint: 'Regularization via soft labels',
    },
  },

  /**
   * Optimizer
   * Academic: Parameter update rule (SGD, Adam, etc.)
   */
  OPTIMIZER: {
    algorithm: {
      type: 'select',
      label: 'Algorithm',
      i18nKey: 'schema.opt.algo',
      default: 'Adam',
      options: ['Adam', 'AdamW', 'SGD', 'RMSProp', 'Adagrad', 'Adadelta'],
      hint: 'Optimization algorithm',
    },
    learningRate: {
      type: 'number',
      label: 'Learning Rate (η)',
      i18nKey: 'schema.opt.lr',
      default: 0.001,
      min: 1e-6,
      max: 1.0,
      hint: 'Step size for gradient descent',
    },
    momentum: {
      type: 'range',
      label: 'Momentum (β)',
      i18nKey: 'schema.opt.momentum',
      default: 0.9,
      min: 0.0,
      max: 0.99,
      step: 0.01,
      hint: 'For SGD with momentum',
    },
    weightDecay: {
      type: 'number',
      label: 'Weight Decay (L2)',
      i18nKey: 'schema.opt.decay',
      default: 0.0001,
      min: 0.0,
      max: 0.1,
      hint: 'L2 regularization strength',
    },
    beta1: {
      type: 'range',
      label: 'Beta1 (Adam)',
      i18nKey: 'schema.opt.beta1',
      default: 0.9,
      min: 0.0,
      max: 0.999,
      step: 0.001,
      hint: 'First moment decay',
    },
    beta2: {
      type: 'range',
      label: 'Beta2 (Adam)',
      i18nKey: 'schema.opt.beta2',
      default: 0.999,
      min: 0.0,
      max: 0.9999,
      step: 0.0001,
      hint: 'Second moment decay',
    },
  },

  // ==================== ADVANCED ARCHITECTURES ====================

  /**
   * Attention Mechanism
   * Academic: Scaled dot-product attention or multi-head attention
   */
  ATTENTION: {
    numHeads: {
      type: 'number',
      label: 'Number of Heads',
      i18nKey: 'schema.attn.heads',
      default: 8,
      min: 1,
      max: 32,
      hint: 'Multi-head attention heads',
    },
    embedDim: {
      type: 'number',
      label: 'Embedding Dimension',
      i18nKey: 'schema.attn.embed',
      default: 512,
      min: 1,
      hint: 'Model dimension (d_model)',
    },
    dropout: {
      type: 'range',
      label: 'Attention Dropout',
      i18nKey: 'schema.attn.dropout',
      default: 0.1,
      min: 0.0,
      max: 0.5,
      step: 0.05,
    },
  },

  /**
   * Embedding Layer
   * Academic: Lookup table mapping discrete tokens to continuous vectors
   */
  EMBEDDING: {
    vocabSize: {
      type: 'number',
      label: 'Vocabulary Size',
      i18nKey: 'schema.embedding.vocab',
      default: 10000,
      min: 1,
      hint: 'Number of unique tokens in vocabulary',
    },
    embeddingDim: {
      type: 'number',
      label: 'Embedding Dimension',
      i18nKey: 'schema.embedding.dim',
      default: 128,
      min: 1,
      hint: 'Dimension of dense embedding vectors',
    },
    paddingIdx: {
      type: 'number',
      label: 'Padding Index',
      i18nKey: 'schema.embedding.padding',
      default: 0,
      min: -1,
      hint: 'Index for padding token (-1 for none)',
    },
    maxNorm: {
      type: 'number',
      label: 'Max Norm',
      i18nKey: 'schema.embedding.maxNorm',
      default: 0,
      min: 0,
      hint: 'Max L2 norm for embeddings (0 = disabled)',
    },
  },

  /**
   * RNN/LSTM Layer
   * Academic: Recurrent neural network with temporal dynamics
   */
  RNN_LSTM: {
    cellType: {
      type: 'select',
      label: 'Cell Type',
      i18nKey: 'schema.rnn.cell',
      default: 'LSTM',
      options: ['RNN', 'LSTM', 'GRU'],
    },
    hiddenSize: {
      type: 'number',
      label: 'Hidden Size',
      i18nKey: 'schema.rnn.hidden',
      default: 256,
      min: 1,
      hint: 'Number of hidden units',
    },
    numLayers: {
      type: 'number',
      label: 'Number of Layers',
      i18nKey: 'schema.rnn.layers',
      default: 2,
      min: 1,
      max: 8,
    },
    bidirectional: {
      type: 'boolean',
      label: 'Bidirectional',
      i18nKey: 'schema.rnn.bidir',
      default: false,
    },
    dropout: {
      type: 'range',
      label: 'Dropout',
      i18nKey: 'schema.rnn.dropout',
      default: 0.2,
      min: 0.0,
      max: 0.5,
      step: 0.05,
    },
  },

  // ==================== BASIC ELEMENTS ====================

  /**
   * Neuron Node
   * Academic: Single neuron with activation visualization
   */
  NEURON: {
    activationState: {
      type: 'range',
      label: 'Activation State',
      i18nKey: 'schema.neuron.activation',
      default: 0.5,
      min: 0.0,
      max: 1.0,
      step: 0.01,
      hint: 'Activation level (0-1)',
    },
    showPulse: {
      type: 'boolean',
      label: 'Show Pulse Animation',
      i18nKey: 'schema.neuron.pulse',
      default: false,
      hint: 'Animated pulse for active neurons',
    },
  },

  // ==================== GROUPING & UTILITIES ====================

  /**
   * Group Container
   * Academic: Logical grouping of sub-components (e.g., ResNet block)
   */
  GROUP: {
    collapsible: {
      type: 'boolean',
      label: 'Collapsible',
      i18nKey: 'schema.group.collapsible',
      default: true,
    },
    collapsed: {
      type: 'boolean',
      label: 'Initially Collapsed',
      i18nKey: 'schema.group.collapsed',
      default: false,
    },
    subtitle: {
      type: 'string',
      label: 'Subtitle',
      i18nKey: 'schema.group.subtitle',
      default: '',
      placeholder: 'e.g., "ResNet Block"',
    },
  },

  /**
   * Default schema for nodes without specific parameters
   */
  DEFAULT: {
    notes: {
      type: 'string',
      label: 'Notes',
      i18nKey: 'schema.default.notes',
      default: '',
      hint: 'Internal comments or documentation',
      placeholder: 'Add notes here...',
    },
  },
};

/**
 * Helper function to get default ML parameters for a node type
 *
 * @param type - Component type key (e.g., "FC_LAYER", "CONV_LAYER")
 * @returns Object with parameter names and default values
 */
export const getDefaultMLParams = (type: string): Record<string, any> => {
  const schema = MLComponentSchemas[type] || MLComponentSchemas.DEFAULT;
  const params: Record<string, any> = {};

  for (const [key, field] of Object.entries(schema)) {
    params[key] = field.default;
  }

  return params;
};

/**
 * Helper function to validate parameter value against schema constraints
 *
 * @param type - Component type
 * @param paramName - Parameter name
 * @param value - Value to validate
 * @returns Validated/clamped value
 */
export const validateParameter = (
  type: string,
  paramName: string,
  value: any
): any => {
  const schema = MLComponentSchemas[type];
  if (!schema || !schema[paramName]) return value;

  const field = schema[paramName];

  // Type-specific validation
  switch (field.type) {
    case 'number':
    case 'range':
      const num = Number(value);
      if (isNaN(num)) return field.default;
      if (field.min !== undefined && num < field.min) return field.min;
      if (field.max !== undefined && num > field.max) return field.max;
      return num;

    case 'select':
      if (field.options && (field.options as any[]).includes(value)) return value;
      return field.default;

    case 'boolean':
      return Boolean(value);

    case 'string':
      return String(value);

    default:
      return value;
  }
};

/**
 * Helper function to get schema field for autocomplete/hints in UI
 *
 * @param type - Component type
 * @param paramName - Parameter name
 * @returns Schema field definition or undefined
 */
export const getSchemaField = (
  type: string,
  paramName: string
): SchemaField | undefined => {
  const schema = MLComponentSchemas[type];
  return schema?.[paramName];
};
