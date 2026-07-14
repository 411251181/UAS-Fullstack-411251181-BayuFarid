<template>
  <header class="header">
    <div class="container header__inner">
      <RouterLink class="brand" to="/">Eco-Share</RouterLink>

      <nav class="nav">
        <RouterLink to="/">Katalog</RouterLink>
        <template v-if="authStore.isAuthenticated">
          <RouterLink v-if="authStore.isOwner" to="/dashboard/owner/items">Barang Saya</RouterLink>
          <RouterLink v-if="authStore.isOwner" to="/dashboard/owner/rentals">Transaksi Owner</RouterLink>
          <RouterLink v-if="authStore.isRenter" to="/dashboard/rentals">Rental Saya</RouterLink>
          <button class="btn btn--ghost btn--small" type="button" @click="handleLogout">Logout</button>
        </template>
        <template v-else>
          <RouterLink to="/login">Login</RouterLink>
          <RouterLink to="/register" class="btn btn--primary btn--small">Register</RouterLink>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
