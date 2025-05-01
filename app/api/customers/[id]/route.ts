import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

// Simplest possible route handler pattern
export async function GET(_req: Request, context: any) {
  const { params } = context
  const id = params.id

  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("customers").select("*").eq("id", id).single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching customer:", error)
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 })
  }
}

export async function PUT(req: Request, context: any) {
  const { params } = context
  const id = params.id

  try {
    const supabase = createServerSupabaseClient()
    const customer = await req.json()
    const { data, error } = await supabase.from("customers").update(customer).eq("id", id).select()

    if (error) {
      throw error
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error updating customer:", error)
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, context: any) {
  const { params } = context
  const id = params.id

  try {
    const supabase = createServerSupabaseClient()
    const { error } = await supabase.from("customers").delete().eq("id", id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting customer:", error)
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 })
  }
}
