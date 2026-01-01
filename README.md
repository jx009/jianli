# jianli

本项目是基于 React + Node.js 的简历制作平台，支持所见即所得编辑、模块拖拽、数据持久化及高质量 PDF 导出。

## 🛠️ 技术栈

*   **前端**: React 18, Vite, Ant Design, Zustand, @dnd-kit
*   **后端**: Express, Prisma, MySQL, Puppeteer (Headless Chrome)
*   **部署**: Docker, Docker Compose, GitHub Actions

## 🚀 快速开始 (本地开发)

### 1. 启动数据库与服务
本项目包含完整的 Docker 编排。

```bash
# 启动 MySQL, Backend, Frontend
docker-compose up -d --build

# (首次运行) 初始化数据库结构
docker-compose exec server npx prisma db push
```

访问:
*   前端: http://localhost:80
*   后端 API: http://localhost:3000

---

## 📦 CI/CD 部署说明

本项目已配置 GitHub Actions 自动构建 Docker 镜像。

### 1. 配置 GitHub Secrets
在 GitHub 仓库的 `Settings` -> `Secrets and variables` -> `Actions` 中添加以下变量：

| Secret Name | 说明 |
| :--- | :--- |
| `DOCKER_USERNAME` | 你的 Docker Hub 用户名 |
| `DOCKER_PASSWORD` | 你的 Docker Hub Token 或密码 |

### 2. 自动构建流程
*   当代码 Push 到 `main` 分支时，Action 会自动触发。
*   **Client** 镜像将被推送到: `docker.io/<username>/jianli-client:latest`
*   **Server** 镜像将被推送到: `docker.io/<username>/jianli-server:latest`

### 3. 服务器部署 (生产环境)
在生产服务器上，使用以下 `docker-compose.prod.yml` (需手动创建或修改原 compose 文件) 拉取最新镜像运行：

```yaml
version: '3.8'
services:
  db:
    image: mysql:8.0
    # ... (同开发配置)
  
  server:
    image: <your-docker-username>/jianli-server:latest
    restart: always
    # ... (环境变量)

  client:
    image: <your-docker-username>/jianli-client:latest
    restart: always
    ports:
      - "80:80"
```
