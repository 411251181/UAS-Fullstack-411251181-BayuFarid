<template>
  <section class="stack-lg">
    <div class="section-heading section-heading--row">
      <div>
        <p class="eyebrow">Dashboard Owner</p>
        <h1>Kelola Barang</h1>
        <p class="muted">Endpoint terproteksi [`/api/v1/items`](UTS-Fullstack-411251181-BayuFarid/README.md) dengan role OWNER.</p>
      </div>
      <button class="btn btn--primary" type="button" @click="startCreate">Tambah Barang</button>
    </div>

    <BaseAlert :message="errorMessage" />
    <BaseAlert :message="successMessage" variant="success" />

    <BaseCard>
      <div class="section-heading">
        <h2>{{ editingItem ? 'Edit Barang' : 'Form Barang Baru' }}</h2>
      </div>
      <ItemForm
        :model-value="formState"
        :submit-label="editingItem ? 'Update Barang' : 'Simpan Barang'"
        :show-cancel="Boolean(editingItem)"
        @submit="handleSubmit"
        @cancel="resetForm"
      />
    </BaseCard>

    <LoadingSpinner v-if="loading" label="Memuat barang owner..." />
    <BaseEmpty
      v-else-if="!items.length"
      title="Belum ada barang"
      description="Tambahkan barang pertama untuk membuka transaksi rental."
    />

    <div v-else class="table-card">
      <table class="table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Kategori</th>
            <th>Harga/Hari</th>
            <th>Stok</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in items" :key="row.id">
            <td>{{ row.name }}</td>
            <td>{{ row.category }}</td>
            <td>{{ formatCurrency(row.dailyPrice) }}</td>
            <td>{{ row.stock }}</td>
            <td>{{ row.status }}</td>
            <td>
              <div class="actions actions--inline">
                <button class="btn btn--ghost btn--small" type="button" @click="startEdit(row)">Edit</button>
                <button class="btn btn--danger btn--small" type="button" @click="handleDelete(row.id)">Hapus</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { createItemRequest, deleteItemRequest, getOwnerItemsRequest, updateItemRequest } from '../../api/items';
import BaseAlert from '../../components/common/BaseAlert.vue';
import BaseCard from '../../components/common/BaseCard.vue';
import BaseEmpty from '../../components/common/BaseEmpty.vue';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import ItemForm from '../../components/forms/ItemForm.vue';
import { extractApiError } from '../../utils/api';
import { formatCurrency } from '../../utils/format';

const defaultForm = () => ({
  name: '',
  description: '',
  category: '',
  dailyPrice: 0,
  stock: 0,
  status: 'AVAILABLE',
});

const items = ref([]);
const loading = ref(true);
const errorMessage = ref('');
const successMessage = ref('');
const editingItem = ref(null);
const formState = computed(() => editingItem.value || defaultForm());

const loadItems = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await getOwnerItemsRequest();
    items.value = response.data;
  } catch (error) {
    errorMessage.value = extractApiError(error);
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  editingItem.value = null;
};

const startCreate = () => {
  successMessage.value = '';
  errorMessage.value = '';
  resetForm();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const startEdit = (item) => {
  successMessage.value = '';
  errorMessage.value = '';
  editingItem.value = {
    id: item.id,
    name: item.name,
    description: item.description,
    category: item.category,
    dailyPrice: Number(item.dailyPrice),
    stock: Number(item.stock),
    status: item.status,
  };
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleSubmit = async (payload) => {
  try {
    const response = editingItem.value
      ? await updateItemRequest(editingItem.value.id, payload)
      : await createItemRequest(payload);

    successMessage.value = response.message;
    resetForm();
    await loadItems();
  } catch (error) {
    throw new Error(extractApiError(error));
  }
};

const handleDelete = async (id) => {
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const response = await deleteItemRequest(id);
    successMessage.value = response.message;
    await loadItems();
  } catch (error) {
    errorMessage.value = extractApiError(error);
  }
};

onMounted(loadItems);
</script>
