<script setup>
import { state, selectNode, dropWidget, moveNodeTo, endDrag } from '../state.js'
import ElementNode from './ElementNode.vue'

function allowDrop(event, targetId = '__canvas__') {
  if (!state.activeDrag) return
  event.preventDefault()
  event.dataTransfer.dropEffect = state.activeDrag.kind === 'widget' ? 'copy' : 'move'
  state.dragOverId = targetId
}

function onDrop(event, targetId = null) {
  if (!state.activeDrag) return
  event.preventDefault()
  event.stopPropagation()

  const drag = state.activeDrag
  if (drag.kind === 'widget') {
    dropWidget(drag.type, targetId, 'inside')
  } else if (drag.kind === 'node' && targetId) {
    const target = event.currentTarget
    const rect = target.getBoundingClientRect()
    const position = event.clientY < rect.top + rect.height / 2 ? 'before' : 'after'
    moveNodeTo(drag.id, targetId, position)
  } else if (drag.kind === 'node') {
    moveNodeTo(drag.id, null, 'inside')
  }
  endDrag()
}

function onCanvasDragOver(event) {
  allowDrop(event, '__canvas__')
}

function onCanvasDrop(event) {
  onDrop(event, null)
}
</script>

<template>
  <div class="canvas-wrap" @click="selectNode(null)" @dragover="onCanvasDragOver" @drop="onCanvasDrop">
    <div class="canvas-page" :class="{ 'drag-target': state.dragOverId === '__canvas__' }" @click.stop>
      <div v-if="!state.elements.length" class="canvas-empty" @dragover.stop="allowDrop($event, '__canvas__')" @drop.stop="onDrop($event, null)">
        <div class="big">▦</div>
        <div><strong>Your canvas is empty</strong></div>
        <div>Click a widget on the left to start building your page, or drag one here.</div>
      </div>
      <ElementNode v-for="n in state.elements" :key="n.id" :node="n" />
    </div>
  </div>
</template>
