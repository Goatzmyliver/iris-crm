import fs from "fs"
import path from "path"

// Function to update package.json
async function updatePackageJson() {
  try {
    const packageJsonPath = path.resolve("./package.json")
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

    // Update Supabase dependencies
    packageJson.dependencies["@supabase/auth-helpers-nextjs"] = "^0.8.7"
    packageJson.dependencies["@supabase/supabase-js"] = "^2.39.3"

    // Write updated package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
    console.log("✅ Updated package.json with correct Supabase dependencies")

    return true
  } catch (error) {
    console.error("❌ Failed to update package.json:", error)
    return false
  }
}

// Function to temporarily rename middleware.ts
async function renameMiddleware() {
  try {
    const middlewarePath = path.resolve("./middleware.ts")
    const backupPath = path.resolve("./middleware.ts.bak")

    // Create backup of original middleware
    if (fs.existsSync(middlewarePath)) {
      fs.copyFileSync(middlewarePath, backupPath)
      console.log("✅ Created backup of original middleware.ts")
    }

    // Create new middleware file
    const newMiddlewarePath = path.resolve("./middleware.ts.new")
    if (fs.existsSync(newMiddlewarePath)) {
      fs.copyFileSync(newMiddlewarePath, middlewarePath)
      console.log("✅ Applied temporary middleware.ts")
    }

    return true
  } catch (error) {
    console.error("❌ Failed to update middleware:", error)
    return false
  }
}

// Main function
async function main() {
  console.log("🔧 Starting Supabase Auth Fix...")

  const packageUpdated = await updatePackageJson()
  const middlewareUpdated = await renameMiddleware()

  if (packageUpdated && middlewareUpdated) {
    console.log("✅ All fixes applied successfully!")
    console.log("")
    console.log("Next steps:")
    console.log("1. Run: pnpm install")
    console.log("2. Run: pnpm build")
    console.log("3. Deploy to Vercel")
    console.log("")
    console.log("After successful deployment, you can restore your original middleware.ts from middleware.ts.bak")
  } else {
    console.log("⚠️ Some fixes could not be applied. Please check the errors above.")
  }
}

main()

