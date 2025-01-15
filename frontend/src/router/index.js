import { createRouter, createWebHistory } from 'vue-router';
import UserDashboardView from '../views/UserDashboardView.vue';
import UserLoginView from '../views/UserLoginView.vue';
import { checkAuthStatus } from '../auth'; // 导入认证状态检查函数

const routes = [
  {
    path: '/', // 登录页
    name: 'UserLoginView',
    component: UserLoginView,
  },
  {
    path: '/dashboard', // 订阅管理页面
    name: 'UserDashboardView',
    component: UserDashboardView,
    beforeEnter: async (to, from, next) => {
      const isAuthenticated = await checkAuthStatus();
      if (!isAuthenticated) {
        window.location.href = '/auth/github'; // 重定向到 GitHub OAuth 登录
      } else {
        next(); // 允许访问
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
