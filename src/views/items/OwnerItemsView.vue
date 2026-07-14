<template>
  <section class="owner-dashboard stack-lg">
    <section class="section-heading section-heading--row">
      <div>
        <p class="eyebrow">Dashboard Owner</p>
        <h1>Kelola Barang</h1>
        <p class="muted">Kelola inventaris owner, pantau stok aktif, dan buka editor modal untuk tambah atau ubah barang.</p>
      </div>
      <button class="btn btn--primary" type="button" @click="startCreate">Tambah Barang</button>
    </section>

    <div class="owner-stats-grid">
      <div class="owner-stat-card">
        <span>Total barang</span>
        <strong>{{ items.length }}</strong>
      </div>
      <div class="owner-stat-card">
        <span>Siap dirental</span>
        <strong>{{ availableCount }}</strong>
      </div>
      <div class="owner-stat-card">
        <span>Total stok</span>
        <strong>{{ totalStock }}</strong>
      </div>
      <div class="owner-stat-card owner-stat-card--accent">
        <span>Nilai katalog / hari</span>
        <strong>{{ totalDailyValue }}</strong>
      </div>
    </div>

    <BaseAlert :message="errorMessage" />
    <BaseAlert :message="successMessage" variant="success" />

    <section v-if="showFormPanel" class="owner-modal-shell">
      <div class="owner-modal-shell__backdrop" @click="resetForm"></div>
      <BaseCard>
        <div class="section-heading section-heading--row owner-modal-shell__header">
          <div>
            <p class="eyebrow">Inventory editor</p>
            <h2>{{ editingItem ? 'Edit Barang' : 'Form Barang Baru' }}</h2>
          </div>
          <button class="btn btn--ghost btn--small" type="button" @click="resetForm">Tutup</button>
        </div>
        <ItemForm
          :model-value="formState"
          :submit-label="editingItem ? 'Update Barang' : 'Simpan Barang'"
          :show-cancel="true"
          @submit="handleSubmit"
          @cancel="resetForm"
        />
      </BaseCard>
    </section>

    <LoadingSpinner v-if="loading" label="Memuat barang owner..." />
    <BaseEmpty
      v-else-if="!items.length"
      title="Belum ada barang"
      description="Tambahkan barang pertama untuk membuka transaksi rental."
    />

    <template v-else>
      <section class="owner-table-shell table-card">
        <div class="owner-table-shell__header">
          <div>
            <p class="eyebrow">Inventaris aktif</p>
            <h2>Daftar barang owner</h2>
          </div>
          <div class="catalog-chip-row">
            <span class="catalog-chip catalog-chip--active">{{ items.length }} item</span>
            <span class="catalog-chip">{{ availableCount }} available</span>
          </div>
        </div>

        <table class="table owner-table">
          <thead>
            <tr>
              <th>Barang</th>
              <th>Status</th>
              <th>Harga/Hari</th>
              <th>Stok</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in items" :key="row.id">
              <td data-label="Barang">
                <div class="owner-table__item">
                  <strong>{{ row.name }}</strong>
                  <span>{{ row.category }}</span>
                </div>
              </td>
              <td data-label="Status">
                <span :class="['item-chip', row.status === 'AVAILABLE' ? 'item-chip--success' : 'item-chip--muted']">
                  {{ row.status }}
                </span>
              </td>
              <td data-label="Harga/Hari">{{ formatCurrency(row.dailyPrice) }}</td>
              <td data-label="Stok">{{ row.stock }}</td>
              <td data-label="Aksi">
                <div class="actions actions--inline">
                  <button class="btn btn--ghost btn--small" type="button" @click="startEdit(row)">Edit</button>
                  <button class="btn btn--danger btn--small" type="button" @click="handleDelete(row.id)">Hapus</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>
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
const showFormPanel = ref(false);
const formState = computed(() => editingItem.value || defaultForm());
const availableCount = computed(() => items.value.filter((item) => item.status === 'AVAILABLE' && Number(item.stock) > 0).length);
const totalStock = computed(() => items.value.reduce((sum, item) => sum + Number(item.stock || 0), 0));
const totalDailyValue = computed(() => formatCurrency(items.value.reduce((sum, item) => sum + Number(item.dailyPrice || 0), 0)));

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
  showFormPanel.value = false;
};

const startCreate = () => {
  successMessage.value = '';
  errorMessage.value = '';
  editingItem.value = null;
  showFormPanel.value = true;
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
  showFormPanel.value = true;
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
