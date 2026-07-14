<template>
  <BaseCard>
    <div class="item-card">
      <div class="item-card__top">
        <div>
          <p class="badge">{{ item.category }}</p>
          <h3>{{ item.name }}</h3>
        </div>
        <p class="price">{{ formatCurrency(item.dailyPrice) }}/hari</p>
      </div>

      <p class="muted">{{ item.description }}</p>

      <dl class="meta-grid">
        <div>
          <dt>Stok</dt>
          <dd>{{ item.stock }}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{{ item.status }}</dd>
        </div>
        <div>
          <dt>Pemilik</dt>
          <dd>{{ item.owner?.name || '-' }}</dd>
        </div>
      </dl>

      <div class="actions">
        <RouterLink class="btn btn--primary" :to="`/items/${item.id}`">Detail</RouterLink>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import BaseCard from '../common/BaseCard.vue';
import { formatCurrency } from '../../utils/format';

defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>
