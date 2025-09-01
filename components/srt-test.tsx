"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

const SRT_SITUATIONS = [
  "While traveling by train he went to toilet. On his return to his seat he found his briefcase missing. He..",
  "He received conflicting orders from his two superior officers. He..",
  "He was appointed captain of basketball team but other players revolted against his appointment. He..",
  "An epidemic spread in the village due to poor hygiene conditions. He..",
  "While he discussed his viewpoints others did not listen to him carefully. He..",
  "He noticed a car moving with high speed running over a child on the road. He..",
  "A fellow passenger fell from a running train. He..",
  "His parents wanted him to marry a wealthy and less educated girl, but he had already found a suitable educated girl for himself. He..",
  "He made a silly mistake and his friend pointed it out. He..",
  "He heard his neighbor screaming 'thief – thief' at mid night. He..",
  "A fellow passenger in the train objected to his smoking being an offence in public place. He..",
  "He reached home from office and saw his house on fire. He..",
  "He was going to Delhi for an interview but realized after one hour that he has boarded a wrong train. He..",
  "While he was going up in a lift the electric power supply failed. He..",
  "While he was hosting a dinner to his friends in a hotel he realized that he has forgotten his wallet at home. He..",
  "His friends came to borrow the book from which he was preparing for next morning paper. He..",
  "He was appointed to supervise evening games in the college but he was staying far away. He..",
  "He proposed to invite a political leader to preside over the annual day celebration but others were against it. He..",
  "He had undergone a major surgical operation but there was no one to look after. He..",
  "His parents were insisting on his early marriage but he wanted to take up a job first. He..",
  "He realized that his seniors were giving step-motherly treatment to him. He..",
  "Hearing an unusual sound at night he woke up and found a thief jumping out of his window. He..",
  "He was going to attend SSB interview. On reaching the Railway Station he noticed that his suitcase has been stolen with his original certificates needed at SSB. He..",
  "While he was traveling on his scooter, someone at gunpoint demanded his purse. He..",
  "He went to college but rowdy students told him to boycott the class. He..",
  "His father had a dispute with his uncle on landed property. He..",
  "He wanted to borrow money for his sister's marriage. The relative who assured him, declined to lend him at the time of marriage. He..",
  "He was going on a bicycle in thick jungle. It was already dark and his destination was 10 Km away. His cycle got punctured. He..",
  "He went to buy a ticket to travel by rail. On getting the ticket he found that his purse was missing. He..",
  "While he was in a jungle in Nagaland, he saw six Nagas with lathis rushing to him. He..",
  "He was appointed Langar Commander. The dal has often been having stones which was complained by the dining members. He..",
  "He didn't do well in written test of SCO Commission. His friends advised him not to venture in future. He..",
  "He was traveling in a train on reserved seat. A fellow passenger claimed to have the same seat on his reservation ticket. He..",
  "He won a lottery of rupees one lakh. He..",
  "His two school going children frequently missed the classes. He..",
  "He was going to the market and he noticed a car and a tonga collide with each other. He..",
  "He was asked to organize a picnic to a nearby historical place. He..",
  "On returning to his barrack from the firing range, he found that his friend had brought 20 rounds of 7.62 mm SLR. He..",
  "A helicopter crashed in the vicinity of his unit lines. He..",
  "He saw a rifle disc lying in the football field of his company. He..",
  "A speeding motor truck ran over a man as he happened to pass by. He..",
  "He was on a boat and he noticed mid stream water entering in the boat. He..",
  "He & his sister were passing through a thick forest on a scooter. The scooter had stopped at gunpoint for ransom. He..",
  "He was called upon to organize a variety entertainment show in aid of Jawans' welfare in his unit. He..",
  "Due to financial difficulties his father couldn't support him for further studies after he passed his metric examination. He..",
  "Demand of a loan from his close relative was urgent whereas he needed the same money for his son's hostel admission. He..",
  "He entered the bathroom and notices a black cobra hanging from the ceiling of the roof. He..",
  "Recently his younger brother had become arrogant. So He..",
  "While he was watching cinema he suddenly noticed smoke coming out of cinema hall. The viewers started running causing stampede. He..",
  "His father had borrowed some money for his higher studies which he could not pay back. So He..",
  "While passing through a mountainous track he was challenged by two persons with weapons in their hands. He..",
  "He had to appear in an exam. On reaching the city, he noticed that curfew had been clamped. He..",
  "He was captain of basketball team and his team was about to loose in the final. He..",
  "After marriage, his in-laws forced him to leave the job. He..",
  "His parents often irritated him with their orthodox ideas about the role of women in a society. He..",
  "At the time of interview, he found that his certificates were missing. He..",
  "When he observed that his friend was having some suspicion on him. He..",
  "He had already decided to vote for a particular candidate whereas his friends wanted his commitment for the other candidate. He..",
  "His colleagues advised him to be tactful with his boss. He..",
  "He happened to be present at a bus stop when a child who was with his mother was hit by a speeding motorbike and was injured seriously. He..",
  "Exams were coming near and he fell seriously ill. He..",
  "He worked too hard in his family but also wanted to study further. He..",
  "On a ship during his duty, he saw fumes and smoke coming out of a cabin. He..",
  "He was a prefect in his hostel. He noticed two of his friends French bunking. He..",
  "He was forced to join the Railways but he was really not interested. He..",
  "He saw a truck hit a cyclist on highway. He..",
  "All his family members were ill and his father was out of town. There was no money in the home. He..",
  "He didn't find a subject interesting to study so He..",
  "He returned late in night from NCC camp. His step mother didn't let him in. He..",
  "His captain was injured before a crucial match and He was asked to lead the team. He..",
  "He was traveling in train and he lost his money. He..",
  "They decided to give a treat to their retiring professor. He wanted to give a dinner party whiles his friends wanted just a tea party. He..",
  "In his train compartment, two gunmen forced passengers to give their belongings. He..",
  "The leader of his trekking team decided to take a longer route when time was running out. He..",
  "He was a student of final year and his father expired. Uncle threw him out of the house. He..",
  "His friends' were having heated arguments over a point. He..",
  "He was driving at high speed. And suddenly some person was ran over by his car and died. He..",
  "He was new in town & didn't know the local language. He..",
  "His money was lost and he was new in the town. He..",
  "He was forced to vote for a candidate not of his choice. He..",
  "His father and uncle quarreled over his intended inter caste marriage. He..",
  "His professor asked him to arrange for a picnic. He..",
  "He & his friends were traveling from a speedy train when his friend looked out of window & got hit by a pole. He..",
  "He was going to market with his sister and some boys started doing mischief with her. He..",
  "His captain was injured before a crucial match, he was asked to lead the team. He..",
  "He was on his way to home and suddenly it started raining heavily. He..",
  "He was an officer posted at the border & suddenly shelling started from the other side. He..",
  "He was at unknown city and lost his purse. And was in dire Need of Money. He..",
  "His brother wanted to get admission in a medical college but his marks fell short by 1 % for admission. He..",
  "He had to go to a city with cash for work but the way was dangerous due t presence of dacoits. He..",
  "He was traveling by a train & suddenly a person snatched purse from a lady & jumped out of the train. He..",
  "He was going to sign a contract. Suddenly he got news that one of his friend who had helped him once met with an accident and was in ICU. He..",
  "He had boarded a wrong train and came to know only when he was asked to pay money to TT. He..",
  "He saw his girlfriend walking with another person on his way. He..",
  "He was on his way to railway station to catch a train. Suddenly a person was thrown out of a speedy car. He..",
  "He was driving the bike without helmet and the traffic Police caught him. He..",
  "He was asked to organize the farewell party. He..",
  "He was ironing his clothes when suddenly he received an electric shock and he noticed the wire burning. He..",
  "He was in charge of wireless board in a sailing ship which lost its communication with the coast. He..",
  "In a discussion with his colleagues. He found himself losing ground. He..",
  "He was to appear for an exam and all of a sudden the curfew was imposed in that area. He..",
  "He went for the picnic with his friends and on the way he had hot arguments with them. He..",
  "There was a person who sold smuggled goods. He too, like many others, had purchased a wristwatch from him. But it didn't work. He..",
  "Just two days before the semi-finals of the bridge tournament, his partner was called by his parents and had to go out of station for an urgent work. He..",
  "He was rather young when his father was killed in the war and later mother kidnapped by the rival group. He had no other relative. He..",
  "He was on the way to his home, suddenly his bicycle got punctured. He..",
  "He urgently needed some money. He..",
  "During exams his teacher threatened him to fail in examination. He..",
  "He was getting late in reaching meeting. He..",
  "He found his hostel roommate not very friendly with him. He..",
  "His mother was seriously ill and his boss didn't grant him leave. He..",
  "He was trying long jump, in college sports day, and injured his ankle. He..",
  "He was to marry a rich girl chosen by his father but he did not like her. He..",
  "He saw his Best friend copying from book in examination hall. He..",
  "During a trekking trip, he was left alone in the jungle. He..",
  "He was weak in studies, and knew that he could not do well in his education. He..",
  "He was going for SSB and on the way he saw a person seriously injured and nobody was there to help him. He..",
  "His brother was facing charges for the murder which he really committed. He..",
  "He was crossing a heavily flooded nala in his boat and suddenly lost his control. He..",
  "He was traveling to his SSB centre, and just before reaching the station, he found that his suitcase is lost. He..",
]

