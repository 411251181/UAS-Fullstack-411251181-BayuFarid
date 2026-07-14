<template>
  <BaseCard>
    <article class="item-card item-discovery-card">
      <div class="item-discovery-card__media">
        <div class="item-discovery-card__badge-row">
          <span class="item-chip item-chip--soft item-chip--icon">
            <Cpu :size="14" />
            <span>{{ item.category }}</span>
          </span>
          <span :class="['item-chip', 'item-chip--icon', statusClass]">
            <component :is="statusIcon" :size="14" />
            <span>{{ statusLabel }}</span>
          </span>
        </div>
        <div class="item-discovery-card__media-content">
          <span class="item-discovery-card__eyebrow">
            <Leaf :size="14" />
            <span>Eco-Share</span>
          </span>
          <h3>{{ item.name }}</h3>
          <p>{{ shortDescription }}</p>
        </div>
      </div>

      <div class="item-discovery-card__body">
        <div class="item-discovery-card__heading-row">
          <div>
            <p class="item-discovery-card__owner-label">Disediakan oleh</p>
            <p class="item-discovery-card__owner item-discovery-card__owner--with-icon">
              <Store :size="14" />
              <span>{{ item.owner?.name || 'Owner Eco-Share' }}</span>
            </p>
          </div>
          <div class="item-discovery-card__price-block">
            <strong>{{ formatCurrency(item.dailyPrice) }}</strong>
            <span>/hari</span>
          </div>
        </div>

        <div class="item-discovery-card__meta-row">
          <div>
            <span class="item-discovery-card__meta-label">Stok</span>
            <strong class="item-discovery-card__meta-value">
              <Boxes :size="14" />
              <span>{{ item.stock }}</span>
            </strong>
          </div>
          <div>
            <span class="item-discovery-card__meta-label">Status</span>
            <strong class="item-discovery-card__meta-value">
              <component :is="statusIcon" :size="14" />
              <span>{{ statusText }}</span>
            </strong>
          </div>
        </div>

        <div class="item-discovery-card__footer">
          <RouterLink class="btn btn--ghost btn--small btn--icon" :to="`/items/${item.id}`">
            <Eye :size="16" />
            <span>Lihat detail</span>
          </RouterLink>
          <RouterLink class="btn btn--primary btn--small btn--icon" :to="`/items/${item.id}`">
            <ShoppingBag :size="16" />
            <span>Sewa sekarang</span>
          </RouterLink>
        </div>
      </div>
    </article>
  </BaseCard>
</template>

<script setup>
import { Boxes, CheckCircle2, Cpu, Eye, Leaf, ShoppingBag, Store, XCircle } from '@lucide/vue';
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
const statusIcon = computed(() => (isAvailable.value ? CheckCircle2 : XCircle));
</script>
