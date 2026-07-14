<template>
  <form class="form" @submit.prevent="submitForm">
    <BaseAlert :message="errorMessage" />

    <label>
      Email
      <input v-model="form.email" type="email" placeholder="owner@example.com" required />
    </label>

    <label>
      Password
      <input v-model="form.password" type="password" placeholder="Minimal 6 karakter" required />
    </label>

    <button class="btn btn--primary" type="submit" :disabled="loading">
      {{ loading ? 'Memproses...' : 'Login' }}
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
  email: '',
  password: '',
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
