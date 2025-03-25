"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Calendar } from "lucide-react"

interface ConvertQuoteToJobProps {
  quote: {
    id: string
    customer_id: string
    status: string
    total_amount: number
    notes?: string
  }
}

export function ConvertQuoteToJob({ quote }: ConvertQuoteToJobProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleConvert = async () => {
    setIsLoading(true)

    try {
      // First, update the quote status to approved
      const { error: quoteError } = await supabase.from("quotes").update({ status: "approved" }).eq("id", quote.id)

      if (quoteError) throw quoteError

      // Fetch quote items to include in the job
      const { data: quoteItems, error: itemsError } = await supabase
        .from("quote_items")
        .select("*")
        .eq("quote_id", quote.id)

      if (itemsError) throw itemsError

      // Create a new job with "unscheduled" status
      const { data: job, error: jobError } = await supabase
        .from("jobs")
        .insert([
          {
            customer_id: quote.customer_id,
            quote_id: quote.id,
            status: "scheduled", // Default status
            scheduled_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Default to 1 week from now
            notes: quote.notes || "",
          },
        ])
        .select()
        .single()

      if (jobError) throw jobError

      // Create job items from quote items
      if (quoteItems && quoteItems.length > 0) {
        const jobItems = quoteItems.map((item) => ({
          job_id: job.id,
          product_id: item.product_id,
          description: item.description,
          quantity: item.quantity,
        }))

        const { error: jobItemsError } = await supabase.from("job_items").insert(jobItems)

        if (jobItemsError) throw jobItemsError
      }

      toast({
        title: "Job created",
        description: "The quote has been converted to a job. You can now schedule it.",
      })

      // Close the dialog and redirect to the job scheduling page
      setOpen(false)
      router.push(`/jobs/${job.id}`)
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to convert quote to job",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Disable the button if the quote is already approved or converted to a job
  const isDisabled = quote.status === "approved" || quote.status === "converted"

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={isDisabled} variant={isDisabled ? "outline" : "default"}>
          <Calendar className="mr-2 h-4 w-4" />
          {isDisabled ? "Already Converted" : "Convert to Job"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convert Quote to Job</DialogTitle>
          <DialogDescription>
            This will mark the quote as approved and create a new job that can be scheduled.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            After conversion, you'll be redirected to the job details page where you can:
          </p>
          <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground space-y-1">
            <li>Schedule the installation date</li>
            <li>Assign an installer</li>
            <li>Add specific installation instructions</li>
            <li>Track job progress</li>
          </ul>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConvert} disabled={isLoading}>
            {isLoading ? "Converting..." : "Convert and Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

