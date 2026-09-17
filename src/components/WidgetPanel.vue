<script setup>
import { WIDGETS, addWidget, state } from '../state.js'

function onDragStart(event, type) {
  event.dataTransfer.effectAllowed = 'copy'
  event.dataTransfer.setData('application/x-vue-page-builder-widget', type)
  event.dataTransfer.setData('text/plain', type)
}
</script>

<template>
  <div class="panel panel-left">
    <div class="panel-head"><h2>Widgets</h2></div>
    <div class="panel-scroll">
      <div class="widget-grid">
        <div
          class="widget-card"
          v-for="w in WIDGETS"
          :key="w.type"
          draggable="true"
          @dragstart="onDragStart($event, w.type)"
          @dragend="state.dragOverId = null"
          @click="addWidget(w.type)"
        >
          <div class="w-icon">{{ w.icon }}</div>
          <div class="w-label">{{ w.label }}</div>
        </div>
      </div>
      <div class="hint-box">
        Click a widget to add it. Or drag a widget onto the canvas or inside a section.
      </div>
    </div>
  </div>
</template>
