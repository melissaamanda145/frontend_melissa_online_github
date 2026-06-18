<template>
  <v-app :theme="currentTheme">
    <!-- Navigation Drawer (Sidebar) — Premium Design -->
    <v-navigation-drawer
      v-if="isLoggedIn"
      v-model="drawer"
      :rail="rail"
      permanent
      :elevation="0"
      class="sidebar-premium border-0"
    >
      <!-- Brand Logo Section -->
      <div class="sidebar-brand pa-4" :class="{ 'pa-2': rail }">
        <div class="d-flex align-center" :class="{ 'justify-center': rail }">
          <div class="brand-icon-wrapper" :class="{ 'pulse-glow': !rail }">
            <v-avatar size="42" class="gradient-primary">
              <v-icon icon="mdi-shopping" color="white" size="22"></v-icon>
            </v-avatar>
          </div>
          <transition name="fade">
            <div v-if="!rail" class="ml-3">
              <h3 class="text-subtitle-1 font-weight-black letter-spacing-tight">TokoMeli</h3>
              <span class="text-caption text-medium-emphasis">Admin Panel</span>
            </div>
          </transition>
        </div>
      </div>

      <v-divider class="mx-4 mb-2 opacity-20"></v-divider>

      <!-- Navigation Menu -->
      <v-list nav density="compact" class="px-3">
        <v-list-item
          v-for="item in menuItems"
          :key="item.value"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          :value="item.value"
          color="primary"
          rounded="lg"
          class="mb-1 nav-item-glow"
          :class="{ 'my-1': rail }"
        >
          <template v-slot:append v-if="item.badge && !rail">
            <v-badge :color="item.badgeColor" :content="item.badge" inline></v-badge>
          </template>
        </v-list-item>
      </v-list>

      <!-- Bottom Actions: Theme + Logout -->
      <template v-slot:append>
        <v-divider class="mx-4 opacity-20"></v-divider>

        <v-list nav density="compact" class="px-3 py-3">
          <!-- Toggle Theme -->
          <v-list-item
            @click="toggleTheme"
            :prepend-icon="currentTheme === 'dark' ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'"
            :title="currentTheme === 'dark' ? 'Mode Terang' : 'Mode Gelap'"
            rounded="lg"
            class="mb-1"
          ></v-list-item>

          <!-- Logout -->
          <v-list-item
            @click="logout"
            prepend-icon="mdi-logout-variant"
            title="Keluar"
            value="logout"
            color="error"
            rounded="lg"
            class="text-error"
          ></v-list-item>
        </v-list>

        <!-- Sidebar Toggle -->
        <div class="d-none d-md-flex justify-center py-2">
          <v-btn
            variant="text"
            :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
            @click.stop="rail = !rail"
            size="small"
            color="medium-emphasis"
          ></v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Top App Bar — Premium Design -->
    <v-app-bar
      v-if="isLoggedIn"
      :elevation="0"
      class="appbar-premium border-0 px-2"
      height="72"
    >
      <!-- Mobile menu toggle -->
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
        class="d-md-none"
      ></v-app-bar-nav-icon>

      <!-- Page Title -->
      <div class="ml-2 d-flex flex-column justify-center" style="height: 100%;">
        <h2 class="text-subtitle-1 font-weight-bold text-high-emphasis mb-0" style="line-height: 1.2;">{{ currentPageTitle }}</h2>
        <p class="text-caption text-medium-emphasis mt-1 mb-0" style="line-height: 1.2;">{{ currentPageSubtitle }}</p>
      </div>

      <v-spacer></v-spacer>

      <!-- Right Toolbar Items -->
      <v-btn icon variant="text" class="mr-1" size="small">
        <v-badge color="error" content="3" floating>
          <v-icon icon="mdi-bell-outline" size="22"></v-icon>
        </v-badge>
      </v-btn>

      <!-- User Avatar Menu -->
      <v-menu min-width="220px" rounded="xl" offset-y>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" class="ml-1">
            <v-avatar size="34" class="gradient-primary">
              <span class="text-white font-weight-bold text-caption">AD</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card class="mt-2 pa-0 overflow-hidden" elevation="8">
          <!-- User Info Header -->
          <div class="gradient-primary pa-5 text-center">
            <v-avatar size="56" color="white" class="mb-2">
              <v-icon icon="mdi-account" color="primary" size="28"></v-icon>
            </v-avatar>
            <h4 class="text-white font-weight-bold">Administrator</h4>
            <p class="text-white-50 text-caption">admin@tokomeli.com</p>
          </div>
          <v-list density="compact" nav class="pa-2">
            <v-list-item prepend-icon="mdi-cog-outline" title="Pengaturan" rounded="lg"></v-list-item>
            <v-list-item prepend-icon="mdi-help-circle-outline" title="Bantuan" rounded="lg"></v-list-item>
            <v-divider class="my-1"></v-divider>
            <v-list-item prepend-icon="mdi-logout-variant" title="Keluar" @click="logout" color="error" rounded="lg"></v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <!-- Main Content Area -->
    <v-main class="min-vh-100 mesh-gradient-bg">
      <v-container fluid class="pa-4 pa-md-6">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTheme } from 'vuetify';

const router = useRouter();
const route = useRoute();
const theme = useTheme();

const drawer = ref(true);
const rail = ref(false);

const currentTheme = computed(() => theme.global.name.value);

const isLoggedIn = computed(() => {
  return route.name !== 'Login' && localStorage.getItem('token');
});

const menuItems = [
  { to: '/', icon: 'mdi-view-dashboard-outline', title: 'Dashboard', value: 'dashboard' },
  { to: '/products', icon: 'mdi-package-variant-closed', title: 'Produk', value: 'products', badge: null },
  { to: '/users', icon: 'mdi-account-group-outline', title: 'Pelanggan', value: 'users' },
  { to: '/orders', icon: 'mdi-receipt-text-outline', title: 'Transaksi', value: 'orders' },
  { to: '/order-items', icon: 'mdi-format-list-checks', title: 'Detail Item', value: 'order-items' },
];

const pageMeta = {
  Dashboard: { title: 'Dashboard', subtitle: 'Ringkasan performa toko Anda hari ini' },
  Products: { title: 'Manajemen Produk', subtitle: 'Kelola katalog produk toko Anda' },
  Users: { title: 'Daftar Pelanggan', subtitle: 'Manajemen profil dan kontak pelanggan' },
  Orders: { title: 'Daftar Transaksi', subtitle: 'Pantau semua pesanan dan penjualan' },
  OrderItems: { title: 'Detail Item Transaksi', subtitle: 'Rincian produk per pesanan' },
};

const currentPageTitle = computed(() => pageMeta[route.name]?.title || '');
const currentPageSubtitle = computed(() => pageMeta[route.name]?.subtitle || '');

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
};

const logout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};
</script>

<style scoped>
.sidebar-premium {
  background: rgba(var(--v-theme-surface), 0.85) !important;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-right: 1px solid rgba(148, 163, 184, 0.08) !important;
}

.appbar-premium {
  background: rgba(var(--v-theme-surface), 0.6) !important;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(148, 163, 184, 0.08) !important;
}

.brand-icon-wrapper {
  border-radius: 12px;
}

.letter-spacing-tight {
  letter-spacing: -0.02em;
}

.text-white-50 {
  color: rgba(255, 255, 255, 0.6);
}

.min-vh-100 {
  min-height: 100vh;
}
</style>
