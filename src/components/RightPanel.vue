<script setup>
import { computed } from 'vue'
import { state, LABELS, GLOBAL_COLORS, findNode, selectNode, updateSpacingSide, toggleLink } from '../state.js'
import PropertyPanel from './PropertyPanel.vue'

const selectedNode = computed(() => (state.selectedId ? findNode(state.elements, state.selectedId) : null))
</script>

<template>
  <div class="panel panel-right">
    <template v-if="selectedNode">
      <div class="panel-head">
        <h2>{{ LABELS[selectedNode.type] }}</h2>
        <button class="btn ghost small" @click="selectNode(null)">✕</button>
      </div>
      <div class="tabs">
        <button class="tab-btn" :class="{ active: state.activeTab === 'content' }" @click="state.activeTab = 'content'">Content</button>
        <button class="tab-btn" :class="{ active: state.activeTab === 'style' }" @click="state.activeTab = 'style'">Style</button>
        <button class="tab-btn" :class="{ active: state.activeTab === 'advanced' }" @click="state.activeTab = 'advanced'">Advanced</button>
      </div>
      <div class="panel-scroll">
        <PropertyPanel
          :node="selectedNode"
          :tab="state.activeTab"
          :global-colors="GLOBAL_COLORS"
          @update-spacing="(box, side, val) => updateSpacingSide(selectedNode, box, side, val)"
          @toggle-link="(box) => toggleLink(selectedNode, box)"
        />
      </div>
    </template>
    <template v-else>
      <div class="panel-head"><h2>Properties</h2></div>
      <div class="no-panel">
        Select an element on the canvas to edit its Content, Style and Advanced (spacing) settings — just like Elementor.
      </div>
    </template>
  </div>
</template>
