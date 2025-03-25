import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, User, Mail, Phone, MessageSquare } from "lucide-react"

export default function EnquiryDetail({ id }: { id: string }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Enquiry #{id}</CardTitle>
              <CardDescription className="mt-1">
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {new Date().toLocaleDateString()}
                </div>
              </CardDescription>
            </div>
            <Badge>New</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium flex items-center">
                <User className="h-4 w-4 mr-2" /> Contact Information
              </h3>
              <Separator className="my-2" />
              <div className="grid gap-1">
                <div className="flex items-center text-sm">
                  <User className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span>John Doe</span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span>john.doe@example.com</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" /> Enquiry Details
              </h3>
              <Separator className="my-2" />
              <p className="text-sm">
                This is a placeholder for the enquiry details. The actual content will be loaded from the database.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

