# Airender / ML Concept Designer 概览

## 愿景
- 为机器学习研究者和工程师提供一款类似 BioRender 的学术级架构绘图工具。
- 让常见网络（Input、Conv、Attention、RNN、Loss、Optimizer 等）以统一的视觉语法呈现。
- 支持拖拽、对齐、分组、模板和导出；后续探索 Prompt-to-Diagram 工作流。

## 产品目标
1. **界面体验：** 真正的拖拽建模、吸附/对齐、快捷面板、模板插入等高频操作。
2. **数据互通：** JSON/CSV/PNG 导入导出；未来扩展 SVG/Mermaid 与可分享链接。
3. **专业视觉：** 节点采用学术界熟悉的造型（Flatten 立方体展开、Attention Q/K/V 等）。
4. **多语言：** UI 支持中英切换（技术名词默认英文，降低沟通成本）。

## 范围 / 非范围
| 分类 | 说明 |
| --- | --- |
| **范围内** | React/Vite SPA、Schema 驱动的节点参数、Undo/Redo、分组、模板、PNG/JSON/CSV 导出、本地存储 |
| **暂不纳入** | 协作/实时同步、复杂动画、超大规模仿真、多人评论系统 |

## 架构分层
1. **Canvas：** 基于 React Flow 提供画布、缩放、对齐、手势。
2. **Sidebar：** 节点库与模板，条目映射到 schema 默认值。
3. **PropertiesPanel：** 根据 schema 自动渲染输入组件并校验参数。
4. **数据层：** Zustand 存储节点/边；`src/data` 统一管理 tokens、schema、默认值与验证函数。
5. **导出：** JSON（全量状态）、CSV（nodes/edges）、PNG（当前视口），未来拓展 SVG/Mermaid。

## 里程碑
| 时间 | 进展 |
| --- | --- |
| 2025-10-15 | 13 个基础节点完成学术化视觉重构（详见 `docs/DESIGN_SYSTEM.md`） |
| 2025-10-22 | Sidebar/Canvas/PropertiesPanel 共用 centralized schema（`src/data/componentSchemas.ts`） |
| 2025-10-31 | 指出 Attention/RNN 视觉缺口、导出与测试不足（`PROJECT_PROGRESS.md`） |
| 2025-11-07 | UTF-8 清理、Attention/RNN 节点、36 项 schema 单测完成 |
| 2025-11-08 | 文档整理：根目录只保留 `README.md`、`PROJECT_PROGRESS.md`、`agents.md` |

## 待办摘要
- 更新模板库与侧边栏缩略图，覆盖 Attention/RNN/Residual。
- 引入 SVG/Mermaid 导出与可分享链接（需确定后端与鉴权策略）。
- 优化分组 UX（嵌套、父容器缩放、LOD）。
- 重写中文 i18n 文本并补充 QA 指南。
