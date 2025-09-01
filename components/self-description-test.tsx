"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"

interface SelfDescriptionTestProps {
  onComplete: () => void
}

const HEADINGS = [
  "What is the opinion of your parents about you?",
  "What is the opinion of your Teachers about you?",
  "What is the opinion of your friends about you?",
  "What kind of a person you are?",
  "What kind of a person you would like to be?",
]

export default function SelfDescriptionTest({ onComplete }: SelfDescriptionTestProps) {
  const [responses, setResponses] = useState<string[]>(Array(5).fill(""))
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(15 * 60) // 15 minutes in seconds
  const [isTimeUp, setIsTimeUp] = useState(false)

  useEffect(() => {
    if (timeRemaining > 0 && !isTimeUp) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && !isTimeUp) {
      setIsTimeUp(true)
      setTimeout(() => {
        handleComplete()
      }, 2000)
    }
  }, [timeRemaining, isTimeUp])

  useEffect(() => {
    const preventRightClick = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    const preventKeyboardShortcuts = (e: KeyboardEvent) => {
      if (
        e.key === "PrintScreen" ||
        (e.ctrlKey && e.shiftKey && (e.key === "S" || e.key === "s")) ||
        (e.ctrlKey && e.key === "s") ||
        (e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4" || e.key === "5")) ||
        (e.altKey && e.key === "PrintScreen") ||
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.key === "u")
      ) {
        e.preventDefault()
        return false
      }
    }

    const preventDragAndSelect = (e: Event) => {
      e.preventDefault()
      return false
    }

    document.addEventListener("contextmenu", preventRightClick)
    document.addEventListener("keydown", preventKeyboardShortcuts)
    document.addEventListener("dragstart", preventDragAndSelect)
    document.addEventListener("selectstart", preventDragAndSelect)

    if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true)
        })
        .catch(() => {
          console.log("Fullscreen not supported")
        })
    }

    return () => {
      document.removeEventListener("contextmenu", preventRightClick)
      document.removeEventListener("keydown", preventKeyboardShortcuts)
      document.removeEventListener("dragstart", preventDragAndSelect)
      document.removeEventListener("selectstart", preventDragAndSelect)
    }
  }, [])

  const handleResponseChange = (index: number, value: string) => {
    const newResponses = [...responses]
    newResponses[index] = value
    setResponses(newResponses)
  }

  const handleComplete = () => {
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen()
    }
    onComplete()
  }

  const completedResponses = responses.filter((response) => response.trim().length > 0).length
  const progressPercentage = (completedResponses / 5) * 100

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-background p-4" style={{ userSelect: "none", WebkitUserSelect: "none" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Self Description Test</h1>
            <div className="flex items-center gap-4">
              <div className={`text-lg font-mono ${timeRemaining <= 300 ? "text-red-600" : "text-foreground"}`}>
                Time: {formatTime(timeRemaining)}
              </div>
              <div className="text-sm text-muted-foreground">Progress: {completedResponses}/5 sections</div>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2 mb-4" />
          <p className="text-muted-foreground">
            Please write one paragraph for each of the following headings. You have 15 minutes to complete all sections.
          </p>
          {isTimeUp && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md">
              <p className="text-red-800 font-semibold">Time's up! The test will complete automatically.</p>
            </div>
          )}
        </Card>

        {/* Security Notice */}
        <Card className="p-4 mb-6 border-amber-200 bg-amber-50">
          <p className="text-sm text-amber-800">
            <strong>Security Notice:</strong> This test is in secure mode. Right-clicking, screenshots, and keyboard
            shortcuts are disabled.
          </p>
        </Card>

        {/* Questions */}
        <div className="space-y-6">
          {HEADINGS.map((heading, index) => (
            <Card key={index} className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">
                  {index + 1}. {heading}
                </h2>
              </div>
              <Textarea
                value={responses[index]}
                onChange={(e) => handleResponseChange(index, e.target.value)}
                placeholder="Write your response here... (one paragraph)"
                className="min-h-32 resize-none"
                rows={6}
                disabled={isTimeUp}
              />
              <div className="mt-2 text-xs text-muted-foreground">Characters: {responses[index].length}</div>
            </Card>
          ))}
        </div>

        {/* Complete Button */}
        <Card className="p-6 mt-6 text-center">
          <Button onClick={handleComplete} size="lg" className="px-8" disabled={false}>
            {isTimeUp
              ? "Test Completed (Time Up)"
              : completedResponses < 5
                ? `Complete Test (${completedResponses}/5 sections done)`
                : "Complete Self Description Test"}
          </Button>
          {!isTimeUp && completedResponses < 5 && (
            <p className="text-sm text-muted-foreground mt-2">
              You can complete the test even if not all sections are finished.
            </p>
          )}
        </Card>
      </div>
    </div>
  )
}
