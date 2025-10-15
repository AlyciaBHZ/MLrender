# ML-CD Visual & Component Spec (Draft)

## 1) 项目与目标 (Project & Goal)
- 项目名称：ML Concept Designer (ML-CD)
- 目标用户：机器学习研究人员、数据科学家、学生

## 2) 设计目标 (Design Goals)
- 语义清晰：语义色与命名一致，组件语义明确
- 现代统一：视觉语言/边角/线宽/留白统一
- 颜色可辨识：角色→颜色映射稳定、对比度充分
- 可程序化生成：结构与样式可由配置/脚本生成
- 输出载体：全部组件以 SVG 输出（矢量优先）
- Tailwind 驱动：尺寸/颜色/间距由 Tailwind 系统驱动

## 2) 颜色与样式规范 (Color & Style Guideline)

### 2.1 设计令牌（Design Tokens / CSS Variables）
- 语义色（CSS 变量，HSL 空格分隔，便于深浅主题动态调节与透明度计算）
  - `--mlcd-primary`   → 品牌/主操作色（默认蓝）
  - `--mlcd-success`   → 成功/正向色（默认绿）
  - `--mlcd-warning`   → 警告/中性强调（默认橙）
  - `--mlcd-danger`    → 危险/错误（默认红）
  - `--mlcd-info`      → 信息/数据（默认天蓝）
  - `--mlcd-neutral`   → 中性色（默认灰）
- 变量名稳定：值可在 Tailwind 主题的暗色模式中覆写
- 定义位置：`src/styles/tailwind.css` 的 `:root` / `[data-theme='dark']`
- Tailwind 语义色映射：`tailwind.config.js -> theme.extend.colors.semantic.*`
  - 使用方式（HSL）：
    - 文本：`text-semantic-primary`、`text-semantic-neutral/70`
    - 描边：`stroke-semantic-info`、`stroke-semantic-danger/60`
    - 填充：`fill-semantic-warning/20`
  - 透明度：`/NN` 与 `<alpha-value>` 依赖 `hsl(var(--mlcd-*) / <alpha-value>)`
- 组件角色默认色（TS 令牌）：`src/ui/tokens.ts`
  - `NodeRoleColor`：`conv/activation/attention/rnn/loss/group/tensor/data`
  - 组件可用 `data.color` 覆盖（建议限制在语义/角色色范围）

### 2.2 边框/圆角/阴影/线宽
- 线宽：
  - 默认描边 `1.5`
  - 选中高亮 `2.0` 外环/描边
- 圆角：
  - 模块类默认 `rounded-[6px]`
  - 激活（圆）`rounded-full`
  - 菱形/其他按节点风格定义
- 阴影：
  - 轻量阴影或描边高亮二选一；在 SVG 模式优先使用描边高亮（避免 SVG 滤镜性能成本）

### 2.2 类型到颜色形状映射（用于 Export to Sheets）
- 目的：在 CSV（nodes.csv）中稳定输出颜色/形状，便于后续在表格或二次渲染中复原视觉风格。
- 输出字段：`color`（可为 token:mlcd.* 或具体颜色）、`shape`（rect|circle|diamond|tensor|group）
- 默认映射（可被 data.color 覆盖）：
  - fcNode / mlpNode → color: mlcd.linear, shape: rect
  - convNode → color: mlcd.linearAlt, shape: rect
  - activationNode → color: mlcd.actG（或 actO），shape: circle/diamond（由 data.shape 决定）
  - tensorNode → color: mlcd.data, shape: tensor
  - dataNode → color: mlcd.data, shape: rect
  - circleNode（Optimizer）→ color: mlcd.opt, shape: circle
  - dropoutNode / 正则 → color: mlcd.aux, shape: rect
  - groupNode → color: mlcd.dataN, shape: group
  - boxNode.variant:
    - loss → mlcd.loss; batchnorm → mlcd.linearAlt; embedding → mlcd.data; pool/flatten → mlcd.linear; attention → mlcd.data; activation → mlcd.actG
- 实现位置：`src/sheets/mapping.ts`（`mapNodeToExport`），导出逻辑见 `src/sheets/export.ts`

| 类型 Type                | 颜色 Color                                      | 形状 Shape           | 内部细节 Internal Detail |
| ---------------------- | --------------------------------------------- | -------------------- | ------------------------ |
| 基础计算层 (Linear/Conv)    | `--mlcd-linear` / `--mlcd-linear-alt`         | 圆角矩形胶囊、或 3D 立方体 | 简洁，边缘设输入输出锚点          |
| 激活函数 (Activation)      | `--mlcd-activation-g` / `--mlcd-activation-o` | 圆形/菱形              | 内置函数曲线（S/ReLU）         |
| 数据流 (Data/Tensor/I/O)  | `--mlcd-data` / `--mlcd-data-neutral`         | 倾斜矩形/梯形/3D 立方体   | 体现流动、多维堆叠              |
| 辅助（正则/归一）            | `--mlcd-aux`（可图案填充）                           | 虚线/点线矩形            | 斜杠/点阵图案表达稀疏            |
| 损失/优化 (Loss/Optimizer) | `--mlcd-loss`（Loss）/ `--mlcd-optimizer`（Opt）  | 圆带符号矩形            | 强化终端目标属性              |
| 背景画布                    | `--mlcd-canvas` + `--mlcd-grid-dot`           | 点状网格               | 无                          |

注：表中形状为视觉规范；导出 CSV 的 `shape` 列使用标准枚举（rect|circle|diamond|tensor|group），其中 3D 立方体/倾斜矩形属于 rect 的视觉变体，由渲染端决定具体样式。

### 2.3 通用绘制规范
- 全 SVG：所有几何采用 `<svg>` 基元（rect/circle/path/polygon/defs/pattern）实现；避免位图滤镜。
- 线宽与描边：默认 `stroke: var(--mlcd-stroke)`, `stroke-width: 1.25px`；激活/选中时 `1.5px`；可用 Tailwind `stroke-mlcd-stroke stroke-1.25` 与 `stroke-1.5`。
- 可见性（Active/Hover）：选中或激活态可叠加轻微外辉 `fill: var(--mlcd-hover)`（低不透明度）或描边加粗；当前实现为 3px 内阴影模拟外辉，逐步迁移为纯 SVG 外圈。
- 选中规则：
  - 边：选中后 `stroke-width: 1.5px`；端帽随之加粗（由 path/marker 继承）。
  - 锚点：选中节点内所有锚点显示外环（hover 色，低不透明度），保持直径 6–8px 的内核不变。
