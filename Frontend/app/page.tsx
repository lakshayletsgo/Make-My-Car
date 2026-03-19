"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("token")
    router.replace(token ? "/recommendations" : "/auth")
  }, [router])

  return null
}
