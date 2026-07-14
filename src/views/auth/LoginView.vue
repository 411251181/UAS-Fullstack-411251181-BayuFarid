<template>
  <div class="auth-layout">
    <BaseCard>
      <div class="section-heading">
        <p class="eyebrow">Autentikasi</p>
        <h1>Masuk ke Eco-Share</h1>
        <p class="muted">Gunakan akun owner atau renter sesuai role pada backend.</p>
      </div>
      <LoginForm @submit="handleLogin" />
    </BaseCard>
  </div>
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
