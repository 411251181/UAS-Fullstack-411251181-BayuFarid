<template>
  <div v-if="message" :class="['alert', `alert--${variant}`]" role="status" aria-live="polite">
    <span class="alert__icon" aria-hidden="true">{{ icon }}</span>
    <div class="alert__content">
      <strong class="alert__title">{{ title }}</strong>
      <p class="alert__message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  message: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: 'error',
  },
});

const icon = computed(() => {
  if (props.variant === 'success') {
    return '✓';
  }

  return '!';
});

const title = computed(() => {
  if (props.variant === 'success') {
    return 'Berhasil';
  }

  return 'Perlu perhatian';
});
</script>
