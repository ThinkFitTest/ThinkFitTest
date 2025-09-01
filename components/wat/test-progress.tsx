import { Progress } from "@/components/ui/progress"
import { formatTime } from "@/lib/wat-utils"

interface TestProgressProps {
  totalElapsed: number
  totalDuration: number
}

export function TestProgress({ totalElapsed, totalDuration }: TestProgressProps) {
  const progressPercentage = (totalElapsed / totalDuration) * 100

  return (
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
  )
}
