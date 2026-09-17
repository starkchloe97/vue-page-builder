<script setup>
import { state, selectNode, dropWidget, clearDragState } from '../state.js'
import ElementNode from './ElementNode.vue'

function getWidgetType(event) {
  return event.dataTransfer.getData('application/x-vue-page-builder-widget') || ''
}

function onCanvasDragOver(event) {
  const widgetType = getWidgetType(event)
  if (!widgetType) return
  event.preventDefault()
  event.dataTransfer.dropEffect = 'copy'
  state.dragOverId = '__canvas__'
}

function onCanvasDragLeave(event) {
  if (event.currentTarget === event.target) state.dragOverId = null
}

function onCanvasDrop(event) {
  event.preventDefault()
  const widgetType = getWidgetType(event)
  if (widgetType) dropWidget(widgetType, null, 'inside')
  clearDragState()
}

function onEmptyDragOver(event) {
  const widgetType = getWidgetType(event)
  if (!widgetType) return
  event.preventDefault()
  event.stopPropagation()
  event.dataTransfer.dropEffect = 'copy'
  state.dragOverId = '__canvas__'
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
        @dragover="onEmptyDragOver"
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
