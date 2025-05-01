"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { Check, Eye, FileText } from "lucide-react"

export function InvoicingList() {
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select(`
          *,
          customers (
            id,
            full_name,
            email,
            phone,
            address
          )
        `)
        .eq("status", "completed")
        .eq("ready_for_invoicing", true)
        .is("invoiced", null)
        .order("completion_date", { ascending: false })

      if (error) throw error
      setJobs(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch jobs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const markAsInvoiced = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from("jobs")
        .update({
          invoiced: true,
          invoice_date: new Date().toISOString(),
        })
        .eq("id", jobId)

      if (error) throw error

      toast({
        title: "Job marked as invoiced",
        description: "The job has been marked as invoiced successfully",
      })

      // Refresh the list
      fetchJobs()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to mark job as invoiced",
        variant: "destructive",
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Completion Date</TableHead>
                  <TableHead>Hours Worked</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No jobs ready for invoicing
                    </TableCell>
                  </TableRow>
                ) : (
                  jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.job_number || `JOB-${job.id.slice(0, 8)}`}</TableCell>
                      <TableCell>{job.customers ? job.customers.full_name : "Unknown Customer"}</TableCell>
                      <TableCell>
                        {job.completion_date ? format(new Date(job.completion_date), "MMM d, yyyy") : "N/A"}
                      </TableCell>
                      <TableCell>{job.hours_worked || 0} hours</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">Ready for Invoicing</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                          <Button size="sm" onClick={() => markAsInvoiced(job.id)}>
                            <Check className="h-4 w-4 mr-1" />
                            Mark Invoiced
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
