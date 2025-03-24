import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export async function getQuotes() {
  const supabase = createClientComponentClient()

  const { data, error } = await supabase
    .from("quotes")
    .select(`
      *,
      customers (
        name
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching quotes:", error)
    return []
  }

  // Transform the data for easier consumption
  return data.map((quote) => ({
    ...quote,
    customerName: quote.customers?.name || "Unknown Customer",
    // Add a random followedUp status for demo purposes
    followedUp: Math.random() > 0.5,
  }))
}