- 圆角与造型：基础层默认 r=8（8px 圆角）；FC 胶囊 r=9999；需 3D 效果时以多层描边/偏移矩形堆叠实现（矢量）。
- 图案填充：辅助/正则类可用 `<pattern>` 制作点/斜杠图案，颜色基于 `--mlcd-aux` 及不透明度变化。
- 锚点规范：输入左侧（`in-0..`）、输出右侧（`out-0..`），尺寸 8×8，命中区≥12×12，与网格对齐。
- 标签与层级：主标题 `text-mlcd-label`，副标题 `text-mlcd-muted`；公式用 MathText+KaTeX；超长截断+title。
- 标签位置：默认置顶或居中（节点垂直方向中线）；根据节点类型选用。
- 组件名：置于组件上方小行或中部居中；Group 名放在 Group 标签条的中部。
- 字体与字号：系统 UI 或 Inter；主标签建议 `text-sm`（≈14px），次标签建议 `text-xs`（≈12px）。
- 背景与网格：画布 `bg-mlcd-canvas`；网格点 `var(--mlcd-grid-dot)`；间距与 `snapGrid` 同步。
- 导出与像素密度：PNG 建议 3× 或 4×；优先提供 SVG 导出；导出白底或透明背景按需求配置。
- 主题与对比度：HSL 变量满足明暗主题；确保文本/线条对比度符合 WCAG AA。

### 2.4 间距（Spacing）
- 组件内边距：8–12px（Tailwind `p-2`/`p-3`），根据密度自适应。
- 锚点与边距：锚点与节点边缘留白 6px；锚点尺寸 8×8，命中区≥12×12。

### 2.5 可编排（Composable sizing）
- 所有尺寸通过 Tailwind 实用类或 rem 控制：`w-*`、`h-*`、`p-*`、`rounded-*`、`min-w-*`、`min-h-*`。
- 禁止在组件样式中硬编码像素宽高；如需 100% 填充，使用 `w-full h-full` 类。
- 动态圆角采用条件类（如 `rounded-full` 或 `rounded-[8px]`），避免内联 `borderRadius` 数值。
### 2.3 文本与层级
- 主标题：`text-sm text-gray-800`
- 副标题：`text-xs text-gray-500`
- 代码/公式标签：MathText + KaTeX（保留现有实现）
- 溢出：`truncate + title` 提示

### 2.4 网格/背景
- 画布背景：浅灰白（`bg-white`）+ 点状网格（`<Background variant={Dots} color='#d1d5db'>`）
- 网格间距：与 `snapGrid` 同步，支持 5–100 调整
- 可定义网格色变量（可选）：`--mlcd-grid: 209 213 219`（`#d1d5db`）

## 3) 核心约束 (Core Constraints)
- 全部图形为矢量/SVG（MANDATORY）：所有节点、装饰与图标均以 SVG 渲染与导出。
- 渲染载体
  - 100% SVG（包含节点、图标、装饰），禁止位图/Canvas 作为主要渲染路径
  - 图标统一为内联 SVG，可参数化颜色/尺寸，支持 Tailwind 类
- 主题与令牌
  - 仅通过 Tailwind 与 tokens 驱动颜色与尺寸；业务代码不得硬编码 Hex（除 tokens 定义处）
  - 语义色位于 `tailwind.config.js -> theme.extend.colors.semantic.*`；角色默认色位于 `src/ui/tokens.ts`
  - 允许 `data.color` 覆盖，但需落在语义色/角色色范围（后续可加入校验）
- 布局与网格
  - 统一使用网格对齐（当前 `snapGrid = [10,10]`）；尺寸与间距遵循 Tailwind 间距刻度
  - 最小点击/触控目标 24×24；节点最小尺寸遵循各组件约束
- 线宽与圆角
  - 默认描边 1.5；选中高亮描边/外环 2.0；圆角遵循组件风格（如模块 6、圆形/激活 9999）
- 状态与交互
  - 统一的 hover/selected/disabled/focus 状态；可见的键盘焦点（focus ring）
  - 选择集操作（对齐/分布/成组/解组）必须单次批量更新（`setNodes`），纳入撤销/重做
- 国际化与无障碍
  - 所有 UI 文案均走 i18n（`toolbar.*`、`panel.*`、`node.*`）；禁止硬编码可见字符串
  - 对比度遵循 WCAG AA（文本/图标 ≥ 4.5:1）；SVG 图形设置可读的 title/aria-label（按需）
- 导出与可视一致性
  - 以 SVG 为一等导出格式；PNG/JPG 可选由矢量转化
  - 导出时保持视觉一致（变换/裁剪/阴影一致），避免外链资源依赖
- 数据与稳定性
  - 节点/边 ID 使用稳定前缀（`n_`、`g_`、`te_` 等）避免冲突；模板插入需做 ID 重映射
  - 禁止直接突变 React Flow 内部状态；通过 store API（`setNodes/setEdges/setDiagram`）修改
- KaTeX/公式
  - 保留 `data.formulaLabel` + MathText + KaTeX 渲染路径；渲染错误需优雅降级为纯文本
- 暗色模式（预留）
  - 使用语义色 + tokens + CSS 变量，避免直接使用灰度常量，便于后续暗色主题映射
- 性能
  - 避免不必要重渲染，优先使用 `useMemo`/`React.memo`；SVG 复杂度可控（避免大面积滤镜）

## 4) 主题化（Theming）
- 技术路线：CSS 变量 + Tailwind 语义色
  - Tailwind：`theme.extend.colors.semantic.*` 使用 `rgb(var(--mlcd-*) / <alpha-value>)`
  - CSS 变量：在 `src/styles/tailwind.css` 定义 `--mlcd-primary/success/...`（RGB 形式）
  - 切换主题：在 `html/body` 添加 `data-theme="dark"` 或类 `.theme-dark` 应用另一套变量
  - 组件用法：
  - 文本/描边/填充使用 `text-semantic-primary`/`stroke-semantic-info`/`fill-semantic-warning/50`
  - 业务组件默认色从 `src/ui/tokens.ts` 映射，逐步替换为 Tailwind 语义类或读取 CSS 变量

