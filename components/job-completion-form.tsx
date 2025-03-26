"use client"

import type React from "react"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Camera, X } from "lucide-react"

interface JobCompletionFormProps {
  jobId: string
  installerId: string
  onComplete: () => void
  onCancel: () => void
}

export function JobCompletionForm({ jobId, installerId, onComplete, onCancel }: JobCompletionFormProps) {
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [notes, setNotes] = useState("")
  const [hoursWorked, setHoursWorked] = useState("")
  const [photos, setPhotos] = useState<File[]>([])
  const [photoUrls, setPhotoUrls] = useState<string[]>([])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files)
      setPhotos([...photos, ...newPhotos])

      // Create preview URLs
      const newUrls = newPhotos.map((file) => URL.createObjectURL(file))
      setPhotoUrls([...photoUrls, ...newUrls])
    }
  }

  const removePhoto = (index: number) => {
    const newPhotos = [...photos]
    newPhotos.splice(index, 1)
    setPhotos(newPhotos)

    const newUrls = [...photoUrls]
    URL.revokeObjectURL(newUrls[index])
    newUrls.splice(index, 1)
    setPhotoUrls(newUrls)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Upload photos if any
      const photoFileNames: string[] = []

      if (photos.length > 0) {
        for (const photo of photos) {
          const fileName = `job-${jobId}-${Date.now()}-${photo.name}`
          const { error: uploadError } = await supabase.storage.from("job-photos").upload(fileName, photo)

          if (uploadError) throw uploadError

          photoFileNames.push(fileName)
        }
      }

      // Update job status to completed
      const { error: jobError } = await supabase
        .from("jobs")
        .update({
          status: "completed",
          completion_date: new Date().toISOString(),
          completion_notes: notes,
          hours_worked: Number.parseFloat(hoursWorked) || 0,
          completion_photos: photoFileNames,
          progress_percentage: 100,
        })
        .eq("id", jobId)

      if (jobError) throw jobError

      // Create a job update record
      await supabase.from("job_updates").insert({
        job_id: jobId,
        update_type: "job_completed",
        notes: `Job completed. Hours worked: ${hoursWorked}. Notes: ${notes}`,
        created_by: installerId,
      })

      toast({
        title: "Job completed",
        description: "You have successfully marked this job as complete.",
      })

      onComplete()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete job",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="hoursWorked">Hours Worked</Label>
        <Input
          id="hoursWorked"
          type="number"
          step="0.25"
          min="0"
          value={hoursWorked}
          onChange={(e) => setHoursWorked(e.target.value)}
          placeholder="Enter hours worked"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Completion Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter any notes about the job completion"
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Photos</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {photoUrls.map((url, index) => (
            <div key={index} className="relative rounded-md overflow-hidden h-24 bg-muted">
              <img src={url || "/placeholder.svg"} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={() => removePhoto(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex flex-col items-center justify-center h-24 border-2 border-dashed rounded-md border-muted-foreground/25 p-2">
            <Label
              htmlFor="photo-upload"
              className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
            >
              <Camera className="h-6 w-6 mb-1 text-muted-foreground" />
              <span className="text-xs text-muted-foreground text-center">Add Photo</span>
              <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoChange}
                className="sr-only"
              />
            </Label>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="sm:w-auto w-full" disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" className="sm:w-auto w-full" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Complete Job"}
        </Button>
      </div>
    </form>
  )
}

