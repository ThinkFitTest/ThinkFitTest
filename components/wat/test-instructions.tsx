"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play } from "lucide-react"

interface TestInstructionsProps {
  onStart: () => void
}

export function TestInstructions({ onStart }: TestInstructionsProps) {
  return (
    <Card className="p-8 text-center max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-primary">WAT Test Instructions</h2>
      <div className="text-left space-y-4 mb-8">
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="font-semibold text-lg mb-4">Please read the following instructions carefully:</p>

          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              <span className="font-bold">1.</span>{" "}
              <span className="font-semibold">
                THIS IS AGAIN A TEST OF YOUR IMAGINATION. IN THIS TEST YOU WILL BE SHOWN WORDS ONE AFTER ANOTHER.
              </span>
            </p>

            <p>
              <span className="font-bold">2.</span>{" "}
              <span className="font-semibold">
                AFTER READING A PARTICULAR WORD WHATEVER THE FIRST THOUGHT OR IDEA COMES TO YOUR MIND PLEASE EXPRESS
                THAT THOUGHT OR IDEA IN THE FORM OF A SENTENCE. YOU MAY OR MAY NOT USE THE WORD SHOWN TO EXPRESS YOUR
                THOUGHT OR IDEA.
              </span>
            </p>

            <p>
              <span className="font-bold">3.</span>{" "}
              <span className="font-semibold">
                A WORD WILL BE SHOWN ON SCREEN FOR A DURATION OF 15 SECONDS. IN THIS DURATION ONLY YOU HAVE TO SEE THE
                WORD AND EXPRESS YOUR THOUGHT OR IDEA IN THE FORM OF A SENTENCE.
              </span>
            </p>

            <p>
              <span className="font-bold">4.</span> <span className="font-semibold">DO NOT WRITE LONG SENTENCES.</span>
            </p>

            <p>
              <span className="font-bold">5.</span>{" "}
              <span className="font-semibold">
                ALTOGETHER YOU WILL BE SHOWN 60 WORDS. THERE WILL BE A BLANK SLIDE AFTER EVERY 20 WORDS. THIS IS JUST TO
                FACILITATE YOU TO TURN OVER THE PAGE AND ALSO MAKING SURE THAT YOU ARE RECORDING YOUR RESPONSES IN
                CORRECT SEQUENCE.
              </span>
            </p>
          </div>
        </div>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Security Notice:</strong> Once started, the test cannot be paused. Right-click and screenshot
            functions are disabled.
          </p>
        </div>
      </div>
      <Button onClick={onStart} size="lg" className="gap-2">
        <Play className="h-5 w-5" />
        Start Test
      </Button>
    </Card>
  )
}
