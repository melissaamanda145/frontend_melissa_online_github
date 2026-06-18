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
              <h2 class="text-h5 font-weight-black">Daftar Transaksi</h2>
              <p class="text-body-2 text-medium-emphasis mt-1">Manajemen penjualan, total pembayaran, dan status pesanan</p>
            </div>
            <v-btn
              color="primary"
              prepend-icon="mdi-cart-plus"
              size="large"
              class="text-capitalize font-weight-bold mt-4 mt-sm-0 gradient-primary"
              @click="openAddDialog"
              elevation="2"
            >
              Tambah Transaksi
            </v-btn>
          </div>

          <v-divider class="my-5 opacity-10"></v-divider>

          <v-row class="align-center">
            <v-col cols="12" sm="5" md="4">
              <v-text-field
                v-model="searchQuery"
                placeholder="Cari nama pelanggan..."
                prepend-inner-icon="mdi-magnify"
                density="comfortable"
                hide-details
                clearable
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="4" md="3">
              <v-select
                v-model="statusFilter"
                :items="statusOptions"
                label="Filter Status"
                density="comfortable"
                hide-details
              ></v-select>
            </v-col>

            <v-spacer></v-spacer>

            <v-col cols="auto" class="d-flex align-center gap-2">
              <div class="d-flex align-center px-4 py-2 rounded-lg bg-soft-success border-subtle">
                <v-icon icon="mdi-trending-up" color="success" class="mr-2" size="20"></v-icon>
                <div>
                  <div class="text-caption text-success font-weight-bold text-uppercase" style="letter-spacing: 0.05em; line-height: 1;">Total Omset</div>
                  <div class="text-subtitle-2 font-weight-black">Rp {{ formatRupiah(totalIncome) }}</div>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-col>

    <!-- Loading -->
    <v-col cols="12" v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="56" width="5" class="mb-4"></v-progress-circular>
      <p class="text-medium-emphasis text-body-2">Memuat data transaksi...</p>
    </v-col>

    <!-- Empty -->
    <v-col cols="12" v-else-if="filteredOrders.length === 0" class="text-center py-12">
      <v-avatar size="80" class="bg-soft-primary mb-4">
        <v-icon icon="mdi-cart-remove" size="40" color="primary"></v-icon>
      </v-avatar>
      <h3 class="text-h6 font-weight-bold">Data Transaksi Kosong</h3>
      <p class="text-medium-emphasis text-body-2 mt-1 px-4">Belum ada riwayat transaksi di database API Anda saat ini.<br>Silakan klik tombol <strong>"Tambah Transaksi"</strong> di atas untuk membuat pesanan baru.</p>
    </v-col>

    <!-- Table -->
    <v-col cols="12" v-else>
      <v-card class="border-subtle overflow-hidden">
        <v-table hover>
          <thead>
            <tr>
              <th class="font-weight-bold text-caption text-uppercase text-medium-emphasis" style="letter-spacing: 0.05em;">ID</th>
              <th class="font-weight-bold text-caption text-uppercase text-medium-emphasis" style="letter-spacing: 0.05em;">Pelanggan</th>
              <th class="font-weight-bold text-caption text-uppercase text-medium-emphasis" style="letter-spacing: 0.05em;">Total Pembayaran</th>
              <th class="font-weight-bold text-caption text-uppercase text-medium-emphasis" style="letter-spacing: 0.05em;">Status</th>
              <th class="font-weight-bold text-caption text-uppercase text-medium-emphasis text-right" style="letter-spacing: 0.05em;">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.id" class="hover-row">
              <td class="font-weight-bold text-primary">#{{ order.id }}</td>
              <td>
                <div class="d-flex align-center">
                  <v-avatar size="32" rounded="lg" class="bg-soft-primary mr-2">
                    <span class="text-caption text-primary font-weight-bold">{{ getInitials(order.user_name) }}</span>
                  </v-avatar>
                  <span class="font-weight-bold">{{ order.user_name || 'Pelanggan #' + order.user_id }}</span>
                </div>
              </td>
              <td class="font-weight-black">Rp {{ formatRupiah(order.total_amount) }}</td>
              <td>
                <v-chip
                  :color="getStatusColor(order.status)"
                  size="small"
                  label
                  variant="tonal"
                  class="font-weight-bold text-capitalize"
                  :class="'status-chip-' + order.status"
                >
                  <v-icon :icon="getStatusIcon(order.status)" size="14" class="mr-1"></v-icon>
                  {{ order.status }}
                </v-chip>
              </td>
              <td class="text-right">
                <v-btn icon="mdi-pencil-outline" variant="text" color="info" size="small" @click="openEditDialog(order)"></v-btn>
                <v-btn icon="mdi-trash-can-outline" variant="text" color="error" size="small" @click="confirmDelete(order)"></v-btn>
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
            <v-icon :icon="isEdit ? 'mdi-file-document-edit' : 'mdi-cart-plus'" class="mr-2"></v-icon>
            {{ isEdit ? 'Ubah Status & Nilai' : 'Buat Transaksi Baru' }}
          </h3>
        </div>
        <v-card-text class="pt-5 px-5">
          <v-form @submit.prevent="saveOrder">
            <v-select
              v-if="!isEdit"
              v-model="form.user_id"
              :items="customerList"
              item-title="name"
              item-value="id"
              label="Pilih Pelanggan"
              placeholder="Cari pelanggan"
              required
              class="mb-3"
            ></v-select>
            
            <div v-else class="mb-4 pa-4 bg-soft-primary rounded-lg border-subtle d-flex align-center">
              <v-avatar size="40" class="gradient-primary mr-3">
                <span class="text-white font-weight-bold text-body-2">{{ getInitials(form.user_name) }}</span>
              </v-avatar>
              <div>
                <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold" style="letter-spacing: 0.05em;">Pelanggan</div>
                <div class="font-weight-bold text-body-1">{{ form.user_name }} (ID: #{{ form.user_id }})</div>
              </div>
            </div>

            <v-text-field
              v-model.number="form.total_amount"
              label="Total Pembayaran (Rp)"
              type="number"
              prefix="Rp"
              required
              class="mb-3"
            ></v-text-field>

            <v-select
              v-model="form.status"
              :items="['pending', 'completed', 'canceled']"
              label="Status Transaksi"
              required
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-icon :icon="getStatusIcon(item.raw)" :color="getStatusColor(item.raw)"></v-icon>
                  </template>
                </v-list-item>
              </template>
            </v-select>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-5 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" class="text-capitalize font-weight-bold" @click="formDialog = false">Batal</v-btn>
          <v-btn color="primary" variant="flat" class="text-capitalize font-weight-bold px-6" :loading="saveLoading" @click="saveOrder">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card class="pa-6 text-center">
        <v-avatar size="64" class="bg-soft-error mb-4 pulse-glow-error">
          <v-icon icon="mdi-alert-octagon" color="error" size="32"></v-icon>
        </v-avatar>
        <h3 class="text-h6 font-weight-bold mb-2">Hapus Transaksi?</h3>
        <p class="text-body-2 text-medium-emphasis">
          Yakin ingin menghapus transaksi <strong>#{{ selectedOrder?.id }}</strong> atas nama <strong>{{ selectedOrder?.user_name }}</strong>?
        </p>
        <div class="d-flex justify-center gap-3 mt-6">
          <v-btn variant="text" class="text-capitalize font-weight-bold" @click="deleteDialog = false">Batal</v-btn>
          <v-btn color="error" variant="flat" class="text-capitalize font-weight-bold px-6" :loading="deleteLoading" @click="deleteOrder">Hapus</v-btn>
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

const orders = ref([]);
const customers = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const statusFilter = ref('all');

const formDialog = ref(false);
const isEdit = ref(false);
const saveLoading = ref(false);
const form = ref({ id: null, user_id: null, user_name: '', total_amount: null, status: 'pending' });

const deleteDialog = ref(false);
const deleteLoading = ref(false);
const selectedOrder = ref(null);

const snackbar = ref({ show: false, text: '', color: 'success' });

const statusOptions = [
  { title: 'Semua Status', value: 'all' },
  { title: 'Selesai (Completed)', value: 'completed' },
  { title: 'Menunggu (Pending)', value: 'pending' },
  { title: 'Dibatalkan (Canceled)', value: 'canceled' }
];

// Endpoint 10: GET /api/orders
const fetchOrders = async () => {
  try {
    loading.value = true;
    const response = await api.get('/orders');
    orders.value = response.data;
  } catch (error) {
    console.error("Gagal mengambil data transaksi:", error);
    showAlert('Gagal memuat transaksi dari server.', 'error');
  } finally {
    loading.value = false;
  }
};

// Endpoint 2: GET /api/users (used for selection)
const fetchCustomers = async () => {
  try {
    const response = await api.get('/users');
    customers.value = response.data;
  } catch (error) {
    console.error("Gagal mengambil data pelanggan:", error);
  }
};

const showAlert = (text, color = 'success') => {
  snackbar.value = { show: true, text, color };
};

const customerList = computed(() => customers.value.map(c => ({ id: c.id, name: `${c.name} (${c.email || 'No Email'})` })));

const filteredOrders = computed(() => {
  let list = [...orders.value];
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(o => (o.user_name && o.user_name.toLowerCase().includes(q)) || `#${o.id}`.includes(q));
  }
  if (statusFilter.value !== 'all') list = list.filter(o => o.status === statusFilter.value);
  return list;
});

