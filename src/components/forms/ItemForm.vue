<template>
  <form class="form" @submit.prevent="submitForm">
    <BaseAlert :message="errorMessage" />

    <label>
      Nama Barang
      <input v-model="localForm.name" type="text" required />
    </label>

    <label>
      Deskripsi
      <textarea v-model="localForm.description" rows="4" required></textarea>
    </label>

    <div class="form-grid">
      <label>
        Kategori
        <input v-model="localForm.category" type="text" required />
      </label>

      <label>
        Harga Harian
        <input v-model.number="localForm.dailyPrice" type="number" min="1" required />
      </label>

      <label>
        Stok
        <input v-model.number="localForm.stock" type="number" min="0" required />
      </label>

      <label>
        Status
        <select v-model="localForm.status">
          <option value="AVAILABLE">AVAILABLE</option>
          <option value="UNAVAILABLE">UNAVAILABLE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </label>
    </div>

    <div class="actions">
      <button class="btn btn--primary" type="submit" :disabled="loading">
        {{ loading ? 'Menyimpan...' : submitLabel }}
      </button>
      <button v-if="showCancel" class="btn btn--ghost" type="button" @click="$emit('cancel')">Batal</button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import BaseAlert from '../common/BaseAlert.vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      name: '',
      description: '',
      category: '',
      dailyPrice: 0,
      stock: 0,
      status: 'AVAILABLE',
    }),
  },
  submitLabel: {
    type: String,
    default: 'Simpan Barang',
  },
  showCancel: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['submit', 'cancel']);
const loading = ref(false);
const errorMessage = ref('');
const localForm = reactive({ ...props.modelValue });

watch(
  () => props.modelValue,
  (value) => Object.assign(localForm, value),
  { deep: true },
);

const submitForm = async () => {
  errorMessage.value = '';
  loading.value = true;

  try {
    await emit('submit', {
      ...localForm,
      dailyPrice: Number(localForm.dailyPrice),
      stock: Number(localForm.stock),
    });
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
};
</script>
