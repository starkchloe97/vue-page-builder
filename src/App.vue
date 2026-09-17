<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { state, clearAll, undo, redo, canUndo, canRedo, copyNode, pasteNode, duplicateNode, deleteNode, selectNode } from './state.js'
import WidgetPanel from './components/WidgetPanel.vue'
import CanvasArea from './components/CanvasArea.vue'
import RightPanel from './components/RightPanel.vue'
import ExportModal from './components/ExportModal.vue'

const showModal = ref(false)
const undoAvailable = computed(() => canUndo())
const redoAvailable = computed(() => canRedo())

function handleKeydown(event) {
  const target = event.target
  const editing = target?.matches?.('input, textarea, select, [contenteditable="true"]')
  const modifier = event.ctrlKey || event.metaKey

  if (modifier && event.key.toLowerCase() === 'z') {
    if (editing) return
    event.preventDefault()
    if (event.shiftKey) redo()
    else undo()
    return
  }
  if (modifier && event.key.toLowerCase() === 'y') {
    if (editing) return
    event.preventDefault()
    redo()
    return
  }
  if (modifier && event.key.toLowerCase() === 'c' && state.selectedId && !editing) {
    event.preventDefault()
    copyNode(state.selectedId)
    return
  }
  if (modifier && event.key.toLowerCase() === 'v' && !editing) {
    event.preventDefault()
    pasteNode()
    return
  }
  if (modifier && event.key.toLowerCase() === 'd' && state.selectedId && !editing) {
    event.preventDefault()
    duplicateNode(state.selectedId)
    return
  }
  if ((event.key === 'Delete' || event.key === 'Backspace') && state.selectedId && !editing) {
    event.preventDefault()
    deleteNode(state.selectedId)
  }
  if (event.key === 'Escape') {
    state.dragOverId = null
    state.activeDrag = null
    selectNode(null)
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <div class="topbar">
    <div class="topbar-left">
      <div class="logo-mark">▦</div>
      <div class="brand">Vue Page Builder</div>
      <div class="brand-sub">— design visually, export a Vue SFC</div>
    </div>
    <div class="topbar-right">
      <div class="history-actions" title="Undo / redo">
        <button class="btn ghost icon-btn" :disabled="!undoAvailable" @click="undo" title="Undo (Ctrl/Cmd + Z)">↶</button>
        <button class="btn ghost icon-btn" :disabled="!redoAvailable" @click="redo" title="Redo (Ctrl/Cmd + Shift + Z)">↷</button>
      </div>
      <button class="btn ghost" @click="clearAll" :disabled="!state.elements.length">Clear canvas</button>
      <button class="btn primary" @click="showModal = true">Get Code</button>
    </div>
  </div>

  <div class="body-row">
    <WidgetPanel />
    <CanvasArea />
    <RightPanel />
  </div>

  <ExportModal :show="showModal" @close="showModal = false" />
</template>

<style scoped>
.history-actions{display:flex;gap:2px;margin-right:4px}.icon-btn{min-width:34px;padding-left:9px;padding-right:9px;font-size:17px}.icon-btn:disabled{opacity:.35;cursor:not-allowed}
</style>
