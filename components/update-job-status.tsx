"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Clock, PlayCircle, XCircle } from "lucide-react"

interface UpdateJobStatusProps {
  job: {
    id: string
    status: string
  }
}

export function UpdateJobStatus({ job }: UpdateJobStatusProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const updateStatus = async (status: string) => {
    setIsLoading(true)

    try {
      const { error } = await supabase.from("jobs").update({ status }).eq("id", job.id)

      if (error) {
        throw error
      }

      toast({
        title: "Status updated",
        description: `Job status has been updated to ${status.replace("_", " ")}.`,
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = () => {
    switch (job.status) {
      case "scheduled":
        return <Clock className="mr-2 h-4 w-4" />
      case "in_progress":
        return <PlayCircle className="mr-2 h-4 w-4" />
      case "completed":
        return <CheckCircle className="mr-2 h-4 w-4" />
      case "cancelled":
        return <XCircle className="mr-2 h-4 w-4" />
      default:
        return <Clock className="mr-2 h-4 w-4" />
    }
  }

  const getStatusText = () => {
    switch (job.status) {
      case "in_progress":
        return "In Progress"
      default:
        return job.status.charAt(0).toUpperCase() + job.status.slice(1)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isLoading}>
          {getStatusIcon()}
          {isLoading ? "Updating..." : getStatusText()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => updateStatus("scheduled")} disabled={job.status === "scheduled"}>
          <Clock className="mr-2 h-4 w-4" />
          Scheduled
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateStatus("in_progress")} disabled={job.status === "in_progress"}>
          <PlayCircle className="mr-2 h-4 w-4" />
          In Progress
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateStatus("completed")} disabled={job.status === "completed"}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Completed
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateStatus("cancelled")} disabled={job.status === "cancelled"}>
          <XCircle className="mr-2 h-4 w-4" />
          Cancelled
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

