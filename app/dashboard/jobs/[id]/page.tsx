import { JobForm } from "@/components/jobs/job-form"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Edit Job - Iris CRM",
  description: "Edit job details",
}

export default async function EditJobPage(props: any) {
  const id = props.params.id
  const supabase = createServerComponentClient({ cookies })

  // Fetch the job
  const { data: job } = await supabase.from("jobs").select("*, customer:customers(*)").eq("id", id).single()

  if (!job) {
    notFound()
  }

  // Fetch customers for the dropdown
  const { data: customers } = await supabase.from("customers").select("*").order("full_name", { ascending: true })

  // Fetch installers (users with installer role)
  const { data: installers } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "installer")
    .order("full_name", { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Edit Job</h2>
        <p className="text-muted-foreground">Update details for Job #{job.job_number}</p>
      </div>

      <JobForm job={job} customers={customers || []} installers={installers || []} />
    </div>
  )
}
