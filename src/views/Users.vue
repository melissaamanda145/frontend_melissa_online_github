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
              <h2 class="text-h5 font-weight-black">Daftar Pelanggan</h2>
              <p class="text-body-2 text-medium-emphasis mt-1">Manajemen data profil dan kontak pelanggan TokoMeli</p>
            </div>
            <v-btn
              color="primary"
              prepend-icon="mdi-account-plus"
              size="large"
              class="text-capitalize font-weight-bold mt-4 mt-sm-0 gradient-primary"
              @click="openAddDialog"
              elevation="2"
            >
              Tambah Pelanggan
            </v-btn>
          </div>

          <v-divider class="my-5 opacity-10"></v-divider>

          <v-row class="align-center">
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="searchQuery"
                placeholder="Cari nama, email, atau telepon..."
                prepend-inner-icon="mdi-magnify"
                density="comfortable"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto">
              <v-chip color="primary" variant="tonal" class="font-weight-bold">
                <v-icon icon="mdi-account-group" class="mr-1" size="16"></v-icon>
                {{ filteredUsers.length }} Pelanggan
              </v-chip>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-col>

    <!-- Loading -->
    <v-col cols="12" v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="56" width="5" class="mb-4"></v-progress-circular>
      <p class="text-medium-emphasis text-body-2">Memuat data pelanggan...</p>
    </v-col>

    <!-- Empty -->
    <v-col cols="12" v-else-if="filteredUsers.length === 0" class="text-center py-12">
      <v-avatar size="80" class="bg-soft-primary mb-4">
        <v-icon icon="mdi-account-search" size="40" color="primary"></v-icon>
      </v-avatar>
      <h3 class="text-h6 font-weight-bold">Data Pelanggan Kosong</h3>
      <p class="text-medium-emphasis text-body-2 mt-1 px-4">Database API Anda saat ini belum memiliki data pelanggan.<br>Silakan klik tombol <strong>"Tambah Pelanggan"</strong> di atas untuk memasukkan data baru.</p>
    </v-col>

    <!-- Table -->
    <v-col cols="12" v-else>
      <v-card class="border-subtle overflow-hidden">
        <v-table hover>
          <thead>
            <tr>
              <th class="font-weight-bold text-caption text-uppercase text-medium-emphasis" style="letter-spacing: 0.05em;">ID</th>
              <th class="font-weight-bold text-caption text-uppercase text-medium-emphasis" style="letter-spacing: 0.05em;">Nama Lengkap</th>
              <th class="font-weight-bold text-caption text-uppercase text-medium-emphasis" style="letter-spacing: 0.05em;">Email</th>
              <th class="font-weight-bold text-caption text-uppercase text-medium-emphasis" style="letter-spacing: 0.05em;">Telepon</th>
              <th class="font-weight-bold text-caption text-uppercase text-medium-emphasis text-right" style="letter-spacing: 0.05em;">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id" class="hover-row">
              <td class="font-weight-bold text-primary">#{{ user.id }}</td>
              <td>
                <div class="d-flex align-center">
                  <v-avatar size="32" rounded="lg" class="mr-2 font-weight-bold text-caption text-white" :style="{ background: getAvatarGradient(user.id) }">
                    {{ getInitials(user.name) }}
                  </v-avatar>
                  <span class="font-weight-bold">{{ user.name }}</span>
                </div>
              </td>
              <td class="text-medium-emphasis">{{ user.email || '-' }}</td>
              <td class="text-medium-emphasis">{{ user.phone || '-' }}</td>
              <td class="text-right">
                <v-btn icon="mdi-pencil-outline" variant="text" color="primary" size="small" @click="openEditDialog(user)"></v-btn>
                <v-btn icon="mdi-trash-can-outline" variant="text" color="error" size="small" @click="confirmDelete(user)"></v-btn>
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
            <v-icon :icon="isEdit ? 'mdi-account-edit' : 'mdi-account-plus'" class="mr-2"></v-icon>
            {{ isEdit ? 'Ubah Data Pelanggan' : 'Tambah Pelanggan Baru' }}
          </h3>
        </div>
        <v-card-text class="pt-5 px-5">
          <v-form @submit.prevent="saveUser">
            <v-text-field v-model="form.name" label="Nama Lengkap" placeholder="Masukkan nama lengkap" required class="mb-3"></v-text-field>
            <v-text-field v-model="form.email" label="Email" placeholder="nama@email.com" type="email" class="mb-3"></v-text-field>
            <v-text-field v-model="form.phone" label="Nomor Telepon" placeholder="Contoh: 0812345678"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-5 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" class="text-capitalize font-weight-bold" @click="formDialog = false">Batal</v-btn>
          <v-btn color="primary" variant="flat" class="text-capitalize font-weight-bold px-6" :loading="saveLoading" @click="saveUser">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card class="pa-6 text-center">
        <v-avatar size="64" class="bg-soft-error mb-4 pulse-glow-error">
          <v-icon icon="mdi-alert-octagon" color="error" size="32"></v-icon>
        </v-avatar>
        <h3 class="text-h6 font-weight-bold mb-2">Hapus Pelanggan?</h3>
        <p class="text-body-2 text-medium-emphasis">
          Apakah Anda yakin ingin menghapus <strong>{{ selectedUser?.name }}</strong>? Data akan dihapus secara permanen.
        </p>
        <div class="d-flex justify-center gap-3 mt-6">
          <v-btn variant="text" class="text-capitalize font-weight-bold" @click="deleteDialog = false">Batal</v-btn>
          <v-btn color="error" variant="flat" class="text-capitalize font-weight-bold px-6" :loading="deleteLoading" @click="deleteUser">Hapus</v-btn>
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

