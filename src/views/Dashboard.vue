<template>
  <v-row>
    <!-- Welcome Banner — Gradient Hero Card -->
    <v-col cols="12">
      <v-card class="gradient-primary overflow-hidden" elevation="0">
        <div class="welcome-card-content pa-6 pa-md-8 position-relative">
          <!-- Decorative circles -->
          <div class="welcome-deco-1"></div>
          <div class="welcome-deco-2"></div>

          <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center position-relative" style="z-index: 1;">
            <div>
              <h1 class="text-h4 text-md-h3 font-weight-black text-white mb-2">
                Selamat Datan! 👋
              </h1>
              <p class="text-subtitle-1 text-white" style="opacity: 0.75;">
                Berikut ringkasan performa TokoMeli hari ini.
              </p>
            </div>
            <v-btn
              color="white"
              variant="flat"
              prepend-icon="mdi-refresh"
              @click="refreshDashboard"
              :loading="loading"
              class="mt-4 mt-sm-0 text-primary font-weight-bold text-capitalize"
              rounded="lg"
              elevation="0"
            >
              Segarkan Data
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-col>

    <!-- Stat Cards — Individual Gradient Icons -->
    <v-col cols="12" sm="4">
      <v-card class="border-subtle pa-5 card-hover-lift" height="100%">
        <div class="d-flex align-center">
          <v-avatar size="56" rounded="lg" class="gradient-success mr-4">
            <v-icon icon="mdi-cash-multiple" color="white" size="26"></v-icon>
          </v-avatar>
          <div>
            <span class="text-caption text-medium-emphasis font-weight-medium d-block text-uppercase" style="letter-spacing: 0.05em;">Total Pendapatan</span>
            <h2 class="text-h5 font-weight-black mt-1 animate-count">
              Rp {{ formatRupiah(stats.total_revenue) }}
            </h2>
          </div>
        </div>
      </v-card>
    </v-col>

    <v-col cols="12" sm="4">
      <v-card class="border-subtle pa-5 card-hover-lift" height="100%">
        <div class="d-flex align-center">
          <v-avatar size="56" rounded="lg" class="gradient-info mr-4">
            <v-icon icon="mdi-receipt-text-outline" color="white" size="26"></v-icon>
          </v-avatar>
          <div>
            <span class="text-caption text-medium-emphasis font-weight-medium d-block text-uppercase" style="letter-spacing: 0.05em;">Jumlah Pesanan</span>
            <h2 class="text-h5 font-weight-black mt-1 animate-count">
              {{ stats.total_orders }} <span class="text-body-2 text-medium-emphasis font-weight-regular">Transaksi</span>
            </h2>
          </div>
        </div>
      </v-card>
    </v-col>

    <v-col cols="12" sm="4">
      <v-card class="border-subtle pa-5 card-hover-lift" height="100%">
        <div class="d-flex align-center">
          <v-avatar size="56" rounded="lg" class="gradient-accent mr-4">
            <v-icon icon="mdi-package-variant" color="white" size="26"></v-icon>
          </v-avatar>
          <div>
            <span class="text-caption text-medium-emphasis font-weight-medium d-block text-uppercase" style="letter-spacing: 0.05em;">Produk Terjual</span>
            <h2 class="text-h5 font-weight-black mt-1 animate-count">
              {{ stats.total_products_sold }} <span class="text-body-2 text-medium-emphasis font-weight-regular">Item</span>
            </h2>
          </div>
        </div>
      </v-card>
    </v-col>

    <!-- Chart Card -->
    <v-col cols="12" md="8">
      <v-card class="border-subtle pa-6" height="100%">
        <div class="d-flex justify-space-between align-center mb-6">
          <div>
            <h3 class="text-subtitle-1 font-weight-bold">Grafik Tren Penjualan</h3>
            <p class="text-caption text-medium-emphasis">Grafik bulanan transaksi penjualan</p>
          </div>
          <v-chip color="primary" size="small" label variant="tonal" class="font-weight-bold">Tahun 2026</v-chip>
        </div>

        <div class="chart-container pa-3 rounded-lg">
          <svg viewBox="0 0 600 220" width="100%" height="200" class="overflow-visible">
            <defs>
              <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#4F46E5" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="#4F46E5" stop-opacity="0"/>
              </linearGradient>
              <linearGradient id="chart-line-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#4F46E5"/>
                <stop offset="100%" stop-color="#7C3AED"/>
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <!-- Grid Lines -->
            <line v-for="y in [30, 80, 130, 180]" :key="'grid-'+y" x1="50" :y1="y" x2="560" :y2="y" stroke="currentColor" stroke-opacity="0.06" stroke-dasharray="4,4"/>

            <!-- Y Axis labels -->
            <text x="10" y="35" class="chart-label" fill="currentColor" opacity="0.4" font-size="11">10M</text>
            <text x="10" y="85" class="chart-label" fill="currentColor" opacity="0.4" font-size="11">7.5M</text>
            <text x="10" y="135" class="chart-label" fill="currentColor" opacity="0.4" font-size="11">5M</text>
            <text x="10" y="185" class="chart-label" fill="currentColor" opacity="0.4" font-size="11">0</text>

            <!-- Area fill -->
            <path d="M 60 180 L 60 150 Q 145 100 160 110 T 260 70 T 360 120 T 460 45 T 560 35 L 560 180 Z" fill="url(#chart-fill)" class="chart-area-animate"/>

            <!-- Line -->
            <path d="M 60 150 Q 145 100 160 110 T 260 70 T 360 120 T 460 45 T 560 35" fill="none" stroke="url(#chart-line-grad)" stroke-width="3" stroke-linecap="round" filter="url(#glow)" class="chart-line-animate"/>

            <!-- Data points -->
            <circle v-for="(pt, i) in chartPoints" :key="'pt-'+i" :cx="pt.x" :cy="pt.y" r="5" fill="#4F46E5" stroke="white" stroke-width="2" class="chart-dot"/>

            <!-- X Axis labels -->
            <text v-for="(label, i) in ['Jan','Feb','Mar','Apr','Mei','Jun']" :key="'x-'+i" :x="60 + i * 100" y="205" text-anchor="middle" fill="currentColor" opacity="0.4" font-size="11" font-weight="600">{{ label }}</text>
          </svg>
        </div>
      </v-card>
    </v-col>

    <!-- Low Stock Alert -->
    <v-col cols="12" md="4">
      <v-card class="border-subtle pa-6" height="100%">
        <div class="d-flex justify-space-between align-center mb-4">
          <h3 class="text-subtitle-1 font-weight-bold">Stok Menipis</h3>
          <v-chip v-if="lowStockProducts.length" color="error" size="small" variant="tonal" class="font-weight-bold">
            {{ lowStockProducts.length }}
          </v-chip>
        </div>

        <div v-if="lowStockProducts.length === 0" class="text-center py-8 text-medium-emphasis">
          <v-avatar color="success" size="48" class="mb-3">
            <v-icon icon="mdi-check-bold" color="white"></v-icon>
          </v-avatar>
          <p class="text-body-2 font-weight-medium">Stok semua produk aman!</p>
        </div>

        <div v-else>
          <div
            v-for="item in lowStockProducts.slice(0, 5)"
            :key="item.id"
            class="d-flex align-center py-3 stock-item"
          >
            <v-avatar size="36" rounded="lg" class="bg-soft-error mr-3">
              <v-icon icon="mdi-alert-circle" color="error" size="18"></v-icon>
            </v-avatar>
            <div class="flex-grow-1">
              <div class="text-body-2 font-weight-bold">{{ item.name }}</div>
              <div class="d-flex align-center mt-1">
                <v-progress-linear
                  :model-value="(item.stock / 10) * 100"
                  color="error"
                  rounded
                  height="4"
                  class="flex-grow-1 mr-2"
                ></v-progress-linear>
                <span class="text-caption text-error font-weight-bold">{{ item.stock }}</span>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </v-col>

    <!-- Recent Orders Table -->
    <v-col cols="12">
      <v-card class="border-subtle overflow-hidden">
        <div class="d-flex justify-space-between align-center pa-6 pb-4">
          <div>
            <h3 class="text-subtitle-1 font-weight-bold">Transaksi Terbaru</h3>
            <p class="text-caption text-medium-emphasis">5 transaksi terakhir yang tercatat</p>
          </div>
          <v-btn
            to="/orders"
            variant="tonal"
            color="primary"
            class="text-capitalize font-weight-bold"
            append-icon="mdi-arrow-right"
            size="small"
          >
            Lihat Semua
          </v-btn>
        </div>

        <v-table class="bg-transparent">
          <thead>
            <tr>
              <th class="text-left font-weight-bold text-caption text-uppercase text-medium-emphasis" style="letter-spacing: 0.05em;">ID</th>
              <th class="text-left font-weight-bold text-caption text-uppercase text-medium-emphasis" style="letter-spacing: 0.05em;">Pelanggan</th>
              <th class="text-left font-weight-bold text-caption text-uppercase text-medium-emphasis" style="letter-spacing: 0.05em;">Total</th>
              <th class="text-left font-weight-bold text-caption text-uppercase text-medium-emphasis" style="letter-spacing: 0.05em;">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in recentOrders" :key="order.id" class="hover-row">
              <td class="font-weight-bold text-primary">#{{ order.id }}</td>
              <td>
                <div class="d-flex align-center">
                  <v-avatar size="28" rounded="lg" class="bg-soft-primary mr-2">
                    <span class="text-caption text-primary font-weight-bold">{{ getInitials(order.user_name) }}</span>
                  </v-avatar>
                  <span class="font-weight-medium">{{ order.user_name || 'Pelanggan #' + order.user_id }}</span>
                </div>
              </td>
              <td class="font-weight-bold">Rp {{ formatRupiah(order.total_amount) }}</td>
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
            </tr>
            <tr v-if="recentOrders.length === 0">
              <td colspan="4" class="text-center py-8 text-medium-emphasis">
                Tidak ada data transaksi terbaru.
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';

