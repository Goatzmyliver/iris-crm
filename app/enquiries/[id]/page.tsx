"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  MessageSquare,
  Clock,
  UserPlus,
  FileUp,
} from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

// Mock enquiry data
const MOCK_ENQUIRY = {
  id: 1,
  name: "John Smith",
  email: "john@example.com",
  phone: "021-555-1234",
  address: "123 Main St, Auckland",
  enquiry_type: "Flooring Installation",
  description:
    "Looking for carpet installation in my living room and hallway. Approximately 45 square meters. Would like to discuss options and get a quote.",
  source: "Website",
  status: "new",
  created_at: "2025-03-20T09:30:00Z",
  assigned_user_id: "user-1",
  assigned_user: "Sarah Wilson",
  notes:
    "Customer mentioned they have a tight budget but want quality carpet. Previous quote from competitor was too high.",
}

// Mock activity data
const MOCK_ACTIVITIES = [
  {
    id: 1,
    type: "status_change",
    description: "Enquiry status changed to New",
    created_at: "2025-03-20T09:30:00Z",
    user: "System",
  },
  {
    id: 2,
    type: "assignment",
    description: "Assigned to Sarah Wilson",
    created_at: "2025-03-20T09:35:00Z",
    user: "Mike Thompson",
  },
  {
    id: 3,
    type: "note",
    description: "Called customer to discuss requirements. They're available for a site visit next Tuesday.",
    created_at: "2025-03-20T10:15:00Z",
    user: "Sarah Wilson",
  },
]

