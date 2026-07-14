<template>
  <section class="auth-split-layout auth-split-layout--unified">
    <div class="auth-split-layout__content">
      <div class="auth-split-layout__intro">
        <p class="eyebrow">Autentikasi</p>
        <h1>Akses Eco-Share dari satu panel</h1>
        <p class="muted">Masuk atau buat akun baru tanpa pindah halaman. Alur tetap mengikuti role backend dan redirect route aktif.</p>
      </div>

      <div class="auth-feature-list">
        <div class="auth-feature-item">
          <strong>Alur cepat</strong>
          <span>Pilih login untuk lanjut sesi aktif atau register untuk onboarding owner dan renter.</span>
        </div>
        <div class="auth-feature-item">
          <strong>Satu titik masuk</strong>
          <span>Navbar guest sekarang mengarah ke satu halaman auth terpadu yang konsisten dengan shell aplikasi.</span>
        </div>
      </div>
    </div>

    <BaseCard class="auth-panel-shell">
      <div class="section-heading auth-panel-shell__heading">
        <p class="eyebrow">Welcome</p>
        <h2>{{ activeTab === 'login' ? 'Masuk ke sesi aktif' : 'Buat akun Eco-Share' }}</h2>
      </div>

      <div class="auth-switch" role="tablist" aria-label="Form autentikasi">
        <button
          type="button"
          class="auth-switch__tab"
          :class="{ 'auth-switch__tab--active': activeTab === 'login' }"
          :aria-selected="String(activeTab === 'login')"
          @click="setTab('login')"
        >
          Login
        </button>
        <button
          type="button"
          class="auth-switch__tab"
          :class="{ 'auth-switch__tab--active': activeTab === 'register' }"
          :aria-selected="String(activeTab === 'register')"
          @click="setTab('register')"
        >
          Register
        </button>
      </div>

      <div class="auth-panel-shell__body">
        <LoginForm v-if="activeTab === 'login'" @submit="handleLogin" />
        <RegisterForm v-else @submit="handleRegister" />
      </div>
    </BaseCard>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseCard from '../../components/common/BaseCard.vue';
import LoginForm from '../../components/forms/LoginForm.vue';
import RegisterForm from '../../components/forms/RegisterForm.vue';
import { useAuthStore } from '../../stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const activeTab = computed(() => (route.query.tab === 'register' ? 'register' : 'login'));

const setTab = (tab) => {
  router.replace({
    name: 'auth',
    query: {
      ...route.query,
      tab,
    },
  });
};

const resolveFallback = () => (authStore.user?.role === 'OWNER' ? '/dashboard/owner/items' : '/dashboard/rentals');

const handleLogin = async (payload) => {
  await authStore.login(payload);
  router.push(route.query.redirect || resolveFallback());
};

const handleRegister = async (payload) => {
  await authStore.register(payload);
  router.push(route.query.redirect || resolveFallback());
};
</script>