const stats = ref({
  total_revenue: 0,
  total_orders: 0,
  total_products_sold: 0
});
const lowStockProducts = ref([]);
const recentOrders = ref([]);
const loading = ref(true);

const chartPoints = [
  { x: 60, y: 150 },
  { x: 160, y: 110 },
  { x: 260, y: 70 },
  { x: 360, y: 120 },
  { x: 460, y: 45 },
  { x: 560, y: 35 },
];

// Endpoint 18: GET /api/statistics
const fetchStats = async () => {
  try {
    const response = await api.get('/statistics');
    stats.value = response.data.data;
  } catch (error) {
    console.error("Gagal mengambil statistik:", error);
  }
};

// Endpoint 6: GET /api/products (used here for low stock filter)
const fetchProducts = async () => {
  try {
    const response = await api.get('/products');
    lowStockProducts.value = response.data.filter(p => p.stock < 10);
  } catch (error) {
    console.error("Gagal mengambil daftar produk:", error);
  }
};

// Endpoint 10: GET /api/orders (used here for recent orders)
const fetchOrders = async () => {
  try {
    const response = await api.get('/orders');
    recentOrders.value = response.data.slice(0, 5);
  } catch (error) {
    console.error("Gagal mengambil daftar transaksi:", error);
  }
};

