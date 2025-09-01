"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Award, Clock } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
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
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">India's first and only automated Professional Psychological Assessment Platform for SSB Aspirants   </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Professional Psychological
            <span className="text-primary block">Assessment Platform</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Comprehensive psychological testing as per actual conditions of SSB, Professional Assessment of Dossiers by Ex-Psychologists of SSB. Trusted by 5000+ SSB Aspirants 
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Assessment
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                Login to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h3>
            <p className="text-muted-foreground text-lg">
              Professional-grade psychological assessments with real time testing conditions giving you the accurate exposure and practice before actual SSB         
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {""}  
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Professional Grade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Prepared by Licensed Ex - Psychologists of SSB           </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Validated Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Scientifically Validated Tests including TAT, WAT, and SRT
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>{"Personalised Feedback"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Dossier Assessment and Personal Feedback Session for in-depth Psych Assessment       </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tests Overview */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Available Assessments</h3>
            <p className="text-muted-foreground text-lg">
              Comprehensive psychological testing suite for professional evaluation
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>TAT Test</CardTitle>
                <CardDescription>Thematic Apperception Test</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  11 images + 1 blank slide for personality assessment through storytelling
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>WAT Test</CardTitle>
                <CardDescription>Word Association Test</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  60 random words with 15-second response time for psychological evaluation
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>SRT Test</CardTitle>
                <CardDescription>Situation Reaction Test</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">60 situational scenarios with 30-minute completion time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Self Description</CardTitle>
                <CardDescription>{"Knowledge of Self"}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  5 paragraph responses for comprehensive personality evaluation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">TF</span>
                </div>
                <span className="font-bold">{"ThinkFitTest"}</span>
              </div>
              <p className="text-muted-foreground leading-5 text-base">
                 {"Need Help? \nWhatsapp Us at +91-9876543210"}    
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/auth/sign-up" className="hover:text-foreground">
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="hover:text-foreground">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    HIPAA Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 ThinkFitTest All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
