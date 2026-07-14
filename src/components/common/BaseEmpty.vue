<template>
  <BaseCard>
    <div class="empty-state">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from './BaseCard.vue';

defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
</script>
