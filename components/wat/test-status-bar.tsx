import type { TestItem } from "@/lib/wat-constants"
import { formatTime } from "@/lib/wat-utils"

interface TestStatusBarProps {
  currentItem: TestItem
  timeRemaining: number
  currentItemIndex: number
  testSequence: TestItem[]
}

export function TestStatusBar({ currentItem, timeRemaining, currentItemIndex, testSequence }: TestStatusBarProps) {
  return (
    <div className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between text-sm">
          <span>
            {currentItem?.type === "word" ? "Word Display" : "Break Period"} ({formatTime(timeRemaining)} remaining)
          </span>
          <span>
            Next:{" "}
            {currentItemIndex < testSequence.length - 1
              ? testSequence[currentItemIndex + 1]?.type === "word"
                ? "Next Word"
                : "Break"
              : "Test Complete"}
          </span>
        </div>
      </div>
    </div>
  )
}
