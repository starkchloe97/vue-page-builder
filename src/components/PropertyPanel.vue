<script setup>
import SpacingBox from './SpacingBox.vue'
import ColorSwatches from './ColorSwatches.vue'
import AlignPicker from './AlignPicker.vue'

defineProps({ node: Object, tab: String, globalColors: Array })
const emit = defineEmits(['update-spacing', 'toggle-link'])
</script>

<template>
  <div v-show="tab === 'content'">
    <template v-if="node.type === 'heading'">
      <div class="field">
        <label>Title</label>
        <textarea v-model="node.content.text"></textarea>
      </div>
      <div class="field">
        <label>HTML Tag</label>
        <select v-model="node.content.tag">
          <option value="h1">H1</option><option value="h2">H2</option><option value="h3">H3</option>
          <option value="h4">H4</option><option value="h5">H5</option><option value="h6">H6</option>
        </select>
      </div>
    </template>

    <template v-else-if="node.type === 'text'">
      <div class="field">
        <label>Text</label>
        <textarea v-model="node.content.text" style="min-height: 120px"></textarea>
      </div>
    </template>

    <template v-else-if="node.type === 'image'">
      <div class="field"><label>Image URL</label><input type="text" v-model="node.content.src" /></div>
      <div class="field"><label>Alt text</label><input type="text" v-model="node.content.alt" /></div>
    </template>

    <template v-else-if="node.type === 'button'">
      <div class="field"><label>Text</label><input type="text" v-model="node.content.text" /></div>
      <div class="field"><label>Link</label><input type="text" v-model="node.content.link" /></div>
    </template>

    <template v-else-if="node.type === 'video'">
      <div class="field"><label>Embed URL</label><input type="text" v-model="node.content.src" /></div>
    </template>

    <template v-else-if="node.type === 'section'">
      <div class="field">
        <label>Layout direction</label>
        <div class="seg">
          <button :class="{ active: node.layout.direction === 'row' }" @click="node.layout.direction = 'row'">Row</button>
          <button :class="{ active: node.layout.direction === 'column' }" @click="node.layout.direction = 'column'">Column</button>
        </div>
      </div>
      <div class="field"><label>Gap (px)</label><input type="number" v-model.number="node.layout.gap" /></div>
      <div class="field">
        <label><input type="checkbox" v-model="node.layout.wrap" style="width: auto; margin-right: 6px" />Wrap items</label>
      </div>
    </template>

    <template v-else>
      <div class="no-panel">This element has no content settings — use the Style and Advanced tabs.</div>
    </template>
  </div>

  <div v-show="tab === 'style'">
    <template v-if="node.type === 'heading' || node.type === 'text'">
      <div class="field"><label>Color</label><ColorSwatches v-model="node.style.color" :colors="globalColors" /></div>
      <div class="row-2">
        <div class="field"><label>Size (px)</label><input type="number" v-model.number="node.style.fontSize" /></div>
        <div class="field">
          <label>Weight</label>
          <select v-model="node.style.fontWeight">
            <option value="300">Light</option><option value="400">Regular</option>
            <option value="500">Medium</option><option value="600">Semibold</option>
            <option value="700">Bold</option><option value="800">Extra Bold</option>
          </select>
        </div>
      </div>
      <div class="field" v-if="node.type === 'text'"><label>Line height</label><input type="number" step="0.1" v-model.number="node.style.lineHeight" /></div>
      <div class="field"><label>Alignment</label><AlignPicker v-model="node.style.textAlign" /></div>
    </template>

    <template v-else-if="node.type === 'image'">
      <div class="field"><label>Width (%)</label><input type="number" v-model.number="node.style.width" min="1" max="100" /></div>
      <div class="field"><label>Corner radius (px)</label><input type="number" v-model.number="node.style.borderRadius" /></div>
    </template>

    <template v-else-if="node.type === 'button'">
      <div class="field"><label>Background</label><ColorSwatches v-model="node.style.bgColor" :colors="globalColors" /></div>
      <div class="field"><label>Text color</label><ColorSwatches v-model="node.style.color" :colors="globalColors" /></div>
      <div class="row-2">
        <div class="field"><label>Size (px)</label><input type="number" v-model.number="node.style.fontSize" /></div>
        <div class="field"><label>Radius (px)</label><input type="number" v-model.number="node.style.borderRadius" /></div>
      </div>
      <div class="field">
        <label>Weight</label>
        <select v-model="node.style.fontWeight">
          <option value="400">Regular</option><option value="500">Medium</option>
          <option value="600">Semibold</option><option value="700">Bold</option>
        </select>
      </div>
      <div class="field"><label>Alignment</label><AlignPicker v-model="node.style.textAlign" /></div>
    </template>

    <template v-else-if="node.type === 'section'">
      <div class="field"><label>Background</label><ColorSwatches v-model="node.style.bgColor" :colors="globalColors" /></div>
    </template>

    <template v-else-if="node.type === 'divider'">
      <div class="field"><label>Color</label><ColorSwatches v-model="node.style.color" :colors="globalColors" /></div>
      <div class="field"><label>Thickness (px)</label><input type="number" v-model.number="node.style.thickness" /></div>
    </template>

    <template v-else-if="node.type === 'spacer'">
      <div class="field"><label>Height (px)</label><input type="number" v-model.number="node.style.height" /></div>
    </template>

    <template v-else>
      <div class="no-panel">No style options for this element.</div>
    </template>
  </div>

  <div v-show="tab === 'advanced'">
    <SpacingBox
      :node="node" box="margin" title="Margin"
      @update-spacing="(b, s, v) => emit('update-spacing', b, s, v)"
      @toggle-link="(b) => emit('toggle-link', b)"
    />
    <SpacingBox
      :node="node" box="padding" title="Padding"
      @update-spacing="(b, s, v) => emit('update-spacing', b, s, v)"
      @toggle-link="(b) => emit('toggle-link', b)"
    />
  </div>
</template>
