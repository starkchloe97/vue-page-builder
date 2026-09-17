<script setup>
import { computed } from 'vue'
import {
  state,
  LABELS,
  nodeStyle,
  selectNode,
  deleteNode,
  duplicateNode,
  moveNode,
  moveNodeTo,
  dropWidget,
} from '../state.js'

const props = defineProps({ node: Object })

const isSelected = computed(() => state.selectedId === props.node.id)
const isDragOver = computed(() => state.dragOverId === props.node.id)
const style = computed(() => nodeStyle(props.node))

function onSelect() {
  selectNode(props.node.id)
}

function onDragStart(event) {
  event.stopPropagation()
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.clearData()
  event.dataTransfer.setData('application/x-vue-page-builder-node', props.node.id)
  event.dataTransfer.setData('text/plain', `node:${props.node.id}`)
}

function onDragEnd() {
  state.dragOverId = null
}

function getNodeId(event) {
  return event.dataTransfer.getData('application/x-vue-page-builder-node') || ''
}

function getWidgetType(event) {
  return event.dataTransfer.getData('application/x-vue-page-builder-widget') || ''
}

function isInsideDraggedNode(nodeId, targetId) {
  const dragged = findNode(state.elements, nodeId)
  return !!dragged?.children?.some(child => child.id === targetId || hasDescendant(child, targetId))
}

function findNode(list, id) {
  for (const item of list) {
    if (item.id === id) return item
    if (item.children) {
      const found = findNode(item.children, id)
      if (found) return found
    }
  }
  return null
}

function hasDescendant(node, id) {
  return !!node.children?.some(child => child.id === id || hasDescendant(child, id))
}

function onDragOver(event) {
  event.preventDefault()
  event.stopPropagation()

  const widgetType = getWidgetType(event)
  const nodeId = getNodeId(event)

  if (!widgetType && !nodeId) return
  if (nodeId === props.node.id) return
  if (nodeId && isInsideDraggedNode(nodeId, props.node.id)) return

  event.dataTransfer.dropEffect = widgetType ? 'copy' : 'move'
  state.dragOverId = props.node.id
}

function getDropPosition(event) {
  const rect = event.currentTarget.getBoundingClientRect()

  if (props.node.type !== 'section') {
    return event.clientY < rect.top + rect.height / 2 ? 'before' : 'after'
  }

  // A section has three useful drop areas: top = before, middle = inside,
  // bottom = after. This makes dropping into an existing section predictable.
  const y = event.clientY - rect.top
  const edge = Math.min(56, Math.max(24, rect.height * 0.22))

  if (y < edge) return 'before'
  if (y > rect.height - edge) return 'after'
  return 'inside'
}

function onDrop(event) {
  event.preventDefault()
  event.stopPropagation()

  const widgetType = getWidgetType(event)
  const nodeId = getNodeId(event)
  const position = getDropPosition(event)

  if (widgetType) {
    dropWidget(widgetType, props.node.id, position)
  } else if (nodeId && nodeId !== props.node.id) {
    moveNodeTo(nodeId, props.node.id, position)
  }

  state.dragOverId = null
}
</script>

<template>
  <div
    class="el-node"
    :class="[`type-${node.type}`, { selected: isSelected, 'drag-over': isDragOver }]"
    :style="style"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @dragover="onDragOver"
    @drop="onDrop"
    @click.stop="onSelect"
  >
    <div v-if="isSelected" class="el-toolbar">
      <span class="el-label">{{ LABELS[node.type] }}</span>
      <button title="Move up" @click.stop="moveNode(node.id, -1)">↑</button>
      <button title="Move down" @click.stop="moveNode(node.id, 1)">↓</button>
      <button title="Duplicate" @click.stop="duplicateNode(node.id)">⧉</button>
      <button title="Delete" @click.stop="deleteNode(node.id)">✕</button>
    </div>

    <template v-if="node.type === 'section'">
      <div v-if="!node.children.length" class="empty-hint">Drop widgets here</div>
      <ElementNode v-for="child in node.children" :key="child.id" :node="child" />
    </template>

    <component
      v-else-if="node.type === 'heading'"
      :is="node.content.tag"
      class="node-content node-heading"
    >{{ node.content.text }}</component>

    <p v-else-if="node.type === 'text'" class="node-content node-text">
      {{ node.content.text }}
    </p>

    <img
      v-else-if="node.type === 'image'"
      class="node-content node-image"
      :src="node.content.src"
      :alt="node.content.alt"
    />

    <a
      v-else-if="node.type === 'button'"
      class="node-content node-button"
      :href="node.content.link"
      @click.prevent.stop="onSelect"
    >{{ node.content.text }}</a>

    <div v-else-if="node.type === 'video'" class="node-content node-video">
      <iframe :src="node.content.src" allowfullscreen></iframe>
    </div>

    <hr v-else-if="node.type === 'divider'" class="node-content node-divider" />

    <div v-else-if="node.type === 'spacer'" class="node-content node-spacer"></div>
  </div>
</template>

<style scoped>
.node-content {
  position: relative;
}

.node-heading,
.node-text {
  margin: 0;
}

.node-image {
  display: block;
  width: 100%;
  height: auto;
}

.node-button {
  display: block;
  width: 100%;
  color: inherit;
  text-decoration: none;
}

.node-video {
  overflow: hidden;
}

.node-video iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
  pointer-events: none;
}

.node-divider {
  width: 100%;
}
</style>
