# Campus_Go — 跃动校园

> 一款基于 React 的移动端校园互动应用演示系统，集运动打卡、社交互动与虚拟宠物养成于一体。

## 项目概述

Campus_Go（跃动校园）是面向校园场景的移动端互动平台。项目采用现代化的前端技术体系，通过手机模拟器框架呈现核心功能模块，涵盖运动打卡、活动社交、积分商城及个人主页等业务领域。

## 技术栈

| 类别 | 技术 |
|------|------|
| 核心框架 | React 18 |
| 构建工具 | Vite 5 |
| 样式方案 | TailwindCSS 4 |
| 动画引擎 | Framer Motion |
| Lottie 动画 | @lottiefiles/dotlottie-react |
| 部署平台 | Vercel |

## 功能模块

### 首页（Home）
- 每日运动打卡与日历记录
- 步数统计与能量值可视化
- 虚拟宠物实时互动

### 活动（Party）
- 校园活动浏览与分类检索
- 活动详情查看与报名
- 动态内容信息流展示

### 商城（Market）
- 积分兑换商品
- 虚拟物品购买
- 奖励领取管理

### 个人中心（Profile）
- 用户信息展示与编辑
- 成就徽章系统
- 数据统计看板

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

启动后访问 `http://localhost:5173` 即可查看应用。

### 生产构建

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

编辑 `src/data/mockData.js` 文件以更新用户数据、活动列表等模拟内容。

## 部署

项目已配置 Vercel 持续部署，推送至主分支后将自动触发构建与发布。

```bash
git push origin main
```

## 许可证

本项目仅供演示与学习用途。

---

**最后更新**: 2026-05-23