## 5) 锚点与标签规范（Anchors & Labels）
- 锚点（React Flow Handles）
  - 方向与角色：
    - 左侧（Position.Left）：`type='target'`，命名前缀 `in-`，默认 `in-0`
    - 右侧（Position.Right）：`type='source'`，命名前缀 `out-`，默认 `out-0`
    - 可选：上/下（Top/Bottom）用于特殊结构（如残差/多分支），命名 `in-top-*`/`out-bottom-*`
  - 尺寸与形状：直径 6–8px 小圆（默认 8px：`w-2 h-2 rounded-full`），可空心/实心；交互命中区 ≥ 12×12
  - 数据属性：统一 `data-port="in|out|skip"` 与 `data-slot="<index>"`，用于导出/自动连线/测试定位
  - 颜色：默认随节点 `data.color` 或角色色；禁用态降低不透明度至 40%
  - 间距：距节点边框 0–4px，确保视觉对齐网格
  - 命名规范：`in-<index>`/`out-<index>`；特殊端口使用语义后缀（如 `out-skip`, `in-gate`）
  - 多端口：
    - 数据结构（建议）：`data.ports = { inputs: string[]; outputs: string[] }`
    - 渲染时按顺序/布局规则布置多个锚点，id 使用上述命名
- 边与标签
  - 边类型：
    - 默认 `smoothstep`（全局），可按需覆盖 `simple`/`residualEdge` 等
  - 边标签：`edge.label` 用于文字；命名与 i18n key：`edge.label.<kind>`（如 residual, skip）
  - 边颜色：`edge.style.stroke` 遵循语义色；高亮/选中时提升对比度
- 节点标签（文本/公式）
  - 主标题：`data.label`（纯文本）；副标题/类别：`data.typeLabel`
  - 公式：`data.formulaLabel`（KaTeX 渲染，错误降级纯文本）
  - 文本排版：
    - 主标题使用 `text-gray-800`，字号 `text-sm`；副标题 `text-xs text-gray-500`
    - 溢出截断（truncate），提供 `title` 作为悬浮提示
  - i18n 命名：`node.<type>.label`、`node.<type>.type`
  - 可访问性：为主要文本提供 `aria-label`，由 `typeLabel + label` 组成

## 4) 画布与网格 (Canvas & Grid)
- 背景与网格：
  - 背景：浅灰或白（`bg-mlcd-canvas`）
  - 网格：8px 间距的点阵（ReactFlow `<Background variant={Dots} color='var(--mlcd-grid-dot)' gap={8}>`）
  - 网格间距与 `snapGrid` 一致；默认 8px，支持 UI 调整（5–100）
- 高清导出：
  - PNG：使用 html-to-image，`pixelRatio ≥ 3`，白底，缓存清理；文件名 `mlcd-canvas.png`
  - SVG：提供矢量导出（首选）；文件名 `mlcd-canvas.svg`
  - 导出区域：默认导出画布容器（后续可支持选区导出）

网格 SVG 样例：
```
<svg class="w-full h-full" aria-hidden="true">
  <defs>
    <pattern id="dot-grid" width="8" height="8" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="0.8" fill="var(--mlcd-grid-dot)"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="var(--mlcd-canvas)"/>
  <rect width="100%" height="100%" fill="url(#dot-grid)"/>
  <!-- 实际实现中使用 React Flow Background(Dots)，此示例用于导出或自定义背景 -->
  <!-- Anchors 仍由节点组件渲染，遵循 data-port/data-slot 规范 -->
  <!-- Tailwind 尺寸类控制 SVG 外层大小，如 w-full h-full 或固定尺寸 -->
```

## 5) 侧边栏结构与命名规范 (Sidebar & Naming)

要求：
- 顶层可折叠（Section 组件开合）
- 中文字符正确显示（使用系统 UI/Inter 字体栈，UTF-8 保存）
- 提供 i18n key（点分层），示例：
  - 类目：`sidebar.core.title`, `sidebar.core.linear_activation`, `sidebar.data.title`
  - 条目：`sidebar.item.fc_layer`, `sidebar.item.conv_layer`, `sidebar.item.tensor`

命名与显示策略：
- Category: `{ id, title, titleKey }`，渲染时优先 `titleKey` → `t(titleKey)`，回退 `title`
- Item: `{ type, label, labelKey }`，渲染时优先 `labelKey` → `t(labelKey)`，回退 `label`
- Sidebar 搜索基于显示文本（t 后的文案）；保留拖拽数据 `application/x-mlcd-data`

建议的层级与 i18n Key（示例）

| Level 1            | Level 2       | 中文名称                 | 英文名称                      | i18n Key              |
| ------------------ | ------------- | ------------------------ | ----------------------------- | --------------------- |
| 核心计算层           | 线性与全连接      | FC 层, 多层感知机            | Linear & Fully Connected      | `core.linear_fc`      |
| 核心计算层           | 卷积与池化       | 卷积, 池化, 展平             | Convolution & Pooling         | `core.conv_pool`      |
| 数据、流程与连接        | I/O 与张量       | 输入数据, 输出, 张量           | I/O & Tensors                 | `data.io_tensors`     |
| 数据、流程与连接        | 连接器          | 箭头, 残差连接               | Connectors                    | `data.connectors`     |
| 功能与约束           | 激活函数         | Tanh, Sigmoid, ReLU     | Activation Functions          | `func.activation`     |
| 功能与约束           | 正则化与归一化      | 批归一化, Dropout          | Normalization & Reg.          | `func.norm_reg`       |
| 目标与优化           |               | 损失函数, 优化器              | Loss & Optimizer              | `objective.loss_opt`  |
| 模板库              |               | CNN 模块, Transformer    | Templates                     | `templates.blocks`    |

命名规则（实例化）
- 组件实例名：`<Type><Variant><Size>`，例如：`FCLayerCapsuleMd`、`Conv3DDepthSm`。
- Type 通常与节点类型一致（FC/Conv/Tensor/Activation/Dropout/Group 等），Variant 用于形态（Capsule/3DDepth/Trapezoid），Size 为建议尺寸（Sm/Md/Lg）。

