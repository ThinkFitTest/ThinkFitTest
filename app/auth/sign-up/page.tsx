"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Page() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    console.log("[v0] Starting signup process")
    console.log("[v0] Environment check:", {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ Set" : "✗ Missing",
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓ Set" : "✗ Missing",
      currentDomain: window.location.origin,
    })

    if (password !== repeatPassword) {
      console.log("[v0] Password mismatch error")
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      // Validate inputs before sending to Supabase
      if (!email || !password || !fullName) {
        console.log("[v0] Validation failed - missing fields")
        throw new Error("All fields are required")
      }

      if (password.length < 6) {
        console.log("[v0] Password too short")
        throw new Error("Password must be at least 6 characters long")
      }

      console.log("[v0] Sending signup request to Supabase with data:", {
        email,
        fullName,
        passwordLength: password.length,
      })

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      console.log("[v0] Supabase signup response:", {
        user: data?.user ? "✓ User created" : "✗ No user",
        session: data?.session ? "✓ Session created" : "✗ No session",
        error: error
          ? {
              message: error.message,
              status: error.status,
              statusCode: error.status,
              name: error.name,
            }
          : "✓ No error",
      })

      if (error) {
        console.log("[v0] Supabase auth error details:", {
          message: error.message,
          status: error.status,
          name: error.name,
          cause: error.cause,
        })

        if (error.message.includes("User already registered")) {
          throw new Error("An account with this email already exists. Please try logging in instead.")
        } else if (error.message.includes("Invalid email")) {
          throw new Error("Please enter a valid email address.")
        } else {
          throw new Error(`Registration failed: ${error.message}`)
        }
      }

      if (!data.user) {
        console.log("[v0] No user returned from Supabase")
        throw new Error("Registration failed - no user created. Please check your connection and try again.")
      }

      console.log("[v0] User created successfully, profile will be created after email confirmation")

      console.log("[v0] Signup completed successfully, redirecting to success page")
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      console.log("[v0] Signup failed with error:", error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred during registration"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sign up</CardTitle>
              <CardDescription>Create a new account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="repeat-password">Repeat Password</Label>
                    </div>
                    <Input
                      id="repeat-password"
                      type="password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating an account..." : "Sign up"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="underline underline-offset-4">
                    Login
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
