import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/items/PublicItemsView.vue'),
    meta: { public: true },
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('../views/auth/AuthView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/login',
    redirect: (to) => ({
      name: 'auth',
      query: {
        ...to.query,
        tab: 'login',
      },
    }),
  },
  {
    path: '/register',
    redirect: (to) => ({
      name: 'auth',
      query: {
        ...to.query,
        tab: 'register',
      },
    }),
  },
  {
    path: '/items/:id',
    name: 'item-detail',
    component: () => import('../views/items/ItemDetailView.vue'),
    meta: { public: true },
  },
  {
    path: '/dashboard/owner/items',
    name: 'owner-items',
    component: () => import('../views/items/OwnerItemsView.vue'),
    meta: { requiresAuth: true, role: 'OWNER' },
  },
  {
    path: '/dashboard/rentals',
    name: 'my-rentals',
    component: () => import('../views/rentals/MyRentalsView.vue'),
    meta: { requiresAuth: true, role: 'RENTER' },
  },
  {
    path: '/dashboard/owner/rentals',
    name: 'owner-rentals',
    component: () => import('../views/rentals/OwnerRentalsView.vue'),
    meta: { requiresAuth: true, role: 'OWNER' },
  },
  {
    path: '/rentals/:id',
    name: 'rental-detail',
    component: () => import('../views/rentals/RentalDetailView.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (!authStore.initialized) {
    await authStore.initialize();
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'auth', query: { redirect: to.fullPath, tab: 'login' } };
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return authStore.user?.role === 'OWNER'
      ? { name: 'owner-items' }
      : { name: 'my-rentals' };
  }

  if (to.meta.role && authStore.user?.role !== to.meta.role) {
    return { name: 'home' };
  }

  return true;
});

export default router;