interface SRTTestProps {
  onComplete: () => void
}

export default function SRTTest({ onComplete }: SRTTestProps) {
  const [testState, setTestState] = useState<"ready" | "running" | "completed">("ready")
  const [timeRemaining, setTimeRemaining] = useState(1800) // 30 minutes = 1800 seconds
  const [selectedSituations, setSelectedSituations] = useState<string[]>([])

  useEffect(() => {
    const shuffled = [...SRT_SITUATIONS].sort(() => Math.random() - 0.5)
    setSelectedSituations(shuffled.slice(0, 60))
  }, [])

  const playSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.log("[v0] Audio not supported")
    }
  }, [])

  useEffect(() => {
    if (testState !== "running") return

    const preventRightClick = (e: MouseEvent) => e.preventDefault()
    const preventKeyboardShortcuts = (e: KeyboardEvent) => {
      if (
        e.key === "PrintScreen" ||
        (e.ctrlKey && e.shiftKey && (e.key === "S" || e.key === "I")) ||
        (e.ctrlKey && e.key === "s") ||
        (e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4" || e.key === "5")) ||
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "C")
      ) {
        e.preventDefault()
        return false
      }
    }
    const preventTextSelection = (e: Event) => e.preventDefault()
    const preventDragStart = (e: DragEvent) => e.preventDefault()

    document.addEventListener("contextmenu", preventRightClick)
    document.addEventListener("keydown", preventKeyboardShortcuts)
    document.addEventListener("selectstart", preventTextSelection)
    document.addEventListener("dragstart", preventDragStart)

    return () => {
      document.removeEventListener("contextmenu", preventRightClick)
      document.removeEventListener("keydown", preventKeyboardShortcuts)
      document.removeEventListener("selectstart", preventTextSelection)
      document.removeEventListener("dragstart", preventDragStart)
    }
  }, [testState])

  useEffect(() => {
    if (testState !== "running") return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setTestState("completed")
          onComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [testState, onComplete])

  const startTest = async () => {
    try {
      await document.documentElement.requestFullscreen()
    } catch (error) {
      console.log("[v0] Fullscreen not supported")
    }

    playSound()
    setTestState("running")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progressPercentage = ((1800 - timeRemaining) / 1800) * 100

  if (testState === "ready") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-2xl">
          <h1 className="text-3xl font-bold mb-6">Situation Response Test (SRT)</h1>
          <div className="space-y-4 text-left mb-8">
            <p className="text-muted-foreground font-semibold mb-4">
              <strong>Instructions:</strong>
            </p>
            <div className="space-y-3 text-sm">
              <p className="font-medium">1. THIS IS A SIMPLE EXERCISE OF PROBLEM SOLVING....</p>
              <p className="font-medium">
                2. IN THIS TEST YOU WILL BE PRESENTED WITH DAY TO DAY PROBLEMS. WE WOULD LIKE TO KNOW HOW YOU WOULD
                FEEL, ACT AND RESPOND IN SUCH SITUATIONS....
              </p>
              <p className="font-medium">3. YOU WILL GET 30 MINUTES TO ANSWER 60 SITUATIONS....</p>
              <p className="font-medium">4. WRITE YOUR RESPONSES CONCISELY AND CLEARLY....</p>
              <p className="font-medium">5. TRY TO ANSWER ALL THE SITUATIONS.</p>
            </div>
          </div>

          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg mb-6">
            <p className="text-sm text-destructive font-medium">
              <strong>Security Notice:</strong> Once started, this test cannot be paused. Right-clicking, screenshots,
              and screen recordings are disabled. The test will run in fullscreen mode.
            </p>
          </div>

          <Button onClick={startTest} size="lg" className="gap-2">
            Start SRT Test
          </Button>
        </Card>
      </div>
    )
  }

  if (testState === "running") {
    return (
      <div className="min-h-screen bg-background p-4 select-none">
        <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b z-10 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold">Situation Response Test (SRT)</h1>
            <div className="flex items-center gap-4">
              <div className="text-lg font-mono font-bold text-primary">{formatTime(timeRemaining)}</div>
              <Progress value={progressPercentage} className="w-32 h-2" />
            </div>
          </div>
        </div>

        <div className="pt-20 pb-8">
          <div className="max-w-4xl mx-auto">
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="space-y-6 pr-4">
                {selectedSituations.map((situation, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-base leading-relaxed">{situation}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="p-8 text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">SRT Test Completed</h2>
        <p className="text-muted-foreground mb-6">You have successfully completed the Situation Response Test.</p>
      </Card>
    </div>
  )
}
