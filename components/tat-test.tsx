"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Play, Square, RotateCcw, Maximize } from "lucide-react"

const ALL_TAT_IMAGES = [
  { id: "card-1", name: "Card 1", src: "/images/card-1.jpeg" },
  { id: "card-2", name: "Card 2", src: "/images/card-2.jpeg" },
  { id: "card-3bm", name: "Card 3BM", src: "/images/card-3bm.jpeg" },
  { id: "card-3gf", name: "Card 3GF", src: "/images/card-3gf.jpeg" },
  { id: "card-4", name: "Card 4", src: "/images/card-4.jpeg" },
  { id: "card-5", name: "Card 5", src: "/images/card-5.jpeg" },
  { id: "card-6bm", name: "Card 6BM", src: "/images/card-6bm.jpeg" },
  { id: "card-6gf", name: "Card 6GF", src: "/images/card-6gf.jpeg" },
  { id: "card-7bm", name: "Card 7BM", src: "/images/card-7bm.jpeg" },
  { id: "card-7gf", name: "Card 7GF", src: "/images/card-7gf.jpeg" },
  { id: "card-8bm", name: "Card 8BM", src: "/images/card-8bm.jpeg" },
  { id: "card-9bm", name: "Card 9BM", src: "/images/card-9bm.jpeg" },
  { id: "card-10", name: "Card 10", src: "/images/card-10.jpeg" },
  { id: "card-11", name: "Card 11", src: "/images/card-11.jpeg" },
  { id: "card-12m", name: "Card 12M", src: "/images/card-12m.jpeg" },
  { id: "card-12bg", name: "Card 12BG", src: "/images/card-12bg.jpeg" },
  { id: "card-13bm", name: "Card 13BM", src: "/images/card-13bm.jpeg" },
  { id: "card-13mf", name: "Card 13MF", src: "/images/card-13mf.jpeg" },
  { id: "card-14", name: "Card 14", src: "/images/card-14.jpeg" },
  { id: "card-15", name: "Card 15", src: "/images/card-15.jpeg" },
]

const BLANK_SLIDE = { id: "blank", name: "Blank Slide", src: null }

const IMAGE_DURATION = 30 // 30 seconds
const BLANK_DURATION = 240 // 4 minutes (240 seconds)
const FINAL_BLANK_DURATION = 30 // 30 seconds for the final blank slide

type TestState = "idle" | "running" | "completed"
type Phase = "image" | "blank"

function generateRandomTestSequence() {
  const shuffled = [...ALL_TAT_IMAGES].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, 11)
  return [...selected, BLANK_SLIDE]
}

const playImageSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime) // 800Hz tone
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
  } catch (error) {
    console.log("[v0] Audio not supported or failed:", error)
  }
}

interface TATTestProps {
  onComplete?: () => void
}

