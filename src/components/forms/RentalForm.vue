<template>
  <form class="form" @submit.prevent="submitForm">
    <BaseAlert :message="errorMessage" />

    <div class="form-grid">
      <label>
        Jumlah
        <input v-model.number="form.quantity" type="number" min="1" :max="maxStock" required />
      </label>

      <label>
        Tanggal Mulai
        <input v-model="form.startDate" type="date" required />
      </label>

      <label>
        Tanggal Selesai
        <input v-model="form.endDate" type="date" required />
      </label>
    </div>

    <button class="btn btn--primary" type="submit" :disabled="loading">
      {{ loading ? 'Memproses...' : 'Buat Rental' }}
    </button>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseAlert from '../common/BaseAlert.vue';

const props = defineProps({
  itemId: {
    type: Number,
    required: true,
  },
  maxStock: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['submit']);
const loading = ref(false);
const errorMessage = ref('');
const today = new Date().toISOString().split('T')[0];
const form = reactive({
  quantity: 1,
  startDate: today,
  endDate: today,
});

const submitForm = async () => {
  errorMessage.value = '';
  loading.value = true;

  try {
    await emit('submit', {
      itemId: props.itemId,
      quantity: Number(form.quantity),
      startDate: form.startDate,
      endDate: form.endDate,
    });
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
};
</script>
