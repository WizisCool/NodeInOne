import { createRouter, createWebHistory } from 'vue-router';
import UserLoginView from '../views/UserLoginView.vue';
import UserDashboardView from '../views/UserDashboardView.vue';

const routes = [
  { path: '/', component: UserLoginView },
  { path: '/dashboard', component: UserDashboardView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;