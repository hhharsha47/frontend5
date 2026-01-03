"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PenTool,
  Settings,
  LogOut,
  Package,
  Users,
  TrendingUp,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
    { name: "Transactions", href: "/admin/transactions", icon: CreditCard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Custom Designs", href: "/admin/custom-design", icon: PenTool },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white z-50 flex flex-col">
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800/50">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300 p-1">
              <Image
                src="/logo.jpeg"
                alt="SkyScale"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-white leading-none">
                SkyScale
              </span>
              <span className="text-[11px] font-medium text-slate-400 group-hover:text-indigo-400 transition-colors">
                Admin Dashboard
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile / Footer */}
        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-slate-400 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
