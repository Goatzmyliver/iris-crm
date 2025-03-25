"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Clock, PhoneCall, FileText, XCircle } from "lucide-react"

interface UpdateEnquiryStatusProps {
  enquiry: {
    id: string
    status: string
  }
}

export function UpdateEnquiryStatus({ enquiry }: UpdateEnquiryStatusProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const updateStatus = async (status: string) => {
    setIsLoading(true)

    try {
      const { error } = await supabase.from("enquiries").update({ status }).eq("id", enquiry.id)

      if (error) {
        throw error
      }

      toast({
        title: "Status updated",
        description: `Enquiry status has been updated to ${status.replace("_", " ")}.`,
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
    switch (enquiry.status) {
      case "new":
        return <Clock className="mr-2 h-4 w-4" />
      case "contacted":
        return <PhoneCall className="mr-2 h-4 w-4" />
      case "quoted":
        return <FileText className="mr-2 h-4 w-4" />
      case "converted":
        return <CheckCircle className="mr-2 h-4 w-4" />
      case "lost":
        return <XCircle className="mr-2 h-4 w-4" />
      default:
        return <Clock className="mr-2 h-4 w-4" />
    }
  }

  const getStatusText = () => {
    return enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)
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
        <DropdownMenuItem onClick={() => updateStatus("new")} disabled={enquiry.status === "new"}>
          <Clock className="mr-2 h-4 w-4" />
          New
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateStatus("contacted")} disabled={enquiry.status === "contacted"}>
          <PhoneCall className="mr-2 h-4 w-4" />
          Contacted
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateStatus("quoted")} disabled={enquiry.status === "quoted"}>
          <FileText className="mr-2 h-4 w-4" />
          Quoted
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateStatus("converted")} disabled={enquiry.status === "converted"}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Converted
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateStatus("lost")} disabled={enquiry.status === "lost"}>
          <XCircle className="mr-2 h-4 w-4" />
          Lost
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

