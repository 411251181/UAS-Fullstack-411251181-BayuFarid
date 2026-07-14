<template>
  <div class="loading-state">
    <div class="spinner"></div>
    <p>{{ label }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: 'Memuat data...',
  },
});
</script>
