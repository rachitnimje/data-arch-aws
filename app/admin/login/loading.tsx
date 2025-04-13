import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-dark mx-auto" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Loading...</h3>
        <p className="mt-1 text-sm text-gray-500">Please wait while we prepare the login page.</p>
      </div>
    </div>
  )
}
