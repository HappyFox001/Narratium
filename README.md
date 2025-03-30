# Narratium - 无限文本冒险 (Infinite Text Adventure)

Narratium 是一个基于人工智能的文本冒险游戏平台，结合了先进的自然语言处理技术与传统文字冒险游戏的魅力，为玩家提供沉浸式的互动故事体验。

## 🌟 特色功能

- **无限故事生成**：基于玩家的选择动态生成故事情节，每次游戏体验都独一无二
- **角色定制**：创建和定制您自己的游戏角色，影响游戏世界和故事发展
- **多语言支持**：支持中文和英文，为不同语言的玩家提供本地化体验
- **故事分享**：创建、分享和探索其他玩家创建的故事框架
- **流式响应**：实时生成故事内容，提供流畅的游戏体验
- **GraphRAG 知识检索**：利用图形检索增强生成技术，提供更加丰富和连贯的故事背景

## 🛠️ 技术架构

### 后端 (Backend)

- **FastAPI**：高性能的 Python Web 框架，提供 RESTful API
- **LangChain**：AI 模型集成框架，用于构建复杂的 AI 应用
- **GraphRAG**：Microsoft 的图形检索增强生成库，用于知识图谱构建和检索
- **SQLAlchemy/Supabase**：数据库 ORM 和云数据库支持，可无缝切换
- **OpenAI/Ollama**：支持多种 LLM 模型，包括本地部署和云端 API

### 前端 (Frontend)

- **Next.js**：React 框架，提供服务端渲染和静态生成
- **TypeScript**：类型安全的 JavaScript 超集
- **Supabase Auth**：集成 Google OAuth 认证
- **Tailwind CSS**：实用优先的 CSS 框架，用于构建现代化 UI

## 🚀 快速开始

### 后端设置

1. 克隆仓库并安装依赖：

```bash
git clone https://github.com/yourusername/OpenWorld.git
cd OpenWorld
pip install -r requirements.txt
```

2. 配置环境变量：

```bash
cp .env.example .env
# 编辑 .env 文件，填入必要的 API 密钥和配置
```

3. 启动后端服务：

```bash
python main.py
```

服务将在 http://localhost:8000 上运行。

### 前端设置

1. 进入前端目录并安装依赖：

```bash
cd narratium-fronted
npm install
# 或
pnpm install
```

2. 启动开发服务器：

```bash
npm run dev
# 或
pnpm dev
```

前端将在 http://localhost:3000 上运行。

## 🔄 数据库配置

项目支持两种数据库配置：

1. **本地 PostgreSQL**：默认配置，适合开发环境
2. **Supabase 云数据库**：通过设置 `USE_SUPABASE=true` 环境变量启用

数据库迁移：

```bash
python narratium/db/db_migrate.py
```

## 🧪 测试

运行集成测试：

```bash
# 先启动 API 服务
python main.py

# 在另一个终端运行测试
python scripts/test_live_api.py
```

## 🌐 API 文档

启动服务后，访问 http://localhost:8000/docs 查看完整的 API 文档。

主要 API 端点：

- `/initialize` - 初始化游戏实例
- `/setup` - 设置新游戏
- `/action` - 执行游戏动作
- `/stories` - 故事管理
- `/sessions` - 游戏会话管理

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出新功能建议！请遵循以下步骤：

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

[MIT License](LICENSE)

## 📧 联系方式

如有任何问题或建议，请通过 [issues](https://github.com/yourusername/OpenWorld/issues) 联系我们。

---

*Narratium - 让每一个故事都是一次冒险*