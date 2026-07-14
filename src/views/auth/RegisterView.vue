<template>
  <section class="auth-split-layout">
    <div class="auth-split-layout__content">
      <div class="auth-split-layout__intro">
        <p class="eyebrow">Registrasi</p>
        <h1>Buat akun Eco-Share</h1>
        <p class="muted">Masuk ke ekosistem sewa elektronik ramah lingkungan. Role menentukan alur dashboard dan aksi backend yang tersedia.</p>
      </div>

      <div class="auth-feature-list">
        <div class="auth-feature-item">
          <strong>Owner flow</strong>
          <span>Tambah barang, kelola stok, dan pantau rental masuk dari satu dashboard.</span>
        </div>
        <div class="auth-feature-item">
          <strong>Renter flow</strong>
          <span>Jelajahi katalog, kirim rental, dan cek status transaksi secara cepat.</span>
        </div>
      </div>
    </div>

    <BaseCard>
      <div class="section-heading">
        <p class="eyebrow">Onboarding</p>
        <h2>Daftar dan mulai sesi baru</h2>
      </div>
      <RegisterForm @submit="handleRegister" />
    </BaseCard>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router';
import BaseCard from '../../components/common/BaseCard.vue';
import RegisterForm from '../../components/forms/RegisterForm.vue';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const handleRegister = async (payload) => {
  await authStore.register(payload);
  router.push(authStore.user?.role === 'OWNER' ? '/dashboard/owner/items' : '/dashboard/rentals');
};
</script>
