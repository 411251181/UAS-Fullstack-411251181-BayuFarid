<template>
  <AppShell>
    <RouterView />
  </AppShell>
</template>

<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import AppShell from './components/layout/AppShell.vue';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();

onMounted(() => {
  authStore.initialize();
});
</script>
