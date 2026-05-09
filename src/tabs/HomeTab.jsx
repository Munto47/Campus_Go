import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { mockUser } from '../data/mockData'
import Toast from '../components/Toast'
import BottomSheet from '../components/BottomSheet'
import TypewriterText from '../components/TypewriterText'

// ── Pets ────────────────────────────────────────────────────────
const PETS = [
  { src: '/assets/pets/MoodyLlama.lottie',    name: '懒洋洋羊驼', state: '待机中'   },
  { src: '/assets/pets/MoodyGiraffe.lottie',  name: '开心长颈鹿', state: '心情不错'  },
  { src: '/assets/pets/MoodyWolf.lottie',     name: '精力旺狼',   state: '跃跃欲试'  },
  { src: '/assets/pets/WalkingDuck.lottie',   name: '散步小鸭',   state: '悠哉游哉'  },
  { src: '/assets/pets/SweetRunCycle.lottie', name: '奔跑小人',   state: '全力冲刺'  },
]

// ── 50 red dots (seeded) ─────────────────────────────────────────
const DOTS = (() => {
  let s = 42
  const rng = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
  const raw = []
  for (let i = 0; i < 16; i++) raw.push({ x: 6  + rng() * 28, y: 60 + rng() * 26 })
  for (let i = 0; i < 13; i++) raw.push({ x: 54 + rng() * 32, y: 6  + rng() * 22 })
  for (let i = 0; i < 11; i++) raw.push({ x: 40 + rng() * 24, y: 44 + rng() * 24 })
  for (let i = 0; i < 7;  i++) raw.push({ x: 16 + rng() * 20, y: 18 + rng() * 28 })
  for (let i = 0; i < 3;  i++) raw.push({ x: 12 + rng() * 68, y: 12 + rng() * 68 })
  return raw.map((pos, id) => {
    const dx = pos.x - 50, dy = pos.y - 50
    const angle = ((Math.atan2(dx, -dy) * 180 / Math.PI) + 360) % 360
    return { id, x: pos.x, y: pos.y, angle, delay: Math.round((angle / 360) * 1850), size: Math.round(5 + rng() * 4) }
  })
})()

// ── Step detail data ─────────────────────────────────────────────
const HOURLY_STEPS = [0,0,0,0,0,0, 180,620,890,450, 340,980,620,750, 420,580,310,720, 1040,580,380,210, 100,50]
const MAX_HOURLY = Math.max(...HOURLY_STEPS)

const EXERCISE_ITEMS = [
  { icon: '🚶', name: '步行',   mins: 24, color: '#34C759' },
  { icon: '🏃', name: '快走',   mins: 12, color: '#007AFF' },
  { icon: '🧗', name: '爬楼梯', mins: 6,  color: '#FF9F0A' },
]

const DISTANCE_STATS = [
  { label: '平均配速', value: "6'30\"" },
  { label: '最快配速', value: "5'42\"" },
  { label: '海拔变化', value: '+48 m'  },
  { label: '消耗热量', value: '186 kcal' },
]
const ELEVATION = [12,15,18,22,28,26,32,35,30,28,24,20,16,14,10,9,7,6,8,10,12,10,8,6]

// ── AI: pet state driven by steps ───────────────────────────────
function getPetStateFromSteps(steps) {
  if (steps < 2000)  return { index: 0, tip: `今天才走了 ${steps} 步，出门走走吧～` }
  if (steps < 5000)  return { index: 3, tip: `已完成目标的 ${Math.round(steps / 100)}%` }
  if (steps < 8000)  return { index: 1, tip: `距目标还差 ${10000 - steps} 步` }
  if (steps < 10000) return { index: 2, tip: `快到了！差 ${10000 - steps} 步达标` }
  return { index: 4, tip: `超额完成 +${steps - 10000} 步 🎉` }
}

