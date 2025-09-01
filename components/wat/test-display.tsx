import type { TestItem } from "@/lib/wat-constants"
import { formatTime } from "@/lib/wat-utils"

interface TestDisplayProps {
  currentItem: TestItem
  timeRemaining: number
}

export function TestDisplay({ currentItem, timeRemaining }: TestDisplayProps) {
  if (currentItem.type === "word") {
    return (
      <div>
        <div className="mb-8">
          <div className="text-8xl font-bold text-primary mb-4 font-mono">{currentItem.content}</div>
          <div className="text-2xl font-mono font-bold text-muted-foreground">{formatTime(timeRemaining)}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-20">
      <div className="mb-8">
        <div className="text-6xl text-gray-400 mb-4">⏸️</div>
        <h2 className="text-3xl font-bold mb-4">Break Time</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Take a moment to rest. The test will continue automatically.
        </p>
        <div className="text-4xl font-mono font-bold text-primary">{formatTime(timeRemaining)}</div>
      </div>
    </div>
  )
}
