import { AnimatePresence, motion } from 'framer-motion'

export default function BottomSheet({ visible, onClose, height = '72%', children }) {
  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            className="absolute inset-0 bg-black/45 backdrop-blur-[1px] z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 z-30 bg-white rounded-t-[32px] flex flex-col"
            style={{ height }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          >
            <div className="w-10 h-1 bg-[#E5E5EA] rounded-full mx-auto mt-3 mb-1 flex-shrink-0" />
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