数据属性（Data Attributes）
- 锚点（handles）：`data-port="in|out|skip"`、`data-slot="<index>"`（示例：`data-port="in" data-slot="0"`）
- 边（edges）：`data-kind="residual"`（残差/跳连）
- 节点（nodes，根容器）：
  - `data-type`：`fc|mlp|conv|neuron|activation|dropout|tensor|group|loss|optimizer`
  - `data-node-type`：内部标识（可与 `data-type` 相同或更细粒度）
  - 可选：`data-variant`（如 boxNode 的 `loss`/`dropout` 等）、`data-shape`（如 activation 的 `circle`/`diamond`）、`data-direction`（如 dataNode 的 `left`/`right`）
  - `data-role`：`core|data|func|objective|template`
- 用途：导出标注、自动化测试定位、样式/行为选择器（避免依赖脆弱的文本）
Design tokens (initial, to be confirmed):
- Colors (semantic):
  - primary: brand.600
  - success: #16a34a
  - warning: #f59e0b
  - danger: #ef4444
  - info: #0ea5e9
  - neutral: gray-600
- Component roles:
  - data: info
  - conv: warning
  - activation: success
  - attention: danger
  - rnn: violet-500
  - loss: danger (lighter bg)
  - group: neutral (dashed)

## 3) 组件细节与图标库规范 (Component Library)

> 下表为统一视觉规范与 SVG 伪代码（可直接转真实 SVG）。示例宽高仅作参考，最终以 Tailwind 类控制尺寸（w-*, h-*, p-*，等）。

| 组件 | 视觉规范 | 颜色分类 | 特殊要求 |
| --- | --- | --- | --- |
| FC Layer | 胶囊状，轻投影可选；左右各 1–N 个锚点 | 基础计算层 | 内部无细节，仅标签 |
| MLP Layers | 圆角矩形，内部均匀小圆点网格 | 基础计算层 | 小圆点表示神经元矩阵 |
| Conv Layer | 3D 透视矩形立方体，显通道叠层 | 基础计算层 | 必须体现深度通道 |
| Neuron | 实心圆，左右锚点 | 激活基础单元 | 尺寸可缩放，标签可选 |
| Sigmoid/Tanh | 圆形内嵌曲线（S/跨零平滑） | 激活函数 | 与 Neuron 视觉区分 |
| Dropout | 虚线圆角矩形 + 稀疏点斜杠填充 | 辅助功能 | 强化随机断开 |
| Tensor | 多个偏移堆叠的 3D 方块 | 数据流 | 表达高维度 & 批量 |
| Group Node | 虚线边框容器，上方小标签 | N/A | 清晰包裹子节点不喧宾夺主 |

### 3.1 核心组件（Core Nodes）

| 组件 | 形状与风格 | 典型标签 | 令牌（颜色） | SVG 伪代码（要点） | 锚点与说明 |
|---|---|---|---|---|---|
| FC/Linear | 胶囊（rounded-full）或圆角矩形（rounded-[8px]） | Dense/Linear | mlcd.linear | rect rx=9999 或 rx=8，stroke-mlcd-stroke，fill 类别色浅层 | 左 in-0，右 out-0 |
| Conv | 3 层错位矩形叠放模拟 3D | Conv 3×3 | mlcd.linearAlt | 三个 <rect> 递进偏移，外层描边更深 | 左 in-0，右 out-0 |
| Activation | 圆/菱形，内部函数曲线 | ReLU/Sigmoid | mlcd.actG 或 mlcd.actO | circle 或 diamond + path（S/ReLU 曲线），描边 1.25 | 左 in-0，右 out-0 |
| Tensor | 多层矩形叠加（立体） | H×W×C | mlcd.data | 两层或三层 <rect> + 带角标 path | 左 in-0，右 out-0 |
| Data/I/O | 倾斜矩形/梯形 | Input/Output | mlcd.data / mlcd.dataN | polygon 倾斜 + 一条中线 path | 左 in-0，右 out-0 |
| Loss | 圆带符号的矩形 | Loss | mlcd.loss | rect rx=8 + ribbon/target 装饰（小圆或角标） | 左 in-0，右 out-0 |
| Optimizer | 圆形/齿轮化图标 | Optimizer | mlcd.optimizer | circle + 简化齿节点装饰（可选） | 左 in-0，右 out-0 |
| Group | 虚线/点线圆角矩形 | Group | mlcd.dataN | rect rx=8，stroke-dashed，透明浅填充 | 不连接外边，内部子节点连线 |

### 3.1 SVG 伪代码（可落地）

伪代码样例（Conv 3 层叠放）
```
<svg viewBox="0 0 140 70" class="w-full h-12 stroke-mlcd-stroke stroke-1.25">
  <rect x="38" y="10" width="82" height="48" rx="8" fill="hsl(var(--mlcd-linear-alt) / 0.10)" />
  <rect x="24" y="6"  width="82" height="48" rx="8" fill="hsl(var(--mlcd-linear-alt) / 0.12)" />
  <rect x="10" y="2"  width="82" height="48" rx="8" fill="hsl(var(--mlcd-linear-alt) / 0.16)" />
</svg>
```

伪代码样例（Activation 菱形 + ReLU）
```
<svg viewBox="0 0 100 100" class="w-20 h-20 stroke-mlcd-stroke stroke-1.25">
  <polygon points="50,8 92,50 50,92 8,50" fill="hsl(var(--mlcd-activation-g) / 0.08)" />
  <path d="M 10 60 L 40 60 L 80 20" stroke="currentColor" fill="none" />
</svg>
```

实现说明（Implementation Notes）
- 令牌填充：
  - 若变量为 HSL 分量（本项目默认）：使用 `fill="hsl(var(--token))"` 或 Tailwind 任意值 `fill-[hsl(var(--token))]`
  - 若变量为完整颜色：可直接 `fill="var(--token)"`
  - 配合 Tailwind 尺寸类控制大小，如 `<svg class="w-28 h-12">`
- 尺寸控制：统一通过 `w-*`/`h-*`/`p-*` 等 Tailwind 实用类或 rem；避免在 SVG 外层容器硬编码 px。
- 锚点标识：所有连接锚点使用 `data-port="in|out|skip"` 与 `data-slot="<index>"` 标注，便于连线系统读取与自动化测试。

