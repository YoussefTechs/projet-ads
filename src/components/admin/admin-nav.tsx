"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MapPin,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/contenus", label: "Contenus", icon: FileText },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin },
  { href: "/admin/moderation", label: "Modération", icon: MessageSquare },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-brand-600 text-white" : "hover:bg-muted",
            )}
          >
            <item.icon size={18} /> {item.label}
          </Link>
        );
      })}
      <Link
        href="/"
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
      >
        <ExternalLink size={18} /> Voir le site
      </Link>
    </nav>
  );
}
