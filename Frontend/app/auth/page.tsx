"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { getMe, login, loginWithGoogle, register } from "@/lib/api"
import { getDashboardRouteByRole, saveSession } from "@/lib/auth"

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (options: {
            client_id: string
            callback: (response: { credential?: string }) => void
          }) => void
          renderButton: (
            element: HTMLElement,
            options: {
              theme?: "outline" | "filled_blue" | "filled_black"
              size?: "large" | "medium" | "small"
              text?: "signin_with" | "signup_with" | "continue_with" | "signin"
              shape?: "rectangular" | "pill" | "circle" | "square"
              width?: number
            }
          ) => void
        }
      }
    }
  }
}

export default function AuthPage() {
  const router = useRouter()
  const googleButtonRef = useRef<HTMLDivElement | null>(null)
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [token, setToken] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const existingToken = localStorage.getItem("access_token") || localStorage.getItem("token")
    const role = localStorage.getItem("user_role")
    if (existingToken) {
      router.replace(getDashboardRouteByRole(role))
    }
  }, [router])

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) return

    let isUnmounted = false

    const mountGoogleButton = () => {
      if (isUnmounted || !googleButtonRef.current) return
      if (!window.google?.accounts?.id) return

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          const credential = response?.credential
          if (!credential) {
            setMessage("Google sign-in failed. Try again.")
            return
          }

          setMessage("")
          setIsSubmitting(true)
          try {
            const data = await loginWithGoogle(credential)
            const me = await getMe(data.access_token)
            saveSession(data.access_token, me)
            setMessage("Login successful")
            router.replace(getDashboardRouteByRole(me.user.role))
          } catch (error) {
            setMessage(error instanceof Error ? error.message : "Google sign-in failed")
          } finally {
            setIsSubmitting(false)
          }
        },
      })

      googleButtonRef.current.innerHTML = ""
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        width: 320,
      })
    }

    if (window.google?.accounts?.id) {
      mountGoogleButton()
      return () => {
        isUnmounted = true
      }
    }

    const existingScript = document.querySelector<HTMLScriptElement>("script[data-google-identity='true']")
    if (existingScript) {
      existingScript.addEventListener("load", mountGoogleButton)
      return () => {
        isUnmounted = true
        existingScript.removeEventListener("load", mountGoogleButton)
      }
    }

    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.dataset.googleIdentity = "true"
    script.onload = mountGoogleButton
    script.onerror = () => setMessage("Unable to load Google sign-in. Check your network and client ID.")
    document.head.appendChild(script)

    return () => {
      isUnmounted = true
      script.removeEventListener("load", mountGoogleButton)
    }
  }, [googleClientId, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage("")
    setIsSubmitting(true)

    try {
      if (mode === "signup") {
        const data = await register({ email, password, name })
        setMessage(data?.message || "Signup successful. Verify your email.")
        if (data?.dev_verification_token) {
          setToken(data.dev_verification_token)
        }
        return
      }

      const data = await login(email, password)
      const me = await getMe(data.access_token)
      saveSession(data.access_token, me)
      setMessage("Login successful")
      router.replace(getDashboardRouteByRole(me.user.role))
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Cannot reach backend API. Check backend server and NEXT_PUBLIC_API_BASE_URL.")
    } finally {
      setIsSubmitting(false)
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
        <button
          className="w-full rounded bg-black px-3 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Please wait..." : mode === "login" ? "Login" : "Sign up"}
        </button>
      </form>

      {mode === "login" ? (
        <>
          <div className="my-4 h-px w-full bg-gray-200" />
          {googleClientId ? (
            <div className="flex justify-center">
              <div ref={googleButtonRef} aria-label="Continue with Google" />
            </div>
          ) : (
            <p className="text-xs text-gray-500">Set NEXT_PUBLIC_GOOGLE_CLIENT_ID to enable Google sign-in.</p>
          )}
        </>
      ) : null}

      {message ? <p className="mt-4 text-sm">{message}</p> : null}
      {token ? (
        <p className="mt-2 break-all text-xs text-gray-500">
          Dev verification token: {token}
        </p>
      ) : null}
    </main>
  )
}