const refreshDashboard = async () => {
  loading.value = true;
  await Promise.all([fetchStats(), fetchProducts(), fetchOrders()]);
  loading.value = false;
};

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID').format(number || 0);
};

const getStatusColor = (status) => {
  if (status === 'completed' || status === 'selesai') return 'success';
  if (status === 'pending') return 'warning';
  if (status === 'processing') return 'info';
  return 'error';
};

const getStatusIcon = (status) => {
  if (status === 'completed' || status === 'selesai') return 'mdi-check-circle';
  if (status === 'pending') return 'mdi-clock-outline';
  if (status === 'processing') return 'mdi-progress-clock';
  return 'mdi-close-circle';
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
};

onMounted(() => {
  refreshDashboard();
});
</script>

<style scoped>
.welcome-card-content {
  position: relative;
  overflow: hidden;
}

.welcome-deco-1 {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
}

.welcome-deco-2 {
  position: absolute;
  bottom: -60px;
  right: 80px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
}

.chart-container {
  background: rgba(148, 163, 184, 0.03);
}

.chart-dot {
  cursor: pointer;
  transition: r 0.2s ease;
}
.chart-dot:hover {
  r: 8;
}

.chart-label {
  font-family: 'Inter', sans-serif;
}

.chart-line-animate {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawLine 2s ease forwards;
}

.chart-area-animate {
  opacity: 0;
  animation: fadeInArea 1s ease 1.5s forwards;
}

@keyframes drawLine {
  to { stroke-dashoffset: 0; }
}

@keyframes fadeInArea {
  to { opacity: 1; }
}

.stock-item {
  border-bottom: 1px solid rgba(148, 163, 184, 0.08);
}
.stock-item:last-child {
  border-bottom: none;
}
</style>
