export const Colors = {
  primary: 'semantic-primary',
  success: 'semantic-success',
  warning: 'semantic-warning',
  danger: 'semantic-danger',
  info: 'semantic-info',
  neutral: 'semantic-neutral',
} as const;

export const NodeRoleColor = {
  data: '#0ea5e9',
  conv: '#f59e0b',
  activation: '#16a34a',
  attention: '#ef4444',
  rnn: '#8b5cf6',
  loss: '#ef4444',
  group: '#6b7280',
  tensor: '#3b82f6',
} as const;

export type NodeVariant = keyof typeof NodeRoleColor;

