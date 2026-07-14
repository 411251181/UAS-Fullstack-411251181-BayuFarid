<template>
  <div class="auth-layout">
    <BaseCard>
      <div class="section-heading">
        <p class="eyebrow">Registrasi</p>
        <h1>Buat akun Eco-Share</h1>
        <p class="muted">Role menentukan akses frontend dan endpoint backend yang bisa dipakai.</p>
      </div>
      <RegisterForm @submit="handleRegister" />
    </BaseCard>
  </div>
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
