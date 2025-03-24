"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CheckCircle, Circle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

type Task = {
  id: string
  title: string
  type: string
  dueDate: Date
  priority: "low" | "medium" | "high"
  isAutomated?: boolean
  relatedId?: string
}

type TasksListProps = {
  automatedTasks: Task[]
}

export function TasksList({ automatedTasks }: TasksListProps) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task-1",
      title: "Follow up with client about proposal",
      type: "follow-up",
      dueDate: new Date(2023, 5, 15),
      priority: "high",
    },
    {
      id: "task-2",
      title: "Prepare quarterly report",
      type: "report",
      dueDate: new Date(2023, 5, 20),
      priority: "medium",
    },
    {
      id: "task-3",
      title: "Schedule team meeting",
      type: "meeting",
      dueDate: new Date(2023, 5, 10),
      priority: "low",
    },
  ])

  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: format(new Date(), "yyyy-MM-dd"),
    priority: "medium" as "low" | "medium" | "high",
    notes: "",
  })

  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  // Combine manual and automated tasks
  const allTasks = [...tasks, ...automatedTasks]

  const handleAddTask = () => {
    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      type: "manual",
      dueDate: new Date(newTask.dueDate),
      priority: newTask.priority,
    }

    setTasks([...tasks, task])
    setNewTask({
      title: "",
      dueDate: format(new Date(), "yyyy-MM-dd"),
      priority: "medium",
      notes: "",
    })
    setOpen(false)
    toast({
      title: "Task added",
      description: "Your new task has been added to the list.",
    })
  }

  const toggleTaskCompletion = (taskId: string) => {
    if (completedTasks.includes(taskId)) {
      setCompletedTasks(completedTasks.filter((id) => id !== taskId))
    } else {
      setCompletedTasks([...completedTasks, taskId])
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-orange-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tasks</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 gap-1">
              <Plus className="h-4 w-4" /> Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>Create a new task to keep track of your work.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task title"
                />
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
              <div className="grid gap-2">
                <Label>Priority</Label>
                <RadioGroup
                  value={newTask.priority}
                  onValueChange={(value) =>
                    setNewTask({
                      ...newTask,
                      priority: value as "low" | "medium" | "high",
                    })
                  }
                  className="flex"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low" className="text-green-500">
                      Low
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium" className="text-orange-500">
                      Medium
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high" className="text-red-500">
                      High
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newTask.notes}
                  onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                  placeholder="Additional details..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTask}>Add Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-2">
        {allTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tasks to display.</p>
        ) : (
          allTasks
            .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
            .map((task) => (
              <div
                key={task.id}
                className={`flex items-start space-x-2 p-2 rounded-md transition-colors ${
                  completedTasks.includes(task.id) ? "bg-muted line-through text-muted-foreground" : "hover:bg-muted/50"
                } ${task.isAutomated ? "border-l-4 border-blue-500 pl-2" : ""}`}
              >
                <button onClick={() => toggleTaskCompletion(task.id)} className="mt-0.5 flex-shrink-0">
                  {completedTasks.includes(task.id) ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium leading-none">{task.title}</p>
                    <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs text-muted-foreground">Due: {format(task.dueDate, "MMM d, yyyy")}</p>
                    {task.isAutomated && <span className="text-xs text-blue-500">Auto-generated</span>}
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  )
}

