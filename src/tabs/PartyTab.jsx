import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { mockActivities, mockMatches, mockUser, weeklySteps } from '../data/mockData'
import Toast from '../components/Toast'

const DAYS = ['一', '二', '三', '四', '五', '六', '日']
const TODAY_IDX = 4 // Friday
const MAX_STEPS = Math.max(...weeklySteps.filter(s => s > 0))

export default function PartyTab() {
  const [expandedAct, setExpandedAct]         = useState(null)
  const [showAllActivities, setShowAll]        = useState(false)
  const [signedUp, setSignedUp]                = useState([])
  const [matching, setMatching]                = useState(false)
  const [matched, setMatched]                  = useState(false)
  const [matchIndex, setMatchIndex]            = useState(0)
  const [invitedSet, setInvitedSet]            = useState(new Set())
  const [toast, setToast]                      = useState({ visible: false, msg: '' })

  const currentMatch = mockMatches[matchIndex]
  const isInvited    = invitedSet.has(matchIndex)

  const fireToast = (msg) => {
    setToast({ visible: true, msg })
    setTimeout(() => setToast({ visible: false, msg: '' }), 2500)
  }

  // 首次匹配：1 秒
  const startMatch = () => {
    setMatching(true)
    setTimeout(() => { setMatching(false); setMatched(true) }, 1000)
  }

  // 换一个：快速重新匹配（0.7 秒），切换到另一位搭档
  const tryAnother = () => {
    setMatched(false)
    setMatching(true)
    const next = (matchIndex + 1) % mockMatches.length
    setMatchIndex(next)
    setTimeout(() => { setMatching(false); setMatched(true) }, 700)
  }

  // 发起约局：记录已发出状态
  const sendInvite = () => {
    setInvitedSet(prev => new Set([...prev, matchIndex]))
    fireToast('🎉 已发送约局邀请！')
  }

  // The activity object for the current expanded card
  const act = mockActivities.find(a => a.id === expandedAct)

  return (
    <div className="w-full h-full bg-[#F2F2F7] overflow-y-auto relative">
      <Toast message={toast.msg} visible={toast.visible} />

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md px-5 pt-14 pb-4 sticky top-0 z-10">
        <h1 className="font-black text-2xl text-black">游乐场</h1>
        <p className="text-[#8E8E93] text-sm">校园活动 · 找到你的运动搭档</p>
      </div>

      <div className="px-4 py-4 space-y-4">

        {/* ── 本周打卡记录（从 Tab4 迁移）── */}
        <section className="bg-white rounded-3xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-lg text-black">本周打卡</h2>
              <p className="text-[#8E8E93] text-sm mt-0.5">
                今日 {mockUser.todaySteps.toLocaleString()} 步
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="font-black text-2xl text-black leading-none">{mockUser.streakDays}</p>
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
                  {i === TODAY_IDX && (
                    <div className="absolute w-2 h-2 rounded-full bg-white/60" />
                  )}
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
            {!matching && !matched && (
              <button
                onClick={startMatch}
                className="w-full py-4 bg-[#34C759] text-white font-bold text-base rounded-2xl active:opacity-80 transition-opacity"
              >
                寻找搭档 →
              </button>
            )}

            <AnimatePresence>
              {matching && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center py-6 gap-3"
                >
                  <motion.div
                    className="w-10 h-10 rounded-full border-2 border-[#E5E5EA] border-t-[#34C759]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                  <p className="text-[#8E8E93] text-sm">正在匹配中…</p>
                </motion.div>
              )}
            </AnimatePresence>

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
                          配对度 {currentMatch.compatibility}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Goals */}
                  <div className="border-t border-[#F2F2F7] pt-3 space-y-2 mb-4">
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

      {/* ── Activity detail overlay (NO layoutId — prevents image glitch on back) ── */}
      <AnimatePresence>
        {act && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="absolute inset-0 bg-black/55 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setExpandedAct(null)}
            />

            {/* Detail panel slides up from bottom */}
            <motion.div
              key="detail"
              className="absolute inset-x-0 bottom-0 z-30 rounded-t-[32px] overflow-hidden bg-white"
              style={{ height: '78%' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            >
              {/* Image header */}
              <div className="relative w-full" style={{ height: '44%' }}>
                <img
                  src={act.img}
                  alt={act.title}
                  className="w-full h-full object-cover"
                  style={{ display: 'block' }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.5) 100%)' }}
                />
                {/* Back button */}
                <button
                  onClick={() => setExpandedAct(null)}
                  className="absolute top-4 left-4 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-base font-bold">‹</span>
                </button>
              </div>

              {/* Content */}
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

      {/* ── 查看全部：子页面（从右滑入）── */}
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
            {/* Sticky nav header */}
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

            {/* Activities list */}
            <div className="px-4 py-4 space-y-4">
              {mockActivities.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  className="bg-white rounded-3xl overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
                >
                  {/* Activity image */}
                  <div className="relative w-full" style={{ height: 180 }}>
                    <img
                      src={activity.img}
                      alt={activity.title}
                      className="w-full h-full object-cover"
                      style={{ display: 'block' }}
                    />
                    <div className="absolute inset-0"
                      style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.65))' }} />
                    <div className="absolute bottom-0 left-0 p-4">
                      <p className="text-white font-black text-xl">{activity.emoji} {activity.title}</p>
                      <p className="text-white/75 text-sm">{activity.sub}</p>
                    </div>
                    <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-white text-xs font-medium">+200 代币</span>
                    </div>
                  </div>

                  {/* Content */}
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
