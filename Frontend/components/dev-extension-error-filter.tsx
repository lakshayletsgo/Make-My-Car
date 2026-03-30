"use client"

import { useEffect } from "react"

export function DevExtensionErrorFilter() {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason
      const message =
        typeof reason === "string"
          ? reason
          : reason && typeof reason === "object" && "message" in reason
          ? String((reason as { message?: unknown }).message)
          : ""

      const stack =
        reason && typeof reason === "object" && "stack" in reason
          ? String((reason as { stack?: unknown }).stack || "")
          : ""

      // Ignore known extension-injected MetaMask connect failures that are unrelated to app logic.
      if (message.includes("Failed to connect to MetaMask") || stack.includes("nkbihfbeogaeaoehlefnkodbefgpgknn")) {
        event.preventDefault()
      }
    }

    window.addEventListener("unhandledrejection", handleUnhandledRejection)
    return () => window.removeEventListener("unhandledrejection", handleUnhandledRejection)
  }, [])

  return null
}
