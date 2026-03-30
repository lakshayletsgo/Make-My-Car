import Link from "next/link"
import { Car } from "lucide-react"

const footerLinks = {
  Platform: [
    { href: "/add-car", label: "Add Your Car" },
    { href: "/recommendations", label: "Recommendations" },
    { href: "/dashboard", label: "Dashboard" },
  ],
  Services: [
    { href: "/recommendations?tab=insurance", label: "Insurance" },
    { href: "/recommendations?tab=accessories", label: "Accessories" },
    { href: "/recommendations?tab=safety", label: "Safety Gear" },
    { href: "/recommendations?tab=service", label: "Service Centers" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "#", label: "Careers" },
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-5 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
                <Car className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-bold text-foreground">Make My Car</span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-xs">
              Helping car owners save time and money by recommending the best services near them. Your trusted automotive companion.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            2026 Make My Car. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
