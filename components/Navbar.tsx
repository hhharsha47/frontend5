"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, Phone } from "lucide-react";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Model Shop", href: "/shop" },
  { name: "Custom Model", href: "/custom-model" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
      <div className="container py-4 flex items-center justify-between gap-4">
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
              className="w-64 lg:w-80 h-11 pl-5 pr-12 rounded-full bg-gray-100 border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
            />
            <button className="absolute right-1 top-1 bottom-1 p-1.5 rounded-full text-gray-500 hover:text-primary hover:bg-white transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/cart"
            className="relative w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary hover:shadow-sm transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm animate-in zoom-in duration-300">
                {count}
              </span>
            )}
          </Link>
          <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary hover:shadow-sm transition-all">
            <Phone className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
