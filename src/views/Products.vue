<template>
  <div>
    <v-row>
    <!-- Header Card -->
    <v-col cols="12">
      <v-card class="border-subtle overflow-hidden">
        <!-- Accent Strip -->
        <div class="header-accent-strip"></div>
        <div class="pa-5 pa-md-6">
          <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center">
            <div>
              <h2 class="text-h5 font-weight-black">Manajemen Produk</h2>
              <p class="text-body-2 text-medium-emphasis mt-1">Kelola daftar produk, stok, dan harga barang toko Anda</p>
            </div>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              size="large"
              class="text-capitalize font-weight-bold mt-4 mt-sm-0 gradient-primary"
              @click="openAddDialog"
              elevation="2"
            >
              Tambah Produk
            </v-btn>
          </div>

          <v-divider class="my-5 opacity-10"></v-divider>

          <!-- Filters -->
          <v-row class="align-center">
            <v-col cols="12" sm="5" md="4">
              <v-text-field
                v-model="searchQuery"
                placeholder="Cari produk..."
                prepend-inner-icon="mdi-magnify"
                density="comfortable"
                hide-details
                clearable
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="4" md="3">
              <v-select
                v-model="sortBy"
                :items="sortOptions"
                label="Urutkan"
                density="comfortable"
                hide-details
              ></v-select>
            </v-col>

            <v-spacer></v-spacer>

            <v-col cols="auto" class="d-flex align-center">
              <v-btn-toggle v-model="viewMode" mandatory color="primary" density="comfortable">
                <v-btn value="table" icon="mdi-format-list-bulleted" size="small"></v-btn>
                <v-btn value="grid" icon="mdi-view-grid-outline" size="small"></v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>

          <!-- Stock Filters -->
          <div class="d-flex align-center flex-wrap gap-2 mt-4">
            <span class="text-caption text-medium-emphasis font-weight-bold mr-1">Filter:</span>
            <v-chip-group v-model="stockFilter" mandatory color="primary">
              <v-chip value="all" filter variant="tonal" size="small">Semua ({{ products.length }})</v-chip>
              <v-chip value="low" filter variant="tonal" size="small" color="error">Stok Menipis</v-chip>
              <v-chip value="safe" filter variant="tonal" size="small" color="success">Stok Aman</v-chip>
            </v-chip-group>
          </div>
        </div>
      </v-card>
    </v-col>

    <!-- Loading -->
    <v-col cols="12" v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="56" width="5" class="mb-4"></v-progress-circular>
      <p class="text-medium-emphasis text-body-2">Memuat data produk...</p>
    </v-col>

    <!-- Empty State -->
    <v-col cols="12" v-else-if="filteredProducts.length === 0" class="text-center py-12">
      <v-avatar size="80" class="bg-soft-primary mb-4">
        <v-icon icon="mdi-package-variant" size="40" color="primary"></v-icon>
      </v-avatar>
      <h3 class="text-h6 font-weight-bold">Produk Tidak Ditemukan</h3>
      <p class="text-medium-emphasis text-body-2 mt-1">Coba sesuaikan kata kunci pencarian atau filter Anda.</p>
      <v-btn color="primary" variant="tonal" class="mt-4 text-capitalize" @click="resetFilters">Reset Filter</v-btn>
    </v-col>

    <!-- Table View -->
    <v-col cols="12" v-else-if="viewMode === 'table'">
      <v-card class="border-subtle overflow-hidden">
        <v-table hover>
          <thead>
            <tr>
              <th class="font-weight-bold text-caption text-uppercase text-medium-emphasis" style="letter-spacing: 0.05em;">ID</th>
              <th class="font-weight-bold text-caption text-uppercase text-medium-emphasis" style="letter-spacing: 0.05em;">Nama Produk</th>
              <th class="font-weight-bold text-caption text-uppercase text-medium-emphasis" style="letter-spacing: 0.05em;">Deskripsi</th>
              <th class="font-weight-bold text-caption text-uppercase text-medium-emphasis" style="letter-spacing: 0.05em;">Harga</th>
              <th class="font-weight-bold text-caption text-uppercase text-medium-emphasis" style="letter-spacing: 0.05em;">Stok</th>
              <th class="font-weight-bold text-caption text-uppercase text-medium-emphasis text-right" style="letter-spacing: 0.05em;">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in filteredProducts"
              :key="product.id"
              class="cursor-pointer hover-row"
              @click="openDetailDialog(product)"
            >
              <td class="font-weight-bold text-primary">#{{ product.id }}</td>
              <td>
                <div class="d-flex align-center">
                  <v-avatar size="32" rounded="lg" class="bg-soft-primary mr-2">
                    <v-icon icon="mdi-package-variant-closed" color="primary" size="16"></v-icon>
                  </v-avatar>
                  <span class="font-weight-bold">{{ product.name }}</span>
                </div>
              </td>
              <td class="desc-cell text-medium-emphasis">{{ product.description || '-' }}</td>
              <td class="font-weight-bold">Rp {{ formatRupiah(product.price) }}</td>
              <td>
                <v-chip
                  :color="product.stock < 10 ? 'error' : 'success'"
                  size="small"
                  label
                  variant="tonal"
                  class="font-weight-bold"
                >
                  {{ product.stock }} pcs
                </v-chip>
              </td>
              <td class="text-right" @click.stop>
                <v-btn icon="mdi-pencil-outline" variant="text" color="primary" size="small" @click="openEditDialog(product)"></v-btn>
                <v-btn icon="mdi-trash-can-outline" variant="text" color="error" size="small" @click="confirmDelete(product)"></v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-col>

    <!-- Grid View -->
    <v-col
      cols="12" sm="6" md="4" lg="3"
      v-else
      v-for="product in filteredProducts"
      :key="'grid-' + product.id"
    >
      <v-card
        class="border-subtle overflow-hidden card-hover-lift h-100 d-flex flex-column"
        @click="openDetailDialog(product)"
      >
        <!-- Product Visual -->
        <div class="product-visual d-flex align-center justify-center py-8">
          <v-avatar size="60" class="gradient-primary elevation-4">
            <v-icon icon="mdi-package-variant-closed" color="white" size="28"></v-icon>
          </v-avatar>
        </div>

        <v-card-item class="pa-4 flex-grow-1">
          <div class="d-flex justify-space-between align-start mb-1">
            <h3 class="text-subtitle-2 font-weight-bold product-title">{{ product.name }}</h3>
            <v-chip size="x-small" color="primary" variant="outlined" class="font-weight-bold ml-2">#{{ product.id }}</v-chip>
          </div>
          <p class="text-caption text-medium-emphasis desc-grid-cell mb-3">
            {{ product.description || 'Tidak ada deskripsi.' }}
          </p>

          <div class="d-flex justify-space-between align-center mt-auto">
            <div>
              <span class="text-caption text-medium-emphasis">Harga</span>
              <div class="text-subtitle-1 font-weight-black text-primary">Rp {{ formatRupiah(product.price) }}</div>
            </div>
            <v-chip :color="product.stock < 10 ? 'error' : 'success'" size="small" variant="tonal" class="font-weight-bold">
              {{ product.stock }} pcs
            </v-chip>
          </div>
        </v-card-item>

        <v-divider></v-divider>

        <v-card-actions class="pa-2">
          <v-spacer></v-spacer>
          <v-btn icon="mdi-pencil-outline" variant="text" color="primary" size="small" @click.stop="openEditDialog(product)"></v-btn>
          <v-btn icon="mdi-trash-can-outline" variant="text" color="error" size="small" @click.stop="confirmDelete(product)"></v-btn>
        </v-card-actions>
      </v-card>
    </v-col>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="formDialog" max-width="500px" persistent>
      <v-card class="pa-2 overflow-hidden">
        <div class="gradient-primary pa-5 text-white">
          <h3 class="text-h6 font-weight-bold">
            <v-icon :icon="isEdit ? 'mdi-pencil' : 'mdi-plus-circle'" class="mr-2"></v-icon>
            {{ isEdit ? 'Ubah Data Produk' : 'Tambah Produk Baru' }}
          </h3>
        </div>

        <v-card-text class="pt-5 px-5">
          <v-form ref="formRef" @submit.prevent="saveProduct">
            <v-text-field v-model="form.name" label="Nama Produk" required class="mb-3"></v-text-field>
            <v-textarea v-model="form.description" label="Deskripsi Produk" rows="3" class="mb-3"></v-textarea>
            <v-row>
              <v-col cols="6">
                <v-text-field v-model.number="form.price" label="Harga (Rp)" type="number" prefix="Rp" required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model.number="form.stock" label="Stok Barang" type="number" required></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-5 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" class="text-capitalize font-weight-bold" @click="formDialog = false">Batal</v-btn>
          <v-btn color="primary" variant="flat" class="text-capitalize font-weight-bold px-6" :loading="saveLoading" @click="saveProduct">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card class="pa-6 text-center">
        <v-avatar size="64" class="bg-soft-error mb-4 pulse-glow-error">
          <v-icon icon="mdi-alert-octagon" color="error" size="32"></v-icon>
        </v-avatar>
        <h3 class="text-h6 font-weight-bold mb-2">Hapus Produk?</h3>
        <p class="text-body-2 text-medium-emphasis">
          Apakah Anda yakin ingin menghapus <strong>{{ selectedProduct?.name }}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div class="d-flex justify-center gap-3 mt-6">
          <v-btn variant="text" class="text-capitalize font-weight-bold" @click="deleteDialog = false">Batal</v-btn>
          <v-btn color="error" variant="flat" class="text-capitalize font-weight-bold px-6" :loading="deleteLoading" @click="deleteProduct">Hapus</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Detail Dialog -->
    <v-dialog v-model="detailDialog" max-width="480px">
      <v-card class="overflow-hidden" v-if="selectedProduct">
        <div class="product-visual d-flex align-center justify-center py-10 position-relative">
          <v-avatar size="80" class="gradient-primary elevation-6">
            <v-icon icon="mdi-package-variant-closed" color="white" size="40"></v-icon>
          </v-avatar>
          <v-btn icon="mdi-close" variant="text" position="absolute" location="top right" class="ma-2" @click="detailDialog = false"></v-btn>
        </div>

        <v-card-text class="pa-6">
          <div class="d-flex justify-space-between align-center mb-4">
            <h3 class="text-h6 font-weight-bold">{{ selectedProduct.name }}</h3>
            <v-chip color="primary" size="small" variant="outlined" class="font-weight-bold">#{{ selectedProduct.id }}</v-chip>
          </div>

          <v-divider class="mb-4 opacity-10"></v-divider>

          <div class="mb-4">
            <span class="text-caption text-medium-emphasis d-block font-weight-bold text-uppercase" style="letter-spacing: 0.05em;">Deskripsi</span>
            <p class="text-body-2 mt-1">{{ selectedProduct.description || 'Tidak ada deskripsi produk.' }}</p>
          </div>

          <v-row class="mb-4">
            <v-col cols="6">
              <span class="text-caption text-medium-emphasis d-block font-weight-bold text-uppercase" style="letter-spacing: 0.05em;">Harga Jual</span>
              <h3 class="text-h6 font-weight-black text-primary mt-1">Rp {{ formatRupiah(selectedProduct.price) }}</h3>
            </v-col>
            <v-col cols="6">
              <span class="text-caption text-medium-emphasis d-block font-weight-bold text-uppercase" style="letter-spacing: 0.05em;">Stok</span>
              <v-chip :color="selectedProduct.stock < 10 ? 'error' : 'success'" variant="tonal" class="font-weight-bold mt-1">
                {{ selectedProduct.stock }} Pcs — {{ selectedProduct.stock < 10 ? 'Kritis' : 'Aman' }}
              </v-chip>
            </v-col>
          </v-row>

          <div class="d-flex flex-column align-center pa-3 rounded-lg border-subtle text-center">
            <v-icon icon="mdi-barcode" size="x-large" color="medium-emphasis" class="mb-1"></v-icon>
            <span class="text-caption font-weight-bold text-medium-emphasis" style="font-family: monospace !important;">MELI-PROD-{{ selectedProduct.id }}</span>
          </div>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-btn color="primary" variant="tonal" prepend-icon="mdi-pencil" class="text-capitalize font-weight-bold" @click="detailDialog = false; openEditDialog(selectedProduct)">Ubah</v-btn>
          <v-spacer></v-spacer>
          <v-btn variant="text" class="text-capitalize font-weight-bold" @click="detailDialog = false">Tutup</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>

  <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" rounded="lg">
    {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../api';

const products = ref([]);
const loading = ref(true);
const viewMode = ref('table');
const searchQuery = ref('');
const sortBy = ref('name-asc');
const stockFilter = ref('all');

const formDialog = ref(false);
const isEdit = ref(false);
const saveLoading = ref(false);
const form = ref({ id: null, name: '', description: '', price: 0, stock: 0 });

const deleteDialog = ref(false);
const deleteLoading = ref(false);
const selectedProduct = ref(null);
const detailDialog = ref(false);

const snackbar = ref({ show: false, text: '', color: 'success' });

const sortOptions = [
  { title: 'Nama (A-Z)', value: 'name-asc' },
  { title: 'Nama (Z-A)', value: 'name-desc' },
  { title: 'Harga Terendah', value: 'price-asc' },
  { title: 'Harga Tertinggi', value: 'price-desc' },
  { title: 'Stok Tersedikit', value: 'stock-asc' },
  { title: 'Stok Terbanyak', value: 'stock-desc' }
];

// Endpoint 6: GET /api/products
const fetchProducts = async () => {
  try {
    loading.value = true;
    const response = await api.get('/products');
    products.value = response.data;
  } catch (error) {
    console.error("Gagal mengambil data produk:", error);
    showAlert('Gagal memuat produk dari server.', 'error');
  } finally {
    loading.value = false;
  }
};

const showAlert = (text, color = 'success') => {
  snackbar.value = { show: true, text, color };
};

const resetFilters = () => {
  searchQuery.value = '';
  stockFilter.value = 'all';
  sortBy.value = 'name-asc';
};

const filteredProducts = computed(() => {
  let list = [...products.value];
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
  }
  if (stockFilter.value === 'low') list = list.filter(p => p.stock < 10);
  else if (stockFilter.value === 'safe') list = list.filter(p => p.stock >= 10);

  list.sort((a, b) => {
    if (sortBy.value === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy.value === 'name-desc') return b.name.localeCompare(a.name);
    if (sortBy.value === 'price-asc') return a.price - b.price;
    if (sortBy.value === 'price-desc') return b.price - a.price;
    if (sortBy.value === 'stock-asc') return a.stock - b.stock;
    if (sortBy.value === 'stock-desc') return b.stock - a.stock;
    return 0;
  });
  return list;
});

