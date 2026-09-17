<script setup>
import { computed } from 'vue'

const props = defineProps({ node: Object, box: String, title: String })
const emit = defineEmits(['update-spacing', 'toggle-link'])

const linked = computed(() => props.node.spacing[props.box + 'Linked'])
const vals = computed(() => props.node.spacing[props.box])

function onInput(side, e) {
  emit('update-spacing', props.box, side, e.target.value)
}
function onToggle() {
  emit('toggle-link', props.box)
}
</script>

<template>
  <div class="box-editor">
    <div class="box-head">
      <strong>{{ title }} (px)</strong>
      <button class="link-btn" :class="{ active: linked }" title="Link values" @click="onToggle">🔗</button>
    </div>
    <div class="box-inputs">
      <input type="number" :value="vals.top" @input="onInput('top', $event)" />
      <input type="number" :value="vals.right" @input="onInput('right', $event)" />
      <input type="number" :value="vals.bottom" @input="onInput('bottom', $event)" />
      <input type="number" :value="vals.left" @input="onInput('left', $event)" />
      <div></div>
    </div>
    <div class="box-labels"><span>Top</span><span>Right</span><span>Bottom</span><span>Left</span><span></span></div>
  </div>
</template>
