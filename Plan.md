# 「跃动校园 / Campus Go」开发参考手册

> **核心原则**：Apple Minimalist——字重代替颜色，留白代替分割线，弹簧物理代替线性动效。

---

## 一、完整素材清单

```
src/
├── avatar/
│   └── girl.png                    → Tab2 社交匹配"学姐"圆形头像
├── icons/
│   ├── bulb-dynamic-color.png      → Tab3 任务列表"占座"图标
│   ├── clock-dynamic-color.png     → Tab3 任务列表"限时"图标
│   ├── flash-dynamic-color.png     → Tab1 数据看板"能量"图标 / 成就标签
│   ├── gym-dynamic-color.png       → Tab3 任务"运动"图标 / Tab4 徽章
│   ├── thumb-up-dynamic-color.png  → Tab2 搭档卡片点赞 / Tab4 徽章
│   ├── trophy-dynamic-color.png    → Tab4 成就徽章列表
│   └── trophy-dynamic-gradient.png → Tab4 荣誉陈列架主展品（重点展示）
├── map/
│   └── map.png                     → Tab1 雷达全屏底图
├── pets/
│   ├── MoodyGiraffe.lottie         → 宠物状态：开心/活跃
│   ├── MoodyLlama.lottie           → 宠物状态：待机默认
│   ├── MoodyWolf.lottie            → 宠物状态：运动中
│   ├── SweetRunCycle.lottie        → 宠物状态：奔跑（跑步后解锁）
│   └── WalkingDuck.lottie          → 宠物状态：散步
└── pics/
    ├── 猫抓老鼠 (追逃).jpg          → Tab2 活动卡片 #1
    ├── 校园躲猫猫 (隐藏).jpg        → Tab2 活动卡片 #2
    └── 末日逃亡 (生存).jpg          → Tab2 活动卡片 #3
```

---

## 二、技术栈与项目初始化

### 依赖安装

```bash
npm create vite@latest campus-go -- --template react
cd campus-go
npm install
npm install tailwindcss @tailwindcss/vite
npm install framer-motion
npm install @lottiefiles/dotlottie-react
```

> **注意**：Lottie 文件为 `.lottie` 格式（非 `.json`），必须用 `@lottiefiles/dotlottie-react`，不能用 `lottie-react`。

### Tailwind 配置（vite.config.js）

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### CSS 全局规范（index.css）

```css
@import "tailwindcss";

* { -webkit-tap-highlight-color: transparent; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  background: #000;           /* 手机外壳外侧黑色背景 */
  overscroll-behavior: none;
}
```

---

## 三、项目文件结构

```
src/
├── assets/                    （将 src/ 素材复制至此）
│   ├── avatar/girl.png
│   ├── icons/*.png
│   ├── map/map.png
│   ├── pets/*.lottie
│   └── pics/*.jpg
├── data/
│   └── mockData.js            唯一数据源
├── components/
│   ├── PhoneFrame.jsx          iPhone 外壳 Mockup
│   ├── TabBar.jsx              底部导航栏（毛玻璃）
│   ├── Toast.jsx               顶部系统级提示
│   └── ActionSheet.jsx         iOS 确认操作表单
├── tabs/
│   ├── HomeTab.jsx             Tab1：探索
│   ├── PartyTab.jsx            Tab2：派对
│   ├── MarketTab.jsx           Tab3：集市
│   └── ProfileTab.jsx          Tab4：大本营
└── App.jsx
```

---

## 四、全局色彩与设计 Token

| 用途 | 值 | Tailwind 写法 |
|------|-----|---------------|
| 背景（主） | `#FFFFFF` | `bg-white` |
| 背景（次） | `#F2F2F7` | `bg-[#F2F2F7]` |
| 主文字 | `#000000` | `text-black` |
| 次级文字 | `#8E8E93` | `text-[#8E8E93]` |
| **全局唯一强调色** | `#34C759`（亮绿）| `bg-[#34C759]` |
| 分割线 | `#E5E5EA` | `border-[#E5E5EA]` |
| 毛玻璃卡片 | `bg-white/70 backdrop-blur-md` | — |

**字重规范**：
- 大标题数字：`font-black`（900）
- 模块标题：`font-bold`（700）
- 正文：`font-normal`（400）
- 次级说明：`font-light text-[#8E8E93]`

---

## 五、核心组件规范

### 5.1 PhoneFrame.jsx（iPhone 外壳）

