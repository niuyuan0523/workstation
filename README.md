# 🚀 DevPortfolio - 个人项目展示站

> Niu Yuan 的个人工作站，展示个人项目和技术演示

## 📖 项目简介

这是一个基于 GitHub Pages 的多项目展示平台，用于集中展示和管理多个独立的前端项目。采用现代化的设计风格，支持动态配置项目卡片。

## ✨ 特性

- 🎨 **现代化 UI** - 采用 Tailwind CSS 打造玻璃态设计
- 📱 **响应式布局** - 完美适配桌面端和移动端
- 🔧 **动态配置** - 通过 `projects.js` 文件轻松管理项目
- 🚀 **零依赖部署** - 无需构建，直接部署到 GitHub Pages
- 🎯 **多项目托管** - 支持在同一仓库下部署多个子项目

## 📁 项目结构

```
workstation/
├── index.html          # 主页面入口
├── projects.js         # 项目配置文件
├── README.md           # 项目说明文档
├── .gitignore          # Git 忽略配置
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions 部署配置
└── 3d-display/         # 子项目：3D 晶体结构可视化
    ├── src/            # 源代码
    ├── package.json    # 项目依赖
    ├── vite.config.js  # Vite 配置
    └── README.md       # 子项目说明
```

## 🚦 快速开始

### 本地预览

直接双击 `index.html` 即可在浏览器中查看主页面。

### 查看子项目

```bash
# 进入 3D 展示项目
cd 3d-display

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## ⚙️ 配置说明

### 添加新项目

编辑 `projects.js` 文件，在 `projectsConfig.projects` 数组中添加新配置：

```javascript
{
    id: "project-d",
    title: "项目名称",
    description: "项目描述",
    tech: "技术栈",
    icon: "fa-图标名称",  // Font Awesome 图标
    color: "blue",        // blue/purple/green/orange
    url: "./项目路径/",
    status: "active"      // active/coming-soon
}
```

### 可用颜色主题

- `blue` - 蓝色渐变（适合技术类项目）
- `purple` - 紫色渐变（适合创意类项目）
- `green` - 绿色渐变（适合生态类项目）
- `orange` - 橙色渐变（适合创新类项目）
- `slate` - 灰色（用于未上线项目）

## 🌐 部署到 GitHub Pages

### 自动化部署

项目已配置 GitHub Actions，推送到主分支后自动部署：

1. 将代码推送到 GitHub 仓库的 `main` 分支
2. GitHub Actions 自动执行以下操作：
   - 构建 3D 展示项目（`3d-display`）
   - 准备部署目录（包含主页和子项目）
   - 自动部署到 GitHub Pages
3. 访问 `https://username.github.io/repo-name/`

### 手动触发部署

你也可以在 GitHub 仓库的 **Actions** 页面手动触发部署：

1. 进入仓库的 **Actions** 标签页
2. 选择 **Deploy to GitHub Pages** 工作流
3. 点击 **Run workflow** 按钮
4. 等待部署完成

### 部署结构

```
部署后目录结构：
/
├── index.html              # 主页面
├── projects.js             # 项目配置
└── 3d-display/             # 3D 展示子项目
    ├── assets/
    ├── index.html
    └── ...
```

### 注意事项

- 确保 `3d-display/vite.config.js` 中设置了 `base: './'` 或正确的路径
- 首次部署需要在仓库设置中启用 GitHub Pages
- 部署源应选择 **GitHub Actions**

## 🛠️ 技术栈

- **HTML5** - 语义化结构
- **Tailwind CSS** - 原子化 CSS 框架
- **Font Awesome** - 图标库
- **Vanilla JavaScript** - 原生 JS 实现
- **Vite** - 子项目构建工具（3D 展示）
- **Three.js** - 3D 渲染引擎（3D 展示）

## 📋 子项目列表

| 项目 | 描述 | 技术栈 | 状态 |
|------|------|--------|------|
| [3D 晶体结构可视化](./3d-display/) | 交互式 3D 晶体结构展示 | Three.js / Vite | ✅ 已完成 |
| Vue 3 管理系统 | 后台管理模板（待添加） | Vue 3 / Vite | 🚧 开发中 |
| React 电商前台 | 电商展示页面（待添加） | React / Tailwind | 🚧 开发中 |

## 📝 开发指南

### 代码规范

- 使用 ES6+ 语法
- 遵循 Airbnb JavaScript 风格指南
- 使用语义化命名
- 添加必要的注释

### 提交规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试相关
chore: 构建/工具相关
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👤 作者

**Niu Yuan**

- GitHub: [@Niuyuan0523](https://github.com/Niuyuan0523)

## 🙏 致谢

- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Font Awesome](https://fontawesome.com/) - 图标库
- [Three.js](https://threejs.org/) - 3D 渲染引擎
- [Vite](https://vitejs.dev/) - 构建工具

---

⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！
