<template>
  <form class="form auth-form-panel" @submit.prevent="submitForm">
    <BaseAlert :message="errorMessage" />

    <div class="auth-form-panel__group">
      <label>
        Email
        <input v-model="form.email" type="email" placeholder="owner@example.com" autocomplete="email" required />
      </label>

      <label>
        Password
        <input v-model="form.password" type="password" placeholder="Minimal 6 karakter" autocomplete="current-password" required />
      </label>
    </div>

    <div class="auth-login-hints">
      <div class="auth-login-hint-card">
        <span class="auth-login-hint-card__title">Masuk sebagai owner</span>
        <span class="auth-login-hint-card__copy">Akses dashboard barang dan rental milik owner.</span>
      </div>
      <div class="auth-login-hint-card">
        <span class="auth-login-hint-card__title">Masuk sebagai renter</span>
        <span class="auth-login-hint-card__copy">Lanjutkan rental, cek status, dan lihat detail transaksi.</span>
      </div>
    </div>

    <div class="auth-form-panel__footer">
      <p class="muted">Role aktif mengikuti akun backend yang dipakai saat login.</p>
      <button class="btn btn--primary" type="submit" :disabled="loading">
        {{ loading ? 'Memproses...' : 'Masuk' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import BaseAlert from '../common/BaseAlert.vue';

const props = defineProps({
  errorMessage: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['submit']);
const loading = ref(false);
const errorMessage = ref(props.errorMessage);
const form = reactive({
  email: '',
  password: '',
});

watch(
  () => props.errorMessage,
  (value) => {
    errorMessage.value = value;
    loading.value = false;
  },
);

const submitForm = async () => {
  errorMessage.value = '';
  loading.value = true;
  emit('submit', { ...form });
};
</script>
