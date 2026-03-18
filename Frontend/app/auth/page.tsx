"use client"

import { useState } from "react"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1"

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [token, setToken] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage("")

    try {
      if (mode === "signup") {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        })
        const data = await res.json()
        if (!res.ok) {
          setMessage(data?.detail || "Signup failed")
          return
        }
        setMessage(data?.message || "Signup successful. Verify your email.")
        if (data?.dev_verification_token) {
          setToken(data.dev_verification_token)
        }
        return
      }

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage(data?.detail || "Login failed")
        return
      }

      localStorage.setItem("access_token", data.access_token)
      setMessage("Login successful")
      window.location.href = "/recommendations"
    } catch {
      setMessage("Cannot reach backend API. Check backend server and NEXT_PUBLIC_API_BASE_URL.")
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="mb-2 text-3xl font-semibold">Make My Car</h1>
      <p className="mb-6 text-sm text-gray-500">{mode === "login" ? "Login" : "Create account"}</p>

      <div className="mb-4 flex gap-2">
        <button
          className={`rounded px-3 py-2 text-sm ${mode === "login" ? "bg-black text-white" : "bg-gray-100"}`}
          onClick={() => setMode("login")}
          type="button"
        >
          Login
        </button>
        <button
          className={`rounded px-3 py-2 text-sm ${mode === "signup" ? "bg-black text-white" : "bg-gray-100"}`}
          onClick={() => setMode("signup")}
          type="button"
        >
          Sign up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === "signup" && (
          <input
            className="w-full rounded border p-2"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          className="w-full rounded border p-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full rounded border p-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full rounded bg-black px-3 py-2 text-white" type="submit">
          {mode === "login" ? "Login" : "Sign up"}
        </button>
      </form>

      {message ? <p className="mt-4 text-sm">{message}</p> : null}
      {token ? (
        <p className="mt-2 break-all text-xs text-gray-500">
          Dev verification token: {token}
        </p>
      ) : null}
    </main>
  )
}
