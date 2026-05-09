// Mon–Sun steps (0 = future/not yet)
export const weeklySteps = [6800, 9200, 7400, 10100, 8420, 0, 0]

export const mockUser = {
  name: '张同学',
  streakDays: 21,
  tokens: 1280,
  todaySteps: 8420,
  stepGoal: 10000,
  exerciseMinutes: 42,
  distance: 3.2,
}

export const mockMatches = [
  {
    name: '林晓薇',
    grade: '大三',
    dept: '外语系',
    avatar: '/assets/avatar/girl.png',
    goals: ['共跑 10km', '3次以上晨练', '每日步数达标'],
    compatibility: 94,
  },
  {
    name: '陈雨萱',
    grade: '大二',
    dept: '体育学院',
    avatar: '/assets/avatar/girl2.png',
    goals: ['每周锻炼 4 次', '完成 5km 长跑', '坚持每日打卡'],
    compatibility: 88,
  },
]

// keep legacy export for other files that may import it
export const mockMatch = mockMatches[0]

export const mockTasks = [
  { id: 1, icon: 'gym',   title: '代取快递', sub: '南区菜鸟驿站 → 女生宿舍', reward: 80, detail: '取件码：2847，请在30分钟内取件' },
  { id: 2, icon: 'bulb',  title: '帮买奶茶', sub: '排队代购',                  reward: 50, detail: '古茗二楼，告知收货人后转账' },
  { id: 3, icon: 'clock', title: '图书馆占座', sub: '早起互助 6:30',           reward: 60, detail: '3楼自习区C排，带本书占好即可' },
]

export const mockSquads = [
  {
    id: 1, emoji: '🌙', title: '晚上8点操场夜跑', count: 3, tag: '夜跑',
    time: '今晚 20:00', location: '主操场入口集合', target: '目标 3km 环形跑', maxPeople: 8,
    desc: '适合初学者，配速约 6–7 分钟/公里，轻松陪跑氛围。完成全程即获 60 代币奖励。',
    notes: ['穿反光或浅色运动服', '携带手机保持联系', '不限配速，陪伴为主'],
  },
  {
    id: 2, emoji: '☀️', title: '明早6:30晨跑打卡', count: 5, tag: '晨练',
    time: '明日 06:30', location: '南门校门口集合', target: '目标 2km 晨练', maxPeople: 10,
    desc: '清晨打卡，唤醒一天活力。2公里轻松跑，配速自由，完成打卡记录即可获得 80 代币。',
    notes: ['提前5分钟到达集合点', '早餐建议打卡后再吃', '可带瑜伽垫做拉伸'],
  },
  {
    id: 3, emoji: '🏸', title: '下午篮球随机匹配', count: 7, tag: '球类',
    time: '今日 15:30', location: '体育馆1号篮球场', target: '45 分钟友谊赛', maxPeople: 10,
    desc: '随机分队进行3对3小场比赛，欢迎任何水平的同学参与，以娱乐交友为主。完成一场获 50 代币。',
    notes: ['穿篮球鞋或运动鞋', '分队随机，不限水平', '禁止恶意犯规'],
  },
]

export const mockActivities = [
  { id: 1, emoji: '🐱', title: '猫抓老鼠', sub: '全校追逃模拟',  img: '/assets/pics/猫抓老鼠 (追逃).jpg',    desc: '全校范围内的追逃游戏，戴上手环成为"猫"或"鼠"，用体能决胜负！计步有奖，跑得越多越安全。' },
  { id: 2, emoji: '🙈', title: '校园躲猫猫', sub: '区域寻人挑战', img: '/assets/pics/校园躲猫猫 (隐藏).jpg', desc: '划定区域内，30分钟找到所有隐藏的同学。藏得越久积分越高，被找到也能获得运动奖励。' },
  { id: 3, emoji: '🧟', title: '末日逃亡', sub: '生存计步挑战',  img: '/assets/pics/末日逃亡 (生存).jpg',    desc: '设定步数目标，在规定时间内存活。步数不达标即被"感染"，达标者瓜分代币奖池！' },
]

export const mockShop = [
  { id: 1, emoji: '☕', name: '瑞幸咖啡券', desc: '5元代金券',  cost: 500, from: '#FF6B6B', to: '#FF8E53' },
  { id: 2, emoji: '🍚', name: '食堂加腿券', desc: '红烧腿+1',   cost: 200, from: '#4ECDC4', to: '#44A08D' },
  { id: 3, emoji: '🎬', name: '电影兑换券', desc: '校内影院',   cost: 800, from: '#667EEA', to: '#764BA2' },
]

export const mockBadges = [
  { id: 1, icon: 'trophy-gradient', label: '跑步王者', unlocked: true  },
  { id: 2, icon: 'gym',             label: '健身达人', unlocked: true  },
  { id: 3, icon: 'thumb-up',        label: '互助之星', unlocked: true  },
  { id: 4, icon: 'flash',           label: '闪电侠',   unlocked: false },
  { id: 5, icon: 'trophy',          label: '百日打卡', unlocked: false },
  { id: 6, icon: 'gym',             label: '马拉松',   unlocked: false },
]
