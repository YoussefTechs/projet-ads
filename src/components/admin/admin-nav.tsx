"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe2,
  Building2,
  Ticket,
  BedDouble,
  UtensilsCrossed,
  BookOpen,
  Newspaper,
  MessageSquare,
  Image as ImageIcon,
  Search,
  Users,
  Settings,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const contentItems = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/countries", label: "Pays", icon: Globe2 },
  { href: "/admin/cities", label: "Villes", icon: Building2 },
  { href: "/admin/activities", label: "Activités", icon: Ticket },
  { href: "/admin/hotels", label: "Hôtels", icon: BedDouble },
  { href: "/admin/restaurants", label: "Restaurants", icon: UtensilsCrossed },
  { href: "/admin/guides", label: "Guides", icon: BookOpen },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/moderation", label: "Modération", icon: MessageSquare },
  { href: "/admin/images", label: "Images", icon: ImageIcon },
  { href: "/admin/seo", label: "SEO", icon: Search },
];

const adminOnlyItems = [
  { href: "/admin/users", label: "Utilisateurs", icon: Users },
  { href: "/admin/settings", label: "Réglages", icon: Settings },
];

export function AdminNav({ role }: { role?: string }) {
  const pathname = usePathname();
  const items = role === "ADMIN" ? [...contentItems, ...adminOnlyItems] : contentItems;

  return (
    <nav className="space-y-0.5">
      {items.map((item) => {
        const active =
          "exact" in item && item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-brand-600 text-white" : "hover:bg-muted",
            )}
          >
            <item.icon size={17} /> {item.label}
          </Link>
        );
      })}
      <Link
        href="/"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
      >
        <ExternalLink size={17} /> Voir le site
      </Link>
    </nav>
  );
}
