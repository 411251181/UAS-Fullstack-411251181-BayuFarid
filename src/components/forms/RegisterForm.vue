<template>
  <form class="form auth-form-panel" @submit.prevent="submitForm">
    <BaseAlert :message="errorMessage" />

    <div class="auth-form-panel__group">
      <label>
        Nama
        <input v-model="form.name" type="text" placeholder="Nama lengkap" autocomplete="name" required />
      </label>

      <label>
        Email
        <input v-model="form.email" type="email" placeholder="email@example.com" autocomplete="email" required />
      </label>

      <label>
        Password
        <input v-model="form.password" type="password" placeholder="Minimal 6 karakter" autocomplete="new-password" required minlength="6" />
      </label>
    </div>

    <div class="auth-role-grid">
      <button
        type="button"
        class="auth-role-card"
        :class="{ 'auth-role-card--active': form.role === 'OWNER' }"
        @click="form.role = 'OWNER'"
      >
        <span class="auth-role-card__title">Owner</span>
        <span class="auth-role-card__copy">Kelola inventaris, pantau rental, terima permintaan penyewaan.</span>
      </button>
      <button
        type="button"
        class="auth-role-card"
        :class="{ 'auth-role-card--active': form.role === 'RENTER' }"
        @click="form.role = 'RENTER'"
      >
        <span class="auth-role-card__title">Renter</span>
        <span class="auth-role-card__copy">Jelajahi katalog, kirim rental, dan pantau transaksi aktif.</span>
      </button>
    </div>

    <label class="auth-form-panel__select">
      Role terpilih
      <select v-model="form.role" required>
        <option value="RENTER">RENTER</option>
        <option value="OWNER">OWNER</option>
      </select>
    </label>

    <div class="auth-form-panel__footer">
      <p class="muted">Registrasi langsung menyimpan sesi dan mengarahkan user ke dashboard sesuai role.</p>
      <button class="btn btn--primary" type="submit" :disabled="loading">
        {{ loading ? 'Memproses...' : 'Buat akun' }}
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
  name: '',
  email: '',
  password: '',
  role: 'RENTER',
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
