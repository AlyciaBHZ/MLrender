import { Node } from 'reactflow';
import { NodeRoleColor } from '@/ui/tokens';

/**
 * Node Size and Color Design Tokens
 *
 * Defines default dimensions and colors for all ML component node types.
 * Used by Sidebar for drag-and-drop creation and global style coordination.
 *
 * Academic Conventions:
 * - Dimensions follow the refined Phase 3 audit fixes (FC: 80×120, MLP: 160×80, etc.)
 * - Colors align with NodeRoleColor palette from @/ui/tokens
 * - Aspect ratios convey function (FC vertical, MLP horizontal)
 */

export interface NodeSizeConfig {
  width: number;
  height: number;
  fillColor: string;
  minWidth: number;
  minHeight: number;
}

export const NodeSizes: Record<string, NodeSizeConfig> = {
  // ==================== CORE COMPUTATION LAYERS ====================

  // Linear & Fully Connected
  NEURON: {
    width: 60,
    height: 60,
    fillColor: NodeRoleColor.activation,
    minWidth: 50,
    minHeight: 50,
  },

  FC_LAYER: {
    width: 80,
    height: 120,
    fillColor: NodeRoleColor.fc, // #4169E1 Royal blue
    minWidth: 80,
    minHeight: 120,
    // NOTE: 2:3 aspect ratio (vertical capsule) - distinguishes from MLP
  },

  MLP_LAYERS: {
    width: 160,
    height: 80,
    fillColor: NodeRoleColor.fc, // Same color family as FC
    minWidth: 160,
    minHeight: 80,
    // NOTE: 2:1 aspect ratio (horizontal rectangle) - distinguishes from FC
  },

  // Convolutional & Pooling
  CONV_LAYER: {
    width: 140,
    height: 160,
    fillColor: NodeRoleColor.conv, // #FF8C00 Dark orange
    minWidth: 140,
    minHeight: 160,
  },

  POOLING: {
    width: 120,
    height: 100,
    fillColor: NodeRoleColor.pool, // #20B2AA Light sea green
    minWidth: 120,
    minHeight: 100,
  },

  FLATTEN: {
    width: 100,
    height: 48,
    fillColor: NodeRoleColor.tensor, // #5F9EA0 Cadet blue
    minWidth: 100,
    minHeight: 48,
    // NOTE: New component from Phase 2 audit - Stack→Bar glyph
  },

  // ==================== ACTIVATION FUNCTIONS ====================

  SIGMOID_TANH: {
    width: 100,
    height: 100,
    fillColor: NodeRoleColor.activation, // #32CD32 Lime green
    minWidth: 100,
    minHeight: 100,
  },

  SOFTMAX_RELU: {
    width: 100,
    height: 100,
    fillColor: NodeRoleColor.activation,
    minWidth: 100,
    minHeight: 100,
  },

  GELU: {
    width: 100,
    height: 100,
    fillColor: NodeRoleColor.activation,
    minWidth: 100,
    minHeight: 100,
  },

  // ==================== NORMALIZATION & REGULARIZATION ====================

  BATCH_NORM: {
    width: 140,
    height: 80,
    fillColor: NodeRoleColor.norm, // #9370DB Medium purple
    minWidth: 140,
    minHeight: 80,
  },

  LAYER_NORM: {
    width: 140,
    height: 80,
    fillColor: NodeRoleColor.norm,
    minWidth: 140,
    minHeight: 80,
  },

  DROPOUT: {
    width: 140,
    height: 100,
    fillColor: NodeRoleColor.dropout, // #A9A9A9 Dark gray
    minWidth: 140,
    minHeight: 100,
  },

  // ==================== DATA & I/O ====================

  INPUT_DATA: {
    width: 120,
    height: 100,
    fillColor: NodeRoleColor.data, // #4682B4 Steel blue
    minWidth: 120,
    minHeight: 100,
  },

  OUTPUT_DATA: {
    width: 120,
    height: 100,
    fillColor: NodeRoleColor.data,
    minWidth: 120,
    minHeight: 100,
  },

  TENSOR: {
    width: 140,
    height: 140,
    fillColor: NodeRoleColor.tensor, // #5F9EA0 Cadet blue
    minWidth: 140,
    minHeight: 140,
    // NOTE: Phase 3 fix - depth indicator (×N) always visible
  },

  // ==================== OBJECTIVE & OPTIMIZATION ====================

  LOSS: {
    width: 100,
    height: 100,
    fillColor: NodeRoleColor.loss, // #B22222 Firebrick
    minWidth: 100,
    minHeight: 100,
  },

  OPTIMIZER: {
    width: 120,
    height: 100,
    fillColor: NodeRoleColor.fc, // #4169E1 Royal blue (optimization is computational)
    minWidth: 120,
    minHeight: 100,
  },

  // ==================== ADVANCED ARCHITECTURES ====================

  ATTENTION: {
    width: 160,
    height: 120,
    fillColor: NodeRoleColor.attention, // #DC143C Crimson
    minWidth: 160,
    minHeight: 120,
  },

  RNN_LSTM: {
    width: 140,
    height: 100,
    fillColor: NodeRoleColor.rnn, // #8B4789 Dark orchid
    minWidth: 140,
    minHeight: 100,
  },

  // ==================== GROUPING & TEMPLATES ====================

  GROUP: {
    width: 300,
    height: 200,
    fillColor: NodeRoleColor.group, // #708090 Slate gray
    minWidth: 200,
    minHeight: 150,
  },

  BASIC_TEMPLATE: {
    width: 400,
    height: 250,
    fillColor: 'transparent', // Templates should be transparent
    minWidth: 300,
    minHeight: 200,
  },
};

