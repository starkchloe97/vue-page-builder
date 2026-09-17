<script setup>
import { ref } from 'vue'
import { state, clearAll } from './state.js'
import WidgetPanel from './components/WidgetPanel.vue'
import CanvasArea from './components/CanvasArea.vue'
import RightPanel from './components/RightPanel.vue'
import ExportModal from './components/ExportModal.vue'

const showModal = ref(false)
</script>

<template>
  <div class="topbar">
    <div class="topbar-left">
      <div class="logo-mark">▦</div>
      <div class="brand">Vue Page Builder</div>
      <div class="brand-sub">— design visually, export a Vue SFC</div>
    </div>
    <div class="topbar-right">
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
