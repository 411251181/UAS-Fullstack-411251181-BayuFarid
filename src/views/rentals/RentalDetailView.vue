<template>
  <section class="stack-lg">
    <BaseAlert :message="errorMessage" />
    <BaseAlert :message="successMessage" variant="success" />
    <LoadingSpinner v-if="loading" label="Memuat detail rental..." />

    <template v-else-if="rental">
      <BaseCard>
        <div class="detail-header">
          <div>
            <p class="badge">{{ rental.status }}</p>
            <h1>Rental #{{ rental.id }}</h1>
            <p class="muted">{{ rental.item.name }} · {{ rental.item.category }}</p>
          </div>
          <strong>{{ formatCurrency(rental.totalPrice) }}</strong>
        </div>

        <dl class="meta-grid">
          <div><dt>Penyewa</dt><dd>{{ rental.renter.name }}</dd></div>
          <div><dt>Email Penyewa</dt><dd>{{ rental.renter.email }}</dd></div>
          <div><dt>Pemilik</dt><dd>{{ rental.item.owner.name }}</dd></div>
          <div><dt>Email Pemilik</dt><dd>{{ rental.item.owner.email }}</dd></div>
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
          <h2>Riwayat Rental</h2>
          <p class="muted">Audit trail transaksi dari backend.</p>
        </div>
        <ul class="timeline">
          <li v-for="history in rental.histories" :key="history.id">
            <strong>{{ history.action }}</strong>
            <span>{{ history.note || '-' }}</span>
            <small>{{ formatDate(history.createdAt) }}</small>
          </li>
        </ul>
      </BaseCard>
    </template>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
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
