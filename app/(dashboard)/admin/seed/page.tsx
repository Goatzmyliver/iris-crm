import SeedData from "@/scripts/seed-data"

export default function SeedPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Database Seed Tool</h2>
      </div>

      <SeedData />
    </div>
  )
}

