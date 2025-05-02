import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { JobList } from "@/components/jobs/job-list"
import { createServerClient } from "@/lib/supabase/server"

export default async function JobsPage() {
  const supabase = createServerClient()

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*, customers(name)")
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
          <p className="text-muted-foreground">Manage your jobs and work orders</p>
        </div>
        <Link href="/dashboard/jobs/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Job
          </Button>
        </Link>
      </div>

      <JobList jobs={jobs || []} />
    </div>
  )
}
