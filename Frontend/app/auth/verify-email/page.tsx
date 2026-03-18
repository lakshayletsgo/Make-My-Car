"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1"

export default function VerifyEmailPage() {
  const params = useSearchParams()
  const token = useMemo(() => params.get("token") || "", [params])
  const [message, setMessage] = useState("Verifying your email...")

  useEffect(() => {
    async function verify() {
      if (!token) {
        setMessage("Missing verification token.")
        return
      }

      const res = await fetch(`${API_BASE}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })

      const data = await res.json()
      if (!res.ok) {
        setMessage(data?.detail || "Email verification failed.")
        return
      }

      setMessage(data?.message || "Email verified successfully.")
    }

    verify()
  }, [token])

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-2 text-3xl font-semibold">Email Verification</h1>
      <p className="text-sm text-gray-600">{message}</p>
      <a href="/auth" className="mt-6 rounded bg-black px-4 py-2 text-sm text-white">
        Go to Login
      </a>
    </main>
  )
}
