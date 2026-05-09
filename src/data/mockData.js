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
    aiReason: '你们的活跃时间高度重合（均为 18:00–20:00），近 7 天步数波动模式相似，且都对"有陪跑压力"的社交跑步模式有偏好。预测长期坚持率提升 34%。',
    aiTags: ['时间契合', '节奏相近', '强激励型'],
  },
  {
    name: '陈雨萱',
    grade: '大二',
    dept: '体育学院',
    avatar: '/assets/avatar/girl2.png',
    goals: ['每周锻炼 4 次', '完成 5km 长跑', '坚持每日打卡'],
    compatibility: 88,
    aiReason: '体育学院背景带来专业引导优势，你近期步数呈上升趋势，配合有经验的伙伴可加速突破瓶颈期。互补型配对，适合想提升成绩的用户。',
    aiTags: ['互补型', '专业引导', '成长加速'],
  },
]

// keep legacy export for other files that may import it
export const mockMatch = mockMatches[0]

export const mockTasks = [
  {
    id: 1, icon: 'flash',
    title: '步数挑战令',
    sub: '今日步数超过 12,000 步',
    reward: 120,
    detail: '完成后截图步数界面提交，每日限领一次。完成者额外获得"冲刺王"称号。',
    tag: '个人挑战', deadline: '今日 23:59',
  },
  {
    id: 2, icon: 'gym',
    title: '跑步陪伴令',
    sub: '带一位新同学完成 3km 跑步',
    reward: 200,
    detail: '需双方 App 同时记录跑步轨迹，系统自动核验距离。培养运动习惯，传递跑步正能量。',
    tag: '社交任务', deadline: '本周日',
  },
  {
    id: 3, icon: 'clock',
    title: '晨练打卡令',
    sub: '连续 3 天 7:00 前完成运动',
    reward: 300,
    detail: '打卡时间以首步记录为准。连续三日达成后一次性发放奖励，中断需重新计算。',
    tag: '连续挑战', deadline: '滚动计算',
  },
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
  { id: 1, icon: 'trophy-gradient', label: '跑步王者', unlocked: true,  progress: 100, target: 100, condition: '累计跑步超过 100km' },
  { id: 2, icon: 'gym',            label: '健身达人', unlocked: true,  progress: 30,  target: 30,  condition: '连续健身打卡 30 天' },
  { id: 3, icon: 'thumb-up',       label: '互助之星', unlocked: true,  progress: 5,   target: 5,   condition: '完成 5 次搭子局任务' },
  { id: 4, icon: 'flash',          label: '闪电侠',   unlocked: false, progress: 8,   target: 10,  condition: '单日步数超 15,000 步，共 10 次' },
  { id: 5, icon: 'trophy',         label: '百日打卡', unlocked: false, progress: 21,  target: 100, condition: '连续打卡 100 天' },
  { id: 6, icon: 'gym',            label: '马拉松',   unlocked: false, progress: 18,  target: 42,  condition: '累计跑步距离达到 42km' },
]

export const mockLeaderboard = [
  { rank: 1, name: '李明远', dept: '计算机学院', steps: 14820, avatar: '🏃', isMe: false },
  { rank: 2, name: '王晓菁', dept: '医学院',     steps: 12340, avatar: '🧗', isMe: false },
  { rank: 3, name: '张同学', dept: '工学院',     steps: 8420,  avatar: '⚡', isMe: true  },
  { rank: 4, name: '刘思远', dept: '外语系',     steps: 7980,  avatar: '🚶', isMe: false },
  { rank: 5, name: '陈雨萱', dept: '体育学院',   steps: 7650,  avatar: '☀️', isMe: false },
]
