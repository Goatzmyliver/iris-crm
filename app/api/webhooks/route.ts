import { type NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/config"

export async function POST(request: NextRequest) {
  // Verify the request is authorized
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.split(" ")[1] !== config.apiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Process different webhook types
    switch (body.type) {
      case "payment.succeeded":
        // Handle successful payment
        console.log("Payment succeeded:", body.data)
        // Update invoice status, send notification, etc.
        break

      case "appointment.reminder":
        // Handle appointment reminder
        console.log("Appointment reminder:", body.data)
        // Send notification to customer and staff
        break

      case "job.status_change":
        // Handle job status change
        console.log("Job status changed:", body.data)
        // Update job status, send notification
        break

      default:
        console.log("Unknown webhook type:", body.type)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
