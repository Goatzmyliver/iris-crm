import { redirect } from "next/navigation"

export default function Home() {
  // Redirect directly to login page for internal use
  redirect("/login")

  // This won't be rendered due to the redirect
  return null
}
