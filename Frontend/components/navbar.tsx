"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, Car } from "lucide-react"
import { clearSession, getDashboardRouteByRole, getStoredSession } from "@/lib/auth"

const publicNavLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
]

const userNavLinks = [
  { href: "/add-car", label: "Add Your Car" },
  { href: "/recommendations", label: "Recommendations" },
  { href: "/dashboard/user", label: "Dashboard" },
]

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const syncAuthState = () => {
      const session = getStoredSession()
      setIsAuthenticated(Boolean(session?.accessToken))
      setUserEmail(session?.email || "")
      setUserRole(session?.role || null)
    }

    syncAuthState()
    window.addEventListener("storage", syncAuthState)
    return () => window.removeEventListener("storage", syncAuthState)
  }, [pathname])

  const handleLogout = () => {
    clearSession()
    setIsAuthenticated(false)
    setUserRole(null)
    setUserEmail("")
    setOpen(false)
    router.push("/auth")
  }

  const navLinks = isAuthenticated
    ? userRole === "USER"
      ? [...publicNavLinks, ...userNavLinks]
      : [...publicNavLinks, { href: getDashboardRouteByRole(userRole), label: "Dashboard" }]
    : publicNavLinks

  const dashboardHref = getDashboardRouteByRole(userRole)

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl shadow-sm" 
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
            <Car className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-foreground">
            Make My Car
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              {userEmail ? <span className="max-w-45 truncate text-sm text-muted-foreground">{userEmail}</span> : null}
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-muted/50">
                <Link href={dashboardHref}>Dashboard</Link>
              </Button>
              <Button size="sm" variant="outline" className="border-border hover:bg-muted" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-muted/50">
                <Link href="/auth">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25">
                <Link href="/auth">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Nav */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu" className="hover:bg-muted/50">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-75 bg-background border-border">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-6 pt-8">
                <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
                    <Car className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-serif text-xl font-bold text-foreground">Make My Car</span>
                </Link>
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col gap-3 pt-4 border-t border-border">
                  {isAuthenticated ? (
                    <>
                      {userEmail ? <p className="truncate px-1 text-sm text-muted-foreground">{userEmail}</p> : null}
                      <Button asChild variant="outline" className="w-full border-border text-foreground hover:bg-muted">
                        <Link href={dashboardHref} onClick={() => setOpen(false)}>
                          Dashboard
                        </Link>
                      </Button>
                      <Button
                        className="w-full bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="outline" className="w-full border-border text-foreground hover:bg-muted">
                        <Link href="/auth" onClick={() => setOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                      <Button asChild className="w-full bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                        <Link href="/auth" onClick={() => setOpen(false)}>
                          Get Started
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
