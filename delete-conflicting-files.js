// This is a script you would run locally to delete the conflicting files
// You can run this with Node.js or manually delete these files

/*
Files to delete:
- app/dashboard/page.tsx
- app/enquiries/page.tsx
- app/enquiries/new/page.tsx
- app/enquiries/[id]/page.tsx
*/

const fs = require("fs")
const path = require("path")

const filesToDelete = [
  "app/dashboard/page.tsx",
  "app/enquiries/page.tsx",
  "app/enquiries/new/page.tsx",
  "app/enquiries/[id]/page.tsx",
]

filesToDelete.forEach((file) => {
  const filePath = path.join(process.cwd(), file)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
    console.log(`Deleted: ${file}`)
  } else {
    console.log(`File not found: ${file}`)
  }
})

console.log("Cleanup complete!")

