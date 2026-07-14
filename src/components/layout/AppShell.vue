<template>
  <div class="app-shell">
    <AppHeader />
    <main class="container app-main">
      <slot />
    </main>
    <footer class="app-footer">
      <div class="container app-footer__inner">
        <div>
          <p class="brand app-footer__brand">Eco-Share</p>
          <p class="muted app-footer__copy">Solusi sewa elektronik ramah lingkungan untuk owner dan renter.</p>
        </div>
        <div class="app-footer__links">
          <span>About Us</span>
          <span>Sustainability</span>
          <span>Privacy Policy</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import AppHeader from './AppHeader.vue';
</script>