```jsx
// 桌面端显示手机外壳，移动端直接全屏
// 外壳尺寸：393×852px（iPhone 14 Pro 逻辑分辨率）
// 内容区：圆角 overflow-hidden，隐藏溢出内容

export default function PhoneFrame({ children }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      {/* 手机外壳：仅桌面端显示 */}
      <div className="relative w-[393px] h-[852px] bg-white rounded-[54px] overflow-hidden
                      shadow-[0_0_0_12px_#1a1a1a,0_0_0_14px_#3a3a3a]
                      md:block hidden">
        {/* 刘海 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[126px] h-[37px]
                        bg-black rounded-b-[20px] z-50" />
        {children}
      </div>
      {/* 移动端：直接全屏 */}
      <div className="md:hidden w-full h-full min-h-screen">
        {children}
      </div>
    </div>
  )
}
```

### 5.2 TabBar.jsx（底部导航）

```jsx
// 毛玻璃底部导航，4个 Tab
// 图标使用 emoji，强调色高亮当前 Tab
// position: fixed bottom-0，安全区适配 pb-safe

const tabs = [
  { id: 'home',    icon: '🗺️', label: '探索'  },
  { id: 'party',  icon: '🎮', label: '派对'  },
  { id: 'market', icon: '🏪', label: '集市'  },
  { id: 'me',     icon: '👤', label: '大本营' },
]
// 外层：fixed bottom-0 w-full bg-white/70 backdrop-blur-md border-t border-[#E5E5EA]
// 当前 Tab：text-[#34C759]，其他：text-[#8E8E93]
```

### 5.3 Toast.jsx（系统级提示）

```jsx
// 从顶部滑入，2秒后自动消失
// Framer Motion：initial y:-80 → animate y:0，exit y:-80
// 外观：bg-black/80 text-white backdrop-blur-md rounded-2xl px-5 py-3
// 位置：top-14（状态栏下方）fixed z-50
```

### 5.4 ActionSheet.jsx（iOS 确认操作表单）

```jsx
// 从底部升起的全局遮罩确认弹窗
// 结构：半透明黑色遮罩 + 底部白色圆角卡片
// 两个按钮：确认（text-[#34C759] font-bold）+ 取消（text-[#8E8E93]）
// Framer Motion：y:300 → y:0，spring({ damping: 20, stiffness: 200 })
```

---

## 六、Tab 详细开发规范

### Tab 1：【探索】HomeTab.jsx

**布局**：全屏，三层叠加（地图层 → 宠物层 → 数据层）

#### 阶段一：雷达动效（进入页面自动播放）

```
① 全屏显示 map.png（object-cover，高对比度滤镜：brightness-110 contrast-105）
② Framer Motion：以屏幕中心为原点，3-5 个细线圆圈向外扩散
   - 每圈：border-2 border-[#34C759]/40，初始 scale:0.1 opacity:0.8 → scale:3 opacity:0
   - staggerChildren 0.4s，repeat Infinity
③ 扫描进行中，地图上随机浮现 8-12 个白色圆点（w-3 h-3 bg-white rounded-full shadow）
   - staggerChildren 逐一出现，animate：scale 0→1，duration 0.3s
④ 1.5秒后，地图某固定坐标弹出【盲盒】
   - 外观：白色圆角正方形，内含 🎁 emoji，阴影清晰
   - 动效：scale 0→1.1→1，spring
⑤ 盲盒出现 3 秒后：地图整体缩小退场
   - 动效：scale 1→0.15，x:左上角偏移，duration 0.6s，ease "easeInOut"
   - 缩小后停靠左上角，变成一个可点击的小地图缩略图
```

#### 阶段二：宠物互动区（雷达退场后主视觉）

```
背景：纯白 bg-white
宠物展示区：屏幕垂直居中，高 240px

当前激活宠物：DotLottie 组件，autoplay loop
底部切换指示器：5个小圆点，当前点亮白色，其他灰色

点击宠物区域：循环切换5种 Lottie 动画
动画顺序：MoodyLlama（默认）→ MoodyGiraffe → MoodyWolf → WalkingDuck → SweetRunCycle

宠物名称：大字重显示，切换时 AnimatePresence 淡入淡出
```

#### 阶段三：数据看板（下滑可见）

```
Apple Health 风格卡片（bg-[#F2F2F7] rounded-3xl p-6 mx-4）：
┌─────────────────────────────┐
│  今日步数                    │
│  8,420        ████████░░  │ ← 环形或粗线条进度条
│  ⚡ flash图标  目标 10,000步  │
└─────────────────────────────┘

数据网格（2列）：
┌──────────┬──────────┐
│ 🔥 运动   │ ⏱ 时长   │
│  42 min  │  3.2 km  │
└──────────┴──────────┘

所有数字：font-black text-4xl text-black
标签：font-light text-sm text-[#8E8E93]
```

