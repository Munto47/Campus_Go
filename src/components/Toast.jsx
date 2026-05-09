import { AnimatePresence, motion } from 'framer-motion'

export default function Toast({ message, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 260 }}
          className="absolute top-14 left-1/2 -translate-x-1/2 z-50
                     bg-black/80 text-white backdrop-blur-md
                     rounded-2xl px-5 py-3 text-sm font-medium
                     whitespace-nowrap shadow-lg"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
