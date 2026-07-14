<template>
  <p v-if="message" :class="['alert', `alert--${variant}`]">
    {{ message }}
  </p>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: 'error',
  },
});
</script>
