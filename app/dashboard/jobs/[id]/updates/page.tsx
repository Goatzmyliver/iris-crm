import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { JobUpdatesList } from "@/components/jobs/job-updates-list"
import { JobUpdateForm } from "@/components/jobs/job-update-form"

export const metadata = {
  title: "Job Updates - Iris CRM",
  description: "View and add job updates",
}

export default async function JobUpdatesPage(props: any) {
  const id = props.params.id
  const supabase = createServerComponentClient({ cookies })

  // Fetch the job
  const { data: job } = await supabase.from("jobs").select("*, customer:customers(*)").eq("id", id).single()

  if (!job) {
    notFound()
  }

  // Fetch job updates
  const { data: updates } = await supabase
    .from("job_updates")
    .select("*, created_by:profiles(full_name)")
    .eq("job_id", id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Job Updates</h2>
        <p className="text-muted-foreground">
          Updates for Job #{job.job_number} - {job.customer.full_name}
        </p>
      </div>

      <JobUpdateForm jobId={id} />

      <JobUpdatesList updates={updates || []} />
    </div>
  )
}
