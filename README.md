# Campus_Go - 跃动校园

> 一款基于 React 的移动端校园互动应用演示版，融合运动打卡、社交互动与虚拟宠物养成。

## 项目简介

Campus_Go（跃动校园）是一个面向校园用户的移动端互动平台。项目采用现代化的前端技术栈构建，通过手机模拟器框架展示核心功能，包括运动打卡、活动社交、积分商城和个人主页等模块。

## 技术栈

- **框架**: React 18
- **构建工具**: Vite 5
- **样式**: TailwindCSS 4
- **动画**: Framer Motion
- **Lottie 动画**: @lottiefiles/dotlottie-react
- **部署**: Vercel

## 功能模块

### 🏠 首页 (Home)
- 每日运动打卡
- 步数统计与能量值展示
- 虚拟宠物互动

### 🎉 活动 (Party)
- 校园活动列表
- 活动详情与报名
- 动态内容展示

### 🛒 商城 (Market)
- 积分兑换商品
- 虚拟物品购买
- 奖励领取

### 👤 我的 (Profile)
- 个人信息展示
- 成就与徽章
- 数据统计

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

启动后访问 `http://localhost:5173` 查看应用。

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
Campus_Go/
├── src/
│   ├── components/        # 可复用组件
│   │   ├── ActionSheet.jsx
│   │   ├── BottomSheet.jsx
│   │   ├── PhoneFrame.jsx
│   │   ├── TabBar.jsx
│   │   ├── Toast.jsx
│   │   └── TypewriterText.jsx
│   ├── data/              # 模拟数据
│   │   └── mockData.js
│   ├── tabs/              # 页面模块
│   │   ├── HomeTab.jsx
│   │   ├── PartyTab.jsx
│   │   ├── MarketTab.jsx
│   │   └── ProfileTab.jsx
│   ├── App.jsx            # 主应用组件
│   ├── index.css          # 全局样式
│   └── main.jsx           # 入口文件
├── public/
│   └── assets/            # 静态资源
│       ├── avatar/        # 头像资源
│       ├── icons/         # 图标资源
│       ├── map/           # 地图资源
│       ├── pets/          # Lottie 宠物动画
│       └── pics/          # 图片资源
├── docs/                  # 产品文档
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

## 开发指南

### 添加新页面

1. 在 `src/tabs/` 目录下创建新的组件文件
2. 在 `src/App.jsx` 中导入并注册到 `tabComponents` 对象
3. 在 `src/components/TabBar.jsx` 中添加对应的导航项

### 修改模拟数据

编辑 `src/data/mockData.js` 文件来更新用户数据、活动列表等模拟内容。

## 部署

项目已配置 Vercel 部署，推送到主分支后自动构建部署。

```bash
git push origin main
```

## 许可证

本项目仅供演示和学习使用。

---

**最后更新**: 2026-05-16