export default function EnquiryDetailPage({ params }: { params: { id: string } }) {
  const [enquiry, setEnquiry] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const [newNote, setNewNote] = useState("")
  const [addingNote, setAddingNote] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchEnquiryData = async () => {
      try {
        // In a real app, you would fetch actual data from Supabase
        // For now, we'll use mock data
        setEnquiry(MOCK_ENQUIRY)
        setActivities(MOCK_ACTIVITIES)

        // Fetch users for assignment
        const { data: usersData } = await supabase.from("users").select("id, name, email")
        setUsers(usersData || [])
      } catch (error) {
        console.error("Error fetching enquiry data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEnquiryData()
  }, [supabase, params.id])

  const handleStatusChange = async (newStatus: string) => {
    // In a real app, you would update the status in the database
    setEnquiry({ ...enquiry, status: newStatus })

    // Add activity
    const newActivity = {
      id: activities.length + 1,
      type: "status_change",
      description: `Enquiry status changed to ${getStatusLabel(newStatus)}`,
      created_at: new Date().toISOString(),
      user: "You",
    }

    setActivities([newActivity, ...activities])
  }

  const handleAssignUser = async (userId: string) => {
    // In a real app, you would update the assigned user in the database
    const assignedUser = users.find((user) => user.id === userId)?.name || "Unassigned"

    setEnquiry({
      ...enquiry,
      assigned_user_id: userId,
      assigned_user: assignedUser,
    })

    // Add activity
    const newActivity = {
      id: activities.length + 1,
      type: "assignment",
      description: userId ? `Assigned to ${assignedUser}` : "Unassigned",
      created_at: new Date().toISOString(),
      user: "You",
    }

    setActivities([newActivity, ...activities])
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return

    setAddingNote(true)

    try {
      // In a real app, you would add the note to the database

      // Add activity
      const newActivity = {
        id: activities.length + 1,
        type: "note",
        description: newNote,
        created_at: new Date().toISOString(),
        user: "You",
      }

      setActivities([newActivity, ...activities])
      setNewNote("")
    } catch (error) {
      console.error("Error adding note:", error)
    } finally {
      setAddingNote(false)
    }
  }

  const handleConvertToCustomer = () => {
    // In a real app, you would create a customer record and update the enquiry status
    router.push(
      `/customers/new?from_enquiry=${params.id}&name=${enquiry.name}&email=${enquiry.email}&phone=${enquiry.phone}&address=${enquiry.address}`,
    )
  }

  const handleCreateQuote = () => {
    // In a real app, you would create a quote and link it to this enquiry
    router.push(
      `/quotes/new?from_enquiry=${params.id}&customer_name=${enquiry.name}&email=${enquiry.email}&phone=${enquiry.phone}&address=${enquiry.address}`,
    )
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "new":
        return "New"
      case "in_progress":
        return "In Progress"
      case "converted":
        return "Converted"
      case "closed":
        return "Closed"
      default:
        return status
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="secondary">New</Badge>
      case "in_progress":
        return <Badge variant="default">In Progress</Badge>
      case "converted":
        return <Badge variant="success">Converted</Badge>
      case "closed":
        return <Badge variant="outline">Closed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "status_change":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "assignment":
        return <User className="h-4 w-4 text-purple-500" />
      case "note":
        return <MessageSquare className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <p>Loading enquiry data...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!enquiry) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <h2 className="text-2xl font-bold mb-2">Enquiry Not Found</h2>
          <p className="mb-4">The enquiry you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button asChild>
            <Link href="/enquiries">Back to Enquiries</Link>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/enquiries">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Enquiry from {enquiry.name}</h1>
            {getStatusBadge(enquiry.status)}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/enquiries/${params.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Enquiry Details</CardTitle>
              <CardDescription>
                Received {formatDistanceToNow(new Date(enquiry.created_at), { addSuffix: true })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{enquiry.name}</p>
                  <p className="text-sm text-muted-foreground">Customer</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{enquiry.phone}</p>
                  <p className="text-sm text-muted-foreground">Phone</p>
                </div>
              </div>

              {enquiry.email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{enquiry.email}</p>
                    <p className="text-sm text-muted-foreground">Email</p>
                  </div>
                </div>
              )}

              {enquiry.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{enquiry.address}</p>
                    <p className="text-sm text-muted-foreground">Address</p>
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{enquiry.enquiry_type}</p>
                  <p className="text-sm text-muted-foreground">Enquiry Type</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium whitespace-pre-line">{enquiry.description}</p>
                  <p className="text-sm text-muted-foreground">Description</p>
                </div>
              </div>

              {enquiry.source && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{enquiry.source}</p>
                    <p className="text-sm text-muted-foreground">Source</p>
                  </div>
                </div>
              )}

              {enquiry.notes && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Internal Notes</p>
                      <p className="text-sm whitespace-pre-line">{enquiry.notes}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <Tabs defaultValue="actions">
              <TabsList>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="activity">Activity Log</TabsTrigger>
              </TabsList>

              <TabsContent value="actions" className="mt-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Manage Enquiry</CardTitle>
                    <CardDescription>Update status and assignment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={enquiry.status} onValueChange={handleStatusChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="converted">Converted</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Assigned To</Label>
                        <Select value={enquiry.assigned_user_id || ""} onValueChange={handleAssignUser}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select user" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unassigned">Unassigned</SelectItem>
                            {users.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Add Note</Label>
                      <Textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add a note about this enquiry..."
                        rows={3}
                      />
                      <Button onClick={handleAddNote} disabled={!newNote.trim() || addingNote} className="mt-2">
                        {addingNote ? "Adding..." : "Add Note"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Convert Enquiry</CardTitle>
                    <CardDescription>Create a customer record or quote</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Create Customer</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm text-muted-foreground">
                            Convert this enquiry into a customer record to track future interactions.
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button onClick={handleConvertToCustomer} className="w-full">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Create Customer
                          </Button>
                        </CardFooter>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Create Quote</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm text-muted-foreground">
                            Create a quote based on this enquiry to send to the customer.
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button onClick={handleCreateQuote} className="w-full">
                            <FileUp className="mr-2 h-4 w-4" />
                            Create Quote
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Log</CardTitle>
                    <CardDescription>History of actions and notes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {activities.length > 0 ? (
                      <div className="space-y-4">
                        {activities.map((activity) => (
                          <div key={activity.id} className="flex gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">{activity.user}</p>
                              <p className="text-sm text-muted-foreground">{activity.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Clock className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No activity recorded yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

