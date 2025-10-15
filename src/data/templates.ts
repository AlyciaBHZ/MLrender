import type { Node, Edge } from 'reactflow';

export type Template = {
  id: string;
  name: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
};

const id = (prefix: string, n: number) => `${prefix}_${n}`;

export const Templates: Template[] = [
  {
    id: 'tmpl_basic_cnn',
    name: 'Basic CNN Block',
    description: 'Input → Conv → Activation → Output',
    nodes: [
      {
        id: id('cnn', 1),
        type: 'tensorNode' as any,
        position: { x: 40, y: 120 },
        data: { label: 'Input (H×W×C)' },
      },
      {
        id: id('cnn', 2),
        type: 'convNode' as any,
        position: { x: 220, y: 110 },
        data: { label: 'Conv 3×3, stride 1' },
      },
      {
        id: id('cnn', 3),
        type: 'activationNode' as any,
        position: { x: 380, y: 110 },
        data: { label: 'ReLU', shape: 'circle', color: '#22c55e' } as any,
      },
      {
        id: id('cnn', 4),
        type: 'tensorNode' as any,
        position: { x: 540, y: 120 },
        data: { label: 'Output (H×W×C\' )' },
      },
    ],
    edges: [
      { id: id('cnn_e', 1), source: id('cnn', 1), target: id('cnn', 2), type: 'smoothstep' },
      { id: id('cnn_e', 2), source: id('cnn', 2), target: id('cnn', 3), type: 'smoothstep' },
      { id: id('cnn_e', 3), source: id('cnn', 3), target: id('cnn', 4), type: 'smoothstep' },
    ],
  },
  {
    id: 'tmpl_basic_rnn',
    name: 'Basic RNN Cell',
    description: 'Input → RNN Cell → Output (with recurrent loop)',
    nodes: [
      {
        id: id('rnn', 1),
        type: 'tensorNode' as any,
        position: { x: 40, y: 300 },
        data: { label: 'x_t' },
      },
      {
        id: id('rnn', 2),
        type: 'boxNode' as any,
        position: { x: 220, y: 280 },
        data: { label: 'RNN Cell', typeLabel: 'RNN', color: '#8b5cf6' } as any,
        style: { width: 140, height: 80 },
      },
      {
        id: id('rnn', 3),
        type: 'tensorNode' as any,
        position: { x: 420, y: 300 },
        data: { label: 'h_t' },
      },
    ],
    edges: [
      { id: id('rnn_e', 1), source: id('rnn', 1), target: id('rnn', 2), type: 'smoothstep' },
      { id: id('rnn_e', 2), source: id('rnn', 2), target: id('rnn', 3), type: 'smoothstep' },
      // recurrent self-loop
      { id: id('rnn_e', 3), source: id('rnn', 2), target: id('rnn', 2), type: 'smoothstep', label: 'h_{t-1}' } as any,
    ],
  },
  {
    id: 'tmpl_attention',
    name: 'Attention Mechanism',
    description: 'Q, K, V → Attention → Output',
    nodes: [
      {
        id: id('attn', 1),
        type: 'tensorNode' as any,
        position: { x: 60, y: 480 },
        data: { label: 'Q' },
      },
      {
        id: id('attn', 2),
        type: 'tensorNode' as any,
        position: { x: 60, y: 560 },
        data: { label: 'K' },
      },
      {
        id: id('attn', 3),
        type: 'tensorNode' as any,
        position: { x: 60, y: 640 },
        data: { label: 'V' },
      },
      {
        id: id('attn', 4),
        type: 'boxNode' as any,
        position: { x: 260, y: 540 },
        data: { label: 'Scaled Dot-Product', typeLabel: 'Attention', color: '#ef4444' } as any,
        style: { width: 180, height: 120 },
      },
      {
        id: id('attn', 5),
        type: 'tensorNode' as any,
        position: { x: 500, y: 580 },
        data: { label: 'Output' },
      },
    ],
    edges: [
      { id: id('attn_e', 1), source: id('attn', 1), target: id('attn', 4), type: 'smoothstep' },
      { id: id('attn_e', 2), source: id('attn', 2), target: id('attn', 4), type: 'smoothstep' },
      { id: id('attn_e', 3), source: id('attn', 3), target: id('attn', 4), type: 'smoothstep' },
      { id: id('attn_e', 4), source: id('attn', 4), target: id('attn', 5), type: 'smoothstep' },
    ],
  },
];

export default Templates;

