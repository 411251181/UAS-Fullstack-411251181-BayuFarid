<template>
  <section class="owner-dashboard stack-lg">
    <section class="section-heading stack-lg">
      <div>
        <p class="eyebrow">Dashboard Owner</p>
        <h1>Transaksi Barang Saya</h1>
        <p class="muted">Pantau rental masuk, status berjalan, dan nilai transaksi barang milik owner.</p>
      </div>
      <div class="owner-stats-grid rental-stats-grid">
        <div class="owner-stat-card">
          <span>Total transaksi</span>
          <strong>{{ rentals.length }}</strong>
        </div>
        <div class="owner-stat-card">
          <span>Pending</span>
          <strong>{{ pendingCount }}</strong>
        </div>
        <div class="owner-stat-card">
          <span>Active</span>
          <strong>{{ activeCount }}</strong>
        </div>
        <div class="owner-stat-card owner-stat-card--accent">
          <span>Nilai transaksi</span>
          <strong>{{ totalValue }}</strong>
        </div>
      </div>
    </section>

    <BaseAlert :message="errorMessage" />
    <LoadingSpinner v-if="loading" label="Memuat transaksi owner..." />
    <BaseEmpty
      v-else-if="!rentals.length"
      title="Belum ada transaksi"
      description="Transaksi akan muncul ketika penyewa membuat rental pada barang milik Anda."
    />

    <section v-else class="owner-table-shell table-card">
      <div class="owner-table-shell__header">
        <div>
          <p class="eyebrow">Ringkasan transaksi</p>
          <h2>Daftar rental barang owner</h2>
        </div>
        <div class="catalog-chip-row">
          <span class="catalog-chip catalog-chip--active">{{ rentals.length }} transaksi</span>
          <span class="catalog-chip">{{ activeCount }} active</span>
        </div>
      </div>

      <table class="table owner-table">
        <thead>
          <tr>
            <th>Barang</th>
            <th>Penyewa</th>
            <th>Periode</th>
            <th>Status</th>
            <th>Total</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rentals" :key="row.id">
            <td data-label="Barang">
              <div class="owner-table__item">
                <strong>{{ row.item.name }}</strong>
                <span>{{ row.item.category }} · {{ row.quantity }} unit</span>
              </div>
            </td>
            <td data-label="Penyewa">
              <div class="owner-table__item">
                <strong>{{ row.renter.name }}</strong>
                <span>{{ row.renter.email }}</span>
              </div>
            </td>
            <td data-label="Periode">{{ formatDate(row.startDate) }} - {{ formatDate(row.endDate) }}</td>
            <td data-label="Status">
              <span :class="['item-chip', statusChipClass(row.status)]">{{ row.status }}</span>
            </td>
            <td data-label="Total">{{ formatCurrency(row.totalPrice) }}</td>
            <td data-label="Aksi">
              <RouterLink class="btn btn--ghost btn--small" :to="`/rentals/${row.id}`">Lihat</RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { getOwnerRentalsRequest } from '../../api/rentals';
import BaseAlert from '../../components/common/BaseAlert.vue';
import BaseEmpty from '../../components/common/BaseEmpty.vue';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import { extractApiError } from '../../utils/api';
import { formatCurrency, formatDate } from '../../utils/format';

const rentals = ref([]);
const loading = ref(true);
const errorMessage = ref('');

const pendingCount = computed(() => rentals.value.filter((rental) => rental.status === 'PENDING').length);
const activeCount = computed(() => rentals.value.filter((rental) => rental.status === 'ACTIVE').length);
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
    const response = await getOwnerRentalsRequest();
    rentals.value = response.data;
  } catch (error) {
    errorMessage.value = extractApiError(error);
  } finally {
    loading.value = false;
  }
};

onMounted(loadRentals);
</script>
