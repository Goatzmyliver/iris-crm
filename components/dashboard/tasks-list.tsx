"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, User, Clock, Plus, CheckCircle } from "lucide-react"

interface Task {
  id: number
  title: string
  customer: string
  type: string
  dueDate: string
  priority: string
  completed: boolean
}

interface TasksListProps {
  tasks: Task[]
}

export function TasksList({ tasks }: TasksListProps) {
  const [taskList, setTaskList] = useState<Task[]>(tasks)

  const toggleTaskCompletion = (taskId: number) => {
    setTaskList(taskList.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "quote":
        return <FileText className="h-4 w-4 text-amber-500" />
      case "job":
        return <Calendar className="h-4 w-4 text-blue-500" />
      case "customer":
        return <User className="h-4 w-4 text-purple-500" />
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

  const activeTasks = taskList.filter((task) => !task.completed)
  const completedTasks = taskList.filter((task) => task.completed)

  return (
    <div className="space-y-4">
      {activeTasks.length > 0 ? (
        <div className="space-y-3">
          {activeTasks.map((task) => (
            <div key={task.id} className="flex items-start gap-3 rounded-lg border p-3">
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

      <Button variant="outline" className="w-full" size="sm">
        <Plus className="mr-2 h-4 w-4" />
        Add New Task
      </Button>
    </div>
  )
}

