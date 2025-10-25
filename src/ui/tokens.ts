export const Colors = {
  primary: 'semantic-primary',
  success: 'semantic-success',
  warning: 'semantic-warning',
  danger: 'semantic-danger',
  info: 'semantic-info',
  neutral: 'semantic-neutral',
} as const;

export const NodeRoleColor = {
  // Core layer types (following academic paper conventions)
  fc: '#4169E1',           // Royal blue - fully connected layers
  conv: '#FF8C00',         // Dark orange - convolutional layers
  pool: '#20B2AA',         // Light sea green - pooling layers

  // Activation functions
  activation: '#32CD32',   // Lime green - activation functions

  // Normalization
  norm: '#9370DB',         // Medium purple - batch norm, layer norm

  // Advanced architectures
  attention: '#DC143C',    // Crimson - attention mechanisms
  rnn: '#8B4789',          // Dark orchid - recurrent layers

  // Data & I/O
  data: '#4682B4',         // Steel blue - input/output
  tensor: '#5F9EA0',       // Cadet blue - tensor operations

  // Regularization & Utility
  dropout: '#A9A9A9',      // Dark gray - dropout layers
  loss: '#B22222',         // Firebrick - loss functions

  // Grouping
  group: '#708090',        // Slate gray - grouping containers
} as const;

export type NodeVariant = keyof typeof NodeRoleColor;

