# OneSub

OneSub 是一个开源的订阅管理平台，支持管理和生成代理节点（如 SSR、Vmess、Vless）的订阅链接。用户可以通过登录系统，方便地添加、编辑和删除订阅，并为每个节点链接添加备注。

## 特性

- **多协议支持**：支持 SSR、Vmess、Vless 等协议的订阅管理。
- **订阅链接生成**：为代理工具（如 V2RayN、Shadowrocket）提供自动同步更新的订阅链接。
- **用户登录**：通过 GitHub OAuth 实现用户登录，确保安全性。
- **节点备注**：为每个节点链接添加备注，更加人性化。
- **响应式设计**：基于 Element Plus UI 组件，界面美观现代。
- **开源**：任何人都可以访问和使用源代码。

## 项目结构

```
OneSub
├── backend               # 后端代码（Node.js + SQLite）
├── frontend              # 前端代码（Vue.js + Element Plus）
├── screenshots           # 项目截图
├── LICENSE               # 许可证文件
└── README.md             # 项目说明文件
```

---

## 技术栈

- **后端**：
  - Node.js
  - Express
  - Passport.js (GitHub OAuth)
  - SQLite
- **前端**：
  - Vue.js 3
  - Element Plus
  - Axios

---

## 截图

### 订阅管理界面
![Subscription Dashboard](https://github.com/WizisCool/OneSub/raw/main/screenshots/dashboard.png)

---

## 开源协议

该项目基于 [MIT License](https://github.com/WizisCool/OneSub/blob/main/LICENSE) 开源，欢迎自由使用。

---

## 作者

@WizisCool  
GitHub 项目地址：[OneSub](https://github.com/WizisCool/OneSub)
