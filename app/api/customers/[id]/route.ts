import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("customers").select("*").eq("id", params.id).single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching customer:", error)
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const supabase = createServerSupabaseClient()

    const customer = await request.json()

    const { data, error } = await supabase.from("customers").update(customer).eq("id", params.id).select()

    if (error) {
      throw error
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error updating customer:", error)
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const supabase = createServerSupabaseClient()
    
    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", params.id)
    
    if (error) {
      throw error
    }
    
    return NextResponse.json({ success: true })
