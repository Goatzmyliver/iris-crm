import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Create a test user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: "test@example.com",
      password: "password123",
      email_confirm: true,
    })

    if (authError) throw authError

    // Create a profile for the user
    if (authData.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        full_name: "Test User",
        email: "test@example.com",
        role: "admin",
      })

      if (profileError) throw profileError
    }

    return NextResponse.json({
      success: true,
      message: "Test user created successfully",
      credentials: {
        email: "test@example.com",
        password: "password123",
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
