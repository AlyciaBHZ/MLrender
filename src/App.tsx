import React, { useEffect, useRef } from 'react';
import DiagramCanvas from './diagram/DiagramCanvas';
import Sidebar from './components/Sidebar';
import PropertiesPanel from './components/PropertiesPanel';
import { useDiagramStore } from './diagram/DiagramState';
import { toPng, toSvg } from 'html-to-image';
import Toolbar from './components/Toolbar';
import { exportToSheets, importFromSheets } from '@/sheets/index';
import LangSwitch from '@/components/LangSwitch';
import QuickPanel from '@/components/QuickPanel';

// ä¸­æ–‡è¯´æ˜Žï¼šä¸»å¸ƒå±€ç»„ä»¶ï¼Œå·¦ä¾§é¢„ç•™å›¾æ ‡ä¾§è¾¹æ ï¼Œä¸­é—´ä¸ºç”»å¸ƒï¼Œå³ä¾§ä¸ºå±žæ€§é¢æ¿å ä½
export default function App() {
  const setDiagram = useDiagramStore((s) => s.setDiagram);
  const nodes = useDiagramStore((s) => s.nodes);
  const edges = useDiagramStore((s) => s.edges);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onSaveJSON = () => {
    const data = { nodes, edges };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mlcd-diagram.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const onLoadJSONClick = () => fileInputRef.current?.click();
  const setNodes = useDiagramStore((s) => s.setNodes);
  const setEdges = useDiagramStore((s) => s.setEdges);
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
        // P3: ä½¿ç”¨ Zustand çš„ setNodes / setEdges é‡æ–°æ¸²æŸ“ç”»å¸ƒ
        setNodes(parsed.nodes);
        setEdges(parsed.edges);
      } else {
        alert('JSON æ ¼å¼æ— æ•ˆï¼šéœ€è¦ { nodes: [], edges: [] }');
      }
    } catch (err) {
      alert('è§£æžå¤±è´¥ï¼Œè¯·æ£€æŸ¥ JSON æ–‡ä»¶');
    } finally {
      e.target.value = '';
    }
  };

  const EXPORT_PIXEL_RATIO = 3; // HD export per spec (2x/3x)
  const onExportPNG = async () => {
    const el = document.getElementById('diagram-canvas');
    if (!el) return;
    const dataUrl = await toPng(el, {
      cacheBust: true,
      pixelRatio: EXPORT_PIXEL_RATIO,
      backgroundColor: '#ffffff',
    });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'mlcd-canvas.png';
    a.click();
  };
  const onExportSVG = async () => {
    const el = document.getElementById('diagram-canvas');
    if (!el) return;
    const svg = await toSvg(el, { cacheBust: true, backgroundColor: '#ffffff' });
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mlcd-canvas.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  const onExportSheets = () => exportToSheets(nodes, edges, true);

  const csvInputRef = useRef<HTMLInputElement | null>(null);
  const onImportSheetsClick = () => csvInputRef.current?.click();
  const onImportSheets = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const result = await importFromSheets(files);
      if (!result) {
        alert('è¯·åŒæ—¶é€‰æ‹©åŒ…å«èŠ‚ç‚¹ä¸Žè¿žçº¿çš„ CSVï¼ˆnodes.csv å’Œ edges.csvï¼‰');
        return;
      }
      setDiagram(result);
    } catch (err) {
      alert('å¯¼å…¥å¤±è´¥ï¼Œè¯·æ£€æŸ¥ CSV æ ¼å¼');
    } finally {
      e.target.value = '';
    }
  };

  // æœ¬åœ°è‡ªåŠ¨ä¿å­˜ï¼ˆlocalStorageï¼Œé˜²æŠ–ï¼‰
  useEffect(() => {
    const h = setTimeout(() => {
      const data = { nodes, edges };
      try {
        localStorage.setItem('mlcd-diagram', JSON.stringify(data));
      } catch {}
    }, 400);
    return () => clearTimeout(h);
  }, [nodes, edges]);

  // åˆå§‹åŠ è½½ï¼ˆå¦‚å­˜åœ¨æœ¬åœ°ç¼“å­˜ï¼‰
  useEffect(() => {
    try {
      const text = localStorage.getItem('mlcd-diagram');
      if (text) {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
          setDiagram({ nodes: parsed.nodes, edges: parsed.edges });
        }
      }
    } catch {}
    // ä»…é¦–æ¬¡æ‰§è¡Œ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // é”®ç›˜å¿«æ·é”®
  const removeSelected = useDiagramStore((s) => s.removeSelected);
  const duplicateSelected = useDiagramStore((s) => s.duplicateSelected);
  const setSnapToGrid = useDiagramStore((s) => s.setSnapToGrid);
  const snapToGrid = useDiagramStore((s) => s.snapToGrid);
  const snapGrid = useDiagramStore((s) => s.snapGrid);
  const setSnapGrid = useDiagramStore((s) => s.setSnapGrid);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          useDiagramStore.getState().redo();
        } else {
          useDiagramStore.getState().undo();
        }
        return;
      }
      // åˆ é™¤
      if (e.key === 'Delete' || e.key === 'Backspace') {
        removeSelected();
      }
      // å¤åˆ¶
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        duplicateSelected();
      }
      // ä¿å­˜
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        onSaveJSON();
      }
      // åŠ è½½
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        onLoadJSONClick();
      }
      // å¯¼å‡º PNG
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        onExportPNG();
      }
      // æ‹Ÿåˆè§†å›¾
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        window.dispatchEvent(new Event('mlcd-fit-view'));
      }
      // åˆ‡æ¢å¸é™„
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        setSnapToGrid(!snapToGrid);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [duplicateSelected, onExportPNG, onLoadJSONClick, onSaveJSON, removeSelected, setSnapToGrid, snapToGrid]);

  return (
    <div className="h-screen w-screen grid grid-cols-[260px_1fr_300px] grid-rows-[auto_1fr]">
      {/* é¡¶éƒ¨æ ï¼šå·¦-æ ‡é¢˜ï¼Œä¸­-ç¼–è¾‘å·¥å…·ï¼Œå³-æ•°æ®æŒ‰é’® */}
      <header className="col-span-3 h-12 px-4 grid grid-cols-[auto_1fr_auto] items-center border-b bg-white gap-4">
        <h1 className="text-sm font-semibold text-gray-800">ML Concept Designer Â· MVP</h1>

        {/* ä¸­é—´ï¼šç¼–è¾‘å·¥å…· */}
        <div className="flex items-center gap-3 justify-center">
          <Toolbar />
          {/* Snap æŽ§ä»¶ */}
          <label className="flex items-center gap-1 text-xs text-gray-700">
            <input type="checkbox" checked={snapToGrid} onChange={(e) => setSnapToGrid(e.target.checked)} /> Snap
          </label>
          <label className="flex items-center gap-1 text-xs text-gray-700">
            Grid
            <input
              className="w-14 rounded border px-1 py-0.5"
              type="number"
              min={5}
              max={100}
              step={5}
              value={snapGrid[0]}
              onChange={(e) => {
                const v = Math.max(5, Math.min(100, Number(e.target.value) || 10));
                setSnapGrid([v, v]);
              }}
            />
          </label>
          <button
            className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
            onClick={() => window.dispatchEvent(new Event('mlcd-fit-view'))}
          >
            é€‚é…è§†å›¾
          </button>
          <button
            className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
            onClick={() => window.dispatchEvent(new Event('mlcd-center'))}
          >
            é‡ç½®ä¸­å¿ƒ
          </button>
        </div>

        {/* å³ä¾§ï¼šæ•°æ®æŒä¹…åŒ–æŒ‰é’® */}
        <div className="flex items-center gap-2 justify-end">
          <button className="text-xs px-2 py-1 rounded border hover:bg-gray-50" onClick={onSaveJSON} aria-label="ä¿å­˜ JSON">ä¿å­˜ JSON</button>
          <button className="text-xs px-2 py-1 rounded border hover:bg-gray-50" onClick={onLoadJSONClick} aria-label="åŠ è½½ JSON">åŠ è½½ JSON</button>
          <button className="text-xs px-2 py-1 rounded border hover:bg-gray-50" onClick={onExportPNG} aria-label="å¯¼å‡º PNG">å¯¼å‡º PNG</button>
          <button className="text-xs px-2 py-1 rounded border hover:bg-gray-50" onClick={onExportSheets} aria-label="å¯¼å‡ºè¡¨æ ¼">å¯¼å‡ºè¡¨æ ¼</button>
          <button className="text-xs px-2 py-1 rounded border hover:bg-gray-50" onClick={onImportSheetsClick} aria-label="å¯¼å…¥è¡¨æ ¼">å¯¼å…¥è¡¨æ ¼</button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={onFileChange} />
          <input ref={csvInputRef} type="file" accept=".csv" multiple className="hidden" onChange={onImportSheets} />
        </div>
      </header>

      {/* å·¦ä¾§å›¾æ ‡é¢æ¿ */}
      <Sidebar />

      {/* ä¸­é—´ç”»å¸ƒ */}
      <main className="relative bg-mlcd-canvas">
        <DiagramCanvas />
        <LangSwitch />
        <QuickPanel />
      </main>

      {/* å³ä¾§å±žæ€§é¢æ¿ */}
      <PropertiesPanel />
    </div>
  );
}

