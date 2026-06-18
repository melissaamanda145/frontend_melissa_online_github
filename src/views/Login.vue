<template>
  <v-container fluid class="fill-height login-bg justify-center align-center min-vh-100 pa-0">
    <!-- Floating Particles -->
    <div class="particles-container">
      <div class="particle" v-for="n in 8" :key="n"></div>
    </div>

    <v-row justify="center" align="center" class="w-100 ma-0" style="z-index: 1;">
      <v-col cols="12" sm="8" md="5" lg="4" xl="3" class="px-4">
        <!-- Login Card — Premium Glassmorphism -->
        <v-card
          class="glass-card pa-8 pa-md-10 overflow-hidden"
          max-width="440"
        >
          <!-- Decorative top gradient line -->
          <div class="login-accent-line"></div>

          <div class="text-center mb-8 mt-2">
            <!-- Brand Icon with gradient + glow -->
            <div class="d-flex justify-center mb-5">
              <div class="brand-logo-wrapper pulse-glow">
                <v-avatar size="72" class="gradient-primary elevation-8">
                  <v-icon icon="mdi-shopping" size="36" color="white"></v-icon>
                </v-avatar>
              </div>
            </div>
            <h1 class="text-h4 font-weight-black text-gradient-primary mb-1">TokoMeli</h1>
            <p class="text-body-2 text-medium-emphasis">Sistem Administrasi Toko Online</p>
          </div>

          <!-- Error Alert -->
          <v-alert
            v-if="errorMessage"
            type="error"
            variant="tonal"
            closable
            class="mb-5"
            rounded="lg"
            @click:close="errorMessage = ''"
          >
            {{ errorMessage }}
          </v-alert>

          <!-- Login Form -->
          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="username"
              label="Username"
              placeholder="Masukkan username"
              prepend-inner-icon="mdi-account-outline"
              density="comfortable"
              required
              class="mb-4"
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Password"
              placeholder="Masukkan password"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              :type="showPassword ? 'text' : 'password'"
              @click:append-inner="showPassword = !showPassword"
              density="comfortable"
              required
              class="mb-6"
            ></v-text-field>

            <!-- Submit Button with Gradient -->
            <v-btn
              type="submit"
              size="large"
              block
              rounded="lg"
              elevation="4"
              class="gradient-primary font-weight-bold text-capitalize text-white login-btn"
              :loading="isLoading"
              :disabled="isLoading"
            >
              <v-icon icon="mdi-login-variant" class="mr-2" size="20"></v-icon>
              Masuk Sekarang
            </v-btn>
          </v-form>

          <!-- Footer -->
          <div class="text-center mt-8">
            <v-divider class="mb-4 opacity-20"></v-divider>
            <span class="text-caption text-medium-emphasis">
              Tugas Praktikum Web &copy; 2026 — Melissa
            </span>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';

const router = useRouter();
const username = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);
const showPassword = ref(false);

// Endpoint 1: POST /api/login
const handleLogin = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';

    const response = await api.post('/login', {
      username: username.value,
      password: password.value
    });

    // Save token to localStorage
    localStorage.setItem('token', response.data.token);

    // Redirect to dashboard
    router.push('/');
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Gagal login, periksa koneksi internet Anda.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-bg {
  background: linear-gradient(135deg, #0B1120 0%, #1A1040 30%, #0B1120 60%, #0D1B2A 100%);
  position: relative;
  overflow: hidden;
}

.login-bg::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background:
    radial-gradient(ellipse at 30% 20%, rgba(79, 70, 229, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 60%, rgba(124, 58, 237, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 80%, rgba(225, 29, 72, 0.08) 0%, transparent 50%);
  animation: loginBgRotate 30s linear infinite;
}

@keyframes loginBgRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.login-accent-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4F46E5, #7C3AED, #E11D48, #7C3AED, #4F46E5);
  background-size: 200% 100%;
  animation: accentSlide 3s ease-in-out infinite;
}

@keyframes accentSlide {
  0%, 100% { background-position: 0% 0%; }
  50% { background-position: 100% 0%; }
}

.brand-logo-wrapper {
  border-radius: 50%;
}

.login-btn {
  letter-spacing: 0.03em;
  height: 48px !important;
  transition: transform 0.2s, box-shadow 0.2s;
}

.login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(79, 70, 229, 0.35) !important;
}
</style>
