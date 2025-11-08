// Sidebar catalog data following the 3-level blueprint.
// Only technical item labels are stored (English), categories are i18n.
// Updated to integrate with designTokens and componentSchemas

import type React from 'react';
import FCLayerIcon from '@/assets/icons/FCLayerIcon';
import DataBlockIcon from '@/assets/icons/DataBlockIcon';
import DataInIcon from '@/assets/icons/DataInIcon';
import {
  ConvIcon,
  PoolIcon,
  BatchNormIcon,
  DropoutIcon,
  FlattenIcon,
  EmbeddingIcon,
  AttentionIcon,
  RNNIcon,
  LossIcon,
  OptimIcon,
  TensorIcon,
} from '@/assets/icons/BasicIcons';
import TanhIcon from '@/assets/icons/TanhIcon';
import SigmoidIcon from '@/assets/icons/SigmoidIcon';
import MLPIcon from '@/assets/icons/MLPIcon';
import NeuronIcon from '@/assets/icons/NeuronIcon';

export type CatalogItem = {
  // React Flow node type or special markers like 'template'
  type: string;
  // English technical label (not localized per P1.2)
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  // Default node data to be attached on drop
  data?: Record<string, any>;
  draggable?: boolean;
  hint?: string;
};

export type CatalogCategory = {
  // Level key used for i18n category titles (sidebar.<id>.title)
  id: string;
  title: string; // default English fallback; UI will use i18n
  items?: CatalogItem[];
  children?: CatalogCategory[];
};