// ── AI: advisor advice bank ──────────────────────────────────────
const AI_ADVICE = [
  {
    trigger: (s) => s < 3000,
    title: '今天还没怎么动哦',
    advice: '检测到你今天步数较少。建议：① 午休后绕楼栋走一圈（约 800 步）② 改走楼梯上课（单层约 150 步）③ 晚饭后操场散步 20 分钟即可轻松达标。以你的配速，完成目标约需 45 分钟。',
    action: '查看今日搭子局',
    tab: 'market',
  },
  {
    trigger: (s) => s >= 3000 && s < 8000,
    title: '状态不错，再加把劲！',
    advice: '你今天已完成 {{steps}} 步，距目标还有 {{remain}} 步。根据你的运动节奏，推荐：① 课后绕操场 2 圈（约 1,600 步）② 选择较远的食堂就餐（单次 +400 步）。预计 18:00 前完全可以达标。',
    action: '查看今日搭子局',
    tab: 'market',
  },
  {
    trigger: (s) => s >= 8000 && s < 10000,
    title: '冲刺阶段！就差一点点',
    advice: '太棒了！距目标仅剩 {{remain}} 步，相当于操场半圈。你近 7 天的步数趋势持续上升，已超过校园内 73% 的同学。今晚完成打卡后，连续天数将达到 {{nextStreak}} 天！',
    action: '查看附近运动搭子',
    tab: 'party',
  },
  {
    trigger: (s) => s >= 10000,
    title: '今日目标已达成！',
    advice: '恭喜你完成了今日目标！你的运动数据显示，本周平均步数为 8,428 步，高于上周 12%。宠物状态已升级为「奔跑小人」，继续保持可解锁「闪电侠」成就（还差 2 次）。',
    action: '查看我的成就',
    tab: 'me',
  },
]

