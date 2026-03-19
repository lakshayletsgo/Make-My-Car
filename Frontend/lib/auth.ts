import type { MeResponse, UserRole } from "@/lib/api"

const ACCESS_TOKEN_KEY = "access_token"
const LEGACY_TOKEN_KEY = "token"
const USER_EMAIL_KEY = "user_email"
const USER_NAME_KEY = "user_name"
const USER_ROLE_KEY = "user_role"
const USER_ID_KEY = "user_id"
const USER_VENDOR_ID_KEY = "user_vendor_id"

export type StoredSession = {
  accessToken: string
  userId: string
  email: string
  name: string
  role: UserRole
  vendorId?: string
}

export function getDashboardRouteByRole(role?: string | null): string {
  if (role === "ADMIN") return "/dashboard/admin"
  if (role === "VENDOR") return "/dashboard/vendor"
  return "/dashboard/user"
}

export function saveSession(token: string, me: MeResponse) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
  localStorage.setItem(LEGACY_TOKEN_KEY, token)
  localStorage.setItem(USER_ID_KEY, me.user.id)
  localStorage.setItem(USER_EMAIL_KEY, me.user.email)
  localStorage.setItem(USER_NAME_KEY, me.user.name)
  localStorage.setItem(USER_ROLE_KEY, me.user.role)
  if (me.vendor_id) {
    localStorage.setItem(USER_VENDOR_ID_KEY, me.vendor_id)
  } else {
    localStorage.removeItem(USER_VENDOR_ID_KEY)
  }
}

export function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(LEGACY_TOKEN_KEY)
  localStorage.removeItem(USER_ID_KEY)
  localStorage.removeItem(USER_EMAIL_KEY)
  localStorage.removeItem(USER_NAME_KEY)
  localStorage.removeItem(USER_ROLE_KEY)
  localStorage.removeItem(USER_VENDOR_ID_KEY)
}

export function getStoredSession(): StoredSession | null {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY)
  const userId = localStorage.getItem(USER_ID_KEY)
  const email = localStorage.getItem(USER_EMAIL_KEY)
  const name = localStorage.getItem(USER_NAME_KEY)
  const role = localStorage.getItem(USER_ROLE_KEY) as UserRole | null
  const vendorId = localStorage.getItem(USER_VENDOR_ID_KEY) || undefined

  if (!accessToken || !userId || !email || !name || !role) {
    return null
  }

  return { accessToken, userId, email, name, role, vendorId }
}

export function getStoredRole(): UserRole | null {
  return (localStorage.getItem(USER_ROLE_KEY) as UserRole | null) || null
}
