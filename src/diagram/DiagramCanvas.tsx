import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowProvider,
  type Viewport,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useDiagramStore } from './DiagramState';
import FCNode from '@/nodes/FCNode';
import BoxNode from '@/nodes/BoxNode';
import CircleNode from '@/nodes/CircleNode';
import ResidualEdge from '@/edges/ResidualEdge';
import ConvNode from '@/nodes/ConvNode';
import DataNode from '@/nodes/DataNode';
import SimpleArrowEdge from '@/edges/SimpleArrowEdge';
import ActivationNode from '@/nodes/ActivationNode';
import TensorNode from '@/nodes/TensorNode';

// ä¸­æ–‡è¯´æ˜Žï¼šç”»å¸ƒå®¹å™¨ï¼Œæä¾›ç¼©æ”¾/å¹³ç§»ï¼Œä½¿ç”¨ Zustand ç®¡ç†èŠ‚ç‚¹ä¸Žè¿žçº¿
function CanvasInner() {
  const nodes = useDiagramStore((s) => s.nodes);
  const edges = useDiagramStore((s) => s.edges);
  const onNodesChange = useDiagramStore((s) => s.onNodesChange);
  const onEdgesChange = useDiagramStore((s) => s.onEdgesChange);
  const onConnect = useDiagramStore((s) => s.onConnect);
  const addNode = useDiagramStore((s) => s.addNode);
  const rf = useReactFlow();
  const { project } = rf;
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const snapToGrid = useDiagramStore((s) => s.snapToGrid);
  const snapGrid = useDiagramStore((s) => s.snapGrid);

  // é»˜è®¤è§†å›¾ï¼ˆå¯è°ƒæ•´ï¼ŒåŽç»­å¯æŒä¹…åŒ–ï¼‰
  const defaultViewport = useMemo<Viewport>(() => ({ x: 0, y: 0, zoom: 1 }), []);

  // æ³¨å†Œè‡ªå®šä¹‰èŠ‚ç‚¹ç±»åž‹
  const nodeTypes = useMemo(() => ({
    fcNode: FCNode,
    boxNode: BoxNode,
    circleNode: CircleNode,
    convNode: ConvNode,
    dataNode: DataNode,
    activationNode: ActivationNode,
    tensorNode: TensorNode,
  }), []);

  const edgeTypes = useMemo(() => ({
    residualEdge: ResidualEdge,
    simpleArrowEdge: SimpleArrowEdge,
  }), []);
  

  // å…è®¸æ‹–æ‹½æ”¾ç½®
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;

    const bounds = wrapperRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const position = project({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });

    let data: any = { label: 'Node' };
    const raw = event.dataTransfer.getData('application/x-mlcd-data');
    if (raw) {
      try { data = JSON.parse(raw); } catch {}
    }

    const id = `n_${Date.now()}_${Math.round(Math.random() * 1e5)}`;
    addNode({
      id,
      type,
      position,
      data,
    });
  }, [addNode, project]);

  // ç›‘å¬ App å‘å‡ºçš„å…¨å±€äº‹ä»¶ï¼ˆæ‹Ÿåˆè§†å›¾/é‡ç½®ä¸­å¿ƒï¼‰
  useEffect(() => {
    const onFit = () => rf.fitView({ duration: 300, includeHiddenNodes: true });
    const onCenter = () => rf.setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 300 });
    window.addEventListener('mlcd-fit-view' as any, onFit);
    window.addEventListener('mlcd-center' as any, onCenter);
    return () => {
      window.removeEventListener('mlcd-fit-view' as any, onFit);
      window.removeEventListener('mlcd-center' as any, onCenter);
    };
  }, [rf]);

  const onMove = useCallback(() => {
    const v = rf.getViewport();
    setZoom(v.zoom);
  }, [rf]);

  return (
    <div ref={wrapperRef} className="h-full w-full" onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        defaultViewport={defaultViewport}
        proOptions={{ hideAttribution: true }}
        snapToGrid={snapToGrid}
        snapGrid={snapGrid}
        onMove={onMove}
        selectionOnDrag
        panOnScroll
        defaultEdgeOptions={{
          markerEnd: { type: 'arrowclosed' as any, color: '#111827' },
          style: { stroke: '#111827', strokeWidth: 1.5 },
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={snapGrid[0]} size={1} color="#d1d5db" />
        <MiniMap pannable zoomable nodeStrokeWidth={2} nodeColor={(n) => (n.data as any)?.color || '#4b5563'} maskColor="rgba(255,255,255,0.6)" />
        <Controls position="bottom-right" />
      </ReactFlow>
      {/* çŠ¶æ€æ ï¼šç¼©æ”¾ä¸Žè®¡æ•° */}
      <div className="absolute bottom-2 left-2 text-xs bg-white/90 rounded border px-2 py-1 text-gray-700 shadow-sm">
        ç¼©æ”¾ {Math.round(zoom * 100)}% Â· èŠ‚ç‚¹ {nodes.length} Â· è¿žçº¿ {edges.length}
      </div>
    </div>
  );
}

export default function DiagramCanvas() {
  return (
    <ReactFlowProvider>
      <div id="diagram-canvas" className="h-full w-full">
        <CanvasInner />
      </div>
    </ReactFlowProvider>
  );
}
