import { ALL_WAT_WORDS, WORDS_PER_SET, type TestItem } from "./wat-constants"

export function generateRandomWATSequence(): TestItem[] {
  // Randomly select 60 words from the comprehensive list
  const shuffledWords = [...ALL_WAT_WORDS].sort(() => Math.random() - 0.5)
  const selectedWords = shuffledWords.slice(0, 60)

  const sequence: TestItem[] = []

  for (let i = 0; i < selectedWords.length; i++) {
    sequence.push({
      type: "word",
      content: selectedWords[i],
    })

    // Add blank slide after every 20 words (but not after the last word)
    if ((i + 1) % WORDS_PER_SET === 0 && i < selectedWords.length - 1) {
      sequence.push({
        type: "blank",
        content: `Break ${Math.floor(i / WORDS_PER_SET) + 1}`,
        setNumber: Math.floor(i / WORDS_PER_SET) + 1,
      })
    }
  }

  return sequence
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function playWordSound(): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.setValueAtTime(600, audioContext.currentTime) // 600Hz tone for words
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.2)
  } catch (error) {
    console.log("[v0] Audio not supported or failed:", error)
  }
}