FC Layer（胶囊）
```
<svg class="w-28 h-10" viewBox="0 0 112 40" aria-label="FC Layer">
  <rect x="1" y="1" width="110" height="38" rx="20"
        fill="hsl(var(--mlcd-linear))" stroke="hsl(var(--mlcd-stroke))" stroke-width="1.25"/>
  <!-- Anchors -->
  <circle cx="0" cy="20" r="3.5" fill="hsl(var(--mlcd-stroke))" data-port="in" />
  <circle cx="112" cy="20" r="3.5" fill="hsl(var(--mlcd-stroke))" data-port="out" />
  <!-- Label -->
  <text x="56" y="24" text-anchor="middle" fill="hsl(var(--mlcd-label))" font-size="12">FC</text>
  <!-- data-slot 可按需添加到锚点：data-slot="0" -->
  <!-- 可在容器选中态绘制外圈：<rect ... stroke="hsl(var(--mlcd-hover))" stroke-width="3" fill="none"/> -->
</svg>
```

MLP Layers（矩阵点阵）
```
<svg class="w-32 h-16" viewBox="0 0 128 64" aria-label="MLP Layers">
  <rect x="1" y="1" width="126" height="62" rx="10"
        fill="hsl(var(--mlcd-linear-alt))" stroke="hsl(var(--mlcd-stroke))" stroke-width="1.25"/>
  <!-- Dot grid -->
  <g fill="hsl(220 20% 30% / 0.45)">
    <!-- 以 10x4 均匀网格为例，真实实现中可循环生成 -->
    <!-- 省略：点阵示意 -->
    <circle cx="20" cy="20" r="2"/><circle cx="32" cy="20" r="2"/>
  </g>
  <circle cx="0" cy="32" r="3.5" fill="hsl(var(--mlcd-stroke))" data-port="in"/>
  <circle cx="128" cy="32" r="3.5" fill="hsl(var(--mlcd-stroke))" data-port="out"/>
  <text x="64" y="56" text-anchor="middle" fill="hsl(var(--mlcd-label))" font-size="12">MLP</text>
  <!-- data-slot 可按需添加到锚点：data-slot="0" -->
</svg>
```

Conv Layer（3D 立方体通道）
```
<svg class="w-36 h-20" viewBox="0 0 144 80" aria-label="Conv Layer">
  <!-- 背板 -->
  <rect x="20" y="10" width="100" height="60" rx="8"
        fill="hsl(var(--mlcd-linear))" stroke="hsl(var(--mlcd-stroke))" stroke-width="1.25"/>
  <!-- 前板（形成纵深） -->
  <rect x="8" y="22" width="100" height="60" rx="8"
        fill="hsl(var(--mlcd-linear-alt))" stroke="hsl(var(--mlcd-stroke))" stroke-width="1.25"/>
  <!-- 简化通道条纹 -->
  <path d="M30,30 h70 M30,45 h70 M30,60 h70" stroke="hsl(220 20% 30% / 0.35)" stroke-width="3" />
  <!-- Anchors -->
  <circle cx="0" cy="40" r="3.5" fill="hsl(var(--mlcd-stroke))" data-port="in"/>
  <circle cx="144" cy="40" r="3.5" fill="hsl(var(--mlcd-stroke))" data-port="out"/>
  <text x="72" y="14" text-anchor="middle" fill="hsl(var(--mlcd-label))" font-size="12">Conv</text>
</svg>
```

Neuron（基础单元）
```
<svg class="w-12 h-12" viewBox="0 0 48 48" aria-label="Neuron">
  <circle cx="24" cy="24" r="18" fill="hsl(var(--mlcd-linear))" stroke="hsl(var(--mlcd-stroke))" stroke-width="1.25"/>
  <circle cx="0" cy="24" r="3.5" fill="hsl(var(--mlcd-stroke))" data-port="in"/>
  <circle cx="48" cy="24" r="3.5" fill="hsl(var(--mlcd-stroke))" data-port="out"/>
</svg>
```

Sigmoid / Tanh（函数曲线）
```
<svg class="w-14 h-14" viewBox="0 0 56 56" aria-label="Sigmoid">
  <circle cx="28" cy="28" r="24" fill="hsl(var(--mlcd-activation-g))" stroke="hsl(var(--mlcd-stroke))" stroke-width="1.25"/>
  <!-- Sigmoid S-curve (0..1) -->
  <path d="M10,38 C16,10 40,46 46,18" fill="none" stroke="hsl(var(--mlcd-stroke))" stroke-width="1.5" />
</svg>
```

Dropout（虚线 + 稀疏）
```
<svg class="w-28 h-12" viewBox="0 0 112 48" aria-label="Dropout">
  <rect x="4" y="4" width="104" height="40" rx="10"
        fill="none" stroke="hsl(var(--mlcd-aux))" stroke-width="1.5" stroke-dasharray="6 4"/>
  <g fill="hsl(var(--mlcd-aux))">
    <circle cx="28" cy="18" r="2"/><circle cx="52" cy="28" r="2"/><circle cx="76" cy="20" r="2"/>
  </g>
  <text x="56" y="44" text-anchor="middle" fill="hsl(var(--mlcd-label))" font-size="12">Dropout</text>
</svg>
```

Tensor（堆叠立方体）
```
<svg class="w-32 h-20" viewBox="0 0 128 80" aria-label="Tensor">
  <rect x="32" y="12" width="64" height="48" rx="6"
        fill="hsl(var(--mlcd-data))" stroke="hsl(var(--mlcd-stroke))" stroke-width="1.25"/>
  <rect x="24" y="20" width="64" height="48" rx="6"
        fill="hsl(var(--mlcd-data-neutral))" stroke="hsl(var(--mlcd-stroke))" stroke-width="1.25"/>
  <rect x="16" y="28" width="64" height="48" rx="6"
        fill="hsl(var(--mlcd-data-neutral))" stroke="hsl(var(--mlcd-stroke))" stroke-width="1.25"/>
  <text x="64" y="74" text-anchor="middle" fill="hsl(var(--mlcd-label))" font-size="12">Tensor</text>
</svg>
```

Group Node（分组容器）
```
<svg class="w-80 h-48" viewBox="0 0 320 192" aria-label="Group Node">
  <rect x="4" y="24" width="312" height="164" rx="10"
        fill="none" stroke="hsl(var(--mlcd-stroke))" stroke-width="1.25" stroke-dasharray="6 4"/>
  <!-- 顶部标签条 -->
  <rect x="12" y="4" width="120" height="28" rx="6"
        fill="hsl(var(--mlcd-linear-alt))" stroke="hsl(var(--mlcd-stroke))" stroke-width="1.25"/>
  <text x="72" y="22" text-anchor="middle" fill="hsl(var(--mlcd-label))" font-size="12">Block</text>
</svg>
```

