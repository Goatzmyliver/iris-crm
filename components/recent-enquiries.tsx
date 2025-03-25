import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface Enquiry {
  id: string | number
  name?: string
  email?: string | null
  enquiry_type?: string
  status?: string
  created_at: string
}

export default function RecentEnquiries({ enquiries = [] }: { enquiries?: Enquiry[] }) {
  const getStatusColor = (status = "new") => {
    switch (status) {
      case "new":
        return "bg-blue-500"
      case "in-progress":
        return "bg-yellow-500"
      case "completed":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Enquiries</CardTitle>
        <CardDescription>
          {enquiries.length === 0 ? "You have no recent enquiries." : `You have ${enquiries.length} recent enquiries.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {enquiries.length === 0 ? (
            <div className="flex items-center">
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">No enquiries found</p>
                <div className="flex items-center pt-2">
                  <CalendarIcon className="mr-1 h-3 w-3 opacity-70" />
                  <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
              <div className="ml-auto">
                <Badge>New</Badge>
              </div>
            </div>
          ) : (
            enquiries.map((enquiry) => (
              <div key={enquiry.id} className="flex items-center">
                <div className="ml-4 space-y-1">
                  <Link href={`/enquiries/${enquiry.id}`} className="text-sm font-medium leading-none hover:underline">
                    {enquiry.name || "Unknown"} - {enquiry.enquiry_type || "General"}
                  </Link>
                  <p className="text-sm text-muted-foreground">{enquiry.email || "No email provided"}</p>
                  <div className="flex items-center pt-2">
                    <CalendarIcon className="mr-1 h-3 w-3 opacity-70" />
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(enquiry.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <div className="ml-auto">
                  <Badge className={getStatusColor(enquiry.status)}>
                    {(enquiry.status || "new").charAt(0).toUpperCase() + (enquiry.status || "new").slice(1)}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

