import { LoginForm } from "@/components/login-form"
import Link from "next/link"

export const metadata = {
  title: "Login - Iris CRM",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-gray-500 dark:text-gray-400">Enter your credentials to access your account</p>
      </div>
      <LoginForm />
      <div className="text-center text-sm">
        <p>
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