Loss / Optimizer（端点目标）
```
<svg class="w-24 h-12" viewBox="0 0 96 48" aria-label="Loss">
  <circle cx="24" cy="24" r="18" fill="hsl(var(--mlcd-loss))" stroke="hsl(var(--mlcd-stroke))" stroke-width="1.25"/>
  <text x="24" y="28" text-anchor="middle" fill="#fff" font-size="12">L</text>
  <rect x="54" y="8" width="34" height="32" rx="6"
        fill="hsl(var(--mlcd-optimizer))" stroke="hsl(var(--mlcd-stroke))" stroke-width="1.25"/>
  <text x="71" y="28" text-anchor="middle" fill="#fff" font-size="10">Opt</text>
</svg>
```

### 3.2 连接与箭头（Connectors / Edges & Markers）
- 默认连线：直线（straight）或正交折线（step）；描边 `stroke: var(--mlcd-stroke)`，`stroke-width: 1.25px`，选中 1.5px。
- 箭头端帽：`marker-end="url(#arrow)"`（纯 SVG 语义）；在 React Flow 中等价为 `markerEnd: ArrowClosed`，颜色随边 stroke。
- 残差/跳连：使用自定义 edge 类型（residualEdge），label 使用 `edge.label.*`。
  - data-kind="residual"；`stroke-dasharray="4 3"`；默认颜色可用 `--mlcd-data`（或按语义改色）。

### 3.3 锚点模板（Anchors Template）
- 左侧输入（target）与右侧输出（source）为 8×8 圆；数据属性：`data-port="in|out|skip"`、`data-slot="<n>"`。
- 多端口：按 data.ports(inputs/outputs) 顺序布局，slot 递增；与网格对齐，留白 6px。

### 3.4 图标库（Icons）
- 视窗：`viewBox="0 0 24 24"`；线宽：`stroke-1.25`；圆角：端点 round；颜色：`stroke-current`/`fill-current`。
- 规则：不嵌入固定颜色，使用 currentColor；尺寸由父级类控制（`w-4 h-4` 等）。
- 可访问性：提供 `<title>`（i18n），必要时 `aria-label`；装饰性图标可 `aria-hidden="true"`。
- 文件/符号 ID 命名：`mlcd-<category>-<name>`，例如 `mlcd-activation-sigmoid`、`mlcd-linear-mlp`、`mlcd-linear-fc`。

Naming (components and data.typeLabel):
- Node type names: PascalCase (FCNode, ConvNode, TensorNode, GroupNode, ActivationNode)
- Data labels: concise noun phrase; `data.typeLabel` shows the family
- i18n keys: toolbar.*, panel.*, node.*

SVG-first:
- Prefer inline SVG for shapes and icons; keep KaTeX labels via MathText

Next steps:
- Confirm palette, spacing, radii, and stroke widths
- Refactor nodes to pull colors from tokens
## 7) 尺寸与对齐（出图一致性）

- 基线与网格
  - 统一 8px 网格（snapGrid=8）；组件最小尺寸按整数倍（如 80×56、120×72）
  - 锚点位置居中对齐（left:mid/right:mid）；多端口等距分布
  - 程序化操作（对齐/分布/成组）结束后，位置统一四舍五入对齐到 8px 网格（含折线拐点由节点位置推导）
- 文字与图标
  - 主标签 text-sm（≈14px）、次标签 text-xs（≈12px），水平居中或顶部对齐
  - 图标 viewBox=24，线宽 stroke-1.25；使用 currentColor
- 线宽与外观
  - 默认 strokeWidth 1.25，选中 1.5；圆角 r=8（胶囊 r=9999）
  - 颜色与透明度使用 HSL 令牌（hsl(var(--token)) / alpha）
- 导出一致性
  - PNG 导出像素比≥3；SVG 导出为一等格式
  - 导出区域含安全边距（建议外扩 8–16px），避免裁切阴影/端帽

- 尺寸档（Size Tiers）
  - Sm（Small）：高度 32–40px（Tailwind 建议：`h-8`/`h-10`）
  - Md（Medium）：高度 40–56px（建议：`h-10`/`h-14`）
  - Lg（Large）：高度 56–80px（建议：`h-14`/`h-20`）
  - 说明：实际高度可随节点内容略有浮动；请尽量使用 `h-*`/`min-h-*` 组合并对齐 8px 网格。
## 8) 无障碍与可读性（A11y）

- 对比度与字号
  - 文本与关键线条满足 WCAG AA 对比度；主标签 text-sm≈14px，次标签 text-xs≈12px
- 焦点可见
  - 锚点与节点在键盘聚焦时显示外环/描边（:focus-visible 样式），选中态与聚焦态可叠加
- 语义与 ARIA
  - 节点根容器带 `aria-label`（由 `typeLabel + label` 或 `label` 构成）
  - Group 容器添加 `role="group"` 并使用 `aria-labelledby` 指向顶部标签条文本 id
  - 装饰性图标 `aria-hidden="true"`；有意义的图标提供 `<title>` 或 `aria-label`
- 交互与目标尺寸
  - 锚点命中目标 ≥12×12；实现为隐形 24×24 点击区，内部可见 6–8px 小圆点
  - 节点最小可交互面积与 8px 网格对齐
  - 鼠标/触控与键盘操作并存；键盘导航（Tab/Shift+Tab）遍历可交互元素
- 动效与偏好
  - 遵循用户的 `prefers-reduced-motion` 偏好，降低过渡/动画
- i18n 与本地化
  - 所有可见字符串使用 i18n；中文/英文均正确显示，UTF-8 存储
- 导出可读性
  - SVG 导出首选（文本可选保留为 `<text>`，便于后处理）；PNG 2x/3x，并保持 1.25/1.5px 描边观感

## 9) 快速使用约定（Tailwind + SVG）

- 尺寸（Size）
  - 使用 Tailwind 控制：`w-*`/`h-*`/`min-w-*`/`min-h-*`；按 8px 网格取整
  - 尺寸档：Sm=32–40（`h-8`/`h-10`），Md=40–56（`h-10`/`h-14`），Lg=56–80（`h-14`/`h-20`）

