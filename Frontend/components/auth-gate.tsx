"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { getMe } from "@/lib/api"
import { clearSession, getDashboardRouteByRole, getStoredRole, saveSession } from "@/lib/auth"

type AuthGateProps = {
  children: React.ReactNode
}

const PROTECTED_PATHS = ["/add-car", "/my-cars", "/dashboard"]

const ROLE_ROUTES: Record<string, string> = {
  USER: "/dashboard/user",
  VENDOR: "/dashboard/vendor",
  ADMIN: "/dashboard/admin",
}

function isPathAllowedForRole(pathname: string, role: string | null) {
  if (!role) return false
  if (!pathname.startsWith("/dashboard")) return true
  if (pathname === "/dashboard") return true
  const requiredPrefix = ROLE_ROUTES[role]
  if (!requiredPrefix) return false
  return pathname === requiredPrefix || pathname.startsWith(`${requiredPrefix}/`)
}

export function AuthGate({ children }: AuthGateProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  const isProtectedPath = useMemo(() => {
    if (!pathname) return false
    return PROTECTED_PATHS.some((protectedPath) => pathname === protectedPath || pathname.startsWith(`${protectedPath}/`))
  }, [pathname])

  useEffect(() => {
    let active = true

    const safeReplace = (target: string) => {
      if (!pathname || pathname !== target) {
        router.replace(target)
      }
    }

    async function guard() {
    const token = localStorage.getItem("access_token") || localStorage.getItem("token")
    const isAuthenticated = Boolean(token)
    let role = getStoredRole()

    if (!isAuthenticated && isProtectedPath) {
      safeReplace("/auth")
      return
    }

    if (!isAuthenticated) {
      if (active) setIsChecking(false)
      return
    }

    // Older sessions may have token but no cached role. Hydrate once from backend.
    if (!role && token) {
      try {
        const me = await getMe()
        saveSession(token, me)
        role = me.user.role
      } catch {
        clearSession()
        safeReplace("/auth")
        return
      }
    }

    if (isAuthenticated && pathname === "/auth") {
      safeReplace(getDashboardRouteByRole(role))
      return
    }

    if (pathname && pathname.startsWith("/dashboard") && role && !isPathAllowedForRole(pathname, role)) {
      safeReplace(getDashboardRouteByRole(role))
      return
    }

    if (active) setIsChecking(false)
    }

    guard()

    return () => {
      active = false
    }
  }, [isProtectedPath, pathname, router])

  if (isChecking) {
    return null
  }

  return <>{children}</>
}
