<template>
  <BaseCard>
    <article class="item-card item-discovery-card item-card--modern">
      <div class="item-discovery-card__media item-card__media-shell">
        <div class="item-discovery-card__badge-row item-card__badge-row">
          <span class="item-chip item-chip--soft item-chip--icon item-card__category-chip">
            <Cpu :size="14" />
            <span>{{ item.category || 'Elektronik' }}</span>
          </span>
          <span :class="['item-chip', 'item-chip--icon', 'item-card__status-chip', statusClass]">
            <component :is="statusIcon" :size="14" />
            <span>{{ statusLabel }}</span>
          </span>
        </div>

        <img
          v-if="imageUrl"
          :src="imageUrl"
          :alt="item.name"
          class="item-card__image"
        />
        <div v-else class="item-card__image item-card__image--placeholder" aria-hidden="true">
          <Leaf :size="44" />
          <span>Eco-Share</span>
        </div>
      </div>

      <div class="item-discovery-card__body item-card__body">
        <div class="item-card__copy stack-sm">
          <div>
            <h3 class="item-card__title">{{ item.name }}</h3>
            <p class="item-card__description">{{ shortDescription }}</p>
          </div>

          <div class="item-discovery-card__price-block item-card__price-block">
            <strong>{{ formatCurrency(item.dailyPrice) }}</strong>
            <span>/hari</span>
          </div>
        </div>

        <div class="item-discovery-card__meta-row item-card__meta-grid">
          <div class="item-card__meta-item">
            <span class="item-discovery-card__meta-label">Owner</span>
            <strong class="item-discovery-card__meta-value item-card__meta-value">
              <Store :size="14" />
              <span>{{ item.owner?.name || 'Owner Eco-Share' }}</span>
            </strong>
          </div>
          <div class="item-card__meta-item item-card__meta-item--align-end">
            <span class="item-discovery-card__meta-label">Stok</span>
            <strong class="item-discovery-card__meta-value item-card__meta-value">
              <Boxes :size="14" />
              <span>{{ stockLabel }}</span>
            </strong>
          </div>
          <div class="item-card__meta-item item-card__meta-item--full">
            <span class="item-discovery-card__meta-label">Status rental</span>
            <strong class="item-discovery-card__meta-value item-card__meta-value" :class="availabilityTextClass">
              <component :is="statusIcon" :size="14" />
              <span>{{ statusText }}</span>
            </strong>
          </div>
        </div>

        <div class="item-discovery-card__footer item-card__footer">
          <RouterLink class="btn btn--ghost btn--small btn--icon item-card__action" :to="`/items/${item.id}`">
            <Eye :size="16" />
            <span>Detail</span>
          </RouterLink>
          <RouterLink class="btn btn--primary btn--small btn--icon item-card__action" :to="`/items/${item.id}`">
            <ShoppingBag :size="16" />
            <span>Sewa</span>
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

const imageUrl = computed(() => (
  props.item.imageUrl
  || props.item.image
  || props.item.thumbnailUrl
  || props.item.photoUrl
  || props.item.photo
  || null
));

const isAvailable = computed(() => props.item.status === 'AVAILABLE' && Number(props.item.stock) > 0);
const stockLabel = computed(() => `${Number(props.item.stock) || 0} unit`);
const statusLabel = computed(() => (isAvailable.value ? 'Tersedia' : 'Belum siap'));
const statusText = computed(() => (isAvailable.value ? 'Siap dirental' : Number(props.item.stock) > 0 ? props.item.status : 'Stok habis'));
const statusClass = computed(() => (isAvailable.value ? 'item-chip--success' : 'item-chip--muted'));
const statusIcon = computed(() => (isAvailable.value ? CheckCircle2 : XCircle));
const availabilityTextClass = computed(() => (isAvailable.value ? 'item-card__meta-value--success' : 'item-card__meta-value--muted'));
</script>
