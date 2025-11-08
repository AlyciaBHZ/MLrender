import React from 'react';
import FCLayerIcon from '@/assets/icons/FCLayerIcon';
import {
  ActivationIcon,
  BatchNormIcon,
  DropoutIcon,
  FlattenIcon,
  EmbeddingIcon,
  AttentionIcon,
  RNNIcon,
  PoolIcon,
  LossIcon,
  InputDataIcon,
} from '@/assets/icons/BasicIcons';

// Marker overlay variants that communicate semantic node types.
export type MarkerVariant =
  | 'fc'
  | 'activation'
  | 'batchnorm'
  | 'dropout'
  | 'flatten'
  | 'embedding'
  | 'attention'
  | 'rnn'
  | 'pool'
  | 'loss'
  | 'input';

const iconMap: Record<MarkerVariant, React.ComponentType<{ className?: string }>> = {
  fc: FCLayerIcon,
  activation: ActivationIcon,
  batchnorm: BatchNormIcon,
  dropout: DropoutIcon,
  flatten: FlattenIcon,
  embedding: EmbeddingIcon,
  attention: AttentionIcon,
  rnn: RNNIcon,
  pool: PoolIcon,
  loss: LossIcon,
  input: InputDataIcon,
};

const DEFAULT_VARIANT: MarkerVariant = 'fc';

function resolveVariant(value?: string): MarkerVariant {
  if (!value) return DEFAULT_VARIANT;
  return (value in iconMap ? value : DEFAULT_VARIANT) as MarkerVariant;
}

const NodeMarker = React.memo(function NodeMarker({ variant }: { variant?: string }) {
  const Icon = iconMap[resolveVariant(variant)];
  return (
    <div className="absolute top-1 right-1 opacity-90" aria-hidden="true">
      <Icon className="h-4.5 w-4.5" />
    </div>
  );
});

export default NodeMarker;
