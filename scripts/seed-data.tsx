"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertCircle, Trash2 } from "lucide-react"

// This is a client component that can be used to seed the database with sample data
export default function SeedData() {
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false)

  // Prefix for all sample data to make it easy to identify and delete later
  const SAMPLE_PREFIX = "[SAMPLE] "

  // Generate a random date within the last 3 months
  const randomDate = (daysBack = 90) => {
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * daysBack))
    return date.toISOString()
  }

  // Generate a random future date within the next 30 days
  const randomFutureDate = (daysAhead = 30) => {
    const date = new Date()
    date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead) + 1)
    return date.toISOString()
  }

  // Generate a random price between min and max
  const randomPrice = (min = 10, max = 1000) => {
    return Number.parseFloat((Math.random() * (max - min) + min).toFixed(2))
  }

  // Generate a random integer between min and max
  const randomInt = (min = 1, max = 10) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  // Pick a random item from an array
  const randomItem = <T,>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)]
  }

  // Sample data
  const customerNames = [
    "John Smith",
    "Emma Johnson",
    "Michael Brown",
    "Olivia Davis",
    "William Wilson",
    "Sophia Martinez",
    "James Taylor",
    "Isabella Anderson",
    "Robert Thomas",
    "Mia Jackson",
    "David White",
    "Charlotte Harris",
    "Joseph Martin",
    "Amelia Thompson",
    "Daniel Garcia",
    "Elizabeth Robinson",
    "Matthew Lewis",
    "Ava Walker",
    "Christopher Allen",
    "Sofia Young",
  ]

  const addresses = [
    "123 Main St, Anytown, CA 12345",
    "456 Oak Ave, Springfield, NY 67890",
    "789 Pine Rd, Lakeside, TX 23456",
    "321 Maple Dr, Mountain View, WA 78901",
    "654 Cedar Ln, Riverside, FL 34567",
    "987 Elm Blvd, Hillcrest, IL 89012",
    "246 Birch Ct, Oceanview, OR 45678",
    "135 Willow Way, Meadowbrook, AZ 90123",
    "864 Spruce St, Highland, CO 56789",
    "975 Aspen Pl, Valleyview, GA 01234",
  ]

  const productNames = [
    "Luxury Wool Carpet - Beige",
    "Stain-Resistant Nylon Carpet - Gray",
    "Berber Loop Carpet - Charcoal",
    "Plush Saxony Carpet - Cream",
    "Commercial Grade Carpet Tiles - Blue",
    "Waterproof Vinyl Flooring - Oak",
    "Luxury Vinyl Plank - Walnut",
    "Sheet Vinyl Flooring - Stone Pattern",
    "Laminate Flooring - Cherry",
    "Engineered Hardwood - Maple",
    "Carpet Padding - Premium",
    "Carpet Installation Kit",
    "Vinyl Transition Strips",
    "Carpet Binding Service",
    "Floor Leveling Compound",
  ]

  const roomTypes = [
    "Living Room",
    "Bedroom",
    "Dining Room",
    "Kitchen",
    "Bathroom",
    "Office",
    "Basement",
    "Hallway",
    "Stairs",
    "Entire House",
  ]

  const enquirySources = ["website", "phone", "email", "referral", "walk_in", "social_media"]

  const seedDatabase = async () => {
    setIsLoading(true)
    setProgress(0)
    setStatus("Starting...")
    setError(null)
    setSuccess(false)

    try {
      // Get the current user for assigning as creator
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("You must be logged in to seed the database")

      // Step 1: Create sample customers
      setStatus("Creating sample customers...")
      setProgress(10)

      const customers = []
      for (let i = 0; i < 15; i++) {
        const name = `${SAMPLE_PREFIX}${customerNames[i % customerNames.length]}`
        customers.push({
          full_name: name,
          email: name.toLowerCase().replace(/\s/g, ".") + "@example.com",
          phone: `555-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, "0")}`,
          address: addresses[i % addresses.length],
          notes: Math.random() > 0.7 ? "Sample customer notes for testing purposes." : null,
          created_at: randomDate(),
        })
      }

      const { data: createdCustomers, error: customersError } = await supabase
        .from("customers")
        .insert(customers)
        .select()

      if (customersError) throw customersError

      // Step 2: Create sample products
      setStatus("Creating sample products...")
      setProgress(20)

      const products = []
      for (let i = 0; i < productNames.length; i++) {
        const price = randomPrice(20, 100)
        const cost = price * 0.6 // 40% markup

        products.push({
          name: `${SAMPLE_PREFIX}${productNames[i]}`,
          description: `High-quality ${productNames[i].toLowerCase()} for residential and commercial use.`,
          price: price,
          cost: cost,
          stock_level: randomInt(5, 100),
          low_stock_threshold: 5,
          unit: i < 10 ? "m²" : "unit",
          supplier_name: randomItem(["Carpet Wholesalers", "Flooring Supplies Inc.", "Premium Floors Ltd"]),
          supplier_contact: randomItem(["john@supplier.com", "555-123-4567", "www.supplier.com"]),
          notes: Math.random() > 0.7 ? "Sample product notes for inventory management." : null,
        })
      }

      const { data: createdProducts, error: productsError } = await supabase.from("products").insert(products).select()

      if (productsError) throw productsError

      // Step 3: Create sample enquiries
      setStatus("Creating sample enquiries...")
      setProgress(30)

      const enquiries = []
      for (let i = 0; i < 10; i++) {
        const customerIndex = i % createdCustomers.length
        const customer = createdCustomers[customerIndex]

        enquiries.push({
          customer_id: customer.id,
          source: randomItem(enquirySources),
          description: `Enquiry about ${randomItem(productNames).toLowerCase()} for ${randomItem(roomTypes).toLowerCase()}.`,
          product_interest: randomItem(["carpet", "vinyl", "laminate", "multiple"]),
          room_type: randomItem(roomTypes),
          approximate_size: `${randomInt(10, 100)} m²`,
          budget_range: `$${randomInt(500, 5000)} - $${randomInt(5001, 10000)}`,
          preferred_contact_method: randomItem(["phone", "email", "sms"]),
          preferred_contact_time: randomItem(["Morning", "Afternoon", "Evening", "Weekends"]),
          notes: Math.random() > 0.7 ? "Customer is interested in financing options." : null,
          status: randomItem(["new", "contacted", "quoted", "converted", "lost"]),
          created_at: randomDate(60),
        })
      }

      const { data: createdEnquiries, error: enquiriesError } = await supabase
        .from("enquiries")
        .insert(enquiries)
        .select()

      if (enquiriesError) throw enquiriesError

      // Step 4: Create sample quotes
      setStatus("Creating sample quotes...")
      setProgress(40)

      const quotes = []
      const quoteItems = []

      for (let i = 0; i < 12; i++) {
        const customerIndex = i % createdCustomers.length
        const customer = createdCustomers[customerIndex]

        // Determine if this quote should be linked to an enquiry
        let enquiryId = null
        if (i < createdEnquiries.length && Math.random() > 0.5) {
          enquiryId = createdEnquiries[i].id
        }

        // Calculate expiry date (30 days from creation)
        const createdAt = randomDate(45)
        const expiryDate = new Date(createdAt)
        expiryDate.setDate(expiryDate.getDate() + 30)

        // Determine status based on creation date
        let status
        const now = new Date()
        const created = new Date(createdAt)
        const daysSinceCreation = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))

        if (daysSinceCreation < 7) {
          status = randomItem(["draft", "sent"])
        } else if (daysSinceCreation < 14) {
          status = randomItem(["draft", "sent", "approved", "rejected"])
        } else {
          status = randomItem(["approved", "rejected", "expired"])
        }

        // Create between 1 and 5 items for this quote
        const itemCount = randomInt(1, 5)
        let totalAmount = 0
        let costTotal = 0

        const quoteId = `quote_${i}_${Date.now()}` // Temporary ID for reference

        for (let j = 0; j < itemCount; j++) {
          const productIndex = (i + j) % createdProducts.length
          const product = createdProducts[productIndex]

          const quantity = randomInt(1, 10)
          const unitPrice = product.price * (1 + randomInt(0, 20) / 100) // Add up to 20% markup
          const costPrice = product.cost

          totalAmount += quantity * unitPrice
          costTotal += quantity * costPrice

          quoteItems.push({
            temp_quote_id: quoteId,
            product_id: product.id,
            description: product.name.replace(SAMPLE_PREFIX, ""),
            quantity: quantity,
            unit_price: unitPrice,
            cost_price: costPrice,
          })
        }

        const profit = totalAmount - costTotal

        quotes.push({
          id: quoteId,
          customer_id: customer.id,
          enquiry_id: enquiryId,
          total_amount: totalAmount,
          cost_total: costTotal,
          profit: profit,
          status: status,
          expiry_date: expiryDate.toISOString().split("T")[0],
          notes: Math.random() > 0.7 ? "Sample quote notes for testing purposes." : null,
          show_item_breakdown: Math.random() > 0.2, // 80% chance to show breakdown
          created_at: createdAt,
        })
      }

      // Insert quotes
      for (const quote of quotes) {
        const tempId = quote.id
        delete quote.id // Remove temporary ID for insertion

        const { data: createdQuote, error: quoteError } = await supabase.from("quotes").insert([quote]).select()

        if (quoteError) throw quoteError

        // Update quote items with the real quote ID and insert them
        const itemsForThisQuote = quoteItems.filter((item) => item.temp_quote_id === tempId)

        for (const item of itemsForThisQuote) {
          delete item.temp_quote_id
          item.quote_id = createdQuote[0].id
        }

        if (itemsForThisQuote.length > 0) {
          const { error: itemsError } = await supabase.from("quote_items").insert(itemsForThisQuote)

          if (itemsError) throw itemsError
        }
      }

      // Step 5: Create sample jobs
      setStatus("Creating sample jobs...")
      setProgress(60)

      // Get all quotes
      const { data: allQuotes, error: allQuotesError } = await supabase
        .from("quotes")
        .select("*")
        .like("notes", `%${SAMPLE_PREFIX.trim()}%`)
        .or(`customer_id.in.(${createdCustomers.map((c) => c.id).join(",")})`)

      if (allQuotesError) throw allQuotesError

      // Create jobs for approved quotes and some random jobs
      const jobs = []
      const jobItems = []

      // First, create jobs from approved quotes
      const approvedQuotes = allQuotes.filter((q) => q.status === "approved")

      for (const quote of approvedQuotes) {
        const scheduledDate = randomFutureDate()
        const status = randomItem(["scheduled", "in_progress", "completed", "cancelled"])
        const progressPercentage = status === "completed" ? 100 : status === "in_progress" ? randomInt(10, 90) : 0

        jobs.push({
          customer_id: quote.customer_id,
          quote_id: quote.id,
          status: status,
          scheduled_date: scheduledDate,
          installer_id: null,
          installer_name: `${SAMPLE_PREFIX}Installer ${randomInt(1, 5)}`,
          notes: `Job created from quote #${quote.id}. ${Math.random() > 0.7 ? "Additional installation notes." : ""}`,
          progress_percentage: progressPercentage,
          progress_notes: progressPercentage > 0 ? "Sample progress notes." : null,
          completion_notes: status === "completed" ? "Job completed successfully." : null,
          completion_date: status === "completed" ? randomDate(7) : null,
        })
      }

      // Then create some random jobs not linked to quotes
      for (let i = 0; i < 5; i++) {
        const customerIndex = i % createdCustomers.length
        const customer = createdCustomers[customerIndex]

        const scheduledDate = randomFutureDate()
        const status = randomItem(["scheduled", "in_progress", "completed", "cancelled"])
        const progressPercentage = status === "completed" ? 100 : status === "in_progress" ? randomInt(10, 90) : 0

        jobs.push({
          customer_id: customer.id,
          quote_id: null,
          status: status,
          scheduled_date: scheduledDate,
          installer_id: null,
          installer_name: `${SAMPLE_PREFIX}Installer ${randomInt(1, 5)}`,
          notes: `Direct job booking for ${randomItem(roomTypes)}. ${Math.random() > 0.7 ? "Special instructions included." : ""}`,
          progress_percentage: progressPercentage,
          progress_notes: progressPercentage > 0 ? "Sample progress notes." : null,
          completion_notes: status === "completed" ? "Job completed successfully." : null,
          completion_date: status === "completed" ? randomDate(7) : null,
        })
      }

      // Insert jobs
      for (const job of jobs) {
        const { data: createdJob, error: jobError } = await supabase.from("jobs").insert([job]).select()

        if (jobError) throw jobError

        // If this job is linked to a quote, get the quote items and create job items
        if (job.quote_id) {
          const { data: quoteItems, error: quoteItemsError } = await supabase
            .from("quote_items")
            .select("*")
            .eq("quote_id", job.quote_id)

          if (quoteItemsError) throw quoteItemsError

          if (quoteItems && quoteItems.length > 0) {
            const jobItemsToInsert = quoteItems.map((item) => ({
              job_id: createdJob[0].id,
              product_id: item.product_id,
              description: item.description,
              quantity: item.quantity,
            }))

            const { error: jobItemsError } = await supabase.from("job_items").insert(jobItemsToInsert)

            if (jobItemsError) throw jobItemsError
          }
        } else {
          // Create random job items
          const itemCount = randomInt(1, 3)

          for (let j = 0; j < itemCount; j++) {
            const productIndex = j % createdProducts.length
            const product = createdProducts[productIndex]

            jobItems.push({
              job_id: createdJob[0].id,
              product_id: product.id,
              description: product.name.replace(SAMPLE_PREFIX, ""),
              quantity: randomInt(1, 5),
            })
          }

          if (jobItems.length > 0) {
            const { error: jobItemsError } = await supabase.from("job_items").insert(jobItems)

            if (jobItemsError) throw jobItemsError
          }
        }

        // Create job updates for jobs with progress or completion
        if (job.progress_percentage > 0 || job.status === "completed") {
          const updates = []

          // Status change update
          if (job.status !== "scheduled") {
            updates.push({
              job_id: createdJob[0].id,
              update_type: "status_change",
              previous_status: "scheduled",
              new_status: job.status,
              notes: job.status === "completed" ? job.completion_notes : null,
              created_by: user.id,
              created_at: randomDate(14),
            })
          }

          // Progress update
          if (job.progress_percentage > 0) {
            updates.push({
              job_id: createdJob[0].id,
              update_type: "progress_update",
              progress_percentage: job.progress_percentage,
              notes: job.progress_notes,
              created_by: user.id,
              created_at: randomDate(7),
            })
          }

          if (updates.length > 0) {
            const { error: updatesError } = await supabase.from("job_updates").insert(updates)

            if (updatesError) throw updatesError
          }
        }
      }

      // Step 6: Create sample follow-ups
      setStatus("Creating sample follow-ups...")
      setProgress(80)

      const followUps = []

      // Create follow-ups for some enquiries
      for (let i = 0; i < 5; i++) {
        if (i < createdEnquiries.length) {
          const enquiry = createdEnquiries[i]

          followUps.push({
            customer_id: enquiry.customer_id,
            enquiry_id: enquiry.id,
            title: `${SAMPLE_PREFIX}Follow-up call regarding ${enquiry.product_interest}`,
            description: "Scheduled follow-up to discuss product options and pricing.",
            scheduled_date: randomFutureDate(14),
            assigned_to: user.id,
            status: randomItem(["pending", "completed", "cancelled"]),
            created_at: randomDate(10),
          })
        }
      }

      // Create some general follow-ups
      for (let i = 0; i < 5; i++) {
        const customerIndex = i % createdCustomers.length
        const customer = createdCustomers[customerIndex]

        followUps.push({
          customer_id: customer.id,
          enquiry_id: null,
          title: `${SAMPLE_PREFIX}${randomItem(["Check-in call", "Satisfaction survey", "Maintenance reminder", "Upsell opportunity", "Warranty check"])}`,
          description: "Regular customer follow-up to maintain relationship.",
          scheduled_date: randomFutureDate(21),
          assigned_to: user.id,
          status: randomItem(["pending", "completed", "cancelled"]),
          created_at: randomDate(10),
        })
      }

      if (followUps.length > 0) {
        const { error: followUpsError } = await supabase.from("follow_ups").insert(followUps)

        if (followUpsError) throw followUpsError
      }

      // All done!
      setStatus("Sample data created successfully!")
      setProgress(100)
      setSuccess(true)
    } catch (err: any) {
      console.error("Error seeding database:", err)
      setError(err.message || "An unknown error occurred")
      setProgress(0)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteAllSampleData = async () => {
    setIsDeleting(true)
    setError(null)
    setDeleteSuccess(false)

    try {
      // Delete in reverse order of dependencies
      setStatus("Deleting sample follow-ups...")
      await supabase.from("follow_ups").delete().like("title", `${SAMPLE_PREFIX}%`)

      setStatus("Deleting sample job updates...")
      // We can't directly filter job updates, so we need to get the job IDs first
      const { data: sampleJobs } = await supabase
        .from("jobs")
        .select("id")
        .like("notes", `%${SAMPLE_PREFIX}%`)
        .or(`installer_name.like.${SAMPLE_PREFIX}%`)

      if (sampleJobs && sampleJobs.length > 0) {
        await supabase
          .from("job_updates")
          .delete()
          .in(
            "job_id",
            sampleJobs.map((j) => j.id),
          )
      }

      setStatus("Deleting sample job items...")
      if (sampleJobs && sampleJobs.length > 0) {
        await supabase
          .from("job_items")
          .delete()
          .in(
            "job_id",
            sampleJobs.map((j) => j.id),
          )
      }

      setStatus("Deleting sample jobs...")
      await supabase
        .from("jobs")
        .delete()
        .like("notes", `%${SAMPLE_PREFIX}%`)
        .or(`installer_name.like.${SAMPLE_PREFIX}%`)

      setStatus("Deleting sample quote items...")
      // Get quote IDs first
      const { data: sampleQuotes } = await supabase.from("quotes").select("id").like("notes", `%${SAMPLE_PREFIX}%`)

      if (sampleQuotes && sampleQuotes.length > 0) {
        await supabase
          .from("quote_items")
          .delete()
          .in(
            "quote_id",
            sampleQuotes.map((q) => q.id),
          )
      }

      setStatus("Deleting sample quotes...")
      await supabase.from("quotes").delete().like("notes", `%${SAMPLE_PREFIX}%`)

      setStatus("Deleting sample enquiries...")
      await supabase.from("enquiries").delete().like("description", `%${SAMPLE_PREFIX}%`)

      setStatus("Deleting sample products...")
      await supabase.from("products").delete().like("name", `${SAMPLE_PREFIX}%`)

      setStatus("Deleting sample customers...")
      await supabase.from("customers").delete().like("full_name", `${SAMPLE_PREFIX}%`)

      setStatus("All sample data deleted successfully!")
      setDeleteSuccess(true)
    } catch (err: any) {
      console.error("Error deleting sample data:", err)
      setError(err.message || "An unknown error occurred")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Database Seed Tool</CardTitle>
          <CardDescription>
            Populate the database with sample data for testing and demonstration purposes. All sample data will be
            prefixed with "{SAMPLE_PREFIX}" for easy identification.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Sample data has been created successfully! You can now browse the application to see it in action.
              </AlertDescription>
            </Alert>
          )}

          {deleteSuccess && (
            <Alert variant="success" className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>All sample data has been deleted successfully!</AlertDescription>
            </Alert>
          )}

          {(isLoading || isDeleting) && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{status}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
            <h3 className="font-medium mb-2">Important Notes:</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>This tool will create sample data across all tables in the database.</li>
              <li>All sample data will be prefixed with "{SAMPLE_PREFIX}" for easy identification.</li>
              <li>You can delete all sample data at any time using the "Delete All Sample Data" button.</li>
              <li>This tool is intended for development and testing purposes only.</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="destructive" onClick={deleteAllSampleData} disabled={isLoading || isDeleting}>
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete All Sample Data"}
          </Button>
          <Button onClick={seedDatabase} disabled={isLoading || isDeleting}>
            {isLoading ? "Creating..." : "Create Sample Data"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

