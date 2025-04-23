"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { LayoutDashboard, Briefcase, Github, BarChart, Settings, Users, FileSearch } from "lucide-react"

export function DashboardNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  const talentNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Projects",
      href: "/dashboard/projects",
      icon: Github,
    },
    {
      title: "Job Matches",
      href: "/dashboard/matches",
      icon: BarChart,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  const companyNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Job Listings",
      href: "/dashboard/jobs",
      icon: Briefcase,
    },
    {
      title: "Talent Matches",
      href: "/dashboard/matches",
      icon: Users,
    },
    {
      title: "Job Scraper",
      href: "/dashboard/scraper",
      icon: FileSearch,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  const navItems = user?.role === "talent" ? talentNavItems : companyNavItems

  return (
    <nav className="hidden w-64 flex-col border-r bg-muted/40 md:flex">
      <div className="flex flex-col gap-2 p-4">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn("justify-start")}
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  )
}
