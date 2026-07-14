<template>
  <section class="owner-dashboard stack-lg">
    <section class="section-heading stack-lg">
      <div>
        <p class="eyebrow">Dashboard Renter</p>
        <h1>Riwayat Rental Saya</h1>
        <p class="muted">Pantau status aktif, total transaksi, dan buka detail rental dari satu dashboard.</p>
      </div>
      <div class="owner-stats-grid rental-stats-grid">
        <div class="owner-stat-card">
          <span>Total rental</span>
          <strong>{{ rentals.length }}</strong>
        </div>
        <div class="owner-stat-card">
          <span>Active</span>
          <strong>{{ activeCount }}</strong>
        </div>
        <div class="owner-stat-card">
          <span>Completed</span>
          <strong>{{ returnedCount }}</strong>
        </div>
        <div class="owner-stat-card owner-stat-card--accent">
          <span>Nilai transaksi</span>
          <strong>{{ totalValue }}</strong>
        </div>
      </div>
    </section>

    <BaseAlert :message="errorMessage" />
    <BaseAlert :message="successMessage" variant="success" />
    <LoadingSpinner v-if="loading" label="Memuat rental saya..." />
    <BaseEmpty
      v-else-if="!rentals.length"
      title="Belum ada rental"
      description="Pilih barang dari katalog lalu buat rental sebagai penyewa."
    />

    <section v-else class="rental-history-list">
      <BaseCard v-for="rental in rentals" :key="rental.id">
        <article :class="['rental-history-card', `rental-history-card--${rental.status.toLowerCase()}`]">
          <div class="rental-history-card__main">
            <div class="rental-history-card__summary">
              <div>
                <h3>{{ rental.item.name }}</h3>
                <p :class="['item-chip', statusChipClass(rental.status)]">{{ rental.status }}</p>
              </div>
              <div class="price-panel rental-history-card__price">
                <span>Total Harga</span>
                <strong>{{ formatCurrency(rental.totalPrice) }}</strong>
              </div>
            </div>

            <div class="rental-history-card__meta">
              <div>
                <span>Periode Rental</span>
                <strong>{{ formatDate(rental.startDate) }} - {{ formatDate(rental.endDate) }}</strong>
              </div>
              <div>
                <span>Kategori</span>
                <strong>{{ rental.item.category }}</strong>
              </div>
              <div>
                <span>Pemilik</span>
                <strong>{{ rental.item.owner.name }}</strong>
              </div>
              <div>
                <span>Jumlah</span>
                <strong>{{ rental.quantity }} unit</strong>
              </div>
            </div>
          </div>

          <div class="rental-history-card__actions">
            <button
              v-if="rental.status === 'ACTIVE'"
              class="btn btn--primary"
              type="button"
              @click="handleReturn(rental.id)"
            >
              Return
            </button>
            <button
              v-if="['PENDING', 'ACTIVE'].includes(rental.status)"
              class="btn btn--danger"
              type="button"
              @click="handleCancel(rental.id)"
            >
              Cancel
            </button>
            <RouterLink class="btn btn--ghost" :to="`/rentals/${rental.id}`">Detail</RouterLink>
          </div>
        </article>
      </BaseCard>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { cancelRentalRequest, getMyRentalsRequest, returnRentalRequest } from '../../api/rentals';
import BaseAlert from '../../components/common/BaseAlert.vue';
import BaseCard from '../../components/common/BaseCard.vue';
import BaseEmpty from '../../components/common/BaseEmpty.vue';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import { extractApiError } from '../../utils/api';
import { formatCurrency, formatDate } from '../../utils/format';

const rentals = ref([]);
const loading = ref(true);
const errorMessage = ref('');
const successMessage = ref('');

const activeCount = computed(() => rentals.value.filter((rental) => rental.status === 'ACTIVE').length);
const returnedCount = computed(() => rentals.value.filter((rental) => rental.status === 'RETURNED').length);
const totalValue = computed(() => formatCurrency(rentals.value.reduce((sum, rental) => sum + Number(rental.totalPrice || 0), 0)));

const statusChipClass = (status) => ({
  ACTIVE: 'item-chip--success',
  PENDING: 'item-chip--pending',
  RETURNED: 'item-chip--muted',
  CANCELLED: 'item-chip--danger',
}[status] || 'item-chip--muted');

const loadRentals = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await getMyRentalsRequest();
    rentals.value = response.data;
  } catch (error) {
    errorMessage.value = extractApiError(error);
  } finally {
    loading.value = false;
  }
};

const handleReturn = async (id) => {
  errorMessage.value = '';

  try {
    const response = await returnRentalRequest(id);
    successMessage.value = response.message;
    await loadRentals();
  } catch (error) {
    errorMessage.value = extractApiError(error);
  }
};

const handleCancel = async (id) => {
  errorMessage.value = '';

  try {
    const response = await cancelRentalRequest(id);
    successMessage.value = response.message;
    await loadRentals();
  } catch (error) {
    errorMessage.value = extractApiError(error);
  }
};

onMounted(loadRentals);
</script>
