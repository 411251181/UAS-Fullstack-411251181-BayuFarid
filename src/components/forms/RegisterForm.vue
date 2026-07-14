<template>
  <form class="form" @submit.prevent="submitForm">
    <BaseAlert :message="errorMessage" />

    <label>
      Nama
      <input v-model="form.name" type="text" placeholder="Nama lengkap" required />
    </label>

    <label>
      Email
      <input v-model="form.email" type="email" placeholder="email@example.com" required />
    </label>

    <label>
      Password
      <input v-model="form.password" type="password" placeholder="Minimal 6 karakter" required minlength="6" />
    </label>

    <label>
      Role
      <select v-model="form.role" required>
        <option value="RENTER">RENTER</option>
        <option value="OWNER">OWNER</option>
      </select>
    </label>

    <button class="btn btn--primary" type="submit" :disabled="loading">
      {{ loading ? 'Memproses...' : 'Register' }}
    </button>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseAlert from '../common/BaseAlert.vue';

const emit = defineEmits(['submit']);
const loading = ref(false);
const errorMessage = ref('');
const form = reactive({
  name: '',
  email: '',
  password: '',
  role: 'RENTER',
});

const submitForm = async () => {
  errorMessage.value = '';
  loading.value = true;

  try {
    await emit('submit', { ...form });
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
};
</script>
