import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Vuetify
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

// Global styles
import './style.css'

const customLightTheme = {
  dark: false,
  colors: {
    background: '#F0F2F5',
    surface: '#FFFFFF',
    'surface-variant': '#F5F7FA',
    'surface-bright': '#FFFFFF',
    primary: '#4F46E5',
    'primary-darken-1': '#4338CA',
    secondary: '#E11D48',
    'secondary-darken-1': '#BE123C',
    accent: '#7C3AED',
    error: '#DC2626',
    info: '#2563EB',
    success: '#059669',
    warning: '#D97706',
    'on-background': '#1E293B',
    'on-surface': '#334155',
    'on-primary': '#FFFFFF',
  },
}

const customDarkTheme = {
  dark: true,
  colors: {
    background: '#0B1120',
    surface: '#131B2E',
    'surface-variant': '#1A2440',
    'surface-bright': '#1E293B',
    primary: '#818CF8',
    'primary-darken-1': '#6366F1',
    secondary: '#FB7185',
    'secondary-darken-1': '#F43F5E',
    accent: '#A78BFA',
    error: '#F87171',
    info: '#60A5FA',
    success: '#34D399',
    warning: '#FBBF24',
    'on-background': '#E2E8F0',
    'on-surface': '#CBD5E1',
    'on-primary': '#FFFFFF',
  },
}

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: customLightTheme,
      dark: customDarkTheme,
    },
  },
  defaults: {
    VCard: {
      rounded: 'xl',
      elevation: 0,
    },
    VBtn: {
      rounded: 'lg',
    },
    VTextField: {
      variant: 'outlined',
      rounded: 'lg',
      color: 'primary',
    },
    VSelect: {
      variant: 'outlined',
      rounded: 'lg',
      color: 'primary',
    },
    VTextarea: {
      variant: 'outlined',
      rounded: 'lg',
      color: 'primary',
    },
    VChip: {
      rounded: 'lg',
    },
    VDialog: {
      rounded: 'xl',
    },
  },
})

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.mount('#app')
