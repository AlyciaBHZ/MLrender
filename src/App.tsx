import React, { useEffect, useRef } from 'react';
import DiagramCanvas from './diagram/DiagramCanvas';
import Sidebar from './components/Sidebar';
import PropertiesPanel from './components/PropertiesPanel';
import { useDiagramStore } from './diagram/DiagramState';
import { toPng } from 'html-to-image';
import Toolbar from './components/Toolbar';
import { exportToSheets, importFromSheets } from '@/sheets/index';
import QuickPanel from '@/components/QuickPanel';
import { useTranslation } from 'react-i18next';

export default function App() {
  const { t } = useTranslation();
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
        setNodes(parsed.nodes);
        setEdges(parsed.edges);
      } else {
        alert('Invalid JSON: expect { nodes: [], edges: [] }');
      }
    } catch (err) {
      alert('Failed to parse JSON file');
    } finally {
      e.target.value = '';
    }
  };

  const EXPORT_PIXEL_RATIO = 3;
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
  // SVG export is currently not exposed in UI

  const onExportSheets = () => exportToSheets(nodes, edges, true);

  const csvInputRef = useRef<HTMLInputElement | null>(null);
  const onImportSheetsClick = () => csvInputRef.current?.click();
  const onImportSheets = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const result = await importFromSheets(files);
      if (!result) {
        alert('Expect two CSV files: nodes.csv and edges.csv');
        return;
      }
      setDiagram(result);
    } catch (err) {
      alert('Failed to import from CSV');
    } finally {
      e.target.value = '';
    }
  };

  // autosave to localStorage
  useEffect(() => {
    const h = setTimeout(() => {
      const data = { nodes, edges };
      try {
        localStorage.setItem('mlcd-diagram', JSON.stringify(data));
      } catch {}
    }, 400);
    return () => clearTimeout(h);
  }, [nodes, edges]);

  // load from localStorage on mount
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keyboard shortcuts
  const removeSelected = useDiagramStore((s) => s.removeSelected);
  const duplicateSelected = useDiagramStore((s) => s.duplicateSelected);
  const snapToGrid = useDiagramStore((s) => s.snapToGrid);
  const setSnapToGrid = useDiagramStore((s) => s.setSnapToGrid);
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
      if (e.key === 'Delete' || e.key === 'Backspace') {
        removeSelected();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        duplicateSelected();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        onSaveJSON();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        onLoadJSONClick();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        onExportPNG();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        window.dispatchEvent(new Event('mlcd-fit-view'));
      }
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
      <header className="col-span-3 h-12 px-4 grid grid-cols-[auto_1fr_auto] items-center border-b bg-white gap-4">
        <h1 className="text-sm font-semibold text-gray-800">ML Concept Designer MVP</h1>

        <div className="flex items-center gap-3 justify-center">
          <Toolbar />
          <label className="flex items-center gap-1 text-xs text-gray-700">
            <input type="checkbox" checked={snapToGrid} onChange={(e) => setSnapToGrid(e.target.checked)} /> {t('toolbar.snap')}
          </label>
          <label className="flex items-center gap-1 text-xs text-gray-700">
            {t('toolbar.grid')}
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
            {t('toolbar.fit')}
          </button>
          <button
            className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
            onClick={() => window.dispatchEvent(new Event('mlcd-center'))}
          >
            {t('toolbar.center')}
          </button>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <button className="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={onExportPNG} aria-label={t('app.exportPng')}>
            {t('app.exportPng')}
          </button>
          <button className="text-xs px-2 py-1 rounded border hover:bg-gray-50" onClick={onExportSheets} aria-label={t('app.exportSheets')}>
            {t('app.exportSheets')}
          </button>
          <span className="w-px h-4 bg-gray-300 mx-1" />
          <button className="text-xs px-2 py-1 rounded border hover:bg-gray-50" onClick={onSaveJSON} aria-label={t('app.saveJson')}>
            {t('app.saveJson')}
          </button>
          <button className="text-xs px-2 py-1 rounded border hover:bg-gray-50" onClick={onLoadJSONClick} aria-label={t('app.loadJson')}>
            {t('app.loadJson')}
          </button>
          <button className="text-xs px-2 py-1 rounded border hover:bg-gray-50" onClick={onImportSheetsClick} aria-label={t('app.importSheets')}>
            {t('app.importSheets')}
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={onFileChange} />
          <input ref={csvInputRef} type="file" accept=".csv" multiple className="hidden" onChange={onImportSheets} />
        </div>
      </header>

      <Sidebar />

      <main className="relative bg-mlcd-canvas">
        <DiagramCanvas />
        <QuickPanel />
      </main>

      <PropertiesPanel />
    </div>
  );
}
