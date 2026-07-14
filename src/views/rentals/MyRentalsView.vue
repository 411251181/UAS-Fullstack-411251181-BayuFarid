<template>
  <section class="stack-lg">
    <div class="section-heading">
      <p class="eyebrow">Dashboard Renter</p>
      <h1>Riwayat Rental Saya</h1>
      <p class="muted">Melihat transaksi, detail, dan aksi return atau cancel sesuai backend.</p>
    </div>

    <BaseAlert :message="errorMessage" />
    <BaseAlert :message="successMessage" variant="success" />
    <LoadingSpinner v-if="loading" label="Memuat rental saya..." />
    <BaseEmpty
      v-else-if="!rentals.length"
      title="Belum ada rental"
      description="Pilih barang dari katalog lalu buat rental sebagai penyewa."
    />

    <div v-else class="grid">
      <BaseCard v-for="rental in rentals" :key="rental.id">
        <div class="rental-card">
          <div class="detail-header">
            <div>
              <p class="badge">{{ rental.status }}</p>
              <h3>{{ rental.item.name }}</h3>
              <p class="muted">{{ rental.item.category }}</p>
            </div>
            <strong>{{ formatCurrency(rental.totalPrice) }}</strong>
          </div>

          <dl class="meta-grid">
            <div><dt>Jumlah</dt><dd>{{ rental.quantity }}</dd></div>
            <div><dt>Mulai</dt><dd>{{ formatDate(rental.startDate) }}</dd></div>
            <div><dt>Selesai</dt><dd>{{ formatDate(rental.endDate) }}</dd></div>
            <div><dt>Pemilik</dt><dd>{{ rental.item.owner.name }}</dd></div>
          </dl>

          <div class="actions actions--wrap">
            <RouterLink class="btn btn--ghost" :to="`/rentals/${rental.id}`">Detail</RouterLink>
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
          </div>
        </div>
      </BaseCard>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
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
