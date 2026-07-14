<template>
  <header class="header">
    <div class="container header__inner">
      <div class="header__brand-group">
        <RouterLink class="brand" to="/">Eco-Share</RouterLink>
        <nav class="nav nav--primary">
          <RouterLink to="/">Katalog</RouterLink>
          <template v-if="authStore.isAuthenticated">
            <RouterLink v-if="authStore.isOwner" to="/dashboard/owner/items">My Items</RouterLink>
            <RouterLink v-if="authStore.isOwner" to="/dashboard/owner/rentals">My Rentals</RouterLink>
            <RouterLink v-if="authStore.isRenter" to="/dashboard/rentals">My Rentals</RouterLink>
          </template>
        </nav>
      </div>

      <nav class="nav nav--actions">
        <template v-if="authStore.isAuthenticated">
          <span class="header__role-badge">{{ authStore.user?.role }}</span>
          <button class="btn btn--ghost btn--small" type="button" @click="handleLogout">Logout</button>
        </template>
        <template v-else>
          <RouterLink to="/auth" class="btn btn--primary btn--small header__cta">Login / Register</RouterLink>
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
  router.push('/auth');
};
</script>
