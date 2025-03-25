"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function DeleteConflicts() {
  const [deleted, setDeleted] = useState<string[]>([])

  const conflictingRoutes = [
    "app/dashboard/page.tsx",
    "app/dashboard/layout.tsx",
    "app/enquiries/page.tsx",
    "app/enquiries/new/page.tsx",
    "app/enquiries/[id]/page.tsx",
  ]

  // In a real application, this would make API calls to delete the files
  // For this demo, we'll just simulate it
  const handleDelete = (file: string) => {
    setDeleted((prev) => [...prev, file])
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Delete Conflicting Routes</h1>

      <div className="space-y-2">
        {conflictingRoutes.map((file) => (
          <div key={file} className="flex items-center justify-between p-2 border rounded">
            <span className={deleted.includes(file) ? "line-through text-gray-400" : ""}>{file}</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(file)}
              disabled={deleted.includes(file)}
            >
              {deleted.includes(file) ? "Deleted" : "Delete"}
            </Button>
          </div>
        ))}
      </div>

      {deleted.length === conflictingRoutes.length && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          All conflicting files have been deleted. Your application should now build successfully.
        </div>
      )}
    </div>
  )
}

