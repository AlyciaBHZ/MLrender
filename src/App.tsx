import React, { useEffect, useRef } from 'react';
import DiagramCanvas from './diagram/DiagramCanvas';
import Sidebar from './components/Sidebar';
import PropertiesPanel from './components/PropertiesPanel';
import { useDiagramStore } from './diagram/DiagramState';
import { toPng } from 'html-to-image';
import Toolbar from './components/Toolbar';
import { exportToSheets, importFromSheets } from '@/sheets/index';

// 中文说明：主布局组件，左侧预留图标侧边栏，中间为画布，右侧为属性面板占位
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
        // P3: 使用 Zustand 的 setNodes / setEdges 重新渲染画布
        setNodes(parsed.nodes);
        setEdges(parsed.edges);
      } else {
        alert('JSON 格式无效：需要 { nodes: [], edges: [] }');
      }
    } catch (err) {
      alert('解析失败，请检查 JSON 文件');
    } finally {
      e.target.value = '';
    }
  };

  const onExportPNG = async () => {
    const el = document.getElementById('diagram-canvas');
    if (!el) return;
    const dataUrl = await toPng(el, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
    });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'mlcd-canvas.png';
    a.click();
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
        alert('请同时选择包含节点与连线的 CSV（nodes.csv 和 edges.csv）');
        return;
      }
      setDiagram(result);
    } catch (err) {
      alert('导入失败，请检查 CSV 格式');
    } finally {
      e.target.value = '';
    }
  };

  // 本地自动保存（localStorage，防抖）
  useEffect(() => {
    const h = setTimeout(() => {
      const data = { nodes, edges };
      try {
        localStorage.setItem('mlcd-diagram', JSON.stringify(data));
      } catch {}
    }, 400);
    return () => clearTimeout(h);
  }, [nodes, edges]);

  // 初始加载（如存在本地缓存）
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
    // 仅首次执行
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 键盘快捷键
  const removeSelected = useDiagramStore((s) => s.removeSelected);
  const duplicateSelected = useDiagramStore((s) => s.duplicateSelected);
  const setSnapToGrid = useDiagramStore((s) => s.setSnapToGrid);
  const snapToGrid = useDiagramStore((s) => s.snapToGrid);
  const snapGrid = useDiagramStore((s) => s.snapGrid);
  const setSnapGrid = useDiagramStore((s) => s.setSnapGrid);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // 删除
      if (e.key === 'Delete' || e.key === 'Backspace') {
        removeSelected();
      }
      // 复制
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        duplicateSelected();
      }
      // 保存
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        onSaveJSON();
      }
      // 加载
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        onLoadJSONClick();
      }
      // 导出 PNG
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        onExportPNG();
      }
      // 拟合视图
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        window.dispatchEvent(new Event('mlcd-fit-view'));
      }
      // 切换吸附
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
      {/* 顶部栏：左-标题，中-编辑工具，右-数据按钮 */}
      <header className="col-span-3 h-12 px-4 grid grid-cols-[auto_1fr_auto] items-center border-b bg-white gap-4">
        <h1 className="text-sm font-semibold text-gray-800">ML Concept Designer · MVP</h1>

        {/* 中间：编辑工具 */}
        <div className="flex items-center gap-3 justify-center">
          <Toolbar />
          {/* Snap 控件 */}
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
            适配视图
          </button>
          <button
            className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
            onClick={() => window.dispatchEvent(new Event('mlcd-center'))}
          >
            重置中心
          </button>
        </div>

        {/* 右侧：数据持久化按钮 */}
        <div className="flex items-center gap-2 justify-end">
          <button className="text-xs px-2 py-1 rounded border hover:bg-gray-50" onClick={onSaveJSON} aria-label="保存 JSON">保存 JSON</button>
          <button className="text-xs px-2 py-1 rounded border hover:bg-gray-50" onClick={onLoadJSONClick} aria-label="加载 JSON">加载 JSON</button>
          <button className="text-xs px-2 py-1 rounded border hover:bg-gray-50" onClick={onExportPNG} aria-label="导出 PNG">导出 PNG</button>
          <button className="text-xs px-2 py-1 rounded border hover:bg-gray-50" onClick={onExportSheets} aria-label="导出表格">导出表格</button>
          <button className="text-xs px-2 py-1 rounded border hover:bg-gray-50" onClick={onImportSheetsClick} aria-label="导入表格">导入表格</button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={onFileChange} />
          <input ref={csvInputRef} type="file" accept=".csv" multiple className="hidden" onChange={onImportSheets} />
        </div>
      </header>

      {/* 左侧图标面板 */}
      <Sidebar />

      {/* 中间画布 */}
      <main className="relative bg-white">
        <DiagramCanvas />
      </main>

      {/* 右侧属性面板 */}
      <PropertiesPanel />
    </div>
  );
}
