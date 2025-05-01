// Environment variables configuration
export const config = {
  // External API key for third-party services
  apiKey: process.env.API_KEY,

  // Supabase configuration is handled separately through the Supabase client

  // Application settings
  app: {
    name: "Iris CRM",
    description: "Complete customer relationship management for service businesses",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },

  // Feature flags
  features: {
    enableNotifications: true,
    enableCalendarSync: true,
    enablePaymentProcessing: true,
  },
}

// Validate required environment variables
if (!config.apiKey) {
  console.warn("API_KEY environment variable is not set. Some features may not work correctly.")
}
