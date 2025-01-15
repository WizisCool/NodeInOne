# OneSub
OneSub 是一个开源的订阅管理平台，支持管理和生成代理节点（如 SSR、Vmess、Vless）的订阅链接。用户可以通过登录系统，方便地添加、编辑和删除订阅，并为每个节点链接添加备注。

## 随笔
你是否也有这样的困扰：小鸡越来越多，搭建的节点也越来越多。并且手上拥有多个平台，如 iOS, Linux, macOS, Windows；不同平台使用不同代理工具（如 V2RayN, 圈X, 小火箭）。
然而，不同代理工具又无法互相同步，搭建 V2board 或 sspanel 又太复杂不轻量。

写到一半发现已经有较为成熟的项目 [Sub-Store](https://github.com/sub-store-org/Sub-Store) 故此项目就写这样吧,需要更多功能可以提交issue或者看看SubStore是否适合你

## 特性

- **多协议支持**：支持 SSR、Vmess、Vless 等协议的订阅管理。
- **订阅链接生成**：为代理工具（如 V2RayN、Shadowrocket）提供自动同步更新的订阅链接。
- **用户登录**：通过 GitHub OAuth 实现用户登录，确保安全性。
- **节点备注**：为每个节点链接添加备注，更加人性化。
- **响应式设计**：基于 Element Plus UI 组件，界面美观现代。
- **开源**：任何人都可以访问和使用源代码。

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

# 部署教程

本教程将指导您如何部署和运行 OneSub 项目。

## 前置要求

1. 安装 [Node.js](https://nodejs.org/)（建议使用 LTS 版本）。
2. 安装 [Git](https://git-scm.com/)（可选，但推荐）。

## 部署步骤

### 1. 下载发布包

- 前往 [Releases](https://github.com/WizisCool/OneSub/releases) 页面。
- 下载最新的发布包（例如 `OneSub-v1.0.0.zip`）。

### 2. 解压发布包

- 将下载的压缩包解压到您选择的目录。
- 解压后的目录结构如下：
  ```
  OneSub
  ├── backend               # 后端代码
  ├── frontend              # 前端代码
  ├── .env                  # 环境变量配置文件
  ├── package.json          # 项目依赖配置文件
  └── README.md             # 项目说明文件
  ```

### 3. 配置环境变量

- 打开项目根目录中的 `.env` 文件。
- 根据您的环境修改以下字段：

  ```env
  PORT=3000  # 服务运行的端口
  GITHUB_CLIENT_ID=您的GitHub OAuth应用程序客户端ID
  GITHUB_CLIENT_SECRET=您的GitHub OAuth应用程序客户端密钥
  BASE_URL=您的服务地址（例如 http://localhost:3000）
  ```

  **注意**：
  - 若您尚未创建 GitHub OAuth 应用，请前往 [GitHub Developer Settings](https://github.com/settings/developers) 创建一个应用。
  - 请将 `Authorization callback URL` 设置为 `http://<您的服务地址>/auth/github/callback`。

### 4. 安装依赖

- 打开终端，进入项目根目录。
- 执行以下命令安装依赖：

  ```bash
  npm install
  ```

### 5. 启动服务

- 在终端中运行以下命令启动服务：

  ```bash
  node server.js
  ```

- 如果一切正常，您将看到类似以下的输出：

  ```
  Server running on port 3000
  Database connected successfully.
  ```

### 6. 访问服务

- 打开浏览器，访问 `http://localhost:3000`。
- 使用 GitHub 登录后，即可管理您的订阅。

## 常见问题

### 1. 数据库文件未创建

- 确保项目根目录有 `database` 文件夹。
- 如果没有，请手动创建一个 `database` 文件夹。

### 2. 服务无法启动

- 检查 `.env` 文件配置是否正确。
- 确保 Node.js 版本符合要求。

### 3. GitHub OAuth 登录失败

- 检查 GitHub OAuth 应用的 `Client ID` 和 `Client Secret` 是否正确。
- 确保 `Authorization callback URL` 设置正确。

## 支持

该项目基于 [MIT License](https://github.com/WizisCool/OneSub/blob/main/LICENSE) 开源，欢迎自由使用。

如有问题，请提交 [Issue](https://github.com/WizisCool/OneSub/issues) 或联系作者 [@WizisCool](https://github.com/WizisCool)。

---

感谢您使用 OneSub！