export const SidebarCatalog: CatalogCategory[] = [
  // core_primitives
  {
    id: 'core_primitives',
    title: 'Core Primitives',
    children: [
      {
        id: 'core.linear_fc',
        title: 'Linear & Fully-Connected',
        children: [
          {
            id: 'core.linear_fc.neuron',
            title: 'Neuron',
            items: [
              { type: 'neuronNode', label: 'Neuron', Icon: NeuronIcon, data: { variant: 'neuron', color: '#16a34a', width: 80 } },
            ],
          },
          {
            id: 'core.linear_fc.linear',
            title: 'Linear/Projection',
            items: [
              { type: 'fcNode', label: 'Linear', Icon: FCLayerIcon, data: { label: 'Linear', typeLabel: 'Projection', variant: 'linear', color: '#2563eb', width: 140 } },
            ],
          },
          {
            id: 'core.linear_fc.fc_mlp',
            title: 'FC/MLP',
            items: [
              { type: 'fcNode', label: 'FC Layer', Icon: FCLayerIcon, data: { label: 'FC Layer', typeLabel: 'Dense / Linear', variant: 'fc', color: '#2563eb', width: 160 } },
              { type: 'mlpNode', label: 'MLP Layers', Icon: MLPIcon, data: { label: 'MLP Layers', typeLabel: 'MLP', neuronRows: 3, neuronCols: 5, color: '#8b5cf6' } },
            ],
          },
        ],
      },
      {
        id: 'core.conv_pool',
        title: 'Convolution & Pooling',
        children: [
          {
            id: 'core.conv_pool.conv_nd',
            title: 'N-D Convolution',
            items: [
              { type: 'convNode', label: 'Conv', Icon: ConvIcon, data: { label: 'Conv', typeLabel: 'ConvNd', color: '#f59e0b', width: 160 } },
            ],
          },
          {
            id: 'core.conv_pool.pooling',
            title: 'Pooling/Downsample',
            items: [
              { type: 'boxNode', label: 'Pooling', Icon: PoolIcon, data: { label: 'Pooling', typeLabel: 'Pooling', variant: 'pool', color: '#10b981', width: 150 } },
            ],
          },
          {
            id: 'core.conv_pool.flatten',
            title: 'Flatten/Concat',
            items: [
              { type: 'boxNode', label: 'Flatten', Icon: FlattenIcon, data: { label: 'Flatten', typeLabel: 'Reshape', variant: 'flatten', color: '#f43f5e', width: 140 } },
            ],
          },
        ],
      },
      {
        id: 'core.activation_gating',
        title: 'Activation & Gating',
        children: [
          {
            id: 'core.activation_gating.classic',
            title: 'Classic Activations',
            items: [
              { type: 'activationNode', label: 'ReLU', Icon: FCLayerIcon as any, data: { label: 'ReLU', typeLabel: 'Activation', variant: 'activation', shape: 'circle', color: '#22c55e' } },
              { type: 'activationNode', label: 'Sigmoid', Icon: SigmoidIcon, data: { label: 'Sigmoid', typeLabel: 'Activation', variant: 'activation', shape: 'circle', color: '#f59e0b' } },
              { type: 'activationNode', label: 'Tanh', Icon: TanhIcon, data: { label: 'Tanh', typeLabel: 'Activation', variant: 'activation', shape: 'circle', color: '#14b8a6' } },
              { type: 'boxNode', label: 'Softmax', Icon: FCLayerIcon as any, data: { label: 'Softmax', typeLabel: 'Activation', variant: 'activation', color: '#fb923c', width: 140 } },
            ],
          },
          {
            id: 'core.activation_gating.modern',
            title: 'Modern Activations',
            items: [
              { type: 'activationNode', label: 'GELU', Icon: FCLayerIcon as any, data: { label: 'GELU', typeLabel: 'Activation', variant: 'activation', shape: 'circle', color: '#22c55e' } },
              { type: 'activationNode', label: 'SiLU/Swish', Icon: FCLayerIcon as any, data: { label: 'SiLU/Swish', typeLabel: 'Activation', variant: 'activation', shape: 'circle', color: '#22c55e' } },
              { type: 'activationNode', label: 'LeakyReLU', Icon: FCLayerIcon as any, data: { label: 'LeakyReLU', typeLabel: 'Activation', variant: 'activation', shape: 'circle', color: '#22c55e' } },
            ],
          },
          {
            id: 'core.activation_gating.learnable_gates',
            title: 'Learnable Gates',
            items: [
              { type: 'boxNode', label: 'GLU', Icon: FCLayerIcon as any, data: { label: 'GLU', typeLabel: 'Gated Unit', variant: 'gated', color: '#06b6d4', width: 120 } },
            ],
          },
        ],
      },
      {
        id: 'core.norm_reg',
        title: 'Normalization & Regularization',
        children: [
          {
            id: 'core.norm_reg.normalization',
            title: 'Normalization',
            items: [
              { type: 'boxNode', label: 'BatchNorm', Icon: BatchNormIcon, data: { label: 'BatchNorm', typeLabel: 'Normalization', variant: 'batchnorm', color: '#3b82f6', width: 150 } },
              { type: 'boxNode', label: 'LayerNorm', Icon: BatchNormIcon, data: { label: 'LayerNorm', typeLabel: 'Normalization', variant: 'layernorm', color: '#3b82f6', width: 150 } },
            ],
          },
          {
            id: 'core.norm_reg.regularization',
            title: 'Regularization',
            items: [
              { type: 'dropoutNode', label: 'Dropout', Icon: DropoutIcon, data: { label: 'Dropout', typeLabel: 'Regularization', variant: 'dropout', color: '#06b6d4', width: 140 } },
            ],
          },
        ],
      },
      {
        id: 'core.embed_attn',
        title: 'Embedding & Attention',
        children: [
          {
            id: 'core.embed_attn.embedding',
            title: 'Embedding & Position',
            items: [
              { type: 'boxNode', label: 'Embedding', Icon: EmbeddingIcon, data: { label: 'Embedding', typeLabel: 'Embedding', variant: 'embedding', color: '#10b981', width: 160 } },
              { type: 'boxNode', label: 'PositionalEncoding', Icon: EmbeddingIcon, data: { label: 'PositionalEncoding', typeLabel: 'Position', variant: 'posenc', color: '#10b981', width: 180 } },
            ],
          },
          {
            id: 'core.embed_attn.attention',
            title: 'Attention Primitives',
            items: [
              { type: 'attentionNode', label: 'Multi-Head Attention', Icon: AttentionIcon, data: { label: 'Multi-Head Attention', typeLabel: 'Attention', variant: 'attention', color: '#DC143C', width: 140, numHeads: 8 } },
              { type: 'attentionNode', label: 'ScaledDotProductAttention', Icon: AttentionIcon, data: { label: 'Scaled Dot-Product', typeLabel: 'Attention', variant: 'attention', color: '#DC143C', width: 140, numHeads: 1 } },
            ],
          },
          {
            id: 'core.embed_attn.rnn',
            title: 'Recurrent Layers',
            items: [
              { type: 'rnnNode', label: 'RNN', Icon: RNNIcon, data: { label: 'RNN', typeLabel: 'RNN', variant: 'rnn', color: '#8B4789', width: 140, cellType: 'RNN', hiddenSize: 256 } },
              { type: 'rnnNode', label: 'LSTM', Icon: RNNIcon, data: { label: 'LSTM', typeLabel: 'LSTM', variant: 'rnn', color: '#8B4789', width: 140, cellType: 'LSTM', hiddenSize: 256 } },
              { type: 'rnnNode', label: 'GRU', Icon: RNNIcon, data: { label: 'GRU', typeLabel: 'GRU', variant: 'rnn', color: '#8B4789', width: 140, cellType: 'GRU', hiddenSize: 256 } },
              { type: 'rnnNode', label: 'Bidirectional LSTM', Icon: RNNIcon, data: { label: 'BiLSTM', typeLabel: 'LSTM', variant: 'rnn', color: '#8B4789', width: 140, cellType: 'LSTM', hiddenSize: 256, bidirectional: true } },
            ],
          },
        ],
      },
      {
        id: 'core.tensor_ops',
        title: 'Tensor & Shape',
        children: [
          {
            id: 'core.tensor_ops.reshape_permute',
            title: 'Reshape & Permute',
            items: [
              { type: 'boxNode', label: 'Reshape', Icon: FCLayerIcon as any, data: { label: 'Reshape', typeLabel: 'Shape', variant: 'reshape', color: '#64748b', width: 140 } },
              { type: 'boxNode', label: 'Permute', Icon: FCLayerIcon as any, data: { label: 'Permute', typeLabel: 'Axes', variant: 'permute', color: '#64748b', width: 140 } },
            ],
          },
          {
            id: 'core.tensor_ops.elementwise',
            title: 'Elementwise Ops',
            items: [
              { type: 'boxNode', label: 'Add', Icon: FCLayerIcon as any, data: { label: 'Add', typeLabel: 'Elementwise', variant: 'add', color: '#64748b', width: 100 } },
              { type: 'boxNode', label: 'Mul', Icon: FCLayerIcon as any, data: { label: 'Mul', typeLabel: 'Elementwise', variant: 'mul', color: '#64748b', width: 100 } },
            ],
          },
        ],
      },
      {
        id: 'core.parameters',
        title: 'Parameters & Constants',
        children: [
          {
            id: 'core.parameters.weights_consts',
            title: 'Weights & Constants',
            items: [
              { type: 'boxNode', label: 'Parameter', Icon: FCLayerIcon as any, data: { label: 'Parameter', typeLabel: 'Weights', variant: 'param', color: '#0ea5e9', width: 140 } },
              { type: 'boxNode', label: 'Constant', Icon: FCLayerIcon as any, data: { label: 'Constant', typeLabel: 'Constant', variant: 'const', color: '#0ea5e9', width: 140 } },
            ],
          },
        ],
      },
    ],
  },

  // data_process
  {
    id: 'data_process',
    title: 'Data & Process',
    children: [
      {
        id: 'data.io',
        title: 'I/O',
        children: [
          {
            id: 'data.io.endpoints',
            title: 'Endpoints',
            items: [
              { type: 'dataNode', label: 'Input', Icon: DataInIcon, data: { label: 'Input', typeLabel: 'Input', variant: 'input', direction: 'left', color: '#6b7280', width: 180 } },
              { type: 'dataNode', label: 'Output', Icon: DataBlockIcon, data: { label: 'Output', typeLabel: 'Output', variant: 'output', direction: 'right', color: '#6b7280', width: 180 } },
            ],
          },
        ],
      },
      {
        id: 'data.tensor',
        title: 'Tensor',
        children: [
          {
            id: 'data.tensor.nd_struct',
            title: 'ND Structures',
            items: [
              { type: 'tensorNode', label: 'Tensor', Icon: TensorIcon, data: { label: 'Tensor', typeLabel: 'Tensor', color: '#3b82f6', width: 160 } },
            ],
          },
        ],
      },
      {
        id: 'data.objective',
        title: 'Objective',
        children: [
          {
            id: 'data.objective.loss',
            title: 'Loss',
            items: [
              { type: 'boxNode', label: 'Loss', Icon: LossIcon, data: { label: 'Loss', typeLabel: 'Objective', variant: 'loss', color: '#ef4444', width: 120 } },
            ],
          },
          {
            id: 'data.objective.optimizer',
            title: 'Optimizer',
            items: [
              { type: 'boxNode', label: 'Optimizer', Icon: OptimIcon, data: { label: 'Optimizer', typeLabel: 'Objective', variant: 'optimizer', color: '#0ea5e9', width: 140 } },
            ],
          },
        ],
      },
      {
        id: 'data.annotation',
        title: 'Annotation',
        children: [
          {
            id: 'data.annotation.ui_docs',
            title: 'UI Docs',
            items: [
              { type: 'boxNode', label: 'Text Box', Icon: DataBlockIcon, data: { label: 'Text Box', typeLabel: 'Annotation', variant: 'textbox', color: '#64748b', width: 160 } },
              { type: 'groupNode', label: 'Group Label', Icon: DataBlockIcon, data: { label: 'Group', typeLabel: 'Annotation', variant: 'group', color: '#6b7280', width: 200 } },
            ],
          },
        ],
      },
    ],
  },

  // connectors
  {
    id: 'connectors',
    title: 'Connectors',
    children: [
      {
        id: 'connect.flow',
        title: 'Flow',
        children: [
          {
            id: 'connect.flow.directed',
            title: 'Directed',
            items: [
              { type: 'simpleArrowEdge', label: 'Arrow Connector', Icon: TensorIcon, draggable: false, hint: 'Edge: simple arrow' },
            ],
          },
          {
            id: 'connect.flow.residual',
            title: 'Residual',
            items: [
              { type: 'residualEdge', label: 'Residual Connector', Icon: TensorIcon, draggable: false, hint: 'Edge: residual' },
            ],
          },
        ],
      },
    ],
  },
];

