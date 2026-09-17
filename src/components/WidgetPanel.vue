<script setup>
import { WIDGETS, addWidget } from '../state.js'
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
          @click="addWidget(w.type)"
        >
          <div class="w-icon">{{ w.icon }}</div>
          <div class="w-label">{{ w.label }}</div>
        </div>
      </div>
      <div class="hint-box">
        Click a widget to add it. Select a <strong>Section</strong> first to
        add widgets inside it — otherwise new widgets are added to the page.
      </div>
    </div>
  </div>
</template>
