import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export async function getRecentCustomers() {
  const supabase = createClientComponentClient()

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  if (error) {
    console.error("Error fetching recent customers:", error)
    return []
  }

  // Add a random amount for demo purposes
  return data.map((customer) => ({
    ...customer,
    amount: Math.floor(Math.random() * 1000) + 100,
  }))
}

