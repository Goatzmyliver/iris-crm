import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type Enquiry = {
  id: number
  createdAt: string
  name: string
  email: string
  phone: string
  address: string
  enquiryType: string
  description: string
  source: string
  status: string
  assignedUserId: string
  notes: string
  convertedToCustomerId: number | null
  convertedToQuoteId: string | null
}

export function EnquiryDetail({ enquiry }: { enquiry: Enquiry }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
          <div className="mt-1">
            <Badge
              variant={
                enquiry.status === "new"
                  ? "default"
                  : enquiry.status === "in-progress"
                    ? "secondary"
                    : enquiry.status === "completed"
                      ? "success"
                      : "outline"
              }
            >
              {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Enquiry Type</h3>
          <p className="mt-1">{enquiry.enquiryType.charAt(0).toUpperCase() + enquiry.enquiryType.slice(1)}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Source</h3>
          <p className="mt-1">
            {enquiry.source ? enquiry.source.charAt(0).toUpperCase() + enquiry.source.slice(1) : "Not specified"}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
          <p className="mt-1">{format(new Date(enquiry.createdAt), "PPP")}</p>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
        <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h4 className="text-xs font-medium text-muted-foreground">Name</h4>
            <p className="mt-1">{enquiry.name}</p>
          </div>

          <div>
            <h4 className="text-xs font-medium text-muted-foreground">Email</h4>
            <p className="mt-1">{enquiry.email || "Not provided"}</p>
          </div>

          <div>
            <h4 className="text-xs font-medium text-muted-foreground">Phone</h4>
            <p className="mt-1">{enquiry.phone}</p>
          </div>

          <div>
            <h4 className="text-xs font-medium text-muted-foreground">Address</h4>
            <p className="mt-1">{enquiry.address || "Not provided"}</p>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
        <p className="mt-2 whitespace-pre-line">{enquiry.description || "No description provided."}</p>
      </div>

      {(enquiry.convertedToCustomerId || enquiry.convertedToQuoteId) && (
        <>
          <Separator />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Conversions</h3>
            <div className="mt-2 space-y-2">
              {enquiry.convertedToCustomerId && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Customer</Badge>
                  <span>Converted to customer ID: {enquiry.convertedToCustomerId}</span>
                </div>
              )}

              {enquiry.convertedToQuoteId && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Quote</Badge>
                  <span>Converted to quote ID: {enquiry.convertedToQuoteId}</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