// ────────────────────────────────────────────────────────────────
export default function HomeTab({ userStats, onUpdateStats, onTabChange }) {
  const steps      = userStats?.todaySteps ?? mockUser.todaySteps
  const stepGoal   = userStats?.stepGoal   ?? mockUser.stepGoal
  const streakDays = userStats?.streakDays  ?? mockUser.streakDays

  const petState = getPetStateFromSteps(steps)

  const [phase, setPhase]             = useState('scanning')
  const [petIndex, setPetIndex]       = useState(petState.index)
  const [showBox, setShowBox]         = useState(false)
  const [visibleDotIds, setVisible]   = useState(new Set())
  const [sweepDeg, setSweepDeg]       = useState(0)
  const [toast, setToast]             = useState({ visible: false, msg: '' })
  const [activeModal, setActiveModal] = useState(null) // 'steps' | 'exercise' | 'distance'
  const [checkedIn, setCheckedIn]     = useState(userStats?.checkedIn ?? false)
  const [showAISheet, setShowAISheet] = useState(false)
  const rafRef  = useRef(null)
  const t0Ref   = useRef(null)

  const fireToast = (msg) => {
    setToast({ visible: true, msg })
    setTimeout(() => setToast({ visible: false, msg: '' }), 2600)
  }

  // ── Radar sweep effect ──────────────────────────────────────
  useEffect(() => {
    setVisible(new Set()); setShowBox(false); setSweepDeg(0)
    cancelAnimationFrame(rafRef.current)
    if (phase !== 'scanning') return

    t0Ref.current = performance.now()
    const loop = (now) => {
      const deg = Math.min(((now - t0Ref.current) / 2000) * 360, 360)
      setSweepDeg(deg)
      if (deg < 360) rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    const dotTimers = DOTS.map(d =>
      setTimeout(() => setVisible(prev => new Set([...prev, d.id])), d.delay)
    )
    const boxTimer   = setTimeout(() => { setShowBox(true); fireToast('🎁 出门收集盲盒，以升级你的宠物') }, 1000)
    const phaseTimer = setTimeout(() => setPhase('petMode'), 2000)

    return () => {
      cancelAnimationFrame(rafRef.current)
      dotTimers.forEach(clearTimeout)
      clearTimeout(boxTimer); clearTimeout(phaseTimer)
    }
  }, [phase])

  const stepProgress = steps / stepGoal
  const circ = 2 * Math.PI * 36

  // Find the right AI advice based on steps
  const currentAdvice = AI_ADVICE.find(a => a.trigger(steps)) || AI_ADVICE[3]
  const adviceText = currentAdvice.advice
    .replace('{{steps}}', steps.toLocaleString())
    .replace('{{remain}}', (stepGoal - steps).toLocaleString())
    .replace('{{nextStreak}}', String(streakDays + 1))

  return (
    <div className="w-full h-full bg-white relative overflow-hidden">
      <Toast message={toast.msg} visible={toast.visible} />

      {/* ── Scanning phase: full-screen map ── */}
      <AnimatePresence>
        {phase === 'scanning' && (
          <motion.div
            key="map-full"
            className="absolute inset-0"
            exit={{ scale: 0.16, x: -148, y: -320, borderRadius: 14, opacity: 0.85 }}
            transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
          >
            <img src="/assets/map/map.png" alt="campus map" className="w-full h-full object-cover"
              style={{ filter: 'brightness(1.05) contrast(1.1) saturate(0.85)' }} />

            {/* Sweep trail */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: `conic-gradient(from -90deg at 50% 50%, rgba(52,199,89,0.10) 0deg, rgba(52,199,89,0.10) ${sweepDeg}deg, transparent ${sweepDeg}deg)`,
            }} />

            {/* Rings */}
            {[28,48,68].map((r,i) => (
              <div key={i} className="absolute rounded-full pointer-events-none" style={{
                left:`calc(50% - ${r/2}%)`, top:`calc(50% - ${r/1.8}%)`,
                width:`${r}%`, height:`${r/0.9}%`, border:'1px solid rgba(52,199,89,0.15)',
              }} />
            ))}

            {/* Radar line (pure CSS) */}
            <div className="absolute pointer-events-none" style={{
              left:'calc(50% - 1px)', bottom:'50%', width:2, height:'55%',
              background:'linear-gradient(to top, rgba(52,199,89,0.95), rgba(52,199,89,0.15) 70%, transparent)',
              transformOrigin:'bottom center',
              animation:'radarSpin 2s linear forwards',
            }} />

            {/* Center dot */}
            <div className="absolute rounded-full pointer-events-none" style={{
              left:'calc(50% - 4px)', top:'calc(50% - 4px)', width:8, height:8,
              background:'#34C759', boxShadow:'0 0 0 3px rgba(52,199,89,0.25),0 0 12px rgba(52,199,89,0.6)',
            }} />

            {/* Red dots */}
            {DOTS.map(dot => (
              <motion.div key={dot.id} className="absolute rounded-full pointer-events-none"
                style={{ left:`${dot.x}%`, top:`${dot.y}%`, width:dot.size, height:dot.size,
                  background:'#FF3B30', transform:'translate(-50%,-50%)',
                  boxShadow:'0 0 6px rgba(255,59,48,0.7)' }}
                initial={{ scale:0, opacity:0 }}
                animate={visibleDotIds.has(dot.id) ? { scale:1, opacity:0.88 } : { scale:0, opacity:0 }}
                transition={{ type:'spring', stiffness:420, damping:16 }}
              />
            ))}

            {/* Blind box */}
            <AnimatePresence>
              {showBox && (
                <motion.div className="absolute" style={{ left:'56%', top:'62%', transform:'translate(-50%,-50%)' }}
                  initial={{ scale:0, opacity:0 }} animate={{ scale:[0,1.18,1], opacity:1 }}
                  exit={{ scale:0, opacity:0 }} transition={{ type:'spring', stiffness:300, damping:18 }}>
                  <div className="bg-white rounded-2xl w-14 h-14 flex items-center justify-center shadow-xl">
                    <span className="text-3xl">🎁</span>
                  </div>
                  <motion.p className="text-center mt-1 text-white text-xs font-semibold"
                    style={{ textShadow:'0 1px 5px rgba(0,0,0,0.9)' }}
                    initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
                    新手盲盒
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-5 pt-14 pb-3">
              <div>
                <p className="text-white font-black text-xl" style={{ textShadow:'0 1px 8px rgba(0,0,0,0.6)' }}>跃动校园</p>
                <p className="text-white/80 text-xs">雷达扫描中…</p>
              </div>
              <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5">
                <span className="text-white text-xs font-medium">🔴 {DOTS.length} 人在线</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Map thumbnail (pet mode) ── */}
      <AnimatePresence>
        {phase === 'petMode' && (
          <motion.div key="map-thumb"
            className="absolute z-20 rounded-2xl overflow-hidden shadow-lg cursor-pointer active:scale-95 transition-transform"
            style={{ top:56, left:16, width:60, height:60 }}
            initial={{ scale:0.16, x:-148, y:-320, opacity:0 }}
            animate={{ scale:1, x:0, y:0, opacity:1 }}
            transition={{ type:'spring', stiffness:200, damping:22 }}
            onClick={() => setPhase('scanning')}>
            <img src="/assets/map/map.png" alt="map" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 flex items-end justify-center pb-1">
              <span className="text-white text-[9px] font-bold">地图</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Pet mode ── */}
      <AnimatePresence>
        {phase === 'petMode' && (
          <motion.div key="pet-area" className="absolute inset-0 flex flex-col bg-white"
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.35 }}>
            <div className="h-14" />

            {/* Pet zone */}
            <div className="flex-1 flex flex-col items-center justify-center cursor-pointer select-none"
              onClick={() => setPetIndex(i => (i+1) % PETS.length)}>
              <AnimatePresence mode="wait">
                <motion.div key={petIndex} className="flex flex-col items-center"
                  initial={{ opacity:0, scale:0.82 }} animate={{ opacity:1, scale:1 }}
                  exit={{ opacity:0, scale:0.82 }}
                  transition={{ type:'spring', stiffness:300, damping:22 }}>
                  <DotLottieReact src={PETS[petIndex].src} autoplay loop style={{ width:200, height:200 }} />
                  <p className="font-black text-2xl text-black mt-2">{PETS[petIndex].name}</p>
                  <p className="text-[#8E8E93] text-sm mt-0.5">{PETS[petIndex].state}</p>
                  {/* AI label */}
                  <p className="text-[#34C759] text-xs mt-1 font-medium">✦ 根据你的运动数据智能选择</p>
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-1.5 mt-5">
                {PETS.map((_,i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
                    style={{ background: i===petIndex ? '#34C759' : '#D1D1D6' }} />
                ))}
              </div>
              <p className="text-[#C7C7CC] text-xs mt-2">点击切换</p>

              {/* Experience bar */}
              <div className="w-48 mt-4">
                <div className="flex justify-between text-[10px] text-[#8E8E93] mb-1">
                  <span>宠物经验值</span>
                  <span>{steps >= stepGoal ? '已满级 🎉' : `还差 ${(stepGoal - steps).toLocaleString()} 步升级`}</span>
                </div>
                <div className="h-1.5 bg-[#F2F2F7] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #34C759, #30D158)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(steps / stepGoal, 1) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                  />
                </div>
              </div>
            </div>

            {/* ── Dashboard ── */}
            <div className="px-4 pb-4 space-y-3">
              {/* Steps card — clickable */}
              <motion.div
                className="bg-[#F2F2F7] rounded-3xl p-5 cursor-pointer active:scale-[0.98] transition-transform"
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveModal('steps')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#8E8E93] text-xs font-medium mb-1">今日步数 <span className="text-[#34C759]">›</span></p>
                    <p className="font-black text-4xl text-black leading-none">{steps.toLocaleString()}</p>
                    <p className="text-[#8E8E93] text-xs mt-1">目标 {stepGoal.toLocaleString()} 步</p>
                  </div>
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="36" fill="none" stroke="#E5E5EA" strokeWidth="6"/>
                      <circle cx="40" cy="40" r="36" fill="none" stroke="#34C759" strokeWidth="6"
                        strokeLinecap="round" strokeDasharray={circ}
                        strokeDashoffset={circ * (1 - Math.min(stepProgress, 1))}
                        style={{ transition:'stroke-dashoffset 1.2s ease' }}/>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-bold text-sm text-black">{Math.round(stepProgress*100)}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Small cards grid */}
              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  className="bg-[#F2F2F7] rounded-2xl p-4 flex flex-col gap-1 cursor-pointer active:scale-[0.97] transition-transform"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveModal('exercise')}
                >
                  <img src="/assets/icons/flash-dynamic-color.png" alt="" className="w-7 h-7" />
                  <p className="font-black text-2xl text-black">{userStats?.exerciseMinutes ?? mockUser.exerciseMinutes}</p>
                  <p className="text-[#8E8E93] text-xs">运动分钟 <span className="text-[#34C759]">›</span></p>
                </motion.div>
                <motion.div
                  className="bg-[#F2F2F7] rounded-2xl p-4 flex flex-col gap-1 cursor-pointer active:scale-[0.97] transition-transform"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveModal('distance')}
                >
                  <img src="/assets/icons/gym-dynamic-color.png" alt="" className="w-7 h-7" />
                  <p className="font-black text-2xl text-black">{userStats?.distance ?? mockUser.distance}</p>
                  <p className="text-[#8E8E93] text-xs">公里 <span className="text-[#34C759]">›</span></p>
                </motion.div>
              </div>

              {/* Check-in button */}
              <motion.button
                onClick={() => {
                  if (!checkedIn) {
                    setCheckedIn(true)
                    onUpdateStats?.(prev => ({ ...prev, tokens: prev.tokens + 20, checkedIn: true }))
                    fireToast('✅ 签到成功，获得 20 代币！')
                  }
                }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 font-bold text-base rounded-2xl transition-all duration-300"
                style={{
                  background: checkedIn ? '#F2F2F7' : '#34C759',
                  color: checkedIn ? '#8E8E93' : '#FFFFFF',
                }}
              >
                {checkedIn ? '✓  今日已打卡' : '今日签到打卡 🏃'}
              </motion.button>

              {/* AI advisor button */}
              <button
                onClick={() => setShowAISheet(true)}
                className="w-full py-3.5 bg-[#F0FDF4] border border-[#34C759]/20 text-[#34C759] font-semibold text-sm rounded-2xl flex items-center justify-center gap-2 active:opacity-80 transition-opacity"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34C759] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34C759]" />
                </span>
                AI 运动顾问 · 查看今日建议
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ Modal: Steps Detail ══════════════════════════════════ */}
      <BottomSheet visible={activeModal === 'steps'} onClose={() => setActiveModal(null)} height="78%">
        <div className="px-6 pb-8">
          {/* Header */}
          <div className="flex items-end justify-between pt-2 pb-5 border-b border-[#F2F2F7]">
            <div>
              <p className="text-[#8E8E93] text-sm">今日步数</p>
              <p className="font-black text-5xl text-black mt-1">{steps.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[#8E8E93] text-xs">目标</p>
              <p className="font-bold text-2xl text-black">{stepGoal.toLocaleString()}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5 mb-1">
            <div className="h-2 bg-[#F2F2F7] rounded-full overflow-hidden">
              <motion.div className="h-full bg-[#34C759] rounded-full"
                initial={{ width:0 }} animate={{ width:`${Math.round(stepProgress*100)}%` }}
                transition={{ duration:0.8, ease:'easeOut' }} />
            </div>
            <p className="text-right text-xs text-[#8E8E93] mt-1">已完成 {Math.round(stepProgress*100)}%</p>
          </div>

          {/* Activity pills */}
          <div className="flex gap-2 flex-wrap mt-4 mb-5">
            {['🚶 上午步行','⚡ 午间快走','🧗 下午爬楼'].map(p => (
              <span key={p} className="bg-[#F2F2F7] px-3 py-1.5 rounded-full text-xs text-[#3C3C43]">{p}</span>
            ))}
          </div>

          {/* Hourly chart */}
          <p className="text-[#8E8E93] text-xs font-medium mb-3">每小时步数</p>
          <div className="flex gap-[3px] items-end" style={{ height:80 }}>
            {HOURLY_STEPS.map((s, i) => (
              <motion.div key={i} className="flex-1 rounded-[2px]"
                style={{ background: s > 700 ? '#34C759' : s > 300 ? 'rgba(52,199,89,0.5)' : '#F2F2F7', minHeight:2 }}
                initial={{ height:0 }}
                animate={{ height: s > 0 ? Math.max((s/MAX_HOURLY)*76, 3) : 2 }}
                transition={{ delay:i*0.015, type:'spring', stiffness:200 }} />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {['0时','6时','12时','18时','24时'].map(t => (
              <span key={t} className="text-[10px] text-[#C7C7CC]">{t}</span>
            ))}
          </div>

          {/* Peak hour tip */}
          <div className="mt-5 bg-[#F2F2F7] rounded-2xl p-4 flex items-center gap-3">
            <span className="text-xl">📊</span>
            <div>
              <p className="text-sm font-semibold text-black">今日高峰：18:00–19:00</p>
              <p className="text-xs text-[#8E8E93] mt-0.5">课后运动贡献了当日最多步数</p>
            </div>
          </div>
        </div>
      </BottomSheet>

      {/* ══ Modal: Exercise Detail ════════════════════════════════ */}
      <BottomSheet visible={activeModal === 'exercise'} onClose={() => setActiveModal(null)} height="62%">
        <div className="px-6 pb-8">
          <div className="pt-2 pb-5 border-b border-[#F2F2F7]">
            <p className="text-[#8E8E93] text-sm">今日运动</p>
            <p className="font-black text-5xl text-black mt-1">
              {userStats?.exerciseMinutes ?? mockUser.exerciseMinutes}
              <span className="text-2xl font-medium text-[#8E8E93] ml-1">分钟</span>
            </p>
          </div>

          <div className="mt-5 space-y-5">
            {EXERCISE_ITEMS.map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-semibold text-sm text-black">{item.name}</span>
                  </div>
                  <span className="font-bold text-sm text-[#8E8E93]">{item.mins} 分钟</span>
                </div>
                <div className="h-2 bg-[#F2F2F7] rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ background: item.color }}
                    initial={{ width:0 }}
                    animate={{ width:`${(item.mins/(userStats?.exerciseMinutes ?? mockUser.exerciseMinutes))*100}%` }}
                    transition={{ delay:i*0.12+0.2, duration:0.6, ease:'easeOut' }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-[#F2F2F7] rounded-2xl p-4 flex items-center gap-4">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-[#8E8E93] text-xs">消耗热量</p>
              <p className="font-black text-2xl text-black">186 <span className="text-sm font-medium text-[#8E8E93]">kcal</span></p>
            </div>
          </div>
        </div>
      </BottomSheet>

      {/* ══ Modal: Distance Detail ════════════════════════════════ */}
      <BottomSheet visible={activeModal === 'distance'} onClose={() => setActiveModal(null)} height="64%">
        <div className="px-6 pb-8">
          <div className="pt-2 pb-5 border-b border-[#F2F2F7]">
            <p className="text-[#8E8E93] text-sm">今日里程</p>
            <p className="font-black text-5xl text-black mt-1">
              {userStats?.distance ?? mockUser.distance}
              <span className="text-2xl font-medium text-[#8E8E93] ml-1">km</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5 mb-6">
            {DISTANCE_STATS.map((s,i) => (
              <div key={i} className="bg-[#F2F2F7] rounded-2xl p-3.5">
                <p className="text-[#8E8E93] text-xs mb-1">{s.label}</p>
                <p className="font-bold text-base text-black">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Elevation profile */}
          <p className="text-[#8E8E93] text-xs font-medium mb-3">海拔变化曲线</p>
          <div className="flex gap-[3px] items-end bg-[#F2F2F7] rounded-2xl p-3" style={{ height:72 }}>
            {ELEVATION.map((h,i) => (
              <motion.div key={i} className="flex-1 rounded-[2px]"
                style={{ background: `rgba(0,122,255,${0.3 + (h/35)*0.5})` }}
                initial={{ height:0 }}
                animate={{ height:(h/35)*52 }}
                transition={{ delay:i*0.03, type:'spring', stiffness:200 }} />
            ))}
          </div>
          <div className="flex justify-between mt-1.5">
            {['出发','1km','2km','3.2km'].map(t => (
              <span key={t} className="text-[10px] text-[#C7C7CC]">{t}</span>
            ))}
          </div>
        </div>
      </BottomSheet>

      {/* ══ Modal: AI Advisor ════════════════════════════════════ */}
      <BottomSheet visible={showAISheet} onClose={() => setShowAISheet(false)} height="72%">
        <div className="px-6 pb-8">
          {/* Header */}
          <div className="pt-2 pb-5 border-b border-[#F2F2F7]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse" />
              <p className="text-[10px] font-semibold text-[#34C759] uppercase tracking-wider">AI 运动顾问</p>
            </div>
            <p className="font-black text-xl text-black">{currentAdvice.title}</p>
            <div className="flex gap-3 mt-3">
              <div className="bg-[#F2F2F7] rounded-xl px-3 py-2 text-center flex-1">
                <p className="text-[10px] text-[#8E8E93]">今日步数</p>
                <p className="font-bold text-sm text-black">{steps.toLocaleString()}</p>
              </div>
              <div className="bg-[#F2F2F7] rounded-xl px-3 py-2 text-center flex-1">
                <p className="text-[10px] text-[#8E8E93]">连续天数</p>
                <p className="font-bold text-sm text-black">{streakDays} 天</p>
              </div>
              <div className="bg-[#F2F2F7] rounded-xl px-3 py-2 text-center flex-1">
                <p className="text-[10px] text-[#8E8E93]">完成度</p>
                <p className="font-bold text-sm text-[#34C759]">{Math.round(stepProgress * 100)}%</p>
              </div>
            </div>
          </div>

          {/* Advice text with typewriter */}
          <div className="mt-5 mb-6">
            <p className="text-[#3C3C43] text-sm leading-relaxed">
              <TypewriterText text={adviceText} speed={18} />
            </p>
          </div>

          {/* CTA */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setShowAISheet(false)
              onTabChange?.(currentAdvice.tab)
            }}
            className="w-full py-4 bg-[#34C759] text-white font-bold rounded-2xl text-base"
          >
            {currentAdvice.action} →
          </motion.button>
        </div>
      </BottomSheet>
    </div>
  )
}
