# Appearance Update Log

This log tracks detailed UI/UX and visual changes that refine the look-and-feel and interaction quality of ML‑CD. The README remains a high-level progress tracker; this file captures the granular design and UX work.

## P7.0 — Core UX Stabilization
- Sidebar scroll lock (F_SCROLL)
  - Scope: `src/components/Sidebar.tsx`
  - Change: root container uses `h-full min-h-0 overflow-y-auto overscroll-contain` so only the sidebar scrolls, not the whole page/canvas.

- Lasso selection (F_LASSO)
  - Scope: `src/diagram/DiagramCanvas.tsx`
  - Change: `selectionOnDrag={true}`, `selectionMode=SelectionMode.Partial`, `panOnDrag={false}`, `panOnScroll` kept for panning.

- Toolbar simplification (F_ALIGN_UI)
  - Scope: `src/components/AlignmentDropdown.tsx` (NEW), `src/components/Toolbar.tsx`
  - Change: consolidated Align/Distribute actions into a dropdown; removed scattered icons to reduce clutter.

- Canvas overlay and onboarding
  - Scope: `src/diagram/DiagramCanvas.tsx`, `i18n`
  - Change: overlay text uses i18n; empty canvas shows onboarding hint; template insertion shows a toast.

## P7.0 — Alignment & Grouping Hardening
- Alignment engine (F_ALIGN)
  - Scope: `src/diagram/alignment.ts`
  - Change: compute in absolute space (parent-aware), safe width/height fallbacks, snap respected; distribution uses centers and endpoint pinning.

- Group selection crash fix (F_GROUP)
  - Scope: `src/diagram/DiagramState.ts`, `src/diagram/grouping.ts`, `src/nodes/GroupNode.tsx`
  - Change: parent-first insertion; consolidated grouping helpers; removed invalid SVG decorations; collapse glyphs fixed.

## P7.1 — Wave 1 Foundations
- Schema-driven PropertiesPanel
  - Scope: `src/ui/nodeSchemas.ts` (NEW), `src/components/PropertiesPanel.tsx`
  - Content: activationNode (activationType, shape), convNode (kernel, stride, padding), fcNode (units), tensorNode (dims)
  - Behavior: schema fields render as select/number/string/boolean; updates write to node data.

- Group-created toast
  - Scope: `src/diagram/DiagramState.ts`, `src/diagram/DiagramCanvas.tsx`
  - Change: store emits `mlcd-group-created`; canvas displays a toast (“Group created”).

- Build and component cleanup
  - Scope: nodes/icons/components
  - Change: removed unused React imports, fixed mojibake in ActivationNode, ensured green build.

### Update: Conv Schema Wiring (Wave 1)
- ConvNode now reflects schema fields in its visuals/labels
  - Kernel number renders as “k×k” on the front face (legacy kernelSize normalized to use ‘×’)
  - Status line shows any of: C (channels), S (stride), D (dilation), P (padding), with ‘ · ’ separator
  - File: `src/nodes/ConvNode.tsx`
- NodeView base applied to Conv and FC, normalizing container/resizer/marker and shadow elevation
  - Files: `src/nodes/common/NodeView.tsx`, `src/nodes/ConvNode.tsx`, `src/nodes/FCNode.tsx`

### Update: NodeView Motifs & Port Styles
- NodeView: standardized elevation/shadow handling via `shadowColor` and `elevation` prop
- Ports: unified handle size/shape/border/hover style using a shared class
  - Files: `src/nodes/common/NodeView.tsx`, `src/nodes/common/ports.ts`, `src/nodes/FCNode.tsx`, `src/nodes/ConvNode.tsx`

## Upcoming (Wave 1 Visuals)
- NodeView base (common silhouette, header/body, tokens/gradients/ports) — `src/nodes/common/NodeView.tsx`
- FC/MLP and Conv refactor to NodeView (consistent visuals, internal motifs)
- Sidebar item previews for Conv/MLP (mini SVGs)
- Extended schemas (Conv dilation/channels, FC bias)

## Notes
- I18N: zh locale keeps technical node names in English (code-enforced); only categories and functional UI are translated.
- A11y: icon buttons have `title`/`aria-label`; dropdown and sections expose `aria-expanded` where applicable.
