"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, User, Clock, Plus, CheckCircle, Bell } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface Task {
  id: number
  title: string
  customer: string
  type: string
  dueDate: string
  priority: string
  completed: boolean
  automated: boolean
  relatedId?: string
}

interface TasksListProps {
  tasks: Task[]
  quotes: any[]
  customers: any[]
  jobs: any[]
}

export function TasksList({ tasks: initialTasks, quotes, customers, jobs }: TasksListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [newTask, setNewTask] = useState({
    title: "",
    customer: "",
    type: "general",
    dueDate: "",
    priority: "medium",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Generate automated tasks based on quotes, customers, and jobs
  const generateAutomatedTasks = () => {
    const automatedTasks: Task[] = []

    // Add follow-up tasks for quotes that were sent more than 3 days ago and haven't been approved
    quotes.forEach((quote) => {
      if (quote.status === "sent") {
        const sentDate = new Date(quote.date)
        const now = new Date()
        const daysSinceSent = Math.floor((now.getTime() - sentDate.getTime()) / (1000 * 60 * 60 * 24))

        if (daysSinceSent >= 3) {
          automatedTasks.push({
            id: automatedTasks.length + 1000, // Use high IDs for automated tasks
            title: `Follow up on quote ${quote.id}`,
            customer: quote.customer,
            type: "quote",
            dueDate: new Date().toISOString().split("T")[0], // Today
            priority: "high",
            completed: false,
            automated: true,
            relatedId: quote.id,
          })
        }
      }
    })

    // Add preparation tasks for upcoming jobs in the next 2 days
    jobs.forEach((job) => {
      const jobDate = new Date(job.date)
      const now = new Date()
      const daysUntilJob = Math.floor((jobDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      if (daysUntilJob <= 2 && daysUntilJob >= 0) {
        automatedTasks.push({
          id: automatedTasks.length + 1000,
          title: `Prepare for job ${job.id}`,
          customer: job.customer,
          type: "job",
          dueDate: new Date().toISOString().split("T")[0], // Today
          priority: "high",
          completed: false,
          automated: true,
          relatedId: job.id,
        })
      }
    })

    // Add follow-up tasks for new customers added in the last 7 days
    customers.forEach((customer) => {
      const addedDate = new Date(customer.date)
      const now = new Date()
      const daysSinceAdded = Math.floor((now.getTime() - addedDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysSinceAdded <= 7) {
        automatedTasks.push({
          id: automatedTasks.length + 1000,
          title: `Welcome follow-up with ${customer.name}`,
          customer: customer.name,
          type: "customer",
          dueDate: new Date().toISOString().split("T")[0], // Today
          priority: "medium",
          completed: false,
          automated: true,
          relatedId: customer.id.toString(),
        })
      }
    })

    return automatedTasks
  }

  // Combine manual tasks with automated tasks
  const allTasks = [
    ...tasks.filter((task) => !task.automated), // Keep manual tasks
    ...generateAutomatedTasks(), // Add automated tasks
  ]

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const handleAddTask = () => {
    if (!newTask.title) return

    const task: Task = {
      id: Math.floor(Math.random() * 1000), // Use low IDs for manual tasks
      title: newTask.title,
      customer: newTask.customer,
      type: newTask.type,
      dueDate: newTask.dueDate || new Date().toISOString().split("T")[0],
      priority: newTask.priority,
      completed: false,
      automated: false,
    }

    setTasks([...tasks, task])
    setNewTask({
      title: "",
      customer: "",
      type: "general",
      dueDate: "",
      priority: "medium",
    })
    setIsDialogOpen(false)
  }

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "quote":
        return <FileText className="h-4 w-4 text-amber-500" />
      case "job":
        return <Calendar className="h-4 w-4 text-blue-500" />
      case "customer":
        return <User className="h-4 w-4 text-purple-500" />
      case "general":
        return <Clock className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive" className="ml-2">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="secondary" className="ml-2">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="ml-2">
            Low
          </Badge>
        )
      default:
        return null
    }
  }

  const activeTasks = allTasks.filter((task) => !task.completed)
  const completedTasks = allTasks.filter((task) => task.completed)

  return (
    <div className="space-y-4">
      {activeTasks.length > 0 ? (
        <div className="space-y-3">
          {activeTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-start gap-3 rounded-lg border p-3 ${task.automated ? "bg-muted/30" : ""}`}
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTaskCompletion(task.id)}
                className="mt-1"
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center">
                  {getTaskIcon(task.type)}
                  <span className="ml-2 font-medium">{task.title}</span>
                  {getPriorityBadge(task.priority)}
                  {task.automated && (
                    <Badge variant="outline" className="ml-2 bg-blue-50">
                      <Bell className="h-3 w-3 mr-1" />
                      Auto
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{task.customer}</span>
                  <span className="text-muted-foreground">Due: {task.dueDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <CheckCircle className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No pending tasks</p>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Completed</h3>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 rounded-lg border p-3 bg-muted/30">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center">
                    {getTaskIcon(task.type)}
                    <span className="ml-2 font-medium line-through text-muted-foreground">{task.title}</span>
                    {task.automated && (
                      <Badge variant="outline" className="ml-2 bg-blue-50/50">
                        <Bell className="h-3 w-3 mr-1" />
                        Auto
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{task.customer}</span>
                    <span className="text-muted-foreground">Completed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Custom Task
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>Create a custom task to track your work.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Follow up with customer"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customer">Customer</Label>
              <Input
                id="customer"
                value={newTask.customer}
                onChange={(e) => setNewTask({ ...newTask, customer: e.target.value })}
                placeholder="Customer name (optional)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select value={newTask.type} onValueChange={(value) => setNewTask({ ...newTask, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="quote">Quote</SelectItem>
                    <SelectItem value="job">Job</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

