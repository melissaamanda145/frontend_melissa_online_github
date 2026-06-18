<template>
  <div>
    <v-row>
    <!-- Header -->
    <v-col cols="12">
      <v-card class="border-subtle overflow-hidden">
        <div class="header-accent-strip"></div>
        <div class="pa-5 pa-md-6">
          <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center">
            <div>
              <h2 class="text-h5 font-weight-black">Detail Barang Transaksi</h2>
              <p class="text-body-2 text-medium-emphasis mt-1">Manajemen rincian item produk yang terjual per pesanan</p>
            </div>
            <v-btn
              color="primary"
              prepend-icon="mdi-playlist-plus"
              size="large"
              class="text-capitalize font-weight-bold mt-4 mt-sm-0 gradient-primary"
              @click="openAddDialog"
              elevation="2"
            >
              Tambah Item
            </v-btn>
          </div>

          <v-divider class="my-5 opacity-10"></v-divider>

          <v-row class="align-center">
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="searchQuery"
                placeholder="Cari ID Transaksi atau produk..."
                prepend-inner-icon="mdi-magnify"
                density="comfortable"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto">
              <v-chip color="primary" variant="tonal" class="font-weight-bold">
                <v-icon icon="mdi-format-list-bulleted" class="mr-1" size="16"></v-icon>
                {{ filteredOrderItems.length }} Item Terjual
              </v-chip>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-col>

    <!-- Loading -->
    <v-col cols="12" v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="56" width="5" class="mb-4"></v-progress-circular>
      <p class="text-medium-emphasis text-body-2">Memuat rincian item barang...</p>
    </v-col>

    <!-- Empty -->
    <v-col cols="12" v-else-if="filteredOrderItems.length === 0" class="text-center py-12">
      <v-avatar size="80" class="bg-soft-primary mb-4">
        <v-icon icon="mdi-clipboard-text-search" size="40" color="primary"></v-icon>
      </v-avatar>
      <h3 class="text-h6 font-weight-bold">Data Detail Item Kosong</h3>
      <p class="text-medium-emphasis text-body-2 mt-1 px-4">Belum ada rincian item barang yang terjual di database API Anda.<br>Silakan klik tombol <strong>"Tambah Item"</strong> di atas untuk memasukkan data.</p>
    </v-col>

    <!-- Table -->
    <v-col cols="12" v-else>
      <v-card class="border-subtle overflow-hidden">
        <v-table hover>
          <thead>
            <tr>
              <th class="font-weight-bold text-caption text-uppercase text-medium-emphasis" style="letter-spacing: 0.05em;">Detail ID</th>
              <th class="font-weight-bold text-caption text-uppercase text-medium-emphasis" style="letter-spacing: 0.05em;">Order ID</th>
              <th class="font-weight-bold text-caption text-uppercase text-medium-emphasis" style="letter-spacing: 0.05em;">Produk</th>
              <th class="font-weight-bold text-caption text-uppercase text-medium-emphasis" style="letter-spacing: 0.05em;">Harga Satuan</th>
              <th class="font-weight-bold text-caption text-uppercase text-medium-emphasis" style="letter-spacing: 0.05em;">Qty</th>
              <th class="font-weight-bold text-caption text-uppercase text-medium-emphasis" style="letter-spacing: 0.05em;">Subtotal</th>
              <th class="font-weight-bold text-caption text-uppercase text-medium-emphasis text-right" style="letter-spacing: 0.05em;">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredOrderItems" :key="item.id" class="hover-row">
              <td class="text-medium-emphasis">#{{ item.id }}</td>
              <td>
                <v-chip size="small" color="primary" variant="outlined" class="font-weight-bold">
                  ORD-{{ item.order_id }}
                </v-chip>
              </td>
              <td>
                <div class="d-flex align-center">
                  <v-avatar size="32" rounded="lg" class="bg-soft-primary mr-2">
                    <v-icon icon="mdi-package-variant-closed" color="primary" size="16"></v-icon>
                  </v-avatar>
                  <span class="font-weight-bold">{{ item.product_name || 'Produk #' + item.product_id }}</span>
                </div>
              </td>
              <td class="text-medium-emphasis">Rp {{ formatRupiah(item.price_at_purchase) }}</td>
              <td>
                <v-chip color="info" size="small" variant="tonal" class="font-weight-bold">
                  {{ item.quantity }}x
                </v-chip>
              </td>
              <td class="font-weight-black text-success">
                Rp {{ formatRupiah(item.price_at_purchase * item.quantity) }}
              </td>
              <td class="text-right">
                <v-btn icon="mdi-pencil-outline" variant="text" color="info" size="small" @click="openEditDialog(item)"></v-btn>
                <v-btn icon="mdi-trash-can-outline" variant="text" color="error" size="small" @click="confirmDelete(item)"></v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-col>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="formDialog" max-width="500px" persistent>
      <v-card class="overflow-hidden">
        <div class="gradient-primary pa-5 text-white">
          <h3 class="text-h6 font-weight-bold">
            <v-icon :icon="isEdit ? 'mdi-playlist-edit' : 'mdi-playlist-plus'" class="mr-2"></v-icon>
            {{ isEdit ? 'Ubah Rincian Item' : 'Tambah Item Pesanan' }}
          </h3>
        </div>
        <v-card-text class="pt-5 px-5">
          <v-form @submit.prevent="saveOrderItem">
            <v-select
              v-model="form.order_id"
              :items="orderList"
              item-title="label"
              item-value="id"
              label="Pilih Transaksi (Order ID)"
              :disabled="isEdit"
              required
              class="mb-3"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :title="`Order #${item.raw.id}`" :subtitle="item.raw.user_name"></v-list-item>
              </template>
            </v-select>

            <v-select
              v-model="form.product_id"
              :items="productList"
              item-title="name"
              item-value="id"
              label="Pilih Produk"
              @update:model-value="onProductChange"
              required
              class="mb-3"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :title="item.raw.originalName" :subtitle="`Stok: ${item.raw.stock} | Rp ${formatRupiah(item.raw.price)}`">
                  <template v-slot:prepend>
                    <v-avatar size="32" class="bg-soft-primary mr-3">
                      <v-icon icon="mdi-package" color="primary" size="18"></v-icon>
                    </v-avatar>
                  </template>
                </v-list-item>
              </template>
            </v-select>

            <v-row>
              <v-col cols="5">
                <v-text-field v-model.number="form.quantity" label="Qty" type="number" min="1" required></v-text-field>
              </v-col>
              <v-col cols="7">
                <v-text-field v-model.number="form.price_at_purchase" label="Harga Satuan" type="number" prefix="Rp" required></v-text-field>
              </v-col>
            </v-row>

            <div class="pa-4 bg-soft-success rounded-lg border-subtle d-flex justify-space-between align-center mt-2">
              <span class="text-caption text-success font-weight-bold text-uppercase" style="letter-spacing: 0.05em;">Subtotal</span>
              <span class="text-subtitle-1 text-success font-weight-black">
                Rp {{ formatRupiah((form.price_at_purchase || 0) * (form.quantity || 0)) }}
              </span>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-5 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" class="text-capitalize font-weight-bold" @click="formDialog = false">Batal</v-btn>
          <v-btn color="primary" variant="flat" class="text-capitalize font-weight-bold px-6" :loading="saveLoading" @click="saveOrderItem">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card class="pa-6 text-center">
        <v-avatar size="64" class="bg-soft-error mb-4 pulse-glow-error">
          <v-icon icon="mdi-alert-octagon" color="error" size="32"></v-icon>
        </v-avatar>
        <h3 class="text-h6 font-weight-bold mb-2">Hapus Item?</h3>
        <p class="text-body-2 text-medium-emphasis">
          Yakin ingin menghapus <strong>{{ selectedItem?.product_name }}</strong> dari pesanan <strong>#{{ selectedItem?.order_id }}</strong>?
        </p>
        <div class="d-flex justify-center gap-3 mt-6">
          <v-btn variant="text" class="text-capitalize font-weight-bold" @click="deleteDialog = false">Batal</v-btn>
          <v-btn color="error" variant="flat" class="text-capitalize font-weight-bold px-6" :loading="deleteLoading" @click="deleteOrderItem">Hapus</v-btn>
        </div>
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

