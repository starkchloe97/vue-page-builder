<script setup>
import { computed } from 'vue'
import { state, LABELS, nodeStyle, selectNode, deleteNode, duplicateNode, moveNode, moveNodeTo, dropWidget } from '../state.js'

const props = defineProps({ node: Object })
const isSelected = computed(() => state.selectedId === props.node.id)
const style = computed(() => nodeStyle(props.node))
const isDragOver = computed(() => state.dragOverId === props.node.id)

function onSelect() {
  selectNode(props.node.id)
}

function onDragStart(event) {
  event.stopPropagation()
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('application/x-vue-page-builder-node', props.node.id)
  event.dataTransfer.setData('text/plain', props.node.id)
}

function onDragOver(event) {
  event.stopPropagation()
  const widgetType = event.dataTransfer.getData('application/x-vue-page-builder-widget')
  const nodeId = event.dataTransfer.getData('application/x-vue-page-builder-node')
  if ((!widgetType && !nodeId) || nodeId === props.node.id) return
  event.preventDefault()
  event.dataTransfer.dropEffect = widgetType ? 'copy' : 'move'
  state.dragOverId = props.node.id
}

function onDrop(event) {
  event.preventDefault()
  event.stopPropagation()
  const widgetType = event.dataTransfer.getData('application/x-vue-page-builder-widget')
  const nodeId = event.dataTransfer.getData('application/x-vue-page-builder-node')

  if (widgetType) {
    dropWidget(widgetType, props.node.id, props.node.type === 'section' ? 'inside' : 'after')
  } else if (nodeId) {
    const rect = event.currentTarget.getBoundingClientRect()
    let position = event.clientY < rect.top + rect.height / 2 ? 'before' : 'after'
    if (props.node.type === 'section' && event.clientY > rect.top + rect.height * 0.25 && event.clientY < rect.bottom - rect.height * 0.25) position = 'inside'
    moveNodeTo(nodeId, props.node.id, position)
  }
  state.dragOverId = null
}
</script>

