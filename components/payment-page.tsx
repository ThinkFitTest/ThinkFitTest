"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, Shield, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface PaymentPageProps {
  user: SupabaseUser
  testType: "complete" | "individual"
  testName?: string
}

export default function PaymentPage({ user, testType, testName }: PaymentPageProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const getPrice = () => {
    if (testType === "complete") return "₹3,499"
    if (testName === "Self Description") return "₹299"
    return "₹999"
  }

  const getTestDetails = () => {
    if (testType === "complete") {
      return {
        title: "Complete Assessment Package",
        description: "All four psychological tests with comprehensive evaluation",
        features: [
          "TAT Test: 11 images + 1 blank slide",
          "WAT Test: 60 random words (15s each)",
          "SRT Test: 60 situations (30 minutes)",
          "Self Description: 5 paragraphs (15 minutes)",
          "PDF Upload: Dossier submission facility",
        ],
        duration: "~2.5 hours (includes breaks)",
      }
    } else {
      const testDetails = {
        TAT: {
          title: "TAT Test",
          description: "Thematic Apperception Test",
          features: ["11 random images + 1 blank slide", "Personality assessment through storytelling"],
          duration: "~45 minutes",
        },
        WAT: {
          title: "WAT Test",
          description: "Word Association Test",
          features: ["60 random words", "15 seconds per word", "Psychological evaluation"],
          duration: "~15 minutes",
        },
        SRT: {
          title: "SRT Test",
          description: "Situation Response Test",
          features: ["60 situational scenarios", "30 minutes completion time"],
          duration: "~30 minutes",
        },
        "Self Description": {
          title: "Self Description Test",
          description: "Personality Assessment",
          features: ["5 paragraph responses", "Comprehensive personality evaluation"],
          duration: "~15 minutes",
        },
      }
      return testDetails[testName as keyof typeof testDetails] || testDetails["TAT"]
    }
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect to test based on type
    if (testType === "complete") {
      router.push("/test/tat")
    } else {
      const testRoutes = {
        TAT: "/test/tat",
        WAT: "/test/wat",
        SRT: "/test/srt",
        "Self Description": "/test/self-description",
      }
      router.push(testRoutes[testName as keyof typeof testRoutes] || "/test/tat")
    }
  }

  const testDetails = getTestDetails()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">TF</span>
              </div>
              <h1 className="text-xl font-bold">{"ThinkFitTest"}</h1>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{testDetails.title}</CardTitle>
                    <CardDescription>{testDetails.description}</CardDescription>
                  </div>
                  {testType === "complete" && <Badge className="bg-green-500">Best Value</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  {testDetails.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-muted p-3 rounded-lg mb-4">
                  <p className="text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Duration: {testDetails.duration}
                  </p>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span className="text-2xl text-primary">{getPrice()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Secure Payment</span>
                </CardTitle>
                <CardDescription>Your payment information is encrypted and secure</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Payment Gateway Placeholder */}
                <div className="space-y-4">
                  <div className="bg-muted p-6 rounded-lg text-center">
                    <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Payment Gateway Integration</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      This is a placeholder for payment gateway integration (Stripe, Razorpay, etc.)
                    </p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• Secure SSL encryption</p>
                      <p>• PCI DSS compliant</p>
                      <p>• Multiple payment methods</p>
                    </div>
                  </div>

                  <Button onClick={handlePayment} size="lg" className="w-full" disabled={isProcessing}>
                    {isProcessing ? "Processing Payment..." : `Pay ${getPrice()} & Start Test`}
                  </Button>

                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    <span>Secured by 256-bit SSL encryption</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Notice */}
            <Card className="mt-6 border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-orange-800 mb-2">Important Notice</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Test begins immediately after successful payment</li>
                  <li>• Security measures prevent pausing or interruption</li>
                  <li>• Screenshots and right-click are disabled during test</li>
                  <li>• Ensure stable internet connection before starting</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
