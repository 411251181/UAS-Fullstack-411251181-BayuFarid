<template>
  <section class="stack-lg">
    <BaseAlert :message="errorMessage" />
    <LoadingSpinner v-if="loading" label="Memuat detail barang..." />

    <template v-else-if="item">
      <BaseCard>
        <div class="detail-header">
          <div>
            <p class="badge">{{ item.category }}</p>
            <h1>{{ item.name }}</h1>
            <p class="muted">{{ item.description }}</p>
          </div>
          <div class="price-panel">
            <strong>{{ formatCurrency(item.dailyPrice) }}</strong>
            <span>/hari</span>
          </div>
        </div>

        <dl class="meta-grid">
          <div><dt>Stok</dt><dd>{{ item.stock }}</dd></div>
          <div><dt>Status</dt><dd>{{ item.status }}</dd></div>
          <div><dt>Pemilik</dt><dd>{{ item.owner?.name }}</dd></div>
          <div><dt>Email Pemilik</dt><dd>{{ item.owner?.email }}</dd></div>
        </dl>
      </BaseCard>

      <BaseCard v-if="authStore.isAuthenticated && authStore.isRenter && item.status === 'AVAILABLE' && item.stock > 0">
        <div class="section-heading">
          <h2>Buat Rental</h2>
          <p class="muted">Backend akan validasi stok, role, dan tanggal rental.</p>
        </div>
        <BaseAlert :message="successMessage" variant="success" />
        <RentalForm :item-id="Number(item.id)" :max-stock="Number(item.stock)" @submit="handleCreateRental" />
      </BaseCard>

      <BaseCard v-else>
        <div class="empty-state left">
          <h3>Informasi Akses</h3>
          <p v-if="!authStore.isAuthenticated">Login sebagai RENTER untuk membuat rental.</p>
          <p v-else-if="authStore.isOwner">Akun OWNER tidak bisa membuat rental.</p>
          <p v-else>Barang tidak dapat dirental saat ini karena stok atau status tidak memenuhi syarat.</p>
        </div>
      </BaseCard>
    </template>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getItemDetailRequest } from '../../api/items';
import { createRentalRequest } from '../../api/rentals';
import BaseAlert from '../../components/common/BaseAlert.vue';
import BaseCard from '../../components/common/BaseCard.vue';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import RentalForm from '../../components/forms/RentalForm.vue';
import { useAuthStore } from '../../stores/auth';
import { extractApiError } from '../../utils/api';
import { formatCurrency } from '../../utils/format';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const item = ref(null);
const loading = ref(true);
const errorMessage = ref('');
const successMessage = ref('');

const loadItem = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await getItemDetailRequest(route.params.id);
    item.value = response.data;
  } catch (error) {
    errorMessage.value = extractApiError(error);
  } finally {
    loading.value = false;
  }
};

const handleCreateRental = async (payload) => {
  try {
    const response = await createRentalRequest(payload);
    successMessage.value = response.message;
    router.push(`/rentals/${response.data.id}`);
  } catch (error) {
    throw new Error(extractApiError(error));
  }
};

onMounted(loadItem);
</script>
