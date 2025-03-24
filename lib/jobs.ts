// This is a mock implementation for demo purposes
export async function getUpcomingJobs() {
  // In a real implementation, this would fetch from the database
  return [
    {
      id: 1,
      customerName: "Acme Inc",
      scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: "scheduled",
      type: "installation",
    },
    {
      id: 2,
      customerName: "TechCorp",
      scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: "scheduled",
      type: "maintenance",
    },
    {
      id: 3,
      customerName: "Global Services",
      scheduledDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: "scheduled",
      type: "repair",
    },
  ]
}

