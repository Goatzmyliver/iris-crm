import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export async function getEnquiries() {
  const supabase = createClientComponentClient()

  const { data, error } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching enquiries:", error)
    throw new Error("Failed to fetch enquiries")
  }

  return data || []
}

export async function getEnquiryById(id: number) {
  const supabase = createClientComponentClient()

  const { data, error } = await supabase.from("enquiries").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching enquiry:", error)
    return null
  }

  return data
}

export async function createEnquiry(enquiryData: any) {
  const supabase = createClientComponentClient()

  const { data, error } = await supabase
    .from("enquiries")
    .insert([
      {
        name: enquiryData.name,
        email: enquiryData.email || null,
        phone: enquiryData.phone,
        address: enquiryData.address || null,
        enquiry_type: enquiryData.enquiryType,
        description: enquiryData.description || null,
        source: enquiryData.source || null,
        status: "new",
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error creating enquiry:", error)
    throw new Error("Failed to create enquiry")
  }

  return data
}

export async function updateEnquiry(id: number, enquiryData: any) {
  const supabase = createClientComponentClient()

  const { data, error } = await supabase
    .from("enquiries")
    .update({
      name: enquiryData.name,
      email: enquiryData.email || null,
      phone: enquiryData.phone,
      address: enquiryData.address || null,
      enquiry_type: enquiryData.enquiryType,
      description: enquiryData.description || null,
      source: enquiryData.source || null,
      status: enquiryData.status,
      notes: enquiryData.notes || null,
      assigned_user_id: enquiryData.assignedUserId || null,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating enquiry:", error)
    throw new Error("Failed to update enquiry")
  }

  return data
}

export async function deleteEnquiry(id: number) {
  const supabase = createClientComponentClient()

  const { error } = await supabase.from("enquiries").delete().eq("id", id)

  if (error) {
    console.error("Error deleting enquiry:", error)
    throw new Error("Failed to delete enquiry")
  }

  return { success: true }
}

export async function convertEnquiryToCustomer(id: number) {
  const supabase = createClientComponentClient()

  // First, get the enquiry data
  const { data: enquiry, error: enquiryError } = await supabase.from("enquiries").select("*").eq("id", id).single()

  if (enquiryError) {
    console.error("Error fetching enquiry:", enquiryError)
    throw new Error("Failed to fetch enquiry")
  }

  // Create a new customer from the enquiry data
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .insert([
      {
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        address: enquiry.address,
        lead_source: enquiry.source,
        notes: enquiry.description,
      },
    ])
    .select()
    .single()

  if (customerError) {
    console.error("Error creating customer:", customerError)
    throw new Error("Failed to create customer")
  }

  // Update the enquiry with the customer ID
  const { error: updateError } = await supabase
    .from("enquiries")
    .update({
      converted_to_customer_id: customer.id,
      status: "completed",
    })
    .eq("id", id)

  if (updateError) {
    console.error("Error updating enquiry:", updateError)
    throw new Error("Failed to update enquiry")
  }

  return { success: true, customerId: customer.id }
}

export async function convertEnquiryToQuote(id: number) {
  const supabase = createClientComponentClient()

  // First, get the enquiry data
  const { data: enquiry, error: enquiryError } = await supabase.from("enquiries").select("*").eq("id", id).single()

  if (enquiryError) {
    console.error("Error fetching enquiry:", enquiryError)
    throw new Error("Failed to fetch enquiry")
  }

  // Check if the enquiry has been converted to a customer
  let customerId = enquiry.converted_to_customer_id

  // If not, create a customer first
  if (!customerId) {
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .insert([
        {
          name: enquiry.name,
          email: enquiry.email,
          phone: enquiry.phone,
          address: enquiry.address,
          lead_source: enquiry.source,
          notes: enquiry.description,
        },
      ])
      .select()
      .single()

    if (customerError) {
      console.error("Error creating customer:", customerError)
      throw new Error("Failed to create customer")
    }

    customerId = customer.id

    // Update the enquiry with the customer ID
    await supabase
      .from("enquiries")
      .update({
        converted_to_customer_id: customerId,
      })
      .eq("id", id)
  }

  // Create a new quote
  const { data: quote, error: quoteError } = await supabase
    .from("quotes")
    .insert([
      {
        customer_id: customerId,
        name: `Quote for ${enquiry.name}`,
        description: enquiry.description,
        status: "draft",
      },
    ])
    .select()
    .single()

  if (quoteError) {
    console.error("Error creating quote:", quoteError)
    throw new Error("Failed to create quote")
  }

  // Update the enquiry with the quote ID
  const { error: updateError } = await supabase
    .from("enquiries")
    .update({
      converted_to_quote_id: quote.id,
      status: "completed",
    })
    .eq("id", id)

  if (updateError) {
    console.error("Error updating enquiry:", updateError)
    throw new Error("Failed to update enquiry")
  }

  return { success: true, quoteId: quote.id, customerId }
}

