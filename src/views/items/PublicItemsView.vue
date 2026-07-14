<template>
  <section class="stack-lg">
    <div class="hero">
      <div>
        <p class="eyebrow">Eco-Share Catalog</p>
        <h1>Sewa alat elektronik bekas secara aman</h1>
        <p class="muted">Frontend Vue terhubung ke backend Eco-Share untuk autentikasi, item, dan transaksi rental.</p>
      </div>
    </div>

    <BaseAlert :message="errorMessage" />
    <LoadingSpinner v-if="loading" label="Memuat katalog barang..." />
    <BaseEmpty
      v-else-if="!items.length"
      title="Belum ada barang tersedia"
      description="Owner belum menambahkan barang dengan status AVAILABLE."
    />
    <div v-else class="grid grid--cards">
      <ItemCard v-for="item in items" :key="item.id" :item="item" />
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getItemsRequest } from '../../api/items';
import BaseAlert from '../../components/common/BaseAlert.vue';
import BaseEmpty from '../../components/common/BaseEmpty.vue';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import ItemCard from '../../components/items/ItemCard.vue';
import { extractApiError } from '../../utils/api';

const items = ref([]);
const loading = ref(true);
const errorMessage = ref('');

const loadItems = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await getItemsRequest();
    items.value = response.data;
  } catch (error) {
    errorMessage.value = extractApiError(error);
  } finally {
    loading.value = false;
  }
};

onMounted(loadItems);
</script>