- 颜色（Colors）
  - 令牌：`bg-mlcd-canvas`、`text-mlcd-label`、`stroke-mlcd-stroke`、`fill-mlcd-linear`/`fill-mlcd-linear/20`
  - 使用方式：
    - HSL 分量变量（默认）：`fill="hsl(var(--mlcd-linear))"` 或 `fill-[hsl(var(--mlcd-linear))]`
    - 完整颜色变量（如有）：`fill="var(--mlcd-linear)"`
  - 主题：HSL 变量（`hsl(var(--mlcd-*))/alpha`），支持明暗覆写；避免硬编码 hex

- 线宽与圆角（Stroke & Corner）
  - 描边：统一 `stroke="var(--mlcd-stroke)" stroke-width="1.25"`（Tailwind：`stroke-mlcd-stroke stroke-1.25`），选中 `stroke-1.5`
  - 圆角：基础 `rounded-[8px]`，胶囊 `rounded-full`

- 标签（Labels）
  - 主标签：`text-sm text-mlcd-label text-center`；副标题：`text-xs text-mlcd-muted`
  - 公式：`<MathText>` + KaTeX；溢出 `truncate` 并加 `title`

- 锚点（Anchors）
  - 组件：React Flow `Handle`；类：`handle-touch`（24×24 隐形点击区，中心 8px 点）
  - 数据属性：`data-port="in|out|skip"`，`data-slot="0..N"`

- 网格与对齐（Grid & Align）
  - 背景：`<Background variant={Dots} color={'var(--mlcd-grid-dot)'} gap={snapGrid[0]}/>`；默认 `snapGrid=[8,8]`
  - 程序化操作（对齐/分布/成组）后自动四舍五入到 8px 网格

- 导出（Export）
  - SVG 为主：`toSvg(el, { backgroundColor: '#fff' })`
  - PNG 高清：`toPng(el, { pixelRatio: 3, backgroundColor: '#fff' })`，保持 1.25/1.5px 描边观感

- 语义与 A11y（Semantics & A11y）
  - 根容器：`aria-label`；Group：`role="group" aria-labelledby="..."`
  - 数据属性：`data-type`（fc|mlp|conv|...）、`data-role`（core|data|func|objective|template）

- 快速示例（FC 胶囊）
```
<div class="rounded-full border px-3 py-2 w-full h-full text-center" aria-label="FC Layer">
  <svg viewBox="0 0 112 40" class="w-28 h-10 stroke-mlcd-stroke stroke-1.25">
    <rect x="1" y="1" width="110" height="38" rx="20" fill="hsl(var(--mlcd-linear))"/>
  </svg>
  <div class="text-sm text-mlcd-label">FC Layer</div>
</div>
```

## 10) Export to Sheets 版摘要表

节点表 nodes.csv（列与含义）

| 列名 | 含义 | 示例 | 备注 |
| ---- | ---- | ---- | ---- |
| id | 节点唯一标识 | n_1700000000_1 | React Flow 节点 id |
| type | 节点类型 | fcNode/convNode/mlpNode/... | 与代码中的节点注册名一致 |
| label | 主标签文本 | FC Layer | 文本标签（i18n 渲染时可替换） |
| formula | 公式标签 | y = Wx + b | KaTeX 字符串，渲染失败降级纯文本 |
| color | 颜色 | token:mlcd.linear 或 #2563eb | 无自定义颜色时输出 token:mlcd.*（见映射规则） |
| shape | 形状枚举 | rect/circle/diamond/tensor/group | 视觉形态，用于下游快速还原 |
| width | 期望宽度 | 160 | 可为空（运行时自适应）；导出时写入方便核对 |
| height | 期望高度 | 72 | 同上 |
| x | 位置 X | 320 | 以画布左上为原点（px），对齐 8px 网格 |
| y | 位置 Y | 240 | 同上 |

连线表 edges.csv（列与含义）

| 列名 | 含义 | 示例 | 备注 |
| ---- | ---- | ---- | ---- |
| id | 连线唯一标识 | e_1700000000_1 | React Flow 连线 id |
| source | 源节点 id | n_... | 源端节点（data-port 默认 out-0） |
| target | 目标节点 id | n_... | 目标端节点（data-port 默认 in-0） |
| type | 连线类型 | straight/step/residualEdge | 默认 straight（或 step） |
| stroke | 颜色 | hsl(var(--mlcd-stroke)) | 可为 token/变量/具体色值 |
| arrow | 是否带箭头 | true/false | 默认 true（arrowclosed） |
| residual | 是否残差跳连 | true/false | `true` 当 type=residualEdge 或 data.kind='residual' |

映射与导出策略
- 代码位置：
  - 列头定义：`src/sheets/schema.ts`
  - 导出逻辑：`src/sheets/export.ts`
  - 类型到颜色/形状映射：`src/sheets/mapping.ts`（`mapNodeToExport`）
- 颜色：
  - 当节点未自定义 `data.color` 时，nodes.csv 的 color 列输出 `token:mlcd.*`；下游可据此恢复主题色（HSL 变量）
- 形状：
  - 枚举 rect/circle/diamond/tensor/group，3D/叠放/倾斜等为样式变体，由渲染端按类型决定细节
- 网格：
  - 导出位置对齐 8px 网格（程序化操作后已四舍五入），方便表格/脚本端布局计算

示例（片段）
```
nodes.csv
id,type,label,formula,color,shape,width,height,x,y
n_1,fcNode,FC Layer,,token:mlcd.linear,rect,160,56,320,240
n_2,convNode,Conv 3×3,,token:mlcd.linearAlt,rect,160,72,480,240

edges.csv
id,source,target,type,stroke,arrow,residual
e_1,n_1,n_2,straight,hsl(var(--mlcd-stroke)),true,false
```

### 10.1 颜色角色表（Color Roles）

