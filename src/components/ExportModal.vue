<script setup>
import { ref, computed } from 'vue'
import { generateSFC } from '../state.js'

const props = defineProps({ show: Boolean })
const emit = defineEmits(['close'])

const copyStatus = ref('')
const exportedCode = computed(() => (props.show ? generateSFC() : ''))

async function copyCode() {
  const text = generateSFC()
  try {
    await navigator.clipboard.writeText(text)
    copyStatus.value = 'Copied to clipboard ✓'
  } catch (e) {
    copyStatus.value = 'Could not auto-copy — select the code and press Ctrl/Cmd+C'
  }
  setTimeout(() => (copyStatus.value = ''), 3500)
}
</script>

<template>
  <div class="modal-overlay" v-if="show" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-head">
        <h3>Copy your Vue component</h3>
        <button class="btn ghost small" @click="$emit('close')">✕ Close</button>
      </div>
      <div class="modal-body">
        <textarea class="code-box" readonly @click="$event.target.select()">{{ exportedCode }}</textarea>
      </div>
      <div class="modal-foot">
        <span class="copy-status" v-if="copyStatus">{{ copyStatus }}</span>
        <button class="btn" @click="$emit('close')">Close</button>
        <button class="btn primary" @click="copyCode">Copy code</button>
      </div>
    </div>
  </div>
</template>
