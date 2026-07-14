<template>
  <header class="header">
    <div class="container header__inner">
      <div class="header__brand-group">
        <RouterLink class="brand" to="/">
          <MonitorSmartphone :size="18" />
          <span>Eco-Share</span>
        </RouterLink>
        <nav class="nav nav--primary">
          <RouterLink class="nav-link" to="/">
            <LayoutGrid :size="16" />
            <span>Katalog</span>
          </RouterLink>
          <template v-if="authStore.isAuthenticated">
            <RouterLink v-if="authStore.isOwner" class="nav-link" to="/dashboard/owner/items">
              <PackageSearch :size="16" />
              <span>My Items</span>
            </RouterLink>
            <RouterLink v-if="authStore.isOwner" class="nav-link" to="/dashboard/owner/rentals">
              <ReceiptText :size="16" />
              <span>My Rentals</span>
            </RouterLink>
            <RouterLink v-if="authStore.isRenter" class="nav-link" to="/dashboard/rentals">
              <ReceiptText :size="16" />
              <span>My Rentals</span>
            </RouterLink>
          </template>
        </nav>
      </div>

      <nav class="nav nav--actions">
        <template v-if="authStore.isAuthenticated">
          <span class="header__role-badge">
            <BadgeCheck :size="14" />
            <span>{{ authStore.user?.role }}</span>
          </span>
          <button class="btn btn--ghost btn--small btn--icon" type="button" @click="handleLogout">
            <LogOut :size="16" />
            <span>Logout</span>
          </button>
        </template>
        <template v-else>
          <RouterLink to="/auth" class="btn btn--primary btn--small btn--icon header__cta">
            <CircleUserRound :size="16" />
            <span>Login / Register</span>
          </RouterLink>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { BadgeCheck, CircleUserRound, LayoutGrid, LogOut, MonitorSmartphone, PackageSearch, ReceiptText } from '@lucide/vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/auth');
};
</script>
