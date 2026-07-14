<template>
  <BaseCard>
    <article class="item-card item-discovery-card">
      <div class="item-discovery-card__media">
        <div class="item-discovery-card__badge-row">
          <span class="item-chip item-chip--soft">{{ item.category }}</span>
          <span :class="['item-chip', statusClass]">{{ statusLabel }}</span>
        </div>
        <div class="item-discovery-card__media-content">
          <span class="item-discovery-card__eyebrow">Eco-Share</span>
          <h3>{{ item.name }}</h3>
          <p>{{ shortDescription }}</p>
        </div>
      </div>

      <div class="item-discovery-card__body">
        <div class="item-discovery-card__heading-row">
          <div>
            <p class="item-discovery-card__owner-label">Disediakan oleh</p>
            <p class="item-discovery-card__owner">{{ item.owner?.name || 'Owner Eco-Share' }}</p>
          </div>
          <div class="item-discovery-card__price-block">
            <strong>{{ formatCurrency(item.dailyPrice) }}</strong>
            <span>/hari</span>
          </div>
        </div>

        <div class="item-discovery-card__meta-row">
          <div>
            <span class="item-discovery-card__meta-label">Stok</span>
            <strong>{{ item.stock }}</strong>
          </div>
          <div>
            <span class="item-discovery-card__meta-label">Status</span>
            <strong>{{ statusText }}</strong>
          </div>
        </div>

        <div class="item-discovery-card__footer">
          <RouterLink class="btn btn--ghost btn--small" :to="`/items/${item.id}`">Lihat detail</RouterLink>
          <RouterLink class="btn btn--primary btn--small" :to="`/items/${item.id}`">Sewa sekarang</RouterLink>
        </div>
      </div>
    </article>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import BaseCard from '../common/BaseCard.vue';
import { formatCurrency } from '../../utils/format';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const shortDescription = computed(() => {
  if (!props.item.description) {
    return 'Elektronik terkurasi untuk kebutuhan harian, belajar, dan produktivitas.';
  }

  return props.item.description.length > 120
    ? `${props.item.description.slice(0, 120)}...`
    : props.item.description;
});

const isAvailable = computed(() => props.item.status === 'AVAILABLE' && Number(props.item.stock) > 0);

const statusLabel = computed(() => (isAvailable.value ? 'Tersedia' : 'Terbatas'));
const statusText = computed(() => (isAvailable.value ? 'Siap dirental' : props.item.status));
const statusClass = computed(() => (isAvailable.value ? 'item-chip--success' : 'item-chip--muted'));
</script>
