<script setup>
defineProps({ modelValue: String, colors: Array })
defineEmits(['update:modelValue'])
</script>

<template>
  <div>
    <div class="swatches">
      <div
        v-for="c in colors"
        :key="c.hex"
        class="swatch"
        :class="{ active: modelValue === c.hex }"
        :style="{ background: c.hex }"
        :title="c.name + ' ' + c.hex"
        @click="$emit('update:modelValue', c.hex)"
      ></div>
    </div>
    <div class="swatch-custom">
      <input type="color" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
      <input type="text" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
    </div>
  </div>
</template>
