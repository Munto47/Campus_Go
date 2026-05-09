const tabs = [
  { id: 'home',   icon: '🗺️', label: '探索'   },
  { id: 'party',  icon: '🎮', label: '派对'   },
  { id: 'market', icon: '🏪', label: '集市'   },
  { id: 'me',     icon: '👤', label: '大本营'  },
]

export default function TabBar({ active, onChange }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-30
                    bg-white/75 backdrop-blur-md
                    border-t border-[#E5E5EA]">
      <div className="flex">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex-1 flex flex-col items-center py-2 pb-3 gap-0.5 active:opacity-60 transition-opacity"
          >
            <span className="text-2xl leading-none">{tab.icon}</span>
            <span className={`text-[10px] font-medium leading-none transition-colors
              ${active === tab.id ? 'text-[#34C759]' : 'text-[#8E8E93]'}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
