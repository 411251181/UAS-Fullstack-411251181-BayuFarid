<template>
  <BaseCard>
    <div class="empty-state">
      <div class="empty-state__icon" aria-hidden="true">◎</div>
      <div class="empty-state__content">
        <span class="empty-state__eyebrow">Eco-Share</span>
        <h3>{{ title }}</h3>
        <p>{{ description }}</p>
      </div>
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