export default function TATTest({ onComplete }: TATTestProps) {
  const [testSequence, setTestSequence] = useState<typeof ALL_TAT_IMAGES>([])
  const [testState, setTestState] = useState<TestState>("idle")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>("image")
  const [timeRemaining, setTimeRemaining] = useState(IMAGE_DURATION)
  const [totalElapsed, setTotalElapsed] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const totalDuration = 11 * (IMAGE_DURATION + BLANK_DURATION) + FINAL_BLANK_DURATION

  const getCurrentPhaseDuration = () => {
    if (phase === "image") return IMAGE_DURATION
    if (currentImageIndex === testSequence.length - 1) return FINAL_BLANK_DURATION // Final blank slide
    return BLANK_DURATION
  }

  const resetTest = useCallback(() => {
    setTestSequence(generateRandomTestSequence())
    setTestState("idle")
    setCurrentImageIndex(0)
    setPhase("image")
    setTimeRemaining(IMAGE_DURATION)
    setTotalElapsed(0)
  }, [])

  useEffect(() => {
    setTestSequence(generateRandomTestSequence())
  }, [])

  const startTest = () => {
    setTestState("running")
    if (phase === "image") {
      setTimeout(() => playImageSound(), 100)
    }
    enterFullscreen()
  }

  const stopTest = () => {
    exitFullscreen()
    resetTest()
  }

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } catch (error) {
      console.log("[v0] Fullscreen not supported:", error)
    }
  }

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      }
      setIsFullscreen(false)
    } catch (error) {
      console.log("[v0] Exit fullscreen failed:", error)
    }
  }

  useEffect(() => {
    const preventRightClick = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    const preventKeyboardShortcuts = (e: KeyboardEvent) => {
      if (
        e.key === "PrintScreen" ||
        (e.ctrlKey && e.shiftKey && (e.key === "S" || e.key === "s")) ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i")) ||
        (e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4" || e.key === "5")) ||
        (e.ctrlKey && (e.key === "S" || e.key === "s")) ||
        (e.ctrlKey && (e.key === "P" || e.key === "p")) ||
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "C" || e.key === "c")) ||
        (e.ctrlKey && e.shiftKey && (e.key === "J" || e.key === "j"))
      ) {
        e.preventDefault()
        return false
      }
    }

    const preventTextSelection = (e: Event) => {
      e.preventDefault()
      return false
    }

    const preventDragDrop = (e: DragEvent) => {
      e.preventDefault()
      return false
    }

    document.addEventListener("contextmenu", preventRightClick)
    document.addEventListener("keydown", preventKeyboardShortcuts)
    document.addEventListener("selectstart", preventTextSelection)
    document.addEventListener("dragstart", preventDragDrop)

    return () => {
      document.removeEventListener("contextmenu", preventRightClick)
      document.removeEventListener("keydown", preventKeyboardShortcuts)
      document.removeEventListener("selectstart", preventTextSelection)
      document.removeEventListener("dragstart", preventDragDrop)
    }
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (testState === "running") {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Time is up for current phase
            if (phase === "image") {
              // Switch to blank phase
              setPhase("blank")
              const nextDuration = currentImageIndex === testSequence.length - 1 ? FINAL_BLANK_DURATION : BLANK_DURATION
              return nextDuration
            } else {
              // Blank phase is done, move to next image or complete test
              if (currentImageIndex < testSequence.length - 1) {
                setCurrentImageIndex((prevIndex) => prevIndex + 1)
                setPhase("image")
                // Play sound for new image
                setTimeout(() => playImageSound(), 100)
                return IMAGE_DURATION
              } else {
                // Test completed
                setTestState("completed")
                if (onComplete) {
                  setTimeout(() => onComplete(), 1000)
                }
                return 0
              }
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
  }, [testState, phase, currentImageIndex, testSequence.length, onComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progressPercentage = (totalElapsed / totalDuration) * 100

  if (testSequence.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading test...</div>
      </div>
    )
  }

  const currentItem = testSequence[currentImageIndex]

  return (
    <div
      className="min-h-screen bg-background flex flex-col select-none"
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
    >
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">TAT (Thematic Apperception Test)</h1>
              <p className="text-muted-foreground">
                Item {currentImageIndex + 1} of {testSequence.length} •{" "}
                {phase === "image" ? "Viewing Phase" : "Response Phase"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {testState === "idle" && (
                <>
                  <Button onClick={startTest} className="gap-2">
                    <Play className="h-4 w-4" />
                    Start Test
                  </Button>
                  {!isFullscreen && (
                    <Button onClick={enterFullscreen} variant="outline" className="gap-2 bg-transparent">
                      <Maximize className="h-4 w-4" />
                      Fullscreen
                    </Button>
                  )}
                </>
              )}
              {testState === "running" && (
                <Button onClick={stopTest} variant="destructive" className="gap-2">
                  <Square className="h-4 w-4" />
                  Stop
                </Button>
              )}
              {testState === "completed" && (
                <Button onClick={resetTest} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  New Test
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {testState !== "idle" && (
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {formatTime(totalElapsed)} / {formatTime(totalDuration)}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        {testState === "idle" && (
          <Card className="p-8 max-w-4xl">
            <h2 className="text-2xl font-bold mb-6 text-center">TAT Test Instructions</h2>
            <div className="space-y-4 text-sm leading-relaxed mb-8">
              <div className="flex gap-3">
                <span className="font-bold text-primary">1.</span>
                <p>
                  <strong>THIS IS A TEST OF YOUR IMAGINATION.</strong> IN THIS TEST YOU ARE REQUIRED TO GIVE YOUR
                  RESPONSES WHICH MAY BE DIFFERENT FROM ONE ANOTHER.
                </p>
              </div>

              <div className="flex gap-3">
                <span className="font-bold text-primary">2.</span>
                <p>
                  <strong>IN THIS TEST YOU WILL BE SHOWN A PICTURE DEPICTING CERTAIN CHARACTERS & SITUATION.</strong>{" "}
                  PLEASE OBSERVE THE PICTURE CAREFULLY AND WRITE A STORY AROUND IT.
                </p>
              </div>

              <div className="flex gap-3">
                <span className="font-bold text-primary">3.</span>
                <p>
                  <strong>
                    YOU WILL WRITE AS TO WHAT LED TO THE SITUATION, WHAT IS GOING ON AND WHAT THE OUTCOME WILL BE.
                  </strong>{" "}
                  YOU WILL ALSO DESCRIBE THE THOUGHTS, FEELINGS AND ACTIONS OF THE CHARACTERS OF YOUR STORY.
                </p>
              </div>

              <div className="flex gap-3">
                <span className="font-bold text-primary">4.</span>
                <p>
                  <strong>WRITE ABOUT 100 WORDS IN YOUR STORY.</strong>
                </p>
              </div>

              <div className="flex gap-3">
                <span className="font-bold text-primary">5.</span>
                <p>
                  <strong>PLEASE DO NOT WRITE IN POINT FORM. WRITE IN PARAGRAPH STYLE.</strong>
                </p>
              </div>

              <div className="flex gap-3">
                <span className="font-bold text-primary">6.</span>
                <p>
                  <strong>
                    YOU WILL BE SHOWN A PICTURE FOR 30 SECONDS AND YOU WILL GET FOUR MINUTES TO WRITE THE STORY.
                  </strong>
                </p>
              </div>

              <div className="flex gap-3">
                <span className="font-bold text-primary">7.</span>
                <p>
                  <strong>ALTOGETHER YOU WILL BE SHOWN 11 PICTURES & 12th PICTURE WILL BE A BLANK SLIDE</strong> IN
                  WHICH YOU ARE FREE TO IMAGINE A PICTURE OF YOUR OWN CHOICE AND WRITE A STORY AROUND IT.
                </p>
              </div>

              <div className="flex gap-3">
                <span className="font-bold text-primary">8.</span>
                <p>
                  <strong>YOU MAY WRITE YOUR STORY IN ENGLISH, HINDI OR COMBINATION OF BOTH.</strong>
                </p>
              </div>

              <div className="flex gap-3">
                <span className="font-bold text-primary">9.</span>
                <p>
                  <strong>PLEASE USE BLUE OR BLACK INK PEN ONLY.</strong>
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <p className="text-muted-foreground mb-6 text-center">
                <strong>Security Notice:</strong> Once started, the test cannot be paused. Right-click and screenshot
                functions are disabled.
              </p>
              <div className="text-center">
                <Button onClick={startTest} size="lg" className="gap-2">
                  <Play className="h-5 w-5" />
                  Start Test
                </Button>
              </div>
            </div>
            {/* </CHANGE> */}
          </Card>
        )}

        {testState === "completed" && (
          <Card className="p-8 text-center max-w-md">
            <h2 className="text-xl font-semibold mb-4">Test Completed</h2>
            <p className="text-muted-foreground mb-6">
              You have completed all 12 items in this TAT assessment (11 images + 1 blank slide).
            </p>
            <Button onClick={resetTest} size="lg" className="gap-2">
              <RotateCcw className="h-5 w-5" />
              Start New Test
            </Button>
          </Card>
        )}

        {testState === "running" && (
          <div className="w-full max-w-4xl">
            {phase === "image" ? (
              <div className="text-center">
                {currentItem.src ? (
                  <div className="mb-4">
                    <img
                      src={currentItem.src || "/placeholder.svg"}
                      alt={currentItem.name}
                      className="max-w-full max-h-[70vh] mx-auto object-contain border rounded-lg shadow-lg pointer-events-none"
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                      style={{ userSelect: "none", WebkitUserSelect: "none" }}
                    />
                  </div>
                ) : (
                  <div className="mb-4 flex items-center justify-center h-[70vh] border rounded-lg bg-gray-100">
                    <div className="text-center">
                      <div className="text-6xl text-gray-400 mb-4">⬜</div>
                      <p className="text-xl text-gray-600">Blank Slide</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-center gap-4">
                  <span className="text-lg font-medium">{currentItem.name}</span>
                  <span className="text-2xl font-mono font-bold text-primary">{formatTime(timeRemaining)}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4">Response Time</h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    {currentItem.id === "blank"
                      ? "Please reflect on your overall experience with the test."
                      : "Please write your story about the previous image."}
                  </p>
                  <div className="text-4xl font-mono font-bold text-primary">{formatTime(timeRemaining)}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Bar */}
      {testState === "running" && (
        <div className="border-t bg-muted/50">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between text-sm">
              <span>
                Phase: {phase === "image" ? "Image Display" : "Response Period"}({formatTime(timeRemaining)} remaining)
              </span>
              <span>
                Next:{" "}
                {phase === "image"
                  ? "Response Period"
                  : currentImageIndex < testSequence.length - 1
                    ? "Next Item"
                    : "Test Complete"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
