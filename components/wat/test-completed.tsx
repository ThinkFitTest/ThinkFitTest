"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RotateCcw } from "lucide-react"

interface TestCompletedProps {
  onReset: () => void
}

export function TestCompleted({ onReset }: TestCompletedProps) {
  return (
    <Card className="p-8 text-center max-w-md">
      <h2 className="text-xl font-semibold mb-4">Test Completed</h2>
      <p className="text-muted-foreground mb-6">You have completed all 60 words in this WAT assessment.</p>
      <Button onClick={onReset} size="lg" className="gap-2">
        <RotateCcw className="h-5 w-5" />
        Start New Test
      </Button>
    </Card>
  )
}