/**
 * Helper function to get initial node data for Sidebar drag-and-drop
 *
 * @param type - Node type key from NodeSizes
 * @returns Partial node data with position, size, and color
 */
export const getInitialNodeData = (type: keyof typeof NodeSizes): Partial<Node> => {
  const size = NodeSizes[type] || NodeSizes.FC_LAYER;

  return {
    type: 'default', // Will be mapped to custom components in DiagramCanvas
    data: {
      width: size.width,
      height: size.height,
      color: size.fillColor,
      label: type.replace(/_/g, ' '), // Convert "FC_LAYER" → "FC LAYER"
      formulaLabel: '', // Empty by default, user can add LaTeX
      // ML parameters will be populated by componentSchemas defaults
    },
    position: { x: 0, y: 0 },
    style: {
      width: size.width,
      height: size.height,
    },
  };
};

/**
 * Helper function to get node type from component key
 * Maps sidebar component keys to actual node component names
 *
 * @param componentKey - Key from NodeSizes (e.g., "FC_LAYER")
 * @returns Node type string for reactflow (e.g., "fc", "conv", "activation")
 */
export const getNodeTypeFromKey = (componentKey: string): string => {
  const typeMap: Record<string, string> = {
    // Linear
    NEURON: 'neuron',
    FC_LAYER: 'fc',
    MLP_LAYERS: 'mlp',

    // Conv/Pool
    CONV_LAYER: 'conv',
    POOLING: 'pooling',
    FLATTEN: 'flatten',

    // Activation
    SIGMOID_TANH: 'activation',
    SOFTMAX_RELU: 'activation',
    GELU: 'activation',

    // Norm/Reg
    BATCH_NORM: 'normalization',
    LAYER_NORM: 'normalization',
    DROPOUT: 'dropout',

    // Data
    INPUT_DATA: 'data',
    OUTPUT_DATA: 'data',
    TENSOR: 'tensor',

    // Objective
    LOSS: 'circle',
    OPTIMIZER: 'circle',

    // Advanced
    ATTENTION: 'attentionNode',
    RNN_LSTM: 'rnnNode',

    // Group
    GROUP: 'group',
  };

  return typeMap[componentKey] || 'box';
};

/**
 * Validation helper - ensures node dimensions meet minimum requirements
 *
 * @param type - Node type key
 * @param width - Proposed width
 * @param height - Proposed height
 * @returns Validated dimensions
 */
export const validateNodeDimensions = (
  type: keyof typeof NodeSizes,
  width: number,
  height: number
): { width: number; height: number } => {
  const config = NodeSizes[type];

  return {
    width: Math.max(width, config.minWidth),
    height: Math.max(height, config.minHeight),
  };
};