const totalIncome = computed(() => {
  return orders.value.filter(o => o.status === 'completed' || o.status === 'selesai').reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
});

const openAddDialog = () => {
  isEdit.value = false;
  form.value = { id: null, user_id: null, total_amount: null, status: 'pending' };
  formDialog.value = true;
};

const openEditDialog = (order) => {
  isEdit.value = true;
  form.value = { ...order };
  formDialog.value = true;
};

// Endpoint 11: POST /api/orders & Endpoint 12: PUT /api/orders/:id
const saveOrder = async () => {
  if (!form.value.user_id && !isEdit.value) {
    showAlert('Silakan pilih pelanggan terlebih dahulu.', 'error');
    return;
  }
  if (form.value.total_amount === null || form.value.total_amount < 0) {
    showAlert('Total pembayaran tidak valid.', 'error');
    return;
  }
  try {
    saveLoading.value = true;
    const body = { user_id: form.value.user_id, total_amount: Number(form.value.total_amount), status: form.value.status };
    if (isEdit.value) {
      await api.put(`/orders/${form.value.id}`, body);
      showAlert('Transaksi berhasil diupdate!');
    } else {
      await api.post('/orders', body);
      showAlert('Transaksi baru berhasil ditambahkan!');
    }
    formDialog.value = false;
    fetchOrders();
  } catch (error) {
    console.error("Gagal menyimpan transaksi:", error);
    showAlert('Gagal menyimpan data transaksi.', 'error');
  } finally {
    saveLoading.value = false;
  }
};

