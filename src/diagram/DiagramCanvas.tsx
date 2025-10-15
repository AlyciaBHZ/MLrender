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
import DropoutNode from '@/nodes/DropoutNode';
import NeuronNode from '@/nodes/NeuronNode';
import MLPNode from '@/nodes/MLPNode';
import GroupNode from '@/nodes/GroupNode';
import TemplatesData from '@/data/templates';

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
    dropoutNode: DropoutNode,
    neuronNode: NeuronNode,
    mlpNode: MLPNode,
    groupNode: GroupNode,
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
    const templateId = event.dataTransfer.getData('application/x-mlcd-template');
    if (templateId) {
      const bounds = wrapperRef.current?.getBoundingClientRect();
      if (!bounds) return;
      const detail = { templateId, at: 'point', clientX: event.clientX, clientY: event.clientY } as any;
      window.dispatchEvent(new CustomEvent('mlcd-insert-template', { detail }));
      return;
    }
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
    const onInsertTemplate = (e: any) => {
      const detail = e?.detail || {};
      const templateId: string | undefined = detail.templateId;
      const at: 'center' | 'point' = detail.at || 'center';
      if (!templateId) return;
      const tmpl = TemplatesData.find((t) => t.id === templateId);
      if (!tmpl) return;

      const bounds = wrapperRef.current?.getBoundingClientRect();
      if (!bounds) return;
      let origin;
      if (at === 'center') {
        origin = project({ x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 });
      } else {
        const cx = typeof detail.clientX === 'number' ? detail.clientX : bounds.left + bounds.width / 2;
        const cy = typeof detail.clientY === 'number' ? detail.clientY : bounds.top + bounds.height / 2;
        origin = project({ x: cx, y: cy });
      }

      const xs = (tmpl.nodes as any[]).map((n) => (n.position?.x ?? 0));
      const ys = (tmpl.nodes as any[]).map((n) => (n.position?.y ?? 0));
      const minX = Math.min(...xs);
      const minY = Math.min(...ys);
      const maxX = Math.max(...xs);
      const maxY = Math.max(...ys);
      const center = { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };

      const now = Date.now();
      const idMap = new Map<string, string>();
      const newNodes = (tmpl.nodes as any[]).map((n, idx) => {
        const newId = `t_${now}_${idx}_${Math.round(Math.random() * 1e5)}`;
        idMap.set(n.id, newId);
        const pos = n.position || { x: 0, y: 0 };
        const newPos = { x: origin.x + (pos.x - center.x), y: origin.y + (pos.y - center.y) };
        return { ...n, id: newId, selected: true, position: newPos };
      });
      const newEdges = (tmpl.edges as any[]).map((e: any, idx: number) => ({
        ...e,
        id: `te_${now}_${idx}_${Math.round(Math.random() * 1e5)}`,
        source: idMap.get(e.source) || e.source,
        target: idMap.get(e.target) || e.target,
      }));

      const s = useDiagramStore.getState();
      s.setDiagram({ nodes: [...s.nodes, ...newNodes], edges: [...s.edges, ...newEdges] });
    };
    window.addEventListener('mlcd-fit-view' as any, onFit);
    window.addEventListener('mlcd-center' as any, onCenter);
    window.addEventListener('mlcd-insert-template' as any, onInsertTemplate);
    return () => {
      window.removeEventListener('mlcd-fit-view' as any, onFit);
      window.removeEventListener('mlcd-center' as any, onCenter);
      window.removeEventListener('mlcd-insert-template' as any, onInsertTemplate);
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
          type: 'straight' as any,
          markerEnd: { type: 'arrowclosed' as any, color: 'hsl(var(--mlcd-stroke))' },
          style: { stroke: 'hsl(var(--mlcd-stroke))', strokeWidth: 1.25 },
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={snapGrid[0]} size={1} color={"var(--mlcd-grid-dot)"} />
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

