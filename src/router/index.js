import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Products from '../views/Products.vue';
import Users from '../views/Users.vue';
import Orders from '../views/Orders.vue';
import OrderItems from '../views/OrderItems.vue';

const routes = [
  { path: '/login', component: Login, name: 'Login' },
  { 
    path: '/', 
    component: Dashboard, 
    name: 'Dashboard',
    meta: { requiresAuth: true }
  },
  { 
    path: '/products', 
    component: Products, 
    name: 'Products',
    meta: { requiresAuth: true }
  },
  { 
    path: '/users', 
    component: Users, 
    name: 'Users',
    meta: { requiresAuth: true }
  },
  { 
    path: '/orders', 
    component: Orders, 
    name: 'Orders',
    meta: { requiresAuth: true }
  },
  { 
    path: '/order-items', 
    component: OrderItems, 
    name: 'OrderItems',
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guard: check auth token before routing
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if (to.path === '/login' && token) {
    next('/');
  } else {
    next();
  }
});

export default router;
