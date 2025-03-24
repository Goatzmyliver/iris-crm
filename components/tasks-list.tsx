"use client"

import type React from "react"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface Task {
  id: string
  title: string
  completed: boolean
  type: "system" | "manual"
  link?: string
}

interface TasksListProps extends React.HTMLAttributes<HTMLDivElement> {
  quotesNeedingFollowUp?: any[]
  recentEnquiries?: any[]
}

export function TasksList({ className, quotesNeedingFollowUp = [], recentEnquiries = [], ...props }: TasksListProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [open, setOpen] = useState(false)
  const [newTask, setNewTask] = useState({ title: "", description: "" })

  // Generate system tasks based on data
  const systemTasks: Task[] = [
    // Tasks for quotes needing follow-up
    ...quotesNeedingFollowUp.map((quote) => ({
      id: `quote-${quote.id}`,
      title: `Follow up on quote for ${quote.customers?.name || "Customer"}`,
      completed: false,
      type: "system" as const,
      link: `/quotes/${quote.id}`,
    })),

    // Tasks for new enquiries
    ...recentEnquiries.map((enquiry) => ({
      id: `enquiry-${enquiry.id}`,
      title: `Respond to new enquiry from ${enquiry.name}`,
      completed: false,
      type: "system" as const,
      link: `/enquiries/${enquiry.id}`,
    })),
  ]

  // Combine with manual tasks (from local storage in this example)
  const [manualTasks, setManualTasks] = useState<Task[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("manualTasks")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const allTasks = [...systemTasks, ...manualTasks]

  const toggleTaskCompletion = (taskId: string) => {
    if (taskId.startsWith("manual-")) {
      const updatedTasks = manualTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      )
      setManualTasks(updatedTasks)
      localStorage.setItem("manualTasks", JSON.stringify(updatedTasks))
    }
  }

  const handleTaskClick = (task: Task) => {
    if (task.link) {
      router.push(task.link)
    }
  }

  const addTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      })
      return
    }

    const task: Task = {
      id: `manual-${Date.now()}`,
      title: newTask.title,
      completed: false,
      type: "manual",
    }

    const updatedTasks = [...manualTasks, task]
    setManualTasks(updatedTasks)
    localStorage.setItem("manualTasks", JSON.stringify(updatedTasks))

    setNewTask({ title: "", description: "" })
    setOpen(false)

    toast({
      title: "Task added",
      description: "Your task has been added to the list",
    })
  }

  return (
    <Card className={className} {...props}>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-1">
          <CardTitle>My Tasks</CardTitle>
          <CardDescription>Tasks that need your attention</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>Create a new task to track your work</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Follow up with client"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Additional details about the task"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addTask}>Add Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No tasks to display</p>
          ) : (
            <div className="space-y-2">
              {allTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent ${
                    task.link ? "cursor-pointer" : ""
                  } ${task.type === "system" ? "border-l-4 border-blue-500 pl-2" : ""}`}
                  onClick={() => handleTaskClick(task)}
                >
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                    onClick={(e) => e.stopPropagation()}
                    disabled={task.type === "system"}
                  />
                  <div className="flex-1 space-y-1">
                    <p
                      className={`text-sm font-medium leading-none ${
                        task.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.type === "system" && <p className="text-xs text-blue-500">System generated task</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

