import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import PaymentPage from "@/components/payment-page"

interface PageProps {
  searchParams: Promise<{ type?: string; test?: string }>
}

export default async function Payment({ searchParams }: PageProps) {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const params = await searchParams
  const { type, test } = params

  if (!type || (type !== "complete" && type !== "individual")) {
    redirect("/dashboard")
  }

  if (type === "individual" && !test) {
    redirect("/dashboard")
  }

  return <PaymentPage user={user} testType={type} testName={test} />
}