| 角色（Role） | 主色 Token | 备用/变体 | 用途（Fill/Stroke/Label） | 示例节点 |
| --- | --- | --- | --- | --- |
| 基础计算 Core | `--mlcd-linear` | `--mlcd-linear-alt` | Fill 主体、Stroke 统一用 `--mlcd-stroke`、Label 用 `--mlcd-label` | FC/MLP/Conv/Flatten/Pool |
| 激活函数 Func | `--mlcd-activation-g` | `--mlcd-activation-o` | Fill 主体；内部曲线使用 `--mlcd-stroke` | ReLU/Sigmoid/Tanh |
| 数据流 Data | `--mlcd-data` | `--mlcd-data-neutral` | Fill 层叠/倾斜；轮廓统一 `--mlcd-stroke` | Tensor/Data/I-O |
| 辅助/正则 Aux | `--mlcd-aux` | （图案填充） | Fill/装饰（点/斜杠）；轮廓 `--mlcd-stroke` 虚线 | Dropout/Regularization |
| 目标/优化 Objective | `--mlcd-loss` | `--mlcd-optimizer` | 端点目标色；文本常用白色以保持对比 | Loss/Optimizer |
| 轮廓线 Stroke | `--mlcd-stroke` | （N/A） | 所有轮廓统一描边 | 全局 |
| 文本 Label | `--mlcd-label` | `--mlcd-muted-label` | 主/次文本 | 全局 |

用法约定
- Fill：`fill="hsl(var(<token>))"` 或 Tailwind 任意值 `fill-[hsl(var(<token>))]`
- Stroke：统一 `stroke="hsl(var(--mlcd-stroke))" stroke-width="1.25"`；选中态 `1.5`
- Label：`text-mlcd-label`（主）、`text-mlcd-muted`（次），对比度≥4.5:1
- 暗色：对红/绿通道适度提升亮度差，确保对比度；变量已在暗色主题中覆写，可按需微调。

颜色 Token 一览

| Token                 | 用途            | 默认 HSL             |
| --------------------- | --------------- | -------------------- |
| `--mlcd-linear`       | 基础层（紫）    | `hsl(255 85% 85%)`   |
| `--mlcd-linear-alt`   | 基础层（蓝）    | `hsl(215 92% 85%)`   |
| `--mlcd-activation-g` | 激活（绿）      | `hsl(150 65% 45%)`   |
| `--mlcd-activation-o` | 激活（橙）      | `hsl(30 90% 55%)`    |
| `--mlcd-data`         | 数据（深蓝）    | `hsl(220 70% 45%)`   |
| `--mlcd-data-neutral` | 数据（灰）      | `hsl(220 8% 60%)`    |
| `--mlcd-aux`          | 正则（红）      | `hsl(355 80% 55%)`   |
| `--mlcd-loss`         | 损失            | `hsl(355 78% 48%)`   |
| `--mlcd-optimizer`    | 优化器          | `hsl(220 68% 42%)`   |
| `--mlcd-stroke`       | 轮廓            | `hsl(220 18% 28%)`   |
| `--mlcd-label`        | 字体            | `hsl(222 36% 18%)`   |

### 10.2 组件到形状与锚点（Shapes & Anchors）

默认端口与对齐
- 端口命名：输入 `in-0..N`（target/左），输出 `out-0..N`（source/右）
- 定位规范：`left:mid` / `right:mid`，与 8px 网格对齐；多端口等距分布
- 数据属性：`data-port="in|out|skip"`，`data-slot="0..N"`

组件映射表

| 组件               | 形状（Shape）         | 默认锚点（Ports）                 | 备注 |
| ------------------ | --------------------- | --------------------------------- | ---- |
| FC Layer           | 胶囊（rounded-full）  | in: `left:mid` → `in-0`; out: `right:mid` → `out-0` | 仅标签，无内部细节 |
| MLP Layers         | 圆角矩形（rounded-8） | 同上                              | 内部均匀小圆点网格 |
| Conv Layer         | 叠放面板（stacked）   | 同上                              | 通道条纹体现深度 |
| Neuron             | 圆（circle）           | 同上                              | 尺寸可缩放，标签可选 |
| Activation Sigmoid | 圆（circle）+S 曲线    | 同上                              | 与 Neuron 视觉区分 |
| Activation Tanh    | 圆（circle）+跨零曲线  | 同上                              | 同上 |
| Dropout            | 虚线圆角矩形          | 同上                              | 稀疏点/斜杠图案 |
| Tensor             | 多层立方体（stacked） | 同上                              | 表达高维/批量 |
| Group Node         | 虚线容器 + 顶部标签条  | 不直接连外边（内部子节点连线）     | 组名居中于标签条 |

快速总览（颜色/锚点/细节）

| 组件             | 形状       | 颜色                       | 输入锚    | 输出锚    | 内部细节   |
| ---------------- | ---------- | -------------------------- | --------- | --------- | ---------- |
| FC Layer         | 胶囊       | `--mlcd-linear`            | 左侧 1–N  | 右侧 1–N  | 无         |
| MLP Layers       | 圆角矩形   | `--mlcd-linear-alt`        | 左侧      | 右侧      | 点阵       |
| Conv Layer       | 3D/叠层    | `--mlcd-linear`/`-alt`     | 左侧      | 右侧      | 通道条纹   |
| Neuron           | 圆         | `--mlcd-linear`            | 左侧      | 右侧      | 无         |
| Sigmoid/Tanh     | 圆         | `--mlcd-activation-*`      | 可无      | 可无      | 曲线       |
| Dropout          | 虚线圆角矩 | `--mlcd-aux`               | 左侧      | 右侧      | 稀疏点斜杠 |
| Tensor           | 堆叠立方   | `--mlcd-data*`             | 任意      | 任意      | 多层       |
| Group Node       | 虚线容器   | `--mlcd-stroke`            | n/a       | n/a       | 顶部标签条 |
| Loss/Optimizer   | 圆/矩形    | `--mlcd-loss/optimizer`    | 任意      | 任意      | L/Opt 符号 |

---

### 11) 最小实现片段（可直接复用）

- 推荐直接参考“3.1 SVG 伪代码（可落地）”与“9) 快速使用约定（Tailwind + SVG）”中的片段。
- 要点：
  - 用 Tailwind 控制尺寸（例如 `class="w-28 h-10"`）
  - 颜色使用 HSL 令牌（例如 `fill="hsl(var(--mlcd-linear))"`、`stroke="hsl(var(--mlcd-stroke))" stroke-width="1.25"`）
  - 锚点附带数据属性（`data-port`/`data-slot`），命中区用 `.handle-touch` 24×24 实现
  - 语义：根容器/图形带 `aria-label`；Group 使用 `role="group" aria-labelledby="..."`
