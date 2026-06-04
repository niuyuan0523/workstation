/**
 * 项目配置文件
 * 在此文件中添加、修改或删除项目
 */

// 颜色映射配置
const colorMap = {
    blue: {
        gradient: 'from-blue-600 to-cyan-600',
        bg: 'bg-blue-500/20',
        text: 'text-blue-400',
        hoverBg: 'group-hover:bg-blue-500',
        linkText: 'text-blue-400'
    },
    purple: {
        gradient: 'from-purple-600 to-pink-600',
        bg: 'bg-purple-500/20',
        text: 'text-purple-400',
        hoverBg: 'group-hover:bg-purple-500',
        linkText: 'text-purple-400'
    },
    green: {
        gradient: 'from-green-600 to-emerald-600',
        bg: 'bg-green-500/20',
        text: 'text-green-400',
        hoverBg: 'group-hover:bg-green-500',
        linkText: 'text-green-400'
    },
    orange: {
        gradient: 'from-orange-600 to-red-600',
        bg: 'bg-orange-500/20',
        text: 'text-orange-400',
        hoverBg: 'group-hover:bg-orange-500',
        linkText: 'text-orange-400'
    },
    slate: {
        gradient: '',
        bg: 'bg-slate-700/50',
        text: 'text-slate-500',
        hoverBg: '',
        linkText: 'text-slate-600'
    }
};

// 项目配置数据
const projectsConfig = {
    projects: [
        {
            id: "project-a",
            title: "3D 晶体结构可视化",
            description: "一个基于Three.js的交互式3D晶体结构可视化系统，用于展示不同晶系的立方体及其对称面。",
            tech: "Three.js / Vite",
            icon: "fa-cube",
            color: "blue",
            url: "./3d-display/",
            status: "active"
        },
        {
            id: "project-b",
            title: "Hive-UI组件库展示",
            description: "Hive-UI 是一个基于 Vue 3 的组件库，提供了丰富的组件和功能，帮助开发者快速构建美观且功能丰富的 Web 应用。",
            tech: "Vue 3 / Vite",
            icon: "fa-rocket",
            color: "purple",
            url: "./hive-ui/",
            status: "active"
        },
        {
            id: "project-c",
            title: "React 电商前台",
            description: "使用 React 18 + Tailwind CSS 开发的电商展示页面。包含购物车逻辑、商品筛选和响应式布局。",
            tech: "React / Tailwind",
            icon: "fa-cart-shopping",
            color: "green",
            url: "./project-b/",
            status: "active"
        },
        {
            id: "git-ultra",
            title: "Git Ultra - 智能Git工作流",
            description: "功能强大的Git命令行工具，集成AI辅助提交信息生成，支持Conventional Commits规范，提高团队开发效率。",
            tech: "Node.js / AI / CLI",
            icon: "🚀",
            color: "orange",
            url: "./git-ultra/",
            status: "active"
        },
        {
            id: "project-d",
            title: "更多项目...",
            description: "正在开发中。后续将在此处添加更多演示项目，如 Node.js 全栈应用或其他创意项目。",
            tech: "Coming Soon",
            icon: "fa-code",
            color: "slate",
            url: "#",
            status: "coming-soon"
        }
    ]
};
