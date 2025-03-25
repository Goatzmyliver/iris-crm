import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status") || ""

  const supabase = createRouteHandlerClient({ cookies })

  let query = supabase.from("jobs").select("*, customers(full_name), quotes(id)")

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  const { data: jobs, error } = await query.order("scheduled_date", {
    ascending: true,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(jobs || [])
}

