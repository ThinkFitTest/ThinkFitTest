"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, LogOut, CreditCard, FileText, Clock, Award } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface DashboardProps {
  user: SupabaseUser
}

export default function Dashboard({ user }: DashboardProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleTestSelection = (type: "complete" | "individual", testName?: string) => {
    const params = new URLSearchParams({
      type,
      ...(testName && { test: testName }),
    })
    router.push(`/payment?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">TF</span>
            </div>
            <h1 className="text-xl font-bold">{"ThinkFitTest"}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} disabled={isLoggingOut}>
              <LogOut className="w-4 h-4 mr-2" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h2>
          <p className="text-muted-foreground">Select from our comprehensive psychological assessment suite. Make sure you have a stable internet connection, a quiet place with no disturbances. Take this test preferrably during morning hours for best results.                 </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tests Completed</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Time</p>
                <p className="text-2xl font-bold">0h</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Certificates</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Credits</p>
                <p className="text-2xl font-bold">₹0</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Selection */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Complete Assessment */}
          <div className="lg:col-span-2">
            <Card className="border-2 hover:border-primary transition-colors relative">
              <Badge className="absolute top-4 right-4 bg-green-500">Best Value</Badge>
              <CardHeader>
                <CardTitle className="text-2xl">Unlock Your True Potential with Expert Psych Assessment</CardTitle>
                <CardDescription>
                  Our Complete Assessment Package gives you: All Four Core Tests (TAT, WAT, SRT &amp; SD); Dossier Assessment and a Personal Feedback Session with an experienced psychologist of SSB.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-primary mb-4 text-2xl">₹3,499 (excl GST)</div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">
                      <strong>TAT :</strong> 11 random images + 1 blank slide
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">
                      <strong>WAT :</strong> 60 random words (15s each)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">
                      <strong>SRT :</strong> 60 situations (30 minutes)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">
                      <strong>Self Description:</strong> 5 paragraphs (15 minutes)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">
                      <strong>PDF Upload:</strong> Dossier submission facility
                    </span>
                  </div>
                </div>
                <div className="bg-muted p-3 rounded-lg mb-4">
                  <p className="text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Total Duration: ~2.5 hours (includes automatic breaks)  
                  </p>
                </div>
                <Button onClick={() => handleTestSelection("complete")} size="lg" className="w-full">
                  Start Complete Assessment - ₹3,499
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Individual Tests */}
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold">Want to Practice Individual Tests?</h3>
              <div className="text-2xl font-bold text-primary">@₹999 (excl GST)</div>
            </div>

            <Card className="hover:border-primary transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">TAT</CardTitle>
                <CardDescription>Thematic Apperception Test</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  11 images + 1 blank slide for personality assessment
                </p>
                <Button onClick={() => handleTestSelection("individual", "TAT")} className="w-full" variant="outline">
                  Start TAT - ₹999
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:border-primary transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">WAT</CardTitle>
                <CardDescription>Word Association Test</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">60 Selected Words</p>
                <Button onClick={() => handleTestSelection("individual", "WAT")} className="w-full" variant="outline">
                  Start WAT - ₹999
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:border-primary transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">SRT </CardTitle>
                <CardDescription>Situation Reaction Test</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">60 Situations</p>
                <Button onClick={() => handleTestSelection("individual", "SRT")} className="w-full" variant="outline">
                  Start SRT - ₹999
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:border-primary transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Self Description</CardTitle>
                <CardDescription>{"Knowledge of Self"}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">5 Paragraph Responses</p>
                <Button
                  onClick={() => handleTestSelection("individual", "Self Description")}
                  className="w-full"
                  variant="outline"
                >
                  Start Self Description - ₹299
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Important:</strong> Tests begin immediately after successful payment. All tests include security
            measures that prevent pausing, right-clicking, and screenshot functions once started.
          </p>
        </div>
      </div>
    </div>
  )
}
