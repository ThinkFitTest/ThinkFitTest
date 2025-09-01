import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import HomePage from "@/components/home-page"

export default async function Page() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return <HomePage />
}
