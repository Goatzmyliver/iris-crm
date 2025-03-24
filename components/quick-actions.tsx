import Link from "next/link"
import { UserPlus, FileText, MessageSquare, FileCheck } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function QuickActions() {
  const actions = [
    {
      title: "New Enquiry",
      description: "Create a new enquiry",
      icon: MessageSquare,
      href: "/enquiries/new",
    },
    {
      title: "New Customer",
      description: "Add a new customer",
      icon: UserPlus,
      href: "/customers/new",
    },
    {
      title: "New Quote",
      description: "Create a new quote",
      icon: FileText,
      href: "/quotes/new",
    },
    {
      title: "New Invoice",
      description: "Create a new invoice",
      icon: FileCheck,
      href: "/invoices/new",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks you can perform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => (
            <Button key={action.title} variant="outline" className="h-auto flex-col items-start gap-1 p-3" asChild>
              <Link href={action.href}>
                <action.icon className="h-4 w-4" />
                <div className="font-medium">{action.title}</div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

