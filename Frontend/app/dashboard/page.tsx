"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getDashboardRouteByRole, getStoredRole } from "@/lib/auth"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const role = getStoredRole()
    router.replace(getDashboardRouteByRole(role))
  }, [router])

  return null
}
