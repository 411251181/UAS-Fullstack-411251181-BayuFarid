<template>
  <form class="form item-form-panel" @submit.prevent="submitForm">
    <BaseAlert :message="errorMessage" />

    <div class="item-form-panel__hero">
      <div>
        <p class="eyebrow">Inventory editor</p>
        <h3>Susun detail barang dengan rapi</h3>
      </div>
      <p class="muted">Nama, harga, stok, dan status langsung dipakai untuk katalog dan transaksi rental.</p>
    </div>

    <label>
      Nama Barang
      <input v-model="localForm.name" type="text" required />
    </label>

    <label>
      Deskripsi
      <textarea v-model="localForm.description" rows="4" required></textarea>
    </label>

    <div class="form-grid item-form-panel__grid">
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

    <div class="item-form-status-row">
      <button
        type="button"
        class="catalog-chip"
        :class="{ 'catalog-chip--active': localForm.status === 'AVAILABLE' }"
        @click="localForm.status = 'AVAILABLE'"
      >
        AVAILABLE
      </button>
      <button
        type="button"
        class="catalog-chip"
        :class="{ 'catalog-chip--active': localForm.status === 'UNAVAILABLE' }"
        @click="localForm.status = 'UNAVAILABLE'"
      >
        UNAVAILABLE
      </button>
      <button
        type="button"
        class="catalog-chip"
        :class="{ 'catalog-chip--active': localForm.status === 'INACTIVE' }"
        @click="localForm.status = 'INACTIVE'"
      >
        INACTIVE
      </button>
    </div>

    <div class="actions item-form-panel__footer">
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
