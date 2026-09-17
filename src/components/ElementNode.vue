<script setup>
import { computed } from 'vue'
import { state, LABELS, nodeStyle, selectNode, deleteNode, duplicateNode, moveNode } from '../state.js'

const props = defineProps({ node: Object })

const isSelected = computed(() => state.selectedId === props.node.id)
const style = computed(() => nodeStyle(props.node))

function onSelect() {
  selectNode(props.node.id)
}
</script>

<template>
  <!-- Section: recurses into ElementNode for children (self-referencing SFC) -->
  <div
    v-if="node.type === 'section'"
    class="el-node type-section"
    :class="{ selected: isSelected }"
    :style="style"
    @click.stop="onSelect"
  >
    <div class="el-toolbar" v-if="isSelected">
      <span class="el-label">{{ LABELS[node.type] }}</span>
      <button title="Move up" @click.stop="moveNode(node.id, -1)">↑</button>
      <button title="Move down" @click.stop="moveNode(node.id, 1)">↓</button>
      <button title="Duplicate" @click.stop="duplicateNode(node.id)">⧉</button>
      <button title="Delete" @click.stop="deleteNode(node.id)">✕</button>
    </div>
    <div v-if="!node.children.length" class="empty-hint">
      Empty section — select a widget on the left to add it here
    </div>
    <ElementNode v-for="c in node.children" :key="c.id" :node="c" />
  </div>

  <component
    v-else-if="node.type === 'heading'"
    :is="node.content.tag"
    class="el-node type-heading"
    :class="{ selected: isSelected }"
    :style="style"
    @click.stop="onSelect"
  >
    {{ node.content.text }}
    <div class="el-toolbar" v-if="isSelected">
      <span class="el-label">{{ LABELS[node.type] }}</span>
      <button title="Move up" @click.stop="moveNode(node.id, -1)">↑</button>
      <button title="Move down" @click.stop="moveNode(node.id, 1)">↓</button>
      <button title="Duplicate" @click.stop="duplicateNode(node.id)">⧉</button>
      <button title="Delete" @click.stop="deleteNode(node.id)">✕</button>
    </div>
  </component>

  <p
    v-else-if="node.type === 'text'"
    class="el-node type-text"
    :class="{ selected: isSelected }"
    :style="style"
    @click.stop="onSelect"
  >
    {{ node.content.text }}
    <div class="el-toolbar" v-if="isSelected">
      <span class="el-label">{{ LABELS[node.type] }}</span>
      <button title="Move up" @click.stop="moveNode(node.id, -1)">↑</button>
      <button title="Move down" @click.stop="moveNode(node.id, 1)">↓</button>
      <button title="Duplicate" @click.stop="duplicateNode(node.id)">⧉</button>
      <button title="Delete" @click.stop="deleteNode(node.id)">✕</button>
    </div>
  </p>

  <div
    v-else-if="node.type === 'image'"
    class="el-node type-image"
    :class="{ selected: isSelected }"
    :style="{ display: 'inline-block', position: 'relative' }"
    @click.stop="onSelect"
  >
    <div class="el-toolbar" v-if="isSelected">
      <span class="el-label">{{ LABELS[node.type] }}</span>
      <button title="Move up" @click.stop="moveNode(node.id, -1)">↑</button>
      <button title="Move down" @click.stop="moveNode(node.id, 1)">↓</button>
      <button title="Duplicate" @click.stop="duplicateNode(node.id)">⧉</button>
      <button title="Delete" @click.stop="deleteNode(node.id)">✕</button>
    </div>
    <img :src="node.content.src" :alt="node.content.alt" :style="style" />
  </div>

  <a
    v-else-if="node.type === 'button'"
    class="el-node type-button"
    :class="{ selected: isSelected }"
    :href="node.content.link"
    @click.prevent.stop="onSelect"
    :style="style"
  >
    {{ node.content.text }}
    <div class="el-toolbar" v-if="isSelected">
      <span class="el-label">{{ LABELS[node.type] }}</span>
      <button title="Move up" @click.stop="moveNode(node.id, -1)">↑</button>
      <button title="Move down" @click.stop="moveNode(node.id, 1)">↓</button>
      <button title="Duplicate" @click.stop="duplicateNode(node.id)">⧉</button>
      <button title="Delete" @click.stop="deleteNode(node.id)">✕</button>
    </div>
  </a>

  <div
    v-else-if="node.type === 'video'"
    class="el-node type-video"
    :class="{ selected: isSelected }"
    :style="style"
    @click.stop="onSelect"
  >
    <div class="el-toolbar" v-if="isSelected">
      <span class="el-label">{{ LABELS[node.type] }}</span>
      <button title="Move up" @click.stop="moveNode(node.id, -1)">↑</button>
      <button title="Move down" @click.stop="moveNode(node.id, 1)">↓</button>
      <button title="Duplicate" @click.stop="duplicateNode(node.id)">⧉</button>
      <button title="Delete" @click.stop="deleteNode(node.id)">✕</button>
    </div>
    <iframe :src="node.content.src" style="width:100%;height:100%;border:0;pointer-events:none;"></iframe>
  </div>

  <hr
    v-else-if="node.type === 'divider'"
    class="el-node type-divider"
    :class="{ selected: isSelected }"
    :style="style"
    @click.stop="onSelect"
  />

  <div
    v-else-if="node.type === 'spacer'"
    class="el-node type-spacer"
    :class="{ selected: isSelected }"
    :style="style"
    @click.stop="onSelect"
  >
    <div class="el-toolbar" v-if="isSelected">
      <span class="el-label">{{ LABELS[node.type] }} ({{ node.style.height }}px)</span>
      <button title="Move up" @click.stop="moveNode(node.id, -1)">↑</button>
      <button title="Move down" @click.stop="moveNode(node.id, 1)">↓</button>
      <button title="Duplicate" @click.stop="duplicateNode(node.id)">⧉</button>
      <button title="Delete" @click.stop="deleteNode(node.id)">✕</button>
    </div>
  </div>
</template>