<template>
  <div v-if="node.type === 'section'" class="el-node type-section" :class="{ selected: isSelected, 'drag-over': isDragOver }" :style="style" draggable="true" @dragstart="onDragStart" @dragover="onDragOver" @dragleave="state.dragOverId === node.id && (state.dragOverId = null)" @drop="onDrop" @click.stop="onSelect">
    <div class="el-toolbar" v-if="isSelected"><span class="el-label">{{ LABELS[node.type] }}</span><button title="Move up" @click.stop="moveNode(node.id, -1)">↑</button><button title="Move down" @click.stop="moveNode(node.id, 1)">↓</button><button title="Duplicate" @click.stop="duplicateNode(node.id)">⧉</button><button title="Delete" @click.stop="deleteNode(node.id)">✕</button></div>
    <div v-if="!node.children.length" class="empty-hint">Drop widgets here</div>
    <ElementNode v-for="c in node.children" :key="c.id" :node="c" />
  </div>

  <component v-else-if="node.type === 'heading'" :is="node.content.tag" class="el-node type-heading" :class="{ selected: isSelected, 'drag-over': isDragOver }" :style="style" draggable="true" @dragstart="onDragStart" @dragover="onDragOver" @dragleave="state.dragOverId === node.id && (state.dragOverId = null)" @drop="onDrop" @click.stop="onSelect">
    {{ node.content.text }}
    <div class="el-toolbar" v-if="isSelected"><span class="el-label">{{ LABELS[node.type] }}</span><button title="Move up" @click.stop="moveNode(node.id, -1)">↑</button><button title="Move down" @click.stop="moveNode(node.id, 1)">↓</button><button title="Duplicate" @click.stop="duplicateNode(node.id)">⧉</button><button title="Delete" @click.stop="deleteNode(node.id)">✕</button></div>
  </component>

  <p v-else-if="node.type === 'text'" class="el-node type-text" :class="{ selected: isSelected, 'drag-over': isDragOver }" :style="style" draggable="true" @dragstart="onDragStart" @dragover="onDragOver" @dragleave="state.dragOverId === node.id && (state.dragOverId = null)" @drop="onDrop" @click.stop="onSelect">
    {{ node.content.text }}
    <div class="el-toolbar" v-if="isSelected"><span class="el-label">{{ LABELS[node.type] }}</span><button title="Move up" @click.stop="moveNode(node.id, -1)">↑</button><button title="Move down" @click.stop="moveNode(node.id, 1)">↓</button><button title="Duplicate" @click.stop="duplicateNode(node.id)">⧉</button><button title="Delete" @click.stop="deleteNode(node.id)">✕</button></div>
  </p>

  <div v-else-if="node.type === 'image'" class="el-node type-image" :class="{ selected: isSelected, 'drag-over': isDragOver }" :style="{ display: 'inline-block', position: 'relative' }" draggable="true" @dragstart="onDragStart" @dragover="onDragOver" @dragleave="state.dragOverId === node.id && (state.dragOverId = null)" @drop="onDrop" @click.stop="onSelect">
    <div class="el-toolbar" v-if="isSelected"><span class="el-label">{{ LABELS[node.type] }}</span><button title="Move up" @click.stop="moveNode(node.id, -1)">↑</button><button title="Move down" @click.stop="moveNode(node.id, 1)">↓</button><button title="Duplicate" @click.stop="duplicateNode(node.id)">⧉</button><button title="Delete" @click.stop="deleteNode(node.id)">✕</button></div>
    <img :src="node.content.src" :alt="node.content.alt" :style="style" />
  </div>

  <a v-else-if="node.type === 'button'" class="el-node type-button" :class="{ selected: isSelected, 'drag-over': isDragOver }" :href="node.content.link" :style="style" draggable="true" @dragstart="onDragStart" @dragover="onDragOver" @dragleave="state.dragOverId === node.id && (state.dragOverId = null)" @drop="onDrop" @click.prevent.stop="onSelect">
    {{ node.content.text }}
    <div class="el-toolbar" v-if="isSelected"><span class="el-label">{{ LABELS[node.type] }}</span><button title="Move up" @click.stop="moveNode(node.id, -1)">↑</button><button title="Move down" @click.stop="moveNode(node.id, 1)">↓</button><button title="Duplicate" @click.stop="duplicateNode(node.id)">⧉</button><button title="Delete" @click.stop="deleteNode(node.id)">✕</button></div>
  </a>

  <div v-else-if="node.type === 'video'" class="el-node type-video" :class="{ selected: isSelected, 'drag-over': isDragOver }" :style="style" draggable="true" @dragstart="onDragStart" @dragover="onDragOver" @dragleave="state.dragOverId === node.id && (state.dragOverId = null)" @drop="onDrop" @click.stop="onSelect">
    <div class="el-toolbar" v-if="isSelected"><span class="el-label">{{ LABELS[node.type] }}</span><button title="Move up" @click.stop="moveNode(node.id, -1)">↑</button><button title="Move down" @click.stop="moveNode(node.id, 1)">↓</button><button title="Duplicate" @click.stop="duplicateNode(node.id)">⧉</button><button title="Delete" @click.stop="deleteNode(node.id)">✕</button></div>
    <iframe :src="node.content.src" style="width:100%;height:100%;border:0;pointer-events:none;"></iframe>
  </div>

  <hr v-else-if="node.type === 'divider'" class="el-node type-divider" :class="{ selected: isSelected, 'drag-over': isDragOver }" :style="style" draggable="true" @dragstart="onDragStart" @dragover="onDragOver" @dragleave="state.dragOverId === node.id && (state.dragOverId = null)" @drop="onDrop" @click.stop="onSelect" />

  <div v-else-if="node.type === 'spacer'" class="el-node type-spacer" :class="{ selected: isSelected, 'drag-over': isDragOver }" :style="style" draggable="true" @dragstart="onDragStart" @dragover="onDragOver" @dragleave="state.dragOverId === node.id && (state.dragOverId = null)" @drop="onDrop" @click.stop="onSelect">
    <div class="el-toolbar" v-if="isSelected"><span class="el-label">{{ LABELS[node.type] }} ({{ node.style.height }}px)</span><button title="Move up" @click.stop="moveNode(node.id, -1)">↑</button><button title="Move down" @click.stop="moveNode(node.id, 1)">↓</button><button title="Duplicate" @click.stop="duplicateNode(node.id)">⧉</button><button title="Delete" @click.stop="deleteNode(node.id)">✕</button></div>
  </div>
</template>
