"use client"

import { useEffect, useState } from "react"

export default function FixRouting() {
  const [conflicts, setConflicts] = useState<string[]>([])

  useEffect(() => {
    // These are the conflicting routes we need to remove
    const conflictingRoutes = [
      "app/dashboard/page.tsx",
      "app/dashboard/layout.tsx",
      "app/enquiries/page.tsx",
      "app/enquiries/new/page.tsx",
      "app/enquiries/[id]/page.tsx",
    ]

    setConflicts(conflictingRoutes)
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Routing Conflicts Detected</h1>
      <p className="mb-4">The following files are causing routing conflicts and should be removed:</p>

      <ul className="list-disc pl-6 mb-6">
        {conflicts.map((file) => (
          <li key={file} className="text-red-500">
            {file}
          </li>
        ))}
      </ul>

      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h2 className="font-semibold mb-2">How to fix:</h2>
        <p>
          In Next.js, route groups (folders in parentheses like <code>(dashboard)</code>) don't affect the URL path.
          They're just for organization. So both <code>app/(dashboard)/dashboard/page.tsx</code> and{" "}
          <code>app/dashboard/page.tsx</code>
          resolve to the same URL: <code>/dashboard</code>.
        </p>
        <p className="mt-2">
          You need to keep only one version of each route. Since you have a <code>(dashboard)</code> route group that
          likely contains layout settings, I recommend keeping that structure and removing the duplicate routes outside
          of it.
        </p>
      </div>
    </div>
  )
}

