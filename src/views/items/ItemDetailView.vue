<template>
  <section class="item-detail-page stack-lg">
    <BaseAlert :message="errorMessage" />
    <LoadingSpinner v-if="loading" label="Memuat detail barang..." />

    <template v-else-if="item">
      <section class="item-detail-hero card">
        <div class="item-detail-hero__media">
          <div class="item-detail-hero__chip-row">
            <span class="item-chip item-chip--soft">{{ item.category }}</span>
            <span :class="['item-chip', availabilityClass]">{{ availabilityLabel }}</span>
          </div>
          <div class="item-detail-hero__media-copy">
            <p class="item-detail-hero__eyebrow">Detail Barang</p>
            <h1>{{ item.name }}</h1>
            <p class="muted">{{ item.description }}</p>
          </div>
        </div>

        <div class="item-detail-hero__summary">
          <div class="item-detail-hero__title-row">
            <div>
              <p class="item-detail-hero__owner-label">Disediakan oleh</p>
              <h2>{{ item.owner?.name || 'Owner Eco-Share' }}</h2>
            </div>
            <div class="item-detail-hero__price">
              <strong>{{ formatCurrency(item.dailyPrice) }}</strong>
              <span>/hari</span>
            </div>
          </div>

          <div class="item-detail-stat-row">
            <div class="item-detail-stat-card">
              <span>Stok aktif</span>
              <strong>{{ item.stock }}</strong>
            </div>
            <div class="item-detail-stat-card">
              <span>Status</span>
              <strong>{{ item.status }}</strong>
            </div>
          </div>

          <dl class="item-detail-owner-grid">
            <div>
              <dt>Email owner</dt>
              <dd>{{ item.owner?.email || '-' }}</dd>
            </div>
            <div>
              <dt>Kategori</dt>
              <dd>{{ item.category }}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section class="item-detail-content">
        <BaseCard>
          <div class="section-heading">
            <p class="eyebrow">Ringkasan rental</p>
            <h2>Atur tanggal dan jumlah perangkat</h2>
            <p class="muted">Validasi stok, role, dan tanggal tetap diproses backend saat submit.</p>
          </div>
          <BaseAlert :message="successMessage" variant="success" />
          <RentalForm
            v-if="canRent"
            :item-id="Number(item.id)"
            :max-stock="Number(item.stock)"
            @submit="handleCreateRental"
          />
          <div v-else class="item-detail-access-note">
            <h3>Informasi akses</h3>
            <p v-if="!authStore.isAuthenticated">Login sebagai RENTER untuk membuat rental dari barang ini.</p>
            <p v-else-if="authStore.isOwner">Akun OWNER tidak bisa membuat rental.</p>
            <p v-else>Barang belum bisa dirental karena stok habis atau status belum AVAILABLE.</p>
          </div>
        </BaseCard>

        <aside class="item-detail-sidebar">
          <BaseCard>
            <div class="section-heading">
              <p class="eyebrow">Kenapa pilih Eco-Share</p>
              <h3>Flow singkat sebelum checkout</h3>
            </div>
            <ol class="item-detail-checklist">
              <li>Pilih jumlah unit sesuai stok tersedia.</li>
              <li>Tentukan tanggal mulai dan tanggal selesai.</li>
              <li>Kirim rental lalu lanjut ke halaman detail transaksi.</li>
            </ol>
          </BaseCard>
        </aside>
      </section>

      <section class="item-detail-sticky-bar">
        <div>
          <span>{{ availabilityLabel }}</span>
          <strong>{{ formatCurrency(item.dailyPrice) }}/hari</strong>
        </div>
        <a v-if="canRent" class="btn btn--primary" href="#rental-form">Buat rental</a>
        <RouterLink v-else class="btn btn--ghost" to="/login">Login renter</RouterLink>
      </section>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
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

const canRent = computed(() => (
  authStore.isAuthenticated
  && authStore.isRenter
  && item.value?.status === 'AVAILABLE'
  && Number(item.value?.stock) > 0
));

const availabilityLabel = computed(() => (
  item.value?.status === 'AVAILABLE' && Number(item.value?.stock) > 0
    ? 'Siap dirental'
    : 'Belum tersedia'
));

const availabilityClass = computed(() => (
  item.value?.status === 'AVAILABLE' && Number(item.value?.stock) > 0
    ? 'item-chip--success'
    : 'item-chip--muted'
));

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
