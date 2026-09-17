<script setup>
defineProps({ modelValue: String })
defineEmits(['update:modelValue'])

const opts = [
  ['left', 'al-left'],
  ['center', 'al-center'],
  ['right', 'al-right'],
  ['justify', 'al-justify'],
]
</script>

<template>
  <div class="seg">
    <button
      v-for="[val, cls] in opts"
      :key="val"
      :class="{ active: modelValue === val }"
      @click="$emit('update:modelValue', val)"
    >
      <span class="align-lines" :class="cls"><span></span><span></span><span></span></span>
    </button>
  </div>
</template>