const orderItems = ref([]);
const orders = ref([]);
const products = ref([]);
const loading = ref(true);
const searchQuery = ref('');

const formDialog = ref(false);
const isEdit = ref(false);
const saveLoading = ref(false);
const form = ref({ id: null, order_id: null, product_id: null, quantity: 1, price_at_purchase: null });

const deleteDialog = ref(false);
const deleteLoading = ref(false);
const selectedItem = ref(null);

const snackbar = ref({ show: false, text: '', color: 'success' });

// Endpoint 14: GET /api/order-items
const fetchOrderItems = async () => {
  try {
    loading.value = true;
    const response = await api.get('/order-items');
    orderItems.value = response.data;
  } catch (error) {
    console.error("Gagal mengambil rincian detail barang:", error);
    showAlert('Gagal memuat rincian detail barang.', 'error');
  } finally {
    loading.value = false;
  }
};

// Endpoints for dropdowns
const fetchOrders = async () => {
  try {
    const response = await api.get('/orders');
    orders.value = response.data;
  } catch (error) {}
};

const fetchProducts = async () => {
  try {
    const response = await api.get('/products');
    products.value = response.data;
  } catch (error) {}
};

const showAlert = (text, color = 'success') => {
  snackbar.value = { show: true, text, color };
};

const orderList = computed(() => orders.value.map(o => ({
  id: o.id,
  user_name: o.user_name || `Pelanggan #${o.user_id}`,
  label: `Order #${o.id} — ${o.user_name || 'Pelanggan #' + o.user_id}`
})));

