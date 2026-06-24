"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Heart, LayoutDashboard, LogOut, MessageSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/compte", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/compte/favoris", label: "Mes favoris", icon: Heart },
  { href: "/compte/commentaires", label: "Mes commentaires", icon: MessageSquare },
  { href: "/compte/parametres", label: "Paramètres", icon: Settings },
];

export function AccountNav() {
  const pathname = usePathname();
  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const active = pathname === item.href;
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
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
      >
        <LogOut size={18} /> Se déconnecter
      </button>
    </nav>
  );
}
