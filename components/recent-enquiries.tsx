import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react"

export default function RecentEnquiries() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Enquiries</CardTitle>
        <CardDescription>You have no recent enquiries.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
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
        </div>
      </CardContent>
    </Card>
  )
}

