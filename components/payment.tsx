"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, CreditCard, Shield, Clock } from "lucide-react"

interface PaymentProps {
  testType: "complete" | "individual"
  testName?: string
  onPaymentSuccess: () => void
  onCancel: () => void
}

export default function Payment({ testType, testName, onPaymentSuccess, onCancel }: PaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle")

  const getPrice = () => {
    if (testType === "complete") return 3499
    if (testName === "Self Description") return 299
    return 999
  }

  const price = getPrice()
  const title = testType === "complete" ? "Complete Assessment" : `${testName} Test`

  const handlePayment = async () => {
    setIsProcessing(true)
    setPaymentStatus("processing")

    // Simulate payment processing
    setTimeout(() => {
      // Mock successful payment
      setPaymentStatus("success")
      setIsProcessing(false)

      // Auto-proceed after showing success
      setTimeout(() => {
        onPaymentSuccess()
      }, 2000)
    }, 3000)

    // In production, integrate with Razorpay:
    /*
    const options = {
      key: 'your_razorpay_key_id',
      amount: price * 100, // Amount in paise
      currency: 'INR',
      name: 'Psychology Tests India',
      description: title,
      handler: function (response: any) {
        setPaymentStatus('success')
        setIsProcessing(false)
        setTimeout(() => onPaymentSuccess(), 2000)
      },
      prefill: {
        name: '',
        email: '',
        contact: ''
      },
      theme: {
        color: '#3B82F6'
      }
    }
    
    const rzp = new window.Razorpay(options)
    rzp.open()
    */
  }

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-green-600">Payment Successful!</h2>
          <p className="text-muted-foreground mb-4">Your payment of ₹{price} has been processed successfully.</p>
          <p className="text-sm text-muted-foreground">Redirecting to {title}...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Complete Payment</h2>
            <p className="text-muted-foreground">Secure payment to start your assessment</p>
          </div>

          {/* Test Details */}
          <div className="bg-muted rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{title}</span>
              <Badge variant="secondary">Premium</Badge>
            </div>
            <div className="text-2xl font-bold text-primary">₹{price}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {testType === "complete" ? "All 4 tests included" : "Individual test access"}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm">Secure & confidential testing</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-sm">
                {testType === "complete" ? "~2.5 hours total duration" : "Individual test timing"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Professional psychological assessment</span>
            </div>
          </div>

          {/* Payment Button */}
          <div className="space-y-3">
            <Button onClick={handlePayment} disabled={isProcessing} size="lg" className="w-full gap-2">
              <CreditCard className="w-5 h-5" />
              {isProcessing ? "Processing Payment..." : `Pay ₹${price}`}
            </Button>

            <Button
              onClick={onCancel}
              variant="outline"
              size="lg"
              className="w-full bg-transparent"
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 text-center">
              <Shield className="w-4 h-4 inline mr-1" />
              Payments are processed securely. Your test will begin immediately after successful payment.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
