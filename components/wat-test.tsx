"use client"

import { useState, useEffect, useCallback } from "react"
import { WORD_DURATION, BLANK_DURATION, type TestState, type TestItem } from "@/lib/wat-constants"
import { generateRandomWATSequence, playWordSound } from "@/lib/wat-utils"
import { useSecurity } from "@/hooks/use-security"
import { useFullscreen } from "@/hooks/use-fullscreen"
import { TestHeader } from "./wat/test-header"
import { TestProgress } from "./wat/test-progress"
import { TestInstructions } from "./wat/test-instructions"
import { TestCompleted } from "./wat/test-completed"
import { TestDisplay } from "./wat/test-display"
import { TestStatusBar } from "./wat/test-status-bar"

interface WATTestProps {
  onComplete?: () => void
}

export default function WATTest({ onComplete }: WATTestProps) {
  const [testSequence, setTestSequence] = useState<TestItem[]>([])
  const [testState, setTestState] = useState<TestState>("idle")
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(WORD_DURATION)
  const [totalElapsed, setTotalElapsed] = useState(0)

  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullscreen()
  useSecurity()

  const totalDuration = 60 * WORD_DURATION + 2 * BLANK_DURATION // 60 words + 2 blank slides

  const resetTest = useCallback(() => {
    setTestSequence(generateRandomWATSequence())
    setTestState("idle")
    setCurrentItemIndex(0)
    setTimeRemaining(WORD_DURATION)
    setTotalElapsed(0)
  }, [])

  useEffect(() => {
    setTestSequence(generateRandomWATSequence())
  }, [])

  const getCurrentItemDuration = () => {
    if (testSequence.length === 0) return WORD_DURATION
    const currentItem = testSequence[currentItemIndex]
    return currentItem?.type === "blank" ? BLANK_DURATION : WORD_DURATION
  }

  const startTest = () => {
    setTestState("running")
    const firstItem = testSequence[0]
    if (firstItem?.type === "word") {
      setTimeout(() => playWordSound(), 100)
    }
    enterFullscreen()
  }

  const stopTest = () => {
    exitFullscreen()
    resetTest()
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (testState === "running") {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Time is up for current item
            if (currentItemIndex < testSequence.length - 1) {
              // Move to next item
              setCurrentItemIndex((prevIndex) => prevIndex + 1)
              const nextItem = testSequence[currentItemIndex + 1]

              // Play sound for new word (not for blank slides)
              if (nextItem?.type === "word") {
                setTimeout(() => playWordSound(), 100)
              }

              return nextItem?.type === "blank" ? BLANK_DURATION : WORD_DURATION
            } else {
              // Test completed
              setTestState("completed")
              if (onComplete) {
                setTimeout(() => onComplete(), 1000)
              }
              return 0
            }
          }
          return prev - 1
        })

        setTotalElapsed((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [testState, currentItemIndex, testSequence, onComplete])

  if (testSequence.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading test...</div>
      </div>
    )
  }

  const currentItem = testSequence[currentItemIndex]
  const wordCount = testSequence.filter((item) => item.type === "word").length
  const currentWordNumber = testSequence.slice(0, currentItemIndex + 1).filter((item) => item.type === "word").length

  return (
    <div
      className="min-h-screen bg-background flex flex-col select-none"
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
    >
      <TestHeader
        testState={testState}
        currentItem={currentItem}
        currentWordNumber={currentWordNumber}
        wordCount={wordCount}
        isFullscreen={isFullscreen}
        onStart={startTest}
        onStop={stopTest}
        onReset={resetTest}
        onEnterFullscreen={enterFullscreen}
      />

      {testState !== "idle" && <TestProgress totalElapsed={totalElapsed} totalDuration={totalDuration} />}

      <div className="flex-1 flex items-center justify-center p-4">
        {testState === "idle" && <TestInstructions onStart={startTest} />}

        {testState === "completed" && <TestCompleted onReset={resetTest} />}

        {testState === "running" && (
          <div className="w-full max-w-4xl text-center">
            <TestDisplay currentItem={currentItem} timeRemaining={timeRemaining} />
          </div>
        )}
      </div>

      {testState === "running" && (
        <TestStatusBar
          currentItem={currentItem}
          timeRemaining={timeRemaining}
          currentItemIndex={currentItemIndex}
          testSequence={testSequence}
        />
      )}
    </div>
  )
}
