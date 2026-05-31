import Link from 'next/link'
import { Ship, LayoutDashboard, KanbanSquare, Users, CalendarClock } from 'lucide-react'

export const metadata = { title: 'CRM — WeltBridge International' }

const navItems = [
  { href: '/crm', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/crm/pipeline', label: 'Pipeline', icon: KanbanSquare },
  { href: '/crm/leads', label: 'Contacts', icon: Users },
  { href: '/crm/activities', label: 'Activities', icon: CalendarClock },
]

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href="/crm" className="flex items-center gap-2 font-semibold">
            <Ship className="h-5 w-5 text-primary" />
            <span>WeltBridge International CRM</span>
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to site
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-6">{children}</main>
    </div>
  )
}
