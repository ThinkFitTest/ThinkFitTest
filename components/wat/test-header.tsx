"use client"

import { Button } from "@/components/ui/button"
import { Play, Square, RotateCcw, Maximize } from "lucide-react"
import type { TestState, TestItem } from "@/lib/wat-constants"

interface TestHeaderProps {
  testState: TestState
  currentItem: TestItem | undefined
  currentWordNumber: number
  wordCount: number
  isFullscreen: boolean
  onStart: () => void
  onStop: () => void
  onReset: () => void
  onEnterFullscreen: () => void
}

export function TestHeader({
  testState,
  currentItem,
  currentWordNumber,
  wordCount,
  isFullscreen,
  onStart,
  onStop,
  onReset,
  onEnterFullscreen,
}: TestHeaderProps) {
  return (
    <div className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">WAT (Word Association Test)</h1>
            <p className="text-muted-foreground">
              {currentItem?.type === "word"
                ? `Word ${currentWordNumber} of ${wordCount}`
                : `Break ${currentItem?.setNumber || ""}`}{" "}
              • {currentItem?.type === "word" ? "Word Display" : "Break Period"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {testState === "idle" && (
              <>
                <Button onClick={onStart} className="gap-2">
                  <Play className="h-4 w-4" />
                  Start Test
                </Button>
                {!isFullscreen && (
                  <Button onClick={onEnterFullscreen} variant="outline" className="gap-2 bg-transparent">
                    <Maximize className="h-4 w-4" />
                    Fullscreen
                  </Button>
                )}
              </>
            )}
            {testState === "running" && (
              <Button onClick={onStop} variant="destructive" className="gap-2">
                <Square className="h-4 w-4" />
                Stop
              </Button>
            )}
            {testState === "completed" && (
              <Button onClick={onReset} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                New Test
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
