<script setup>
import { state, selectNode, dropWidget, moveNodeTo, endDrag } from '../state.js'
import ElementNode from './ElementNode.vue'

function onCanvasDragOver(event) {
  if (!state.activeDrag) return
  event.preventDefault()
  event.dataTransfer.dropEffect = state.activeDrag.kind === 'widget' ? 'copy' : 'move'
  state.dragOverId = '__canvas__'
}

function onCanvasDrop(event) {
  event.preventDefault()
  event.stopPropagation()

  const drag = state.activeDrag
  if (!drag) return

  if (drag.kind === 'widget') {
    dropWidget(drag.type, null, 'inside')
  } else if (drag.kind === 'node') {
    moveNodeTo(drag.id, null, 'inside')
  }

  endDrag()
}

function onCanvasDragLeave(event) {
  if (event.currentTarget === event.target) state.dragOverId = null
}
</script>

<template>
  <div
    class="canvas-wrap"
    @click="selectNode(null)"
    @dragover="onCanvasDragOver"
    @dragleave="onCanvasDragLeave"
    @drop="onCanvasDrop"
  >
    <div
      class="canvas-page"
      :class="{ 'drag-target': state.dragOverId === '__canvas__' }"
      @click.stop
    >
      <div
        v-if="!state.elements.length"
        class="canvas-empty"
        @dragover.stop="onCanvasDragOver"
        @drop.stop="onCanvasDrop"
      >
        <div class="big">▦</div>
        <div><strong>Your canvas is empty</strong></div>
        <div>Click a widget on the left to start building your page, or drag one here.</div>
      </div>

      <ElementNode
        v-for="node in state.elements"
        :key="node.id"
        :node="node"
      />
    </div>
  </div>
</template>