---

### Tab 2：【派对】PartyTab.jsx

#### 模块A：活动卡片轮播

```
容器：overflow-x-scroll，snap-x snap-mandatory，-ms-overflow-style:none（隐藏滚动条）
每张卡片：w-[340px] h-[200px] rounded-[28px] overflow-hidden flex-shrink-0 snap-center

卡片内部：
- 背景：对应活动图片，object-cover
- 叠加：linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.7) 100%)
- 左下角：emoji + 粗白体标题（text-white font-black text-xl）+ 副标题（text-white/70 text-sm）

三张卡片内容：
① 🐱 猫抓老鼠   → 猫抓老鼠 (追逐).jpg  → 副标题"全校追逃模拟"
② 🙈 校园躲猫猫 → 校园躲猫猫 (隐藏).jpg → 副标题"区域寻人挑战"
③ 🧟 末日逃亡   → 末日逃亡 (生存).jpg  → 副标题"生存计步挑战"

点击卡片：Framer Motion layoutId 实现无缝放大至全屏详情页
全屏页：同图片背景 + 白色内容区从底部升起（毛玻璃卡片）
```

#### 模块B：运动羁绊匹配

```
入口：
  - 标题"运动羁绊"font-bold text-xl
  - 副标题"找到最适合你的运动搭档" text-[#8E8E93] text-sm
  - 按钮：bg-[#34C759] text-white font-bold rounded-2xl w-full py-4 text-lg
    文字："寻找搭档 →"

点击后：
  ① 屏幕中央出现系统 Spinner（animate-spin，w-8 h-8，border-2 border-[#34C759]）
  ② 模拟匹配 2 秒（setTimeout 2000）
  ③ 弹出毛玻璃匹配卡片：

匹配卡片（从底部升起，Framer Motion y:400→0，spring damping:25）：
  外观：bg-white/80 backdrop-blur-xl rounded-t-[32px] p-6
  ┌────────────────────────────────┐
  │  ●──── 拖拽关闭指示条 ────●    │
  │                                │
  │   [girl.png 圆形头像 72px]     │  ← border-2 border-[#E5E5EA]
  │   林晓薇                       │  ← font-black text-2xl
  │   大三 · 外语系                 │  ← text-[#8E8E93] text-sm
  │                                │
  │ ── 本周共同目标 ──              │  ← 极浅分割线
  │ ✅  共跑 10km                  │
  │ ✅  3次以上晨练                 │
  │ ✅  每日步数达标                 │
  │                                │
  │   [ 发起约局 → ]               │  ← bg-[#34C759] 全宽按钮
  └────────────────────────────────┘
```

---

### Tab 3：【集市】MarketTab.jsx

**整体布局**：白色背景，两个列表 section

#### 列表A：悬赏令大厅

```
Section 标题："悬赏令大厅" font-bold text-xl + 右侧"全部"文字链接 text-[#34C759]

列表项（iOS Reminders 风格）：
bg-white rounded-2xl overflow-hidden，列表项间 border-b border-[#F2F2F7]

每行结构：
├─ 左：图标圆圈（bg-[#F2F2F7] w-10 h-10 rounded-full + png图标 w-6）
├─ 中：标题（font-semibold text-base）+ 副标题（text-[#8E8E93] text-sm）
└─ 右：代币数（font-bold text-[#34C759]）+ chevron（>）

三条任务数据：
① 图标:gym  "代取快递"    副标题:"南区菜鸟→女生宿舍"  奖励:"+ 80 代币"
② 图标:bulb "帮买奶茶"    副标题:"排队代购"            奖励:"+ 50 代币"
③ 图标:clock "图书馆占座" 副标题:"早起互助 6:30"       奖励:"+ 60 代币"

点击某行 → 展开详情（AnimatePresence，height:0→auto）：
  展开内容：模糊地址 + 备注（如：取件码 2847）
  底部："接单" 按钮 → 弹出 ActionSheet → 确认后 Toast "接单成功，请在30分钟内完成"
```

#### 列表B：运动搭子局

