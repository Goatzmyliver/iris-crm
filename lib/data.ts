import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function getJobs(status: string) {
  const supabase = createServerComponentClient({ cookies })

  let query = supabase.from("jobs").select("*, customers(full_name), quotes(id)")

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  const { data: jobs } = await query.order("scheduled_date", {
    ascending: true,
  })

  return jobs || []
}

export async function getQuotes(status: string) {
  const supabase = createServerComponentClient({ cookies })

  let query = supabase.from("quotes").select("*, customers(full_name)")

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  const { data: quotes } = await query.order("created_at", {
    ascending: false,
  })

  return quotes || []
}

export async function getCustomers(search: string) {
  const supabase = createServerComponentClient({ cookies })

  let query = supabase.from("customers").select("*")

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
  }

  const { data: customers } = await query.order("created_at", {
    ascending: false,
  })

  return customers || []
}

export async function getProducts(search: string) {
  const supabase = createServerComponentClient({ cookies })

  let query = supabase.from("products").select("*")

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,sku.ilike.%${search}%`)
  }

  const { data: products } = await query.order("name")

  return products || []
}

export async function getReportData() {
  const supabase = createServerComponentClient({ cookies })

  const [{ data: salesData }, { data: jobsData }, { data: inventoryData }] = await Promise.all([
    supabase.rpc("get_monthly_sales"),
    supabase.rpc("get_job_status_counts"),
    supabase.rpc("get_inventory_status"),
  ])

  return {
    salesData: salesData || [],
    jobsData: jobsData || [],
    inventoryData: inventoryData || [],
  }
}

