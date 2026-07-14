<template>
  <div class="loading-state" role="status" aria-live="polite">
    <div class="loading-state__spinner-wrap">
      <div class="spinner"></div>
    </div>
    <div class="loading-state__content">
      <span class="loading-state__eyebrow">Eco-Share</span>
      <p>{{ label }}</p>
    </div>
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
