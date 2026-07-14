<template>
  <div class="app-shell">
    <AppHeader />
    <main class="container app-main">
      <slot />
    </main>
  </div>
</template>

<script setup>
import AppHeader from './AppHeader.vue';
</script>
