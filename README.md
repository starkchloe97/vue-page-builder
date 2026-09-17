# Vue Page Builder

An Elementor-style visual page builder built with Vue 3 (Composition API) + Vite.
Drag together sections and widgets, style them with a live Content / Style / Advanced
panel, and export the design as a ready-to-paste Vue Single File Component.

## Run it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview   # to test the production build locally
```

## Project structure

```
src/
  main.js              entry point
  style.css            theme tokens + editor UI styles
  state.js             reactive canvas state, data model, and the
                        design -> Vue SFC code generator
  App.vue              top-level layout (topbar + 3 panels)
  components/
    WidgetPanel.vue     left sidebar: click to add widgets
    CanvasArea.vue      center canvas
    ElementNode.vue     recursive renderer for every element type
    RightPanel.vue      right sidebar shell (tabs)
    PropertyPanel.vue   Content / Style / Advanced fields
    SpacingBox.vue      margin/padding box editor with link toggle
    ColorSwatches.vue   global color palette + custom hex picker
    AlignPicker.vue     text alignment control
    ExportModal.vue     "Get Code" modal with copy-to-clipboard
```

## How it works

- Every element on the canvas (section, heading, text, image, button, video,
  divider, spacer) is a plain reactive JS object in `state.elements`, so the
  whole design is just data.
- Selecting an element shows its settings in the right panel across three tabs,
  matching the Content / Style / Advanced tabs from Elementor.
- Margin and padding use the same 4-field top/right/bottom/left box with a
  link/unlink toggle.
- **Get Code** walks the element tree and outputs a self-contained `.vue` file
  with all spacing, color and typography baked in as inline styles — no props
  or extra state required to use it elsewhere.

## Extending it

Want drag-and-drop reordering, responsive breakpoints, or code export that
uses CSS classes/props instead of inline styles? The whole data model lives
in `src/state.js`, so that's the place to start.