const confirmDelete = (order) => {
  selectedOrder.value = order;
  deleteDialog.value = true;
};

// Endpoint 13: DELETE /api/orders/:id
const deleteOrder = async () => {
  try {
    deleteLoading.value = true;
    await api.delete(`/orders/${selectedOrder.value.id}`);
    showAlert('Transaksi berhasil dihapus!');
    deleteDialog.value = false;
    fetchOrders();
  } catch (error) {
    console.error("Gagal menghapus transaksi:", error);
    showAlert('Gagal menghapus transaksi.', 'error');
  } finally {
    deleteLoading.value = false;
  }
};

const getStatusColor = (status) => {
  if (status === 'completed' || status === 'selesai') return 'success';
  if (status === 'pending') return 'warning';
  if (status === 'canceled' || status === 'cancelled') return 'error';
  return 'info';
};

const getStatusIcon = (status) => {
  if (status === 'completed' || status === 'selesai') return 'mdi-check-circle';
  if (status === 'pending') return 'mdi-clock-outline';
  if (status === 'canceled' || status === 'cancelled') return 'mdi-close-circle';
  return 'mdi-progress-clock';
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
};

const formatRupiah = (number) => new Intl.NumberFormat('id-ID').format(number);

onMounted(() => { fetchOrders(); fetchCustomers(); });
</script>

<style scoped>
.header-accent-strip {
  height: 4px;
  background: linear-gradient(90deg, #4F46E5, #7C3AED, #E11D48);
}
</style>
