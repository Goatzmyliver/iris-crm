import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const [{ data: salesData }, { data: jobsData }, { data: inventoryData }] = await Promise.all([
      supabase.rpc("get_monthly_sales"),
      supabase.rpc("get_job_status_counts"),
      supabase.rpc("get_inventory_status"),
    ])

    return NextResponse.json({
      salesData: salesData || [],
      jobsData: jobsData || [],
      inventoryData: inventoryData || [],
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

