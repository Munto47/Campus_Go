import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { mockUser, mockBadges, mockShop } from '../data/mockData'
import Toast from '../components/Toast'

const ICON_MAP = {
  'trophy-gradient': '/assets/icons/trophy-dynamic-gradient.png',
  'trophy':          '/assets/icons/trophy-dynamic-color.png',
  'gym':             '/assets/icons/gym-dynamic-color.png',
  'thumb-up':        '/assets/icons/thumb-up-dynamic-color.png',
  'flash':           '/assets/icons/flash-dynamic-color.png',
}

export default function ProfileTab({ userStats, onUpdateStats }) {
  const [tokens, setTokens]         = useState(userStats?.tokens ?? mockUser.tokens)
  const [toast, setToast]           = useState({ visible: false, msg: '' })
  const [redeemedIds, setRedeemed]  = useState(new Set())
  const [shakeId, setShakeId]       = useState(null)

  const fireToast = (msg) => {
    setToast({ visible: true, msg })
    setTimeout(() => setToast({ visible: false, msg: '' }), 2600)
  }

  const redeem = (item) => {
    if (redeemedIds.has(item.id)) return
    if (tokens < item.cost) {
      setShakeId(item.id)
      setTimeout(() => setShakeId(null), 500)
      fireToast('💰 代币不足，继续运动赚取吧！')
      return
    }
    const newT = tokens - item.cost
    setTokens(newT)
    onUpdateStats?.(prev => ({ ...prev, tokens: newT }))
    setRedeemed(prev => new Set([...prev, item.id]))
    fireToast(`🎉 兑换成功！${item.name} 已发放至钱包`)
  }

  // Find a badge close to unlocking (≥70% progress)
  const nearBadge = mockBadges.find(b => !b.unlocked && b.progress / b.target >= 0.7)

  return (
    <div className="w-full h-full bg-[#F2F2F7] overflow-y-auto relative">
      <Toast message={toast.msg} visible={toast.visible} />

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md px-5 pt-14 pb-4 sticky top-0 z-10">
        <h1 className="font-black text-2xl text-black">大本营</h1>
        <p className="text-[#8E8E93] text-sm">我的成就 · 资产中心</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* ── Stats Dashboard ── */}
        <div className="bg-white rounded-3xl p-5">
          <div className="flex justify-between items-start">
            {/* Streak */}
            <div>
              <p className="text-[#8E8E93] text-xs font-medium mb-1">连续打卡</p>
              <div className="flex items-end gap-1">
                <motion.p
                  className="font-black text-6xl text-black leading-none"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {userStats?.streakDays ?? mockUser.streakDays}
                </motion.p>
                <p className="text-[#8E8E93] font-light text-lg mb-1">天</p>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#34C759]" />
                <span className="text-[#34C759] text-xs font-medium">本月最佳纪录</span>
              </div>
            </div>
            {/* Token wallet */}
            <div className="text-right">
              <p className="text-[#8E8E93] text-xs font-medium mb-1">社交代币</p>
              <motion.p
                className="font-black text-3xl text-black leading-none"
                key={tokens}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
              >
                {tokens.toLocaleString()}
              </motion.p>
              <p className="text-[#8E8E93] text-xs mt-1">Campus Coin</p>
            </div>
          </div>
        </div>

        {/* ── Achievement Shelf ── */}
        <section>
          <h2 className="font-bold text-lg text-black mb-3">荣誉陈列架</h2>

          {/* Near-unlock alert */}
          <AnimatePresence>
            {nearBadge && (
              <motion.div
                className="bg-[#F0FDF4] border border-[#34C759]/25 rounded-2xl p-4 flex items-center gap-3 mb-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ delay: 0.4 }}
              >
                <motion.span
                  className="text-2xl flex-shrink-0"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ✨
                </motion.span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-black">「{nearBadge.label}」即将解锁！</p>
                  <p className="text-xs text-[#8E8E93] mt-0.5">
                    再完成 {nearBadge.target - nearBadge.progress} 次，即可获得成就
                  </p>
                </div>
                <p className="font-black text-lg text-[#34C759] flex-shrink-0">
                  {Math.round(nearBadge.progress / nearBadge.target * 100)}%
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Featured trophy */}
          <div className="bg-white rounded-3xl p-6 mb-3 flex flex-col items-center">
            <motion.img
              src={ICON_MAP['trophy-gradient']}
              alt="trophy"
              className="w-28 h-28 object-contain"
              style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))' }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <p className="font-black text-lg text-black mt-3">{mockBadges[0].label}</p>
            <p className="text-[#8E8E93] text-sm">{mockBadges[0].condition}</p>
          </div>

          {/* Badge grid */}
          <div className="grid grid-cols-3 gap-3">
            {mockBadges.slice(1).map(badge => (
              <div
                key={badge.id}
                className="bg-white rounded-2xl p-3 flex flex-col items-center gap-1.5"
                style={{ opacity: badge.unlocked ? 1 : 0.9 }}
              >
                <img
                  src={ICON_MAP[badge.icon]}
                  alt={badge.label}
                  className={`w-10 h-10 object-contain ${!badge.unlocked ? 'grayscale' : ''}`}
                />
                <p className="text-xs font-semibold text-black text-center leading-tight">{badge.label}</p>

                {badge.unlocked ? (
                  <span className="text-[10px] font-medium text-[#34C759]">✓ 已解锁</span>
                ) : (
                  <>
                    <div className="w-full h-1 bg-[#F2F2F7] rounded-full overflow-hidden mt-0.5">
                      <motion.div
                        className="h-full bg-[#34C759] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(badge.progress / badge.target) * 100}%` }}
                        transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="text-[10px] text-[#C7C7CC]">
                      {badge.progress}/{badge.target}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Token Shop ── */}
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-bold text-lg text-black">代币商城</h2>
            <motion.span
              key={tokens}
              className="text-sm font-medium"
              initial={{ color: '#FF3B30', scale: 1.15 }}
              animate={{ color: '#8E8E93', scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              余额 {tokens} 币
            </motion.span>
          </div>

          <div className="space-y-3">
            {mockShop.map(item => {
              const redeemed = redeemedIds.has(item.id)
              const canAfford = tokens >= item.cost

              return (
                <motion.div
                  key={item.id}
                  className="rounded-2xl overflow-hidden"
                  animate={shakeId === item.id
                    ? { x: [-5, 5, -4, 4, -2, 2, 0] }
                    : { x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Gradient card header */}
                  <div
                    className="relative p-4 flex items-center gap-4 transition-all duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${item.from}, ${item.to})`,
                      opacity: redeemed ? 0.65 : 1,
                    }}
                  >
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                      {item.emoji}
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-white text-base">{item.name}</p>
                      <p className="text-white/70 text-sm">{item.desc}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`font-black text-xl ${redeemed ? 'line-through text-white/50' : 'text-white'}`}>
                        {item.cost}
                      </p>
                      <p className="text-white/70 text-xs">代币</p>
                    </div>

                    {/* Redeemed badge */}
                    <AnimatePresence>
                      {redeemed && (
                        <motion.div
                          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
                          initial={{ scale: 0, rotate: -45, opacity: 0 }}
                          animate={{ scale: 1, rotate: 0, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 340, damping: 20 }}
                        >
                          <span className="text-[#34C759] text-base font-black">✓</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Redeem button */}
                  <motion.button
                    disabled={redeemed}
                    onClick={() => redeem(item)}
                    whileTap={!redeemed ? { scale: 0.97 } : {}}
                    animate={redeemed ? { scale: [1, 1.04, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    className="w-full py-3 font-bold text-sm transition-all duration-400"
                    style={{
                      background: redeemed
                        ? '#34C759'
                        : canAfford ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.5)',
                      color: redeemed
                        ? '#FFFFFF'
                        : canAfford ? item.from : 'rgba(0,0,0,0.3)',
                      cursor: redeemed ? 'default' : 'pointer',
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {redeemed ? (
                        <motion.span
                          key="done"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                        >
                          ✓ 已兑换
                        </motion.span>
                      ) : (
                        <motion.span
                          key="redeem"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {canAfford ? '立即兑换' : '代币不足'}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>
              )
            })}
          </div>
        </section>

        <div className="h-4" />
      </div>
    </div>
  )
}
