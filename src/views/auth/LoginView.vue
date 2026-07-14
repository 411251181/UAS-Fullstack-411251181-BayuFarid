<template>
  <section class="auth-split-layout auth-split-layout--compact">
    <div class="auth-split-layout__content">
      <div class="auth-split-layout__intro">
        <p class="eyebrow">Autentikasi</p>
        <h1>Masuk ke Eco-Share</h1>
        <p class="muted">Gunakan akun owner atau renter sesuai data backend. Redirect tetap mengikuti role dan query route aktif.</p>
      </div>

      <div class="auth-feature-list">
        <div class="auth-feature-item">
          <strong>Satu akun, satu role</strong>
          <span>Sistem login membaca role dari backend lalu mengarahkan ke dashboard relevan.</span>
        </div>
        <div class="auth-feature-item">
          <strong>Lanjutkan transaksi</strong>
          <span>Setelah login, renter bisa lanjut rental aktif dan owner bisa cek inventaris.</span>
        </div>
      </div>
    </div>

    <BaseCard>
      <div class="section-heading">
        <p class="eyebrow">Welcome back</p>
        <h2>Masuk ke sesi aktif</h2>
      </div>
      <LoginForm @submit="handleLogin" />
    </BaseCard>
  </section>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import BaseCard from '../../components/common/BaseCard.vue';
import LoginForm from '../../components/forms/LoginForm.vue';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const handleLogin = async (payload) => {
  await authStore.login(payload);
  const fallback = authStore.user?.role === 'OWNER' ? '/dashboard/owner/items' : '/dashboard/rentals';
  router.push(route.query.redirect || fallback);
};
</script>
