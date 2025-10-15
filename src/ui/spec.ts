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
