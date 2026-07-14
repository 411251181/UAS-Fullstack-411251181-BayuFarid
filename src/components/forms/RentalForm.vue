<template>
  <form id="rental-form" class="form rental-form-panel" @submit.prevent="submitForm">
    <BaseAlert :message="errorMessage" />

    <div class="rental-form-panel__summary">
      <div>
        <span>Stok tersedia</span>
        <strong>{{ maxStock }} unit</strong>
      </div>
      <div>
        <span>Minimum rental</span>
        <strong>1 hari</strong>
      </div>
    </div>

    <div class="form-grid rental-form-panel__grid">
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

    <div class="rental-form-panel__footer">
      <p class="muted">Pastikan tanggal sesuai kebutuhan. Backend akan cek ketersediaan final saat submit.</p>
      <button class="btn btn--primary" type="submit" :disabled="loading">
        {{ loading ? 'Memproses...' : 'Buat Rental' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
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
  errorMessage: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['submit']);
const loading = ref(false);
const errorMessage = ref(props.errorMessage);
const today = new Date().toISOString().split('T')[0];
const form = reactive({
  quantity: 1,
  startDate: today,
  endDate: today,
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
  emit('submit', {
    itemId: props.itemId,
    quantity: Number(form.quantity),
    startDate: form.startDate,
    endDate: form.endDate,
  });
};
</script>