```
Section 标题："今日搭子局" font-bold text-xl + 右上角"+" 图标

列表项结构：
├─ 左：彩色圆形头像（emoji 背景色圆圈，无真实头像）
├─ 中：标题（粗体，如"晚上8点操场夜跑"）+ 人数标签（"已有3人"）
└─ 右：报名按钮（border border-[#34C759] text-[#34C759] rounded-xl px-3 py-1）

三条数据：
① 🌙 "晚上8点操场夜跑"   已有3人  → 点击 Toast "已加入，等待确认"
② ☀️  "明早6:30晨跑打卡" 已有5人  → 同上
③ 🏸  "下午篮球随机匹配"  已有7人  → 同上
```

---

### Tab 4：【大本营】ProfileTab.jsx

#### 模块A：顶部数据仪表盘

```
布局：bg-white p-6

左列：
  连续运动天数（font-black text-6xl text-black）
  "天" font-light text-lg text-[#8E8E93]
  "连续打卡" text-sm text-[#8E8E93]

右列：
  "¥ 1,280" （font-black text-3xl）← 类似 Apple Pay 金额样式
  "社交代币" text-sm text-[#8E8E93]
  flash图标标注
```

#### 模块B：荣誉陈列架

```
Section 标题："我的成就"

展台背景：bg-[#F2F2F7] rounded-3xl p-6
主展品区（居中）：
  trophy-dynamic-gradient.png（w-32 h-32，drop-shadow 效果）
  ← 这是最重要的3D质感展示，用 filter drop-shadow 模拟 AO 阴影

徽章网格（2×3）：
  每个徽章：bg-white rounded-2xl p-3 flex-col items-center
  ├─ 对应图标（trophy/gym/thumb-up/flash 各44px）
  ├─ 名称（font-semibold text-xs text-center）
  └─ 已解锁：正常显示；未解锁：grayscale opacity-40

六个徽章：
  ① trophy-dynamic-color   "跑步王者"    已解锁
  ② gym-dynamic-color      "健身达人"    已解锁
  ③ thumb-up-dynamic-color "互助之星"    已解锁
  ④ flash-dynamic-color    "闪电侠"      未解锁（灰显）
  ⑤ trophy-dynamic-color   "百日打卡"    未解锁（灰显）
  ⑥ gym-dynamic-color      "马拉松"      未解锁（灰显）
```

#### 模块C：代币商城（Apple Wallet 风格）

```
Section 标题："代币商城" + 余额 "1,280"

Passbook 卡片（每张）：
  尺寸：w-full h-[120px] rounded-2xl overflow-hidden
  背景：渐变色（各不同）
  左侧：商家图标（emoji）+ 商家名 + 描述
  右侧：所需代币（font-black text-white text-2xl）+ "代币"小字
  底部：兑换按钮（bg-white/20 text-white rounded-xl）

三张卡片：
  ① 背景 from-[#FF6B6B] to-[#FF8E53]  ☕ "瑞幸咖啡券"  "5元代金券"   500代币
  ② 背景 from-[#4ECDC4] to-[#44A08D]  🍚 "食堂加腿券"  "红烧腿+1"    200代币
  ③ 背景 from-[#667EEA] to-[#764BA2]  🎬 "电影兑换券"  "校内影院"   800代币

点击兑换：
  if (余额 >= 所需代币) → Toast "兑换成功！已发放至钱包" + 余额扣减
  else → Toast "代币不足，继续运动赚取吧！"
```

---

## 七、Mock 数据文件

```js
// src/data/mockData.js
export const mockUser = {
  name: '张同学',
  streakDays: 21,
  tokens: 1280,
  todaySteps: 8420,
  stepGoal: 10000,
  exerciseMinutes: 42,
  distance: 3.2,
}

export const mockMatch = {
  name: '林晓薇',
  grade: '大三',
  dept: '外语系',
  avatar: '/assets/avatar/girl.png',
  goals: ['共跑 10km', '3次以上晨练', '每日步数达标'],
}

export const mockTasks = [
  { id:1, icon:'gym',   title:'代取快递', sub:'南区菜鸟→女生宿舍', reward:80, detail:'取件码：2847，限时30分钟' },
  { id:2, icon:'bulb',  title:'帮买奶茶', sub:'排队代购',           reward:50, detail:'古茗二楼，告知收货人' },
  { id:3, icon:'clock', title:'图书馆占座', sub:'早起互助 6:30',   reward:60, detail:'3楼自习区C排，带本书' },
]

export const mockSquads = [
  { id:1, emoji:'🌙', title:'晚上8点操场夜跑', count:3 },
  { id:2, emoji:'☀️', title:'明早6:30晨跑打卡', count:5 },
  { id:3, emoji:'🏸', title:'下午篮球随机匹配', count:7 },
]

export const mockActivities = [
  { id:1, emoji:'🐱', title:'猫抓老鼠', sub:'全校追逃模拟',   img:'/assets/pics/猫抓老鼠 (追逃).jpg' },
  { id:2, emoji:'🙈', title:'校园躲猫猫', sub:'区域寻人挑战', img:'/assets/pics/校园躲猫猫 (隐藏).jpg' },
  { id:3, emoji:'🧟', title:'末日逃亡', sub:'生存计步挑战',   img:'/assets/pics/末日逃亡 (生存).jpg' },
]

export const mockShop = [
  { id:1, emoji:'☕', name:'瑞幸咖啡券', desc:'5元代金券',  cost:500, from:'#FF6B6B', to:'#FF8E53' },
  { id:2, emoji:'🍚', name:'食堂加腿券', desc:'红烧腿+1',   cost:200, from:'#4ECDC4', to:'#44A08D' },
  { id:3, emoji:'🎬', name:'电影兑换券', desc:'校内影院',   cost:800, from:'#667EEA', to:'#764BA2' },
]
```

