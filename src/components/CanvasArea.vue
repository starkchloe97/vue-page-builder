<script setup>
import { state, selectNode, dropWidget, moveNodeTo, clearDragState } from '../state.js'
import ElementNode from './ElementNode.vue'

function readDrag(event) {
  return event.dataTransfer.getData('application/x-vue-page-builder-widget') || event.dataTransfer.getData('text/plain')
}

function allowDrop(event, targetId = null) {
  const type = readDrag(event)
  if (!type) return
  event.preventDefault()
  event.dataTransfer.dropEffect = type ? 'copy' : 'move'
  state.dragOverId = targetId
}

function onDrop(event) {
  event.preventDefault()
  const type = readDrag(event)
  if (type) dropWidget(type, null, 'inside')
  clearDragState()
}

function onCanvasDragOver(event) {
  const type = readDrag(event)
  if (!type) return
  event.preventDefault()
  event.dataTransfer.dropEffect = type ? 'copy' : 'move'
  state.dragOverId = '__canvas__'
}

function onCanvasDrop(event) {
  event.preventDefault()
  const type = readDrag(event)
  if (type) {
    dropWidget(type, null, 'inside')
  }
  clearDragState()
}
</script>

<template>
  <div class="canvas-wrap" @click="selectNode(null)" @dragover="onCanvasDragOver" @drop="onCanvasDrop">
    <div class="canvas-page" :class="{ 'drag-target': state.dragOverId === '__canvas__' }" @click.stop>
      <div v-if="!state.elements.length" class="canvas-empty" @dragover.stop="allowDrop($event)" @drop.stop="onDrop">
        <div class="big">▦</div>
        <div><strong>Your canvas is empty</strong></div>
        <div>Click a widget on the left to start building your page, or drag one here.</div>
      </div>
      <ElementNode v-for="n in state.elements" :key="n.id" :node="n" />
    </div>
  </div>
</template>
