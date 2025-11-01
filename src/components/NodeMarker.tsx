import React from 'react';
import FCLayerIcon from '@/assets/icons/FCLayerIcon';
import {
  ActivationIcon,
  BatchNormIcon,
  DropoutIcon,
  FlattenIcon,
  EmbeddingIcon,
  AttentionIcon,
  PoolIcon,
  LossIcon,
  InputDataIcon,
} from '@/assets/icons/BasicIcons';

// 中文说明：小型节点内部标记，根据 variant 渲染对应的迷你图标
export type MarkerVariant =
  | 'fc'
  | 'activation'
  | 'batchnorm'
  | 'dropout'
  | 'flatten'
  | 'embedding'
  | 'attention'
  | 'pool'
  | 'loss'
  | 'input';

const map: Record<MarkerVariant, React.ComponentType<{ className?: string }>> = {
  fc: FCLayerIcon,
  activation: ActivationIcon,
  batchnorm: BatchNormIcon,
  dropout: DropoutIcon,
  flatten: FlattenIcon,
  embedding: EmbeddingIcon,
  attention: AttentionIcon,
  pool: PoolIcon,
  loss: LossIcon,
  input: InputDataIcon,
};

export default function NodeMarker({ variant }: { variant?: string }) {
  const key = (variant || 'fc') as MarkerVariant;
  const Icon = (map[key] || FCLayerIcon) as any;
  return (
    <div className="absolute top-1 right-1 opacity-90">
      <Icon className="w-4.5 h-4.5" />
    </div>
  );
}
