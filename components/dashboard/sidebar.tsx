"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Gift,
  CalendarX,
  Settings,
  Receipt,
  FileText,
  Palette,
  Utensils,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Vue d'ensemble",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Bons cadeaux",
    href: "/dashboard/gift-cards",
    icon: Gift,
  },
  {
    title: "Validation",
    href: "/dashboard/validation",
    icon: Receipt,
  },
  {
    title: "Périodes d'exclusion",
    href: "/dashboard/exclusion-periods",
    icon: CalendarX,
  },
  {
    title: "Types de menus",
    href: "/dashboard/menu-types",
    icon: Utensils,
  },
  {
    title: "Prévisualisation PDF",
    href: "/dashboard/pdf-preview",
    icon: FileText,
  },
  {
    title: "Templates PDF",
    href: "/dashboard/pdf-templates",
    icon: Palette,
  },
  {
    title: "Paramètres",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Gift className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Influences</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
