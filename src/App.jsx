import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PhoneFrame from './components/PhoneFrame'
import TabBar from './components/TabBar'
import HomeTab from './tabs/HomeTab'
import PartyTab from './tabs/PartyTab'
import MarketTab from './tabs/MarketTab'
import ProfileTab from './tabs/ProfileTab'

const tabComponents = {
  home:   HomeTab,
  party:  PartyTab,
  market: MarketTab,
  me:     ProfileTab,
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home')

  const TabContent = tabComponents[activeTab]

  return (
    <PhoneFrame>
      {/* Content area — leaves room for TabBar (65px) */}
      <div className="absolute inset-0 overflow-hidden" style={{ bottom: 65 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            className="w-full h-full"
          >
            <TabContent />
          </motion.div>
        </AnimatePresence>
      </div>

      <TabBar active={activeTab} onChange={setActiveTab} />
    </PhoneFrame>
  )
}
