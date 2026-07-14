<template>
  <section class="catalog-page stack-lg">
    <section class="catalog-hero">
      <div class="catalog-hero__content">
        <div class="stack-lg">
          <div class="stack-lg">
            <p class="eyebrow">Eco-Share Catalog</p>
            <div class="stack-lg">
              <div>
                <h1>Temukan elektronik siap pakai untuk kebutuhan harian</h1>
                <p class="muted catalog-hero__lead">
                  Sewa perangkat bekas berkualitas dari owner terpercaya. Alur tetap terhubung ke backend Eco-Share untuk stok, autentikasi, dan transaksi rental.
                </p>
              </div>
              <div class="catalog-hero__actions actions actions--wrap">
                <a class="btn btn--primary" href="#catalog-grid">Jelajahi katalog</a>
                <RouterLink class="btn btn--ghost" to="/register">Mulai sebagai renter</RouterLink>
              </div>
            </div>
          </div>

          <div class="catalog-highlight-grid">
            <div class="catalog-highlight-card">
              <span class="catalog-highlight-card__value">{{ availableCount }}</span>
              <span class="catalog-highlight-card__label">Barang tersedia</span>
            </div>
            <div class="catalog-highlight-card">
              <span class="catalog-highlight-card__value">{{ ownerCount }}</span>
              <span class="catalog-highlight-card__label">Owner aktif</span>
            </div>
            <div class="catalog-highlight-card">
              <span class="catalog-highlight-card__value">{{ categoryCount }}</span>
              <span class="catalog-highlight-card__label">Kategori tercatat</span>
            </div>
          </div>
        </div>
      </div>

      <div class="catalog-hero__preview card">
        <div class="catalog-hero__preview-art">
          <span class="catalog-hero__preview-badge">Pilihan minggu ini</span>
          <div>
            <p class="catalog-hero__preview-kicker">Eco-Share Curated</p>
            <h2>{{ featuredItem?.name || 'Perangkat terkurasi untuk produktivitas dan belajar' }}</h2>
            <p class="muted">
              {{ featuredDescription }}
            </p>
          </div>
        </div>

        <div class="catalog-hero__preview-meta">
          <div>
            <span>Harga mulai</span>
            <strong>{{ featuredPrice }}</strong>
          </div>
          <div>
            <span>Stok</span>
            <strong>{{ featuredStock }}</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="catalog-toolbar">
      <div class="catalog-chip-row">
        <button
          v-for="category in categories"
          :key="category"
          type="button"
          class="catalog-chip"
          :class="{ 'catalog-chip--active': activeCategory === category }"
          @click="activeCategory = category"
        >
          {{ category }}
        </button>
      </div>
      <div class="catalog-toolbar__summary muted">
        <span>{{ filteredItems.length }} barang tampil</span>
        <span>•</span>
        <span>{{ availableCount }} siap dirental</span>
      </div>
    </section>

    <BaseAlert :message="errorMessage" />
    <LoadingSpinner v-if="loading" label="Memuat katalog barang..." />
    <BaseEmpty
      v-else-if="!items.length"
      title="Belum ada barang tersedia"
      description="Owner belum menambahkan barang dengan status AVAILABLE."
    />
    <template v-else>
      <section class="section-heading section-heading--row">
        <div>
          <p class="eyebrow">Pilihan perangkat</p>
          <h2 id="catalog-grid">Katalog elektronik Eco-Share</h2>
        </div>
        <p class="muted">Filter kategori ringan, kartu lebih informatif, siap lanjut ke detail barang.</p>
      </section>

      <div v-if="filteredItems.length" class="grid grid--cards grid--catalog">
        <ItemCard v-for="item in filteredItems" :key="item.id" :item="item" />
      </div>
      <BaseEmpty
        v-else
        title="Kategori belum punya barang"
        description="Pilih kategori lain untuk melihat perangkat yang tersedia."
      />

      <section class="catalog-cta card">
        <div>
          <p class="eyebrow">Butuh akses penuh?</p>
          <h2>Daftar sebagai renter untuk kirim rental lebih cepat</h2>
          <p class="muted">Setelah login, kamu bisa buka detail barang, isi tanggal, lalu buat rental langsung dari halaman detail.</p>
        </div>
        <div class="actions actions--wrap">
          <RouterLink class="btn btn--primary" to="/register">Daftar sekarang</RouterLink>
          <RouterLink class="btn btn--ghost" to="/login">Login</RouterLink>
        </div>
      </section>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { getItemsRequest } from '../../api/items';
import BaseAlert from '../../components/common/BaseAlert.vue';
import BaseEmpty from '../../components/common/BaseEmpty.vue';
import LoadingSpinner from '../../components/common/LoadingSpinner.vue';
import ItemCard from '../../components/items/ItemCard.vue';
import { extractApiError } from '../../utils/api';
import { formatCurrency } from '../../utils/format';

const items = ref([]);
const loading = ref(true);
const errorMessage = ref('');
const activeCategory = ref('Semua');

const categories = computed(() => [
  'Semua',
  ...new Set(items.value.map((item) => item.category).filter(Boolean)),
]);

const filteredItems = computed(() => {
  if (activeCategory.value === 'Semua') {
    return items.value;
  }

  return items.value.filter((item) => item.category === activeCategory.value);
});

const featuredItem = computed(() => items.value[0] || null);
const featuredDescription = computed(() => featuredItem.value?.description || 'Kurasi perangkat bekas yang masih layak pakai untuk kerja, belajar, dan kebutuhan rumah tangga.');
const featuredPrice = computed(() => formatCurrency(featuredItem.value?.dailyPrice || 0));
const featuredStock = computed(() => featuredItem.value?.stock ?? 0);
const availableCount = computed(() => items.value.filter((item) => item.status === 'AVAILABLE' && Number(item.stock) > 0).length);
const ownerCount = computed(() => new Set(items.value.map((item) => item.owner?.id || item.owner?.name).filter(Boolean)).size);
const categoryCount = computed(() => new Set(items.value.map((item) => item.category).filter(Boolean)).size);

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
