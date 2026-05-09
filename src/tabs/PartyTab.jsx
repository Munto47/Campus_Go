import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { mockActivities, mockMatches, mockUser, weeklySteps, mockLeaderboard } from '../data/mockData'
import Toast from '../components/Toast'
import TypewriterText from '../components/TypewriterText'

const DAYS = ['一', '二', '三', '四', '五', '六', '日']
const TODAY_IDX = 4 // Friday
const MAX_STEPS = Math.max(...weeklySteps.filter(s => s > 0))

// ── Animated number counter (for compatibility score) ────────────
function AnimatedNumber({ target, duration = 900 }) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    setValue(0)
    const start = Date.now()
    const timer = setInterval(() => {
      const p = Math.min((Date.now() - start) / duration, 1)
      setValue(Math.round(target * p))
      if (p >= 1) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return <>{value}</>
}

export default function PartyTab({ userStats }) {
  const [expandedAct, setExpandedAct]         = useState(null)
  const [showAllActivities, setShowAll]        = useState(false)
  const [signedUp, setSignedUp]                = useState([])
  const [matchPhase, setMatchPhase]            = useState('idle') // 'idle'|'scanning'|'analyzing'|'done'
  const [matched, setMatched]                  = useState(false)
  const [matchIndex, setMatchIndex]            = useState(0)
  const [invitedSet, setInvitedSet]            = useState(new Set())
  const [toast, setToast]                      = useState({ visible: false, msg: '' })
  const [analyzeProgress, setAnalyzeProgress]  = useState(0)

  const currentMatch = mockMatches[matchIndex]
  const isInvited    = invitedSet.has(matchIndex)

  // Leaderboard gap calculation
  const myEntry     = mockLeaderboard.find(u => u.isMe)
  const secondEntry = mockLeaderboard.find(u => u.rank === 2)
  const gapToSecond = secondEntry && myEntry ? secondEntry.steps - myEntry.steps : 0

  const todaySteps = userStats?.todaySteps ?? mockUser.todaySteps

  const fireToast = (msg) => {
    setToast({ visible: true, msg })
    setTimeout(() => setToast({ visible: false, msg: '' }), 2500)
  }

  // Reset analyzing progress bar when phase changes
  useEffect(() => {
    if (matchPhase === 'analyzing') {
      setAnalyzeProgress(0)
      const start = Date.now()
      const timer = setInterval(() => {
        const p = Math.min((Date.now() - start) / 800, 1)
        setAnalyzeProgress(p * 100)
        if (p >= 1) clearInterval(timer)
      }, 16)
      return () => clearInterval(timer)
    }
  }, [matchPhase])

  // 首次匹配：两阶段动画
  const startMatch = () => {
    setMatchPhase('scanning')
    setTimeout(() => setMatchPhase('analyzing'), 800)
    setTimeout(() => { setMatchPhase('done'); setMatched(true) }, 1600)
  }

  // 换一个：快速重新匹配
  const tryAnother = () => {
    setMatched(false)
    setMatchPhase('scanning')
    const next = (matchIndex + 1) % mockMatches.length
    setMatchIndex(next)
    setTimeout(() => { setMatchPhase('done'); setMatched(true) }, 700)
  }

  // 发起约局
  const sendInvite = () => {
    setInvitedSet(prev => new Set([...prev, matchIndex]))
    fireToast('🎉 已发送约局邀请！')
  }

  // The activity object for the current expanded card
  const act = mockActivities.find(a => a.id === expandedAct)

  const rankColors = (rank) => {
    if (rank === 1) return { bg: '#FFD60A', text: '#000000' }
    if (rank === 2) return { bg: '#C7C7CC', text: '#FFFFFF' }
    if (rank === 3) return { bg: '#FF9F0A', text: '#FFFFFF' }
    return { bg: '#F2F2F7', text: '#8E8E93' }
  }

  return (
    // 外层：relative 定位锚点，不滚动 —— 弹窗 absolute 以此为基准，始终固定
    <div className="w-full h-full relative">
      <Toast message={toast.msg} visible={toast.visible} />

      {/* ── 内层：实际滚动区域 ── */}
      <div className="w-full h-full bg-[#F2F2F7] overflow-y-auto">

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md px-5 pt-14 pb-4 sticky top-0 z-10">
        <h1 className="font-black text-2xl text-black">游乐场</h1>
        <p className="text-[#8E8E93] text-sm">校园活动 · 找到你的运动搭档</p>
      </div>

      <div className="px-4 py-4 space-y-4">

        {/* ── 本周打卡记录 ── */}
        <section className="bg-white rounded-3xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-lg text-black">本周打卡</h2>
              <p className="text-[#8E8E93] text-sm mt-0.5">
                今日 {todaySteps.toLocaleString()} 步
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="font-black text-2xl text-black leading-none">{userStats?.streakDays ?? mockUser.streakDays}</p>
                <p className="text-[#8E8E93] text-xs text-right">连续天</p>
              </div>
            </div>
          </div>

          {/* Day check-in dots */}
          <div className="grid grid-cols-7 gap-1 mb-3">
            {DAYS.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: i < 5 ? '#34C759' : '#F2F2F7' }}
                >
                  {i < 5 && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: i === TODAY_IDX ? '#34C759' : '#8E8E93' }}
                >
                  {d}
                </span>
              </div>
            ))}
          </div>

          {/* Step bars */}
          <div className="flex gap-1.5 items-end" style={{ height: 52 }}>
            {weeklySteps.map((steps, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end">
                <motion.div
                  className="rounded-sm"
                  style={{
                    background: i === TODAY_IDX
                      ? '#34C759'
                      : i < TODAY_IDX ? 'rgba(52,199,89,0.35)' : '#F2F2F7',
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: steps > 0 ? (steps / MAX_STEPS) * 46 : 6 }}
                  transition={{ delay: i * 0.06, type: 'spring', stiffness: 180 }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1">
            {DAYS.map((d, i) => (
              <span key={i} className="flex-1 text-center text-[9px] text-[#C7C7CC]">{d}</span>
            ))}
          </div>
        </section>

        {/* ── 校园步数排行榜 ── */}
        <section className="bg-white rounded-3xl p-5">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-bold text-lg text-black">🏆 本周步数榜</h2>
            <span className="text-[#8E8E93] text-xs">周一至今</span>
          </div>

          <div className="space-y-2.5">
            {mockLeaderboard.map((user, i) => {
              const rc = rankColors(user.rank)
              return (
                <motion.div
                  key={user.rank}
                  className="flex items-center gap-3 p-3 rounded-2xl"
                  style={{ background: user.isMe ? '#F0FDF4' : '#F2F2F7',
                    border: user.isMe ? '1px solid rgba(52,199,89,0.2)' : '1px solid transparent' }}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, type: 'spring', stiffness: 200 }}
                >
                  {/* Rank badge */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{ background: rc.bg, color: rc.text }}
                  >
                    {user.rank}
                  </div>
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                    {user.avatar}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: user.isMe ? '#34C759' : '#000000' }}>
                      {user.name}{user.isMe ? ' (我)' : ''}
                    </p>
                    <p className="text-[#8E8E93] text-xs truncate">{user.dept}</p>
                  </div>
                  {/* Steps */}
                  <p className="font-black text-base flex-shrink-0" style={{ color: user.isMe ? '#34C759' : '#000000' }}>
                    {user.steps.toLocaleString()}
                  </p>
                </motion.div>
              )
            })}
          </div>

          {/* Gap to 2nd notice */}
          {gapToSecond > 0 && (
            <motion.div
              className="mt-4 bg-[#F2F2F7] rounded-xl p-3 flex items-center gap-2"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-base">💪</span>
              <p className="text-sm text-[#3C3C43]">
                距离第 2 名还差 <span className="font-bold text-black">{gapToSecond.toLocaleString()} 步</span>，加油冲榜！
              </p>
            </motion.div>
          )}
        </section>

        {/* ── Activity Cards ── */}
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-bold text-lg text-black">周末限时派对</h2>
            <button
              onClick={() => setShowAll(true)}
              className="text-[#34C759] text-sm font-medium active:opacity-60"
            >
              查看全部 ›
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {mockActivities.map(activity => (
              <div
                key={activity.id}
                className="relative flex-shrink-0 rounded-[24px] overflow-hidden cursor-pointer active:scale-[0.97] transition-transform"
                style={{ width: 260, height: 160 }}
                onClick={() => setExpandedAct(activity.id)}
              >
                <img
                  src={activity.img}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                  style={{ display: 'block' }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.72) 100%)' }}
                />
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="text-white font-black text-lg leading-tight">
                    {activity.emoji} {activity.title}
                  </p>
                  <p className="text-white/70 text-xs mt-0.5">{activity.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Partner Matching ── */}
        <section className="bg-white rounded-3xl p-5">
          <div className="flex items-center gap-3 mb-1">
            <img src="/assets/icons/thumb-up-dynamic-color.png" alt="" className="w-8 h-8" />
            <div>
              <h2 className="font-bold text-lg text-black">运动羁绊</h2>
              <p className="text-[#8E8E93] text-sm">找到最适合你的运动搭档</p>
            </div>
          </div>

          <div className="mt-4">
            {/* Idle: show start button */}
            {matchPhase === 'idle' && !matched && (
              <button
                onClick={startMatch}
                className="w-full py-4 bg-[#34C759] text-white font-bold text-base rounded-2xl active:opacity-80 transition-opacity"
              >
                寻找搭档 →
              </button>
            )}

            {/* Loading: two-phase animation */}
            <AnimatePresence>
              {(matchPhase === 'scanning' || matchPhase === 'analyzing') && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-6"
                >
                  <AnimatePresence mode="wait">
                    {matchPhase === 'scanning' && (
                      <motion.div
                        key="scanning"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex flex-col items-center gap-3"
                      >
                        <motion.div
                          className="w-10 h-10 rounded-full border-2 border-[#E5E5EA] border-t-[#34C759]"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        />
                        <p className="text-[#8E8E93] text-sm">正在分析运动数据…</p>
                      </motion.div>
                    )}
                    {matchPhase === 'analyzing' && (
                      <motion.div
                        key="analyzing"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex flex-col items-center gap-3"
                      >
                        <div className="w-full h-2 bg-[#F2F2F7] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-[#34C759] rounded-full"
                            style={{ width: `${analyzeProgress}%` }}
                          />
                        </div>
                        <p className="text-[#8E8E93] text-sm">正在计算兼容度…</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Match card */}
            <AnimatePresence mode="wait">
              {matched && (
                <motion.div
                  key={matchIndex}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                  className="mt-2"
                >
                  {/* Profile row */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={currentMatch.avatar}
                        alt={currentMatch.name}
                        className="w-16 h-16 rounded-full object-cover"
                        style={{ border: '2px solid #E5E5EA' }}
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#34C759] rounded-full flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">✓</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-xl text-black">{currentMatch.name}</p>
                      <p className="text-[#8E8E93] text-sm">{currentMatch.grade} · {currentMatch.dept}</p>
                      <div className="mt-1 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#34C759]" />
                        <span className="text-xs text-[#34C759] font-medium">
                          配对度 <AnimatedNumber target={currentMatch.compatibility} />%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Goals */}
                  <div className="border-t border-[#F2F2F7] pt-3 space-y-2 mb-3">
                    <p className="text-xs text-[#8E8E93] font-medium">本周共同目标</p>
                    {currentMatch.goals.map((g, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#34C759]/15 flex items-center justify-center flex-shrink-0">
                          <span className="text-[#34C759] text-xs">✓</span>
                        </div>
                        <p className="text-sm text-black">{g}</p>
                      </div>
                    ))}
                  </div>

                  {/* AI analysis card */}
                  <div className="bg-[#F0FDF4] border border-[#34C759]/20 rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse" />
                      <p className="text-[10px] font-semibold text-[#34C759] uppercase tracking-wider">AI 配对分析</p>
                    </div>
                    <p className="text-sm text-[#3C3C43] leading-relaxed">
                      <TypewriterText text={currentMatch.aiReason} speed={22} />
                    </p>
                    <div className="flex gap-1.5 mt-3 flex-wrap">
                      {currentMatch.aiTags.map(tag => (
                        <span key={tag} className="text-[10px] bg-[#34C759]/10 text-[#34C759] px-2.5 py-1 rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={sendInvite}
                      className="flex-1 py-3 font-bold rounded-2xl text-sm transition-all duration-300"
                      style={{
                        background: isInvited ? '#F2F2F7' : '#34C759',
                        color:      isInvited ? '#8E8E93' : '#FFFFFF',
                      }}
                    >
                      {isInvited ? '✓ 已发出邀请' : '发起约局 →'}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={tryAnother}
                      className="px-4 py-3 bg-[#F2F2F7] text-[#8E8E93] font-medium rounded-2xl text-sm active:opacity-70 transition-opacity"
                    >
                      换一个
                    </motion.button>
                  </div>

                  {/* Profile indicator dots */}
                  <div className="flex justify-center gap-1.5 mt-3">
                    {mockMatches.map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
                        style={{ background: i === matchIndex ? '#34C759' : '#D1D1D6' }} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <div className="h-4" />
      </div>

      </div>{/* end scrollable inner div */}

      {/* ── Activity detail overlay（外层，不受滚动影响）── */}
      <AnimatePresence>
        {act && (
          <>
            <motion.div
              key="backdrop"
              className="absolute inset-0 bg-black/55 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setExpandedAct(null)}
            />
            <motion.div
              key="detail"
              className="absolute inset-x-0 bottom-0 z-30 rounded-t-[32px] overflow-hidden bg-white"
              style={{ height: '78%' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            >
              <div className="relative w-full" style={{ height: '44%' }}>
                <img src={act.img} alt={act.title} className="w-full h-full object-cover" style={{ display: 'block' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.5) 100%)' }} />
                <button
                  onClick={() => setExpandedAct(null)}
                  className="absolute top-4 left-4 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-base font-bold">‹</span>
                </button>
              </div>
              <div className="px-6 pt-5 pb-8 overflow-y-auto">
                <p className="font-black text-2xl text-black">{act.emoji} {act.title}</p>
                <p className="text-[#8E8E93] text-sm mt-1 mb-4">{act.sub}</p>
                <p className="text-[#3C3C43] text-sm leading-relaxed mb-5">{act.desc}</p>
                <div className="flex gap-2 flex-wrap text-sm mb-6">
                  <span className="bg-[#F2F2F7] px-3 py-1.5 rounded-full text-[#3C3C43]">📍 全校范围</span>
                  <span className="bg-[#F2F2F7] px-3 py-1.5 rounded-full text-[#3C3C43]">⏱ 60 分钟</span>
                  <span className="bg-[#34C759]/15 px-3 py-1.5 rounded-full text-[#34C759] font-medium">+200 代币</span>
                </div>
                <motion.button
                  onClick={() => {
                    if (!signedUp.includes(act.id)) {
                      setSignedUp(prev => [...prev, act.id])
                      fireToast('🎮 已报名！活动开始时将通知你')
                    }
                    setExpandedAct(null)
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-4 font-bold rounded-2xl text-base transition-all duration-300"
                  style={{
                    background: signedUp.includes(act.id) ? '#F2F2F7' : '#34C759',
                    color: signedUp.includes(act.id) ? '#8E8E93' : '#FFFFFF',
                  }}
                >
                  {signedUp.includes(act.id) ? '✓ 已报名' : '立即报名'}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── 查看全部：子页面 ── */}
      <AnimatePresence>
        {showAllActivities && (
          <motion.div
            key="all-activities"
            className="absolute inset-0 bg-[#F2F2F7] z-30 overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          >
            <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-[#F2F2F7] z-10 px-4 pt-12 pb-3">
              <button
                onClick={() => setShowAll(false)}
                className="flex items-center gap-1 text-[#34C759] active:opacity-60"
              >
                <span className="text-xl font-bold">‹</span>
                <span className="text-base">返回</span>
              </button>
              <h1 className="font-black text-2xl text-black mt-2">所有活动</h1>
              <p className="text-[#8E8E93] text-sm">选择你感兴趣的校园挑战</p>
            </div>

            <div className="px-4 py-4 space-y-4">
              {mockActivities.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  className="bg-white rounded-3xl overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
                >
                  <div className="relative w-full" style={{ height: 180 }}>
                    <img src={activity.img} alt={activity.title} className="w-full h-full object-cover" style={{ display: 'block' }} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.65))' }} />
                    <div className="absolute bottom-0 left-0 p-4">
                      <p className="text-white font-black text-xl">{activity.emoji} {activity.title}</p>
                      <p className="text-white/75 text-sm">{activity.sub}</p>
                    </div>
                    <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-white text-xs font-medium">+200 代币</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-[#3C3C43] text-sm leading-relaxed mb-4">{activity.desc}</p>
                    <div className="flex gap-2 flex-wrap text-xs mb-4">
                      <span className="bg-[#F2F2F7] px-3 py-1.5 rounded-full text-[#3C3C43]">📍 全校范围</span>
                      <span className="bg-[#F2F2F7] px-3 py-1.5 rounded-full text-[#3C3C43]">⏱ 60 分钟</span>
                      <span className="bg-[#F2F2F7] px-3 py-1.5 rounded-full text-[#3C3C43]">👥 不限人数</span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        if (!signedUp.includes(activity.id)) {
                          setSignedUp(prev => [...prev, activity.id])
                          fireToast(`🎮 《${activity.title}》报名成功！`)
                        }
                      }}
                      className="w-full py-3.5 font-bold rounded-2xl text-base transition-all duration-300"
                      style={{
                        background: signedUp.includes(activity.id) ? '#F2F2F7' : '#34C759',
                        color: signedUp.includes(activity.id) ? '#8E8E93' : '#FFFFFF',
                      }}
                    >
                      {signedUp.includes(activity.id) ? '✓ 已报名' : '立即报名'}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
              <div className="h-4" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
