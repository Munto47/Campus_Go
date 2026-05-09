import { useState, useEffect } from 'react'

export default function TypewriterText({ text, speed = 22, onDone }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const timer = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(timer)
        setDone(true)
        onDone?.()
      }
    }, speed)
    return () => clearInterval(timer)
  }, [text])

  return (
    <span>
      {displayed}
      {!done && (
        <span className="inline-block w-0.5 h-3.5 bg-[#34C759] ml-0.5 animate-pulse align-middle" />
      )}
    </span>
  )
}
