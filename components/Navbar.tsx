"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, Phone } from "lucide-react";

// Actually I don't have shadcn components folder setup yet. I'll use raw tailwind for now to ensure it works then refactor if needed.

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Model Shop", href: "/shop" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
      <div className="container py-2 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/file.svg"
            alt="Hobbyist Decals"
            width={200}
            height={70}
            className="h-16 w-auto object-contain"
            priority
          />
        </Link>

        {/* Navigation Links - Centered */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? "text-primary font-semibold" : "text-gray-600"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Search + Actions */}
        <div className="flex items-center gap-3">
          {/* Compact Search Bar */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="w-48 lg:w-64 h-9 pl-4 pr-10 rounded-full bg-gray-100 border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
            />
            <button className="absolute right-1 top-1 bottom-1 p-1.5 rounded-full text-gray-500 hover:text-primary hover:bg-white transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>

          <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary hover:shadow-sm transition-all">
            <ShoppingCart className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary hover:shadow-sm transition-all">
            <Phone className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
