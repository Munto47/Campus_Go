import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { mockTasks, mockSquads } from '../data/mockData'
import Toast from '../components/Toast'
import ActionSheet from '../components/ActionSheet'
import BottomSheet from '../components/BottomSheet'

const ICON_MAP = {
  gym:   '/assets/icons/gym-dynamic-color.png',
  bulb:  '/assets/icons/bulb-dynamic-color.png',
  clock: '/assets/icons/clock-dynamic-color.png',
  flash: '/assets/icons/flash-dynamic-color.png',
}

export default function MarketTab() {
  const [expandedTask, setExpandedTask]   = useState(null)
  const [actionSheet, setActionSheet]     = useState({ visible: false, task: null })
  const [toast, setToast]                 = useState({ visible: false, msg: '' })
  const [joinedSquads, setJoinedSquads]   = useState([])
  const [selectedSquad, setSelectedSquad] = useState(null)

  const fireToast = (msg) => {
    setToast({ visible: true, msg })
    setTimeout(() => setToast({ visible: false, msg: '' }), 2500)
  }

  const handleAccept = (task) => setActionSheet({ visible: true, task })

  const confirmAccept = () => {
    setActionSheet({ visible: false, task: null })
    setExpandedTask(null)
    fireToast('✅ 接单成功，请在 30 分钟内完成')
  }

  const joinSquad = (id) => {
    if (joinedSquads.includes(id)) return
    setJoinedSquads(prev => [...prev, id])
    fireToast('🤝 已加入，等待确认')
  }

  return (
    // 外层：relative 定位锚点，不滚动 —— 弹窗 absolute 以此为基准，始终固定
    <div className="w-full h-full relative">

      {/* ── 所有弹窗层放在外层（非滚动容器内），确保定位稳定 ── */}
      <Toast message={toast.msg} visible={toast.visible} />

      <ActionSheet
        visible={actionSheet.visible}
        title="接单确认"
        description={actionSheet.task ? `「${actionSheet.task.title}」·  +${actionSheet.task.reward} 代币` : ''}
        confirmText="确认接单"
        onConfirm={confirmAccept}
        onCancel={() => setActionSheet({ visible: false, task: null })}
      />

      <BottomSheet
        visible={!!selectedSquad}
        onClose={() => setSelectedSquad(null)}
        height="70%"
      >
        {(() => {
          const squad = mockSquads.find(s => s.id === selectedSquad)
          if (!squad) return null
          const joined = joinedSquads.includes(squad.id)
          return (
            <div className="px-6 pb-8">
              {/* Header */}
              <div className="flex items-center gap-3 pt-2 pb-5 border-b border-[#F2F2F7]">
                <div className="w-14 h-14 rounded-2xl bg-[#F2F2F7] flex items-center justify-center text-3xl flex-shrink-0">
                  {squad.emoji}
                </div>
                <div>
                  <p className="font-black text-xl text-black">{squad.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[#8E8E93] text-sm">已有 {squad.count} 人</span>
                    <span className="bg-[#F2F2F7] text-[#8E8E93] text-[10px] px-2 py-0.5 rounded-full">{squad.tag}</span>
                  </div>
                </div>
              </div>

              {/* Detail grid */}
              <div className="grid grid-cols-2 gap-3 mt-4 mb-4">
                {[
                  { icon: '⏰', label: '时间', value: squad.time },
                  { icon: '📍', label: '地点', value: squad.location },
                  { icon: '🎯', label: '目标', value: squad.target },
                  { icon: '👥', label: '人数', value: `${squad.count}/${squad.maxPeople} 人` },
                ].map((item, i) => (
                  <div key={i} className="bg-[#F2F2F7] rounded-2xl p-3.5">
                    <p className="text-[#8E8E93] text-xs mb-1">{item.icon} {item.label}</p>
                    <p className="font-semibold text-sm text-black">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <p className="text-[#3C3C43] text-sm leading-relaxed mb-4">{squad.desc}</p>

              {/* Notes */}
              <div className="bg-[#F2F2F7] rounded-2xl p-4 mb-5">
                <p className="font-semibold text-sm text-black mb-2.5">注意事项</p>
                {squad.notes.map((note, i) => (
                  <div key={i} className="flex items-start gap-2 mt-2">
                    <span className="text-[#34C759] text-sm mt-0.5">•</span>
                    <p className="text-sm text-[#3C3C43]">{note}</p>
                  </div>
                ))}
              </div>

              {/* Join button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSelectedSquad(null)
                  joinSquad(squad.id)
                }}
                className="w-full py-4 font-bold rounded-2xl text-base transition-all duration-300"
                style={{
                  background: joined ? '#F2F2F7' : '#34C759',
                  color: joined ? '#8E8E93' : '#FFFFFF',
                }}
              >
                {joined ? '✓ 已加入该搭子局' : '立即报名'}
              </motion.button>
            </div>
          )
        })()}
      </BottomSheet>

      {/* ── 内层：实际滚动区域 ── */}
      <div className="w-full h-full bg-[#F2F2F7] overflow-y-auto">

        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md px-5 pt-14 pb-4 sticky top-0 z-10">
          <h1 className="font-black text-2xl text-black">集市</h1>
          <p className="text-[#8E8E93] text-sm">悬赏任务 · 运动搭子</p>
        </div>

        <div className="px-4 py-4 space-y-6">

          {/* ── Bounty Task Hall ── */}
          <section>
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="font-bold text-lg text-black">悬赏令大厅</h2>
              <span className="text-[#34C759] text-sm font-medium">全部</span>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden">
              {mockTasks.map((task, idx) => (
                <div key={task.id}>
                  {/* Row */}
                  <button
                    className="w-full flex items-center gap-3 px-4 py-4 active:bg-[#F2F2F7] transition-colors text-left"
                    onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                  >
                    <div className="w-11 h-11 rounded-full bg-[#F2F2F7] flex items-center justify-center flex-shrink-0">
                      <img src={ICON_MAP[task.icon]} alt="" className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base text-black">{task.title}</p>
                      <p className="text-[#8E8E93] text-sm truncate">{task.sub}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="font-bold text-[#34C759] text-sm">+{task.reward}</span>
                      <span className="text-[#8E8E93] text-xs">币</span>
                      <motion.span
                        className="text-[#C7C7CC] text-sm ml-1"
                        animate={{ rotate: expandedTask === task.id ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        ›
                      </motion.span>
                    </div>
                  </button>

                  {/* Expandable detail */}
                  <AnimatePresence initial={false}>
                    {expandedTask === task.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 bg-[#F9F9F9]">
                          <p className="text-[#3C3C43] text-sm py-3 border-t border-[#F2F2F7]">
                            {task.detail}
                          </p>
                          <div className="flex gap-2">
                            <div className="flex-1 bg-[#F2F2F7] rounded-xl p-3 text-center">
                              <p className="text-xs text-[#8E8E93]">奖励</p>
                              <p className="font-black text-lg text-[#34C759]">+{task.reward} 币</p>
                            </div>
                            <div className="flex-1 bg-[#F2F2F7] rounded-xl p-3 text-center">
                              <p className="text-xs text-[#8E8E93]">截止</p>
                              <p className="font-black text-base text-black">{task.deadline}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAccept(task)}
                            className="w-full py-3.5 bg-[#34C759] text-white font-bold rounded-2xl mt-3 active:opacity-80 transition-opacity"
                          >
                            接单
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Divider (not last) */}
                  {idx < mockTasks.length - 1 && (
                    <div className="h-px bg-[#F2F2F7] mx-4" />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── Squad Sessions ── */}
          <section>
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="font-bold text-lg text-black">今日搭子局</h2>
              <button
                onClick={() => fireToast('📝 发起约局功能即将上线')}
                className="w-8 h-8 bg-[#34C759] rounded-full flex items-center justify-center active:opacity-80"
              >
                <span className="text-white text-xl font-light leading-none">+</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden">
              {mockSquads.map((squad, idx) => (
                <div key={squad.id}>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-4 active:bg-[#F2F2F7] transition-colors text-left"
                    onClick={() => setSelectedSquad(squad.id)}
                  >
                    <div className="w-11 h-11 rounded-full bg-[#F2F2F7] flex items-center justify-center text-2xl flex-shrink-0">
                      {squad.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base text-black truncate">{squad.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[#8E8E93] text-xs">已有 {squad.count} 人</span>
                        <span className="bg-[#F2F2F7] text-[#8E8E93] text-[10px] px-2 py-0.5 rounded-full">
                          {squad.tag}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {joinedSquads.includes(squad.id) && (
                        <span className="text-[#34C759] text-xs font-medium">已加入</span>
                      )}
                      <span className="text-[#C7C7CC] text-lg">›</span>
                    </div>
                  </button>
                  {idx < mockSquads.length - 1 && <div className="h-px bg-[#F2F2F7] mx-4" />}
                </div>
              ))}
            </div>
          </section>

          <div className="h-4" />
        </div>
      </div>
    </div>
  )
}
