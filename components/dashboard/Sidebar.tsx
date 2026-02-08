"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Trello,
  ListTodo,
  BarChart3,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useUser, useClerk, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: number | null;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  {
    title: "GENERAL",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Boards", href: "/boards", icon: Trello },
      { name: "Tasks", href: "/tasks", icon: ListTodo },
    ],
  },
  {
    title: "TOOLS",
    items: [{ name: "Analytics", href: "/analytics", icon: BarChart3 }],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <Trello className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900">TaskFlow</span>
      </div>

      {/* Workspace Selector */}
      <div className="px-4 py-4">
        <button
          aria-label="Select workspace"
          className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-100 text-xs font-bold text-blue-600">
              W
            </div>
            <span>Workspace</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-2">
        {navigation.map((group) => (
          <div key={group.title} className="mb-6">
            <p className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-gray-500">
              {group.title}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(item.href));
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-blue-600" />
                      )}
                      <item.icon
                        className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-gray-400"}`}
                      />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3 mb-3">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-9 w-9",
              },
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.fullName || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
        <div className="border-t border-gray-100 my-2"></div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </aside>
  );
}
