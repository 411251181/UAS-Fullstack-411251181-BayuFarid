<template>
  <section class="stack-lg">
    <div class="section-heading">
      <p class="eyebrow">Dashboard Owner</p>
      <h1>Transaksi Barang Saya</h1>
      <p class="muted">Pantau seluruh rental untuk barang yang Anda miliki.</p>
    </div>

    <BaseAlert :message="errorMessage" />
    <LoadingSpinner v-if="loading" label="Memuat transaksi owner..." />
    <BaseEmpty
      v-else-if="!rentals.length"
      title="Belum ada transaksi"
      description="Transaksi akan muncul ketika penyewa membuat rental pada barang milik Anda."
    />

    <div v-else class="table-card">
      <table class="table">
        <thead>
          <tr>
            <th>Barang</th>
            <th>Penyewa</th>
            <th>Jumlah</th>
            <th>Periode</th>
            <th>Status</th>
            <th>Total</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rentals" :key="row.id">
            <td>{{ row.item.name }}</td>
            <td>{{ row.renter.name }}</td>
            <td>{{ row.quantity }}</td>
            <td>{{ formatDate(row.startDate) }} - {{ formatDate(row.endDate) }}</td>
            <td>{{ row.status }}</td>
            <td>{{ formatCurrency(row.totalPrice) }}</td>
            <td>
              <RouterLink class="btn btn--ghost btn--small" :to="`/rentals/${row.id}`">Lihat</RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
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
