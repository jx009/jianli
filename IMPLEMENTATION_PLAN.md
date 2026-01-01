# 老鱼简历复刻项目实施方案 (Implementation Plan)

本方案旨在 1:1 复刻“老鱼简历”网站的前端视觉风格与核心业务功能。项目将分为前端（Client）与后端（Server）两部分进行开发，并最终提供 **Docker 一键部署** 能力。

## 1. 技术栈选型 (Tech Stack)

### 前端 (Client)
*   **框架**: React 18 + Vite (高性能现代化构建工具)
*   **UI 组件库**: Ant Design 5.x (原站深度使用 Ant Design，使用此库可最快还原 UI)
*   **样式处理**: CSS Modules + 原站 CSS 复用 (直接引入 `htmlCopy` 中的 CSS 资源以保证 1:1 还原)
*   **状态管理**: Zustand (管理简历数据、模块排序、全局配置)
*   **拖拽库**: `@dnd-kit/core` & `@dnd-kit/sortable` (实现简历模块的自由拖拽排序)
*   **路由**: React Router 6
*   **服务器**: Nginx (在 Docker 中作为静态资源服务器)

### 后端 (Server)
*   **运行时**: Node.js
*   **框架**: Express
*   **数据库**: MySQL 8.0 (关系型数据库，存储用户信息和简历结构)
*   **ORM**: Prisma (现代、类型安全且易于维护)
*   **PDF 生成**: Puppeteer (Headless Chrome，确保生成“WPS 级”高质量 PDF)
*   **鉴权**: 微信开放平台 API (服务号登录)

### 部署与运维 (DevOps)
*   **容器化**: Docker
*   **编排**: Docker Compose (实现一键启动 前端 + 后端 + 数据库)

---

## 2. 目录结构规划 (Project Structure)

```text
/mnt/c/jxProject/jianli/
├── IMPLEMENTATION_PLAN.md  # 本方案文件
├── docker-compose.yml      # Docker 一键部署编排文件
├── htmlCopy/               # 参考素材 (已存在)
├── client/                 # 前端项目
│   ├── Dockerfile          # 前端镜像构建文件
│   ├── nginx.conf          # Nginx 配置 (反向代理 /api 到后端)
│   ├── public/             # 存放 htmlCopy 中的静态资源
│   ├── src/
│   │   ├── components/     # 通用组件
│   │   ├── pages/
│   │   │   ├── Home/       # 首页
│   │   │   ├── Template/   # 模板中心
│   │   │   ├── Editor/     # 简历编辑器 (核心)
│   │   │   └── Dashboard/  # [新增] 我的简历 (历史记录)
│   │   ├── store/          # 状态管理
│   └── index.html
└── server/                 # 后端项目
    ├── Dockerfile          # 后端镜像构建文件
    ├── src/
    │   ├── config/
    │   ├── prisma/         # Prisma Schema (MySQL 定义: User, Resume)
    │   ├── controllers/    # 包含 ResumeController (增删改查)
    │   ├── services/
    │       └── pdfService.js # Puppeteer 导出逻辑
    └── package.json
```

---

## 3. 详细功能实现步骤

### 第一阶段：项目初始化与静态资源迁移 (Setup & Assets)
1.  **初始化 Client**: 使用 Vite 创建 React 项目。
2.  **资源迁移**: 将 `htmlCopy/**_files` 中的资源迁移至 `client/public/static/`，并在 `index.html` 中引入核心 CSS，确保全局样式变量 (`--ant-blue` 等) 生效。
3.  **初始化 Server**: 搭建 Express + Prisma 环境，配置 MySQL 连接。

### 第二阶段：首页与模板中心复刻 (Home & Templates)
**目标**: 视觉 1:1 还原，实现模板选择功能。

1.  **首页 (Home)**: 拆解 DOM 结构，应用原站 CSS 类名，还原 Hero 区域和特性介绍。
2.  **模板中心**: 实现网格布局，鼠标悬停交互，点击“使用模板”跳转逻辑。

### 第三阶段：简历编辑器与数据持久化 (Editor & Persistence) - **重难点**
**目标**: 高自由度编辑、保存草稿、继续编辑。

1.  **编辑器布局**: 左侧组件库、中间 A4 画布 (210mm x 297mm)、右侧属性面板。
2.  **数据结构**: 定义标准的 JSON Resume Schema。
    ```javascript
    // 存入 MySQL Resume 表的 content 字段
    {
      "config": { "font": "Roboto", "color": "#24be58" },
      "modules": [ ... ] // 模块数组
    }
    ```
3.  **核心功能**:
    *   **拖拽排序**: `@dnd-kit` 实现模块上下移动。
    *   **实时编辑**: 每次操作更新 Zustand Store。
    *   **保存机制**:
        *   **自动保存**: 监听 Store 变化，防抖 (Debounce) 后调用 `PUT /api/resumes/:id`。
        *   **手动保存**: 顶部增加“保存”按钮。

### 第四阶段：用户中心与历史记录 (User Dashboard) - **[新增]**
**目标**: 管理历史简历。

1.  **我的简历页 (Dashboard)**:
    *   展示用户所有简历列表（卡片式布局）。
    *   显示信息：缩略图（可选）、标题、最后修改时间。
    *   **操作**:
        *   **继续编辑**: 点击跳转到 `/editor/:resumeId`。
        *   **复制**: 基于现有简历创建副本。
        *   **删除**: 软删除或物理删除。
2.  **后端接口**:
    *   `GET /api/resumes`: 获取当前用户的所有简历。
    *   `GET /api/resumes/:id`: 获取特定简历的详细 JSON 数据（用于回显到编辑器）。
    *   `POST /api/resumes`: 从模板创建新简历。
    *   `PUT /api/resumes/:id`: 更新简历内容。

### 第五阶段：后端服务与导出 (Backend & Export)
1.  **微信登录**: 实现微信回调接口，结合 Prisma 存储用户数据。
2.  **PDF 导出 (Puppeteer)**:
    *   后端启动 Headless Chrome。
    *   **关键点**: 在 Docker 环境中正确安装中文字体 (`fonts-noto-cjk`, `wqy-zenhei`)，防止导出 PDF 乱码。
    *   生成 A4 格式 PDF 并返回流。

### 第六阶段：Docker 化与一键部署 (Dockerization)
1.  **编写 `client/Dockerfile`**: 多阶段构建 (Build -> Nginx Serve)。
2.  **编写 `server/Dockerfile`**: 安装 Chromium 依赖和中文字体。
3.  **编写 `docker-compose.yml`**: 编排 MySQL, Server, Client。

---

## 4. Docker 部署说明 (Deployment)

开发完成后，您只需在服务器上运行以下命令即可启动整个应用：

```bash
# 1. 启动服务
docker-compose up -d --build

# 2. 初始化数据库 (首次运行)
docker-compose exec server npx prisma db push
```

### 环境变量配置 (.env)

项目根目录需配置 `.env` 文件 (Docker Compose 会自动读取)：

```env
# MySQL 配置
MYSQL_ROOT_PASSWORD=root_password
MYSQL_DATABASE=jianli
MYSQL_USER=jianli_user
MYSQL_PASSWORD=jianli_password

# 后端配置
DATABASE_URL="mysql://jianli_user:jianli_password@db:3306/jianli"
WECHAT_APP_ID=your_wx_app_id
WECHAT_APP_SECRET=your_wx_app_secret

# 端口映射
PORT=3000
```
