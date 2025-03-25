import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface Lead {
  id: string
  title: string
  status: string
  created_at: string
}

export function RecentLeads({ leads = [] }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return <p className="text-sm text-muted-foreground">No leads found.</p>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500"
      case "open":
        return "bg-yellow-500"
      case "qualified":
        return "bg-green-500"
      case "unqualified":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <div key={lead.id} className="flex items-center justify-between">
          <div className="space-y-1">
            <Link href={`/leads/${lead.id}`} className="font-medium leading-none hover:underline">
              {lead.title}
            </Link>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
            </p>
          </div>
          <Badge className={getStatusColor(lead.status)}>
            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
          </Badge>
        </div>
      ))}
    </div>
  )
}

