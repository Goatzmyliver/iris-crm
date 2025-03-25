export async function getJobs(status: string) {
  const params = new URLSearchParams()
  if (status) params.set("status", status)

  const res = await fetch(`/api/jobs?${params.toString()}`)
  if (!res.ok) throw new Error("Failed to fetch jobs")
  return res.json()
}

export async function getQuotes(status: string) {
  const params = new URLSearchParams()
  if (status) params.set("status", status)

  const res = await fetch(`/api/quotes?${params.toString()}`)
  if (!res.ok) throw new Error("Failed to fetch quotes")
  return res.json()
}

export async function getCustomers(search: string) {
  const params = new URLSearchParams()
  if (search) params.set("search", search)

  const res = await fetch(`/api/customers?${params.toString()}`)
  if (!res.ok) throw new Error("Failed to fetch customers")
  return res.json()
}

export async function getProducts(search: string) {
  const params = new URLSearchParams()
  if (search) params.set("search", search)

  const res = await fetch(`/api/products?${params.toString()}`)
  if (!res.ok) throw new Error("Failed to fetch products")
  return res.json()
}

export async function getReportData() {
  const res = await fetch("/api/reports")
  if (!res.ok) throw new Error("Failed to fetch report data")
  return res.json()
}

