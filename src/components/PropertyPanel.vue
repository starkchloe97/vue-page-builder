<script setup>
import SpacingBox from './SpacingBox.vue'
import ColorSwatches from './ColorSwatches.vue'
import AlignPicker from './AlignPicker.vue'

defineProps({ node: Object, tab: String, globalColors: Array })
const emit = defineEmits(['update-spacing', 'toggle-link'])

const justifyOptions = [
  ['flex-start', 'Start'], ['center', 'Center'], ['flex-end', 'End'],
  ['space-between', 'Between'], ['space-around', 'Around'], ['space-evenly', 'Evenly'],
]
const alignOptions = [['stretch', 'Stretch'], ['flex-start', 'Start'], ['center', 'Center'], ['flex-end', 'End']]
</script>

<template>
  <div v-show="tab === 'content'">
    <template v-if="node.type === 'heading'">
      <div class="field"><label>Title</label><textarea v-model="node.content.text"></textarea></div>
      <div class="field"><label>HTML Tag</label><select v-model="node.content.tag"><option value="h1">H1</option><option value="h2">H2</option><option value="h3">H3</option><option value="h4">H4</option><option value="h5">H5</option><option value="h6">H6</option></select></div>
    </template>
    <template v-else-if="node.type === 'text'"><div class="field"><label>Text</label><textarea v-model="node.content.text" style="min-height:120px"></textarea></div></template>
    <template v-else-if="node.type === 'image'"><div class="field"><label>Image URL</label><input type="text" v-model="node.content.src" /></div><div class="field"><label>Alt text</label><input type="text" v-model="node.content.alt" /></div></template>
    <template v-else-if="node.type === 'button'"><div class="field"><label>Text</label><input type="text" v-model="node.content.text" /></div><div class="field"><label>Link</label><input type="text" v-model="node.content.link" /></div></template>
    <template v-else-if="node.type === 'video'"><div class="field"><label>Embed URL</label><input type="text" v-model="node.content.src" /></div></template>
    <template v-else-if="node.type === 'section'">
      <div class="field">
        <label>Layout</label>
        <div class="layout-mode">
          <button :class="{ active: (node.layout.mode || 'flex') === 'flex' }" @click="node.layout.mode = 'flex'">Flexbox</button>
          <button :class="{ active: node.layout.mode === 'grid' }" @click="node.layout.mode = 'grid'">CSS Grid</button>
        </div>
      </div>

      <template v-if="(node.layout.mode || 'flex') === 'flex'">
        <div class="field">
          <label>Direction</label>
          <div class="seg"><button :class="{active:node.layout.direction==='row'}" @click="node.layout.direction='row'">Row</button><button :class="{active:node.layout.direction==='column'}" @click="node.layout.direction='column'">Column</button></div>
        </div>
        <div class="field"><label>Justify content</label><select v-model="node.layout.justify"><option v-for="item in justifyOptions" :key="item[0]" :value="item[0]">{{ item[1] }}</option></select></div>
        <div class="field"><label>Align items</label><select v-model="node.layout.align"><option v-for="item in alignOptions" :key="item[0]" :value="item[0]">{{ item[1] }}</option></select></div>
        <div class="field"><label>Gap (px)</label><input type="number" min="0" v-model.number="node.layout.gap" /></div>
        <div class="field"><label>Wrap</label><div class="seg"><button :class="{active:node.layout.wrap!==false}" @click="node.layout.wrap=true">Wrap</button><button :class="{active:node.layout.wrap===false}" @click="node.layout.wrap=false">No wrap</button></div></div>
      </template>

      <template v-else>
        <div class="field"><label>Columns</label><select v-model="node.layout.columns"><option :value="1">1</option><option :value="2">2</option><option :value="3">3</option><option :value="4">4</option><option :value="5">5</option><option :value="6">6</option><option value="auto">Auto responsive</option></select></div>
        <div class="field"><label>Rows</label><select v-model="node.layout.rows"><option value="auto">Auto</option><option :value="1">1</option><option :value="2">2</option><option :value="3">3</option><option :value="4">4</option></select></div>
        <div class="row-2"><div class="field"><label>Column gap</label><input type="number" min="0" v-model.number="node.layout.columnGap" /></div><div class="field"><label>Row gap</label><input type="number" min="0" v-model.number="node.layout.rowGap" /></div></div>
        <div class="field"><label>Horizontal alignment</label><select v-model="node.layout.justify"><option value="stretch">Stretch</option><option value="start">Start</option><option value="center">Center</option><option value="end">End</option></select></div>
        <div class="field"><label>Vertical alignment</label><select v-model="node.layout.align"><option value="stretch">Stretch</option><option value="start">Start</option><option value="center">Center</option><option value="end">End</option></select></div>
      </template>
      <div class="layout-note">Use Flexbox for Elementor-style rows/columns. Use Grid when you need explicit columns and rows.</div>
    </template>
    <template v-else><div class="no-panel">This element has no content settings — use the Style and Advanced tabs.</div></template>
  </div>

  <div v-show="tab === 'style'">
    <template v-if="node.type === 'heading' || node.type === 'text'">
      <div class="field"><label>Color</label><ColorSwatches v-model="node.style.color" :colors="globalColors" /></div>
      <div class="row-2"><div class="field"><label>Size (px)</label><input type="number" v-model.number="node.style.fontSize" /></div><div class="field"><label>Weight</label><select v-model="node.style.fontWeight"><option value="300">Light</option><option value="400">Regular</option><option value="500">Medium</option><option value="600">Semibold</option><option value="700">Bold</option><option value="800">Extra Bold</option></select></div></div>
      <div class="field" v-if="node.type === 'text'"><label>Line height</label><input type="number" step="0.1" v-model.number="node.style.lineHeight" /></div><div class="field"><label>Alignment</label><AlignPicker v-model="node.style.textAlign" /></div>
    </template>
    <template v-else-if="node.type === 'image'"><div class="field"><label>Width (%)</label><input type="number" v-model.number="node.style.width" min="1" max="100" /></div><div class="field"><label>Corner radius (px)</label><input type="number" v-model.number="node.style.borderRadius" /></div></template>
    <template v-else-if="node.type === 'button'"><div class="field"><label>Background</label><ColorSwatches v-model="node.style.bgColor" :colors="globalColors" /></div><div class="field"><label>Text color</label><ColorSwatches v-model="node.style.color" :colors="globalColors" /></div><div class="row-2"><div class="field"><label>Size (px)</label><input type="number" v-model.number="node.style.fontSize" /></div><div class="field"><label>Radius (px)</label><input type="number" v-model.number="node.style.borderRadius" /></div></div><div class="field"><label>Weight</label><select v-model="node.style.fontWeight"><option value="400">Regular</option><option value="500">Medium</option><option value="600">Semibold</option><option value="700">Bold</option></select></div><div class="field"><label>Alignment</label><AlignPicker v-model="node.style.textAlign" /></div></template>
    <template v-else-if="node.type === 'section'"><div class="field"><label>Background</label><ColorSwatches v-model="node.style.bgColor" :colors="globalColors" /></div></template>
    <template v-else-if="node.type === 'divider'"><div class="field"><label>Color</label><ColorSwatches v-model="node.style.color" :colors="globalColors" /></div><div class="field"><label>Thickness (px)</label><input type="number" v-model.number="node.style.thickness" /></div></template>
    <template v-else-if="node.type === 'spacer'"><div class="field"><label>Height (px)</label><input type="number" v-model.number="node.style.height" /></div></template>
    <template v-else><div class="no-panel">No style options for this element.</div></template>
  </div>

  <div v-show="tab === 'advanced'"><SpacingBox :node="node" box="margin" title="Margin" @update-spacing="(b,s,v)=>emit('update-spacing',b,s,v)" @toggle-link="(b)=>emit('toggle-link',b)" /><SpacingBox :node="node" box="padding" title="Padding" @update-spacing="(b,s,v)=>emit('update-spacing',b,s,v)" @toggle-link="(b)=>emit('toggle-link',b)" /></div>
</template>

<style scoped>
.layout-mode{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--border-strong);border-radius:5px;overflow:hidden}.layout-mode button{padding:8px;border:0;border-right:1px solid var(--border-strong);background:var(--bg);color:var(--text-muted);cursor:pointer}.layout-mode button:last-child{border-right:0}.layout-mode button.active{background:var(--accent);color:var(--accent-text)}.layout-note{padding:9px 10px;border-radius:5px;background:var(--accent-soft);color:var(--text-muted);font-size:11px;line-height:1.45;margin-top:4px}
</style>
