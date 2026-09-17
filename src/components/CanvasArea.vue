<script setup>
import { state, selectNode } from '../state.js'
import ElementNode from './ElementNode.vue'
</script>

<template>
  <div class="canvas-wrap" @click="selectNode(null)">
    <div class="canvas-page" @click.stop>
      <div v-if="!state.elements.length" class="canvas-empty">
        <div class="big">▦</div>
        <div><strong>Your canvas is empty</strong></div>
        <div>Click a widget on the left to start building your page.</div>
      </div>
      <ElementNode v-for="n in state.elements" :key="n.id" :node="n" />
    </div>
  </div>
</template>
