<template>
  <section class="item-detail-page stack-lg">
    <BaseAlert :message="errorMessage" />
    <BaseAlert :message="successMessage" variant="success" />
    <LoadingSpinner v-if="loading" label="Memuat detail rental..." />

    <template v-else-if="rental">
      <section class="item-detail-hero rental-detail-hero">
        <div class="item-detail-hero__media rental-detail-hero__media">
          <span class="item-detail-hero__eyebrow">Rental detail</span>
          <div class="item-detail-hero__title-row">
            <div>
              <h1>Rental #{{ rental.id }}</h1>
              <p>{{ rental.item.name }} · {{ rental.item.category }}</p>
            </div>
            <span :class="['item-chip', 'item-chip--soft']">{{ rental.status }}</span>
          </div>
          <div class="item-detail-stat-row rental-detail-stat-row">
            <div class="item-detail-stat-card">
              <span>Total harga</span>
              <strong>{{ formatCurrency(rental.totalPrice) }}</strong>
            </div>
            <div class="item-detail-stat-card">
              <span>Jumlah</span>
              <strong>{{ rental.quantity }} unit</strong>
            </div>
            <div class="item-detail-stat-card">
              <span>Durasi</span>
              <strong>{{ rentalDays }} hari</strong>
            </div>
          </div>
        </div>

        <div class="item-detail-hero__summary rental-detail-summary">
          <div class="section-heading">
            <p class="eyebrow">Pihak terkait</p>
            <h2>Kontak transaksi</h2>
          </div>
          <dl class="item-detail-owner-grid rental-detail-contact-grid">
            <div><dt>Penyewa</dt><dd>{{ rental.renter.name }}</dd></div>
            <div><dt>Email Penyewa</dt><dd>{{ rental.renter.email }}</dd></div>
            <div><dt>Pemilik</dt><dd>{{ rental.item.owner.name }}</dd></div>
            <div><dt>Email Pemilik</dt><dd>{{ rental.item.owner.email }}</dd></div>
          </dl>
          <div class="item-detail-access-note rental-detail-period-note">
            <h3>Periode rental</h3>
            <p class="muted">{{ formatDate(rental.startDate) }} - {{ formatDate(rental.endDate) }}</p>
          </div>
        </div>
      </section>

      <section class="item-detail-content rental-detail-content">
        <BaseCard>
          <div class="section-heading">
            <p class="eyebrow">Ringkasan</p>
            <h2>Detail transaksi</h2>
          </div>
          <dl class="meta-grid">
            <div><dt>Status</dt><dd>{{ rental.status }}</dd></div>
            <div><dt>Barang</dt><dd>{{ rental.item.name }}</dd></div>
            <div><dt>Kategori</dt><dd>{{ rental.item.category }}</dd></div>
            <div><dt>Total Harga</dt><dd>{{ formatCurrency(rental.totalPrice) }}</dd></div>
            <div><dt>Jumlah</dt><dd>{{ rental.quantity }}</dd></div>
            <div><dt>Periode</dt><dd>{{ formatDate(rental.startDate) }} - {{ formatDate(rental.endDate) }}</dd></div>
          </dl>

          <div class="actions actions--wrap" v-if="authStore.isRenter && rental.renterId === authStore.user?.id">
            <button v-if="rental.status === 'ACTIVE'" class="btn btn--primary" type="button" @click="handleReturn">Return</button>
            <button v-if="['PENDING', 'ACTIVE'].includes(rental.status)" class="btn btn--danger" type="button" @click="handleCancel">Cancel</button>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="section-heading">
            <p class="eyebrow">Audit trail</p>
            <h2>Riwayat Rental</h2>
            <p class="muted">Jejak perubahan status dan catatan backend.</p>
          </div>
          <ul class="timeline rental-detail-timeline">
            <li v-for="history in rental.histories" :key="history.id">
              <strong>{{ history.action }}</strong>
              <span>{{ history.note || '-' }}</span>
              <small>{{ formatDate(history.createdAt) }}</small>
            </li>
          </ul>
        </BaseCard>
      </section>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { cancelRentalRequest, getRentalDetailRequest, returnRentalRequest } from '../../api/rentals';
import BaseAlert from '../../components/common/BaseAlert.vue';
import BaseCard from '../../components/common/BaseCard.vue';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import { useAuthStore } from '../../stores/auth';
import { extractApiError } from '../../utils/api';
import { formatCurrency, formatDate } from '../../utils/format';

const authStore = useAuthStore();
const route = useRoute();
const rental = ref(null);
const loading = ref(true);
const errorMessage = ref('');
const successMessage = ref('');
const rentalDays = computed(() => {
  if (!rental.value) return 0;
  const start = new Date(rental.value.startDate);
  const end = new Date(rental.value.endDate);
  const diff = Math.round((end - start) / 86400000) + 1;
  return Number.isFinite(diff) && diff > 0 ? diff : 0;
});

const loadRental = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await getRentalDetailRequest(route.params.id);
    rental.value = response.data;
  } catch (error) {
    errorMessage.value = extractApiError(error);
  } finally {
    loading.value = false;
  }
};

const handleReturn = async () => {
  try {
    const response = await returnRentalRequest(route.params.id);
    successMessage.value = response.message;
    await loadRental();
  } catch (error) {
    errorMessage.value = extractApiError(error);
  }
};

const handleCancel = async () => {
  try {
    const response = await cancelRentalRequest(route.params.id);
    successMessage.value = response.message;
    await loadRental();
  } catch (error) {
    errorMessage.value = extractApiError(error);
  }
};

onMounted(loadRental);
</script>
