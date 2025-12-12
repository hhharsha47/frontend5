"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, Phone } from "lucide-react";

// Actually I don't have shadcn components folder setup yet. I'll use raw tailwind for now to ensure it works then refactor if needed.

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Model Shop", href: "/shop" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
      {/* Top Row: Logo, Search, Actions */}
      <div className="container py-1 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="shrink-0 ml-24">
          <Image
            src="/file.svg"
            alt="Hobbyist Decals"
            width={240}
            height={85}
            className="h-20 w-auto object-contain"
            priority
          />
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl w-full mx-auto relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products, categories..."
              className="w-full h-10 pl-5 pr-12 rounded-full bg-gray-100 border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
            />
            <button className="absolute right-1 top-1 bottom-1 p-2 rounded-full text-gray-500 hover:text-primary hover:bg-white transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary hover:shadow-sm transition-all">
            <ShoppingCart className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary hover:shadow-sm transition-all">
            <Phone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Row: Navigation */}
      <div className="border-t border-gray-50">
        <div className="container py-2 overflow-x-auto no-scrollbar">
          <nav className="flex items-center justify-center gap-2 md:gap-4 w-full min-w-max">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                  link.name === "Home"
                    ? "bg-primary text-white border-primary shadow-sm hover:bg-primary/90"
                    : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary hover:bg-blue-50/50"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
