export type ColorTokenKey =
  | 'canvas' | 'stroke' | 'label'
  | 'linear' | 'linearAlt'
  | 'activationG' | 'activationO'
  | 'data' | 'dataNeutral'
  | 'aux' | 'loss' | 'optimizer';

export interface DesignTokens {
  colors: Record<ColorTokenKey, string>;
  strokeWidth: { base: number; active: number };
  radius: { sm: number; md: number; lg: number; pill: number };
}

export type Role = 'core' | 'data' | 'func' | 'objective' | 'group' | 'template';

export interface PortsSpec {
  in?: string[];
  out?: string[];
}

export type ComponentSpec = {
  role: Role;
  shape: string | string[];
  ports?: PortsSpec;
  label?: boolean;
  fill?: string | string[];
  fills?: string[];
  stroke?: string | { style?: 'dashed' | 'solid' };
  pattern?: string;
  decoration?: string;
  depth?: number;
  layers?: number;
  channels?: string;
  curve?: 'sigmoid' | 'tanh' | string;
  labelBar?: { height: number; fill: string };
};

export interface UISpecConfig {
  tokens: DesignTokens;
  components: Record<string, ComponentSpec>;
}

export type SizeTier = 'Sm' | 'Md' | 'Lg';

export const SizeHeights: Record<SizeTier, { min: number; max: number; tailwind: string[] }> = {
  Sm: { min: 32, max: 40, tailwind: ['h-8', 'h-10'] },
  Md: { min: 40, max: 56, tailwind: ['h-10', 'h-14'] },
  Lg: { min: 56, max: 80, tailwind: ['h-14', 'h-20'] },
};

// Locked spec: LOD rules and semantic color default
export const SEMANTIC_COLORS_LOCKED_DEFAULT = true;

export const LOD_RULES = {
  alwaysVisible: ['typeRibbon', 'cornerMarker', 'mainLabel'] as const,
  hideDetailsWhen: {
    nodeHeightPx: 64,
    zoom: 0.5,
  },
  ultraSimpleWhen: {
    nodeHeightPx: 48,
    zoom: 0.35,
  },
};

// Locked spec: Port conventions
export const PORT_CONVENTIONS = {
  default: { in: 'left', out: 'right', shape: 'square' },
  functionHandleShape: 'round',
  gateHandleShape: 'diamond',
  auxAllowedFor: ['tensorNode', 'convNode', 'activationNode', 'mlpNode', 'attentionNode'] as string[],
  residualEdgesDashed: true,
};

// Locked spec: Family visuals (silhouette + color token)
export const FAMILY_VISUALS: Record<string, { silhouette: string; colorToken: string; alt?: string }> = {
  dataNode:        { silhouette: 'rounded-rect + side chevrons', colorToken: 'mlcd.data' },
  inputNode:       { silhouette: 'rounded-rect + side chevrons', colorToken: 'mlcd.data' },
  outputNode:      { silhouette: 'rounded-rect + side chevrons', colorToken: 'mlcd.data' },
  tensorNode:      { silhouette: 'stacked slices, front grid',    colorToken: 'mlcd.data', alt: 'mlcd.tensor-alt' },
  fcNode:          { silhouette: 'vertical lines / dot matrix',   colorToken: 'mlcd.linear' },
  mlpNode:         { silhouette: 'mini-bars (horizontal)',        colorToken: 'mlcd.linear' },
  convNode:        { silhouette: 'cuboid + front grid + k badge', colorToken: 'mlcd.linear-alt' },
  poolingNode:     { silhouette: '2x2 cell + glyph',              colorToken: 'mlcd.pool' },
  activationNode:  { silhouette: 'diamond (circle alt)',          colorToken: 'mlcd.activation-g' },
  normalizationNode:{ silhouette: 'bell curve + dashed center',   colorToken: 'mlcd.norm' },
  dropoutNode:     { silhouette: 'perforated/dotted mask',        colorToken: 'mlcd.aux' },
  embeddingNode:   { silhouette: 'matrix → vector',               colorToken: 'mlcd.data-alt' },
  flattenNode:     { silhouette: 'stack → bar',                   colorToken: 'mlcd.tensor-alt' },
  attentionNode:   { silhouette: 'QKᵀV or heads fan',             colorToken: 'mlcd.attn' },
  rnnNode:         { silhouette: 'loop arrow badge',              colorToken: 'mlcd.rnn' },
  lossNode:        { silhouette: 'red circle + L',                colorToken: 'mlcd.loss' },
  optimizerNode:   { silhouette: 'gear-in-circle',                 colorToken: 'mlcd.optimizer' },
  groupNode:       { silhouette: 'dashed container',              colorToken: 'mlcd.data-neutral' },
};