const users = ref([]);
const loading = ref(true);
const searchQuery = ref('');

const formDialog = ref(false);
const isEdit = ref(false);
const saveLoading = ref(false);
const form = ref({ id: null, name: '', email: '', phone: '' });

const deleteDialog = ref(false);
const deleteLoading = ref(false);
const selectedUser = ref(null);

const snackbar = ref({ show: false, text: '', color: 'success' });

// Endpoint 2: GET /api/users
const fetchUsers = async () => {
  try {
    loading.value = true;
    const response = await api.get('/users');
    users.value = response.data;
  } catch (error) {
    console.error("Gagal mengambil data pelanggan:", error);
    showAlert('Gagal memuat data pelanggan dari server.', 'error');
  } finally {
    loading.value = false;
  }
};

const showAlert = (text, color = 'success') => {
  snackbar.value = { show: true, text, color };
};

const filteredUsers = computed(() => {
  let list = [...users.value];
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(u =>
      u.name.toLowerCase().includes(q) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phone && u.phone.toLowerCase().includes(q))
    );
  }
  return list;
});

const openAddDialog = () => {
  isEdit.value = false;
  form.value = { id: null, name: '', email: '', phone: '' };
  formDialog.value = true;
};

const openEditDialog = (user) => {
  isEdit.value = true;
  form.value = { ...user };
  formDialog.value = true;
};

// Endpoint 3: POST /api/users  &  Endpoint 4: PUT /api/users/:id
const saveUser = async () => {
  if (!form.value.name) {
    showAlert('Nama lengkap wajib diisi.', 'error');
    return;
  }
  try {
    saveLoading.value = true;
    const body = { name: form.value.name, email: form.value.email, phone: form.value.phone };
    if (isEdit.value) {
      await api.put(`/users/${form.value.id}`, body);
      showAlert('Data pelanggan berhasil diperbarui!');
    } else {
      await api.post('/users', body);
      showAlert('Pelanggan baru berhasil ditambahkan!');
    }
    formDialog.value = false;
    fetchUsers();
  } catch (error) {
    console.error("Gagal menyimpan data pelanggan:", error);
    showAlert('Gagal menyimpan data pelanggan.', 'error');
  } finally {
    saveLoading.value = false;
  }
};

const confirmDelete = (user) => {
  selectedUser.value = user;
  deleteDialog.value = true;
};

// Endpoint 5: DELETE /api/users/:id
const deleteUser = async () => {
  try {
    deleteLoading.value = true;
    await api.delete(`/users/${selectedUser.value.id}`);
    showAlert('Pelanggan berhasil dihapus!');
    deleteDialog.value = false;
    fetchUsers();
  } catch (error) {
    console.error("Gagal menghapus pelanggan:", error);
    showAlert('Gagal menghapus pelanggan. Mungkin terikat dengan transaksi aktif.', 'error');
  } finally {
    deleteLoading.value = false;
  }
};

const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
};

const avatarGradients = [
  'linear-gradient(135deg, #4F46E5, #7C3AED)',
  'linear-gradient(135deg, #059669, #10B981)',
  'linear-gradient(135deg, #E11D48, #FB7185)',
  'linear-gradient(135deg, #2563EB, #60A5FA)',
  'linear-gradient(135deg, #D97706, #FBBF24)',
  'linear-gradient(135deg, #7C3AED, #A78BFA)',
];

const getAvatarGradient = (id) => avatarGradients[id % avatarGradients.length];

onMounted(() => { fetchUsers(); });
</script>

<style scoped>
.header-accent-strip {
  height: 4px;
  background: linear-gradient(90deg, #4F46E5, #7C3AED, #E11D48);
}
</style>