const productList = computed(() => products.value.map(p => ({
  id: p.id,
  originalName: p.name,
  name: `${p.name} (Stok: ${p.stock})`,
  price: p.price,
  stock: p.stock
})));

const onProductChange = (productId) => {
  const selectedProd = products.value.find(p => p.id === productId);
  if (selectedProd) form.value.price_at_purchase = selectedProd.price;
};

const filteredOrderItems = computed(() => {
  let list = [...orderItems.value];
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(item => (item.product_name && item.product_name.toLowerCase().includes(q)) || `#${item.order_id}`.includes(q) || `#${item.id}`.includes(q));
  }
  return list;
});

const openAddDialog = () => {
  isEdit.value = false;
  form.value = { id: null, order_id: null, product_id: null, quantity: 1, price_at_purchase: null };
  formDialog.value = true;
};

const openEditDialog = (item) => {
  isEdit.value = true;
  form.value = { ...item };
  formDialog.value = true;
};

// Endpoint 15: POST /api/order-items & Endpoint 16: PUT /api/order-items/:id
const saveOrderItem = async () => {
  if (!form.value.order_id || !form.value.product_id || !form.value.quantity || form.value.price_at_purchase === null) {
    showAlert('Semua kolom wajib diisi.', 'error');
    return;
  }
  try {
    saveLoading.value = true;
    const body = { order_id: form.value.order_id, product_id: form.value.product_id, quantity: Number(form.value.quantity), price_at_purchase: Number(form.value.price_at_purchase) };
    if (isEdit.value) {
      await api.put(`/order-items/${form.value.id}`, body);
      showAlert('Item detail transaksi berhasil diupdate!');
    } else {
      await api.post('/order-items', body);
      showAlert('Item berhasil ditambahkan ke transaksi!');
    }
    formDialog.value = false;
    fetchOrderItems();
  } catch (error) {
    console.error("Gagal menyimpan item transaksi:", error);
    showAlert('Gagal menyimpan rincian item.', 'error');
  } finally {
    saveLoading.value = false;
  }
};

const confirmDelete = (item) => {
  selectedItem.value = item;
  deleteDialog.value = true;
};

// Endpoint 17: DELETE /api/order-items/:id
const deleteOrderItem = async () => {
  try {
    deleteLoading.value = true;
    await api.delete(`/order-items/${selectedItem.value.id}`);
    showAlert('Item transaksi berhasil dihapus!');
    deleteDialog.value = false;
    fetchOrderItems();
  } catch (error) {
    console.error("Gagal menghapus item transaksi:", error);
    showAlert('Gagal menghapus item transaksi.', 'error');
  } finally {
    deleteLoading.value = false;
  }
};

const formatRupiah = (number) => new Intl.NumberFormat('id-ID').format(number);

onMounted(() => { fetchOrderItems(); fetchOrders(); fetchProducts(); });
</script>

<style scoped>
.header-accent-strip {
  height: 4px;
  background: linear-gradient(90deg, #4F46E5, #7C3AED, #E11D48);
}
</style>
