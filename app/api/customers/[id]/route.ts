import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

// The correct type for route parameters in Next.js 15
export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("customers").select("*").eq("id", context.params.id).single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching customer:", error)
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()

    const customer = await request.json()

    const { data, error } = await supabase.from("customers").update(customer).eq("id", context.params.id).select()

    if (error) {
      throw error
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error updating customer:", error)
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("customers").delete().eq("id", context.params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting customer:", error)
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 })
  }
}
