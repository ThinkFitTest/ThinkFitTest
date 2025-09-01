export default function AuthCodeError() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <p className="text-gray-600 mb-4">There was an error confirming your email. Please try signing up again.</p>
        <a href="/auth/sign-up" className="text-blue-600 underline">
          Back to Sign Up
        </a>
      </div>
    </div>
  )
}
