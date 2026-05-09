import { AnimatePresence, motion } from 'framer-motion'

export default function ActionSheet({ visible, title, description, confirmText = '确认', onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          {/* Sheet */}
          <motion.div
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            exit={{ y: 300 }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="absolute bottom-0 left-0 right-0 z-50
                       bg-white rounded-t-[32px] p-6 pb-10"
          >
            <div className="w-10 h-1 bg-[#E5E5EA] rounded-full mx-auto mb-6" />
            <p className="text-lg font-bold text-black mb-1 text-center">{title}</p>
            {description && (
              <p className="text-sm text-[#8E8E93] text-center mb-6">{description}</p>
            )}
            <button
              onClick={onConfirm}
              className="w-full py-4 bg-[#34C759] text-white font-bold text-base rounded-2xl mb-3 active:opacity-80 transition-opacity"
            >
              {confirmText}
            </button>
            <button
              onClick={onCancel}
              className="w-full py-4 text-[#8E8E93] font-medium text-base"
            >
              取消
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
