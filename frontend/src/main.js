import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // 保留路由的引用
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

const app = createApp(App);

// 全局注册图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 使用插件
app.use(router); // 添加路由
app.use(ElementPlus);

app.mount('#app');
