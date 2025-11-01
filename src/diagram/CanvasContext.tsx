import React from 'react';

export type CanvasContextValue = {
  zoom: number;
};

export const CanvasContext = React.createContext<CanvasContextValue>({ zoom: 1 });

export const useCanvasContext = () => React.useContext(CanvasContext);

