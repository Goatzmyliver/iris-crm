import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { JobForm } from "@/components/jobs/job-form"

export default async function NewJobPage() {
  const supabase = createServerClient()

  // Fetch customers for the dropdown
  const { data: customers } = await supabase.from("customers").select("id, name").order("name")

  async function createJob(formData: FormData) {
    "use server"

    const supabase = createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Not authenticated" }
    }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const customerId = formData.get("customer_id") as string
    const scheduledDate = formData.get("scheduled_date") as string
    const status = formData.get("status") as string

    const { error } = await supabase.from("jobs").insert({
      title,
      description,
      customer_id: customerId,
      scheduled_date: scheduledDate,
      status,
      user_id: user.id,
    })

    if (error) {
      return { error: error.message }
    }

    redirect("/dashboard/jobs")
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Job</h1>
        <p className="text-muted-foreground">Create a new job or work order</p>
      </div>

      <JobForm action={createJob} customers={customers || []} />
    </div>
  )
}