---

## 八、关键动效参数（Framer Motion）

```js
// 标准弹簧（弹窗、卡片升起）
const spring = { type:'spring', damping:25, stiffness:200 }

// 轻弹簧（页面切换）
const softSpring = { type:'spring', damping:30, stiffness:150 }

// 雷达圈扩散
const radarRing = {
  animate: { scale:[0.2, 3], opacity:[0.8, 0] },
  transition: { duration:2, repeat:Infinity, ease:'easeOut' }
}

// 底部面板升起
const slideUp = {
  initial: { y:400 },
  animate: { y:0, transition: spring },
  exit:    { y:400 }
}

// 页面切换（Tab 切换）
const pageFade = {
  initial: { opacity:0, y:10 },
  animate: { opacity:1, y:0 },
  exit:    { opacity:0, y:-10 },
  transition: softSpring
}
```

---

## 九、部署方案

### 推荐：Vercel（最快）

```bash
npm run build
# 将 dist/ 文件夹拖入 vercel.com，或：
npx vercel --prod
```

### 备选：阿里云 OSS

1. 创建 Bucket，开启静态网站托管
2. 设置首页文档：`index.html`，错误页：`index.html`
3. 上传 `dist/` 全部内容
4. 开启 CDN 加速（可选）

> 部署前：`npm run build` 确认无报错，`dist/` 中 assets 路径正确。

---

## 十、开发优先级与检查清单

### 必须完成（核心分）

- [ ] PhoneFrame 外壳 + TabBar 导航
- [ ] Tab1：雷达动效 + Lottie 宠物切换
- [ ] Tab1：Apple Health 风格数据看板
- [ ] Tab2：活动大卡片轮播（3张图片）
- [ ] Tab2：匹配流程（Spinner → 毛玻璃卡片）
- [ ] Tab3：悬赏令列表展开 + 接单 ActionSheet
- [ ] Tab4：数据仪表盘 + trophy 展示
- [ ] Toast 全局提示组件
- [ ] 静态网站成功部署，URL 可访问

### 加分项（时间允许再做）

- [ ] Tab2：活动卡片点击全屏放大（Framer Motion layoutId）
- [ ] Tab3：运动搭子局加入交互
- [ ] Tab4：代币商城真实扣减逻辑
- [ ] 切换 Tab 时的 AnimatePresence 过渡动效
- [ ] 移动端真机适配验证

### 绝对不要做的事

- ❌ 不要引入真实后端/数据库
- ❌ 不要引入 Redux/复杂状态管理（useState 足够）
- ❌ 不要追求像素级还原——抓大放小，留白和字重比颜色重要
- ❌ 不要使用多种强调色——全局只能出现 `#34C759` 一种亮色

---

## 十一、视觉自检标准

开发每个模块后，用以下问题自检：

1. **留白够不够大？** 如果卡片内部感觉"挤"，加 `p-5` 或 `gap-4`
2. **是否用颜色代替了字重？** 正确做法是调 `font-bold/black`，而非改文字颜色
3. **强调色出现超过一处了吗？** `#34C759` 只能用在最核心的操作按钮和高亮数字
4. **动效是弹簧物理吗？** 检查有没有 `ease:'linear'`，全部替换为 spring
5. **毛玻璃背景有实色底吗？** 毛玻璃组件必须 `bg-white/70 backdrop-blur-md`，不能用纯白实色