const openAddDialog = () => {
  isEdit.value = false;
  form.value = { id: null, name: '', description: '', price: null, stock: null };
  formDialog.value = true;
};

const openEditDialog = (product) => {
  isEdit.value = true;
  form.value = { ...product };
  formDialog.value = true;
};

// Endpoint 7: POST /api/products  &  Endpoint 8: PUT /api/products/:id
const saveProduct = async () => {
  if (!form.value.name || form.value.price === null || form.value.stock === null) {
    showAlert('Semua kolom wajib diisi dengan benar.', 'error');
    return;
  }
  try {
    saveLoading.value = true;
    const body = { name: form.value.name, description: form.value.description, price: Number(form.value.price), stock: Number(form.value.stock) };
    if (isEdit.value) {
      await api.put(`/products/${form.value.id}`, body);
      showAlert('Produk berhasil diupdate!');
    } else {
      await api.post('/products', body);
      showAlert('Produk baru berhasil ditambahkan!');
    }
    formDialog.value = false;
    fetchProducts();
  } catch (error) {
    console.error("Gagal menyimpan produk:", error);
    showAlert('Gagal menyimpan data produk.', 'error');
  } finally {
    saveLoading.value = false;
  }
};

const confirmDelete = (product) => {
  selectedProduct.value = product;
  deleteDialog.value = true;
};

// Endpoint 9: DELETE /api/products/:id
const deleteProduct = async () => {
  try {
    deleteLoading.value = true;
    await api.delete(`/products/${selectedProduct.value.id}`);
    showAlert('Produk berhasil dihapus!');
    deleteDialog.value = false;
    fetchProducts();
  } catch (error) {
    console.error("Gagal menghapus produk:", error);
    showAlert('Gagal menghapus produk.', 'error');
  } finally {
    deleteLoading.value = false;
  }
};

const openDetailDialog = (product) => {
  selectedProduct.value = product;
  detailDialog.value = true;
};

const formatRupiah = (number) => new Intl.NumberFormat('id-ID').format(number);

onMounted(() => { fetchProducts(); });
</script>

<style scoped>
.header-accent-strip {
  height: 4px;
  background: linear-gradient(90deg, #4F46E5, #7C3AED, #E11D48);
}

.desc-cell {
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.desc-grid-cell {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 36px;
}
.product-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 75%;
}
.product-visual {
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(124, 58, 237, 0.05) 100%);
}
.cursor-pointer { cursor: pointer; }
</style>
