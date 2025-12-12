"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  ArrowRight,
  Github,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white pt-10 pb-6 border-t border-slate-900">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand Column */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold tracking-tight">SKYSCALE</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Premium 3D scale models for collectors and hobbyists. Precision
              engineering meets artistic craftsmanship.
            </p>
            <div className="flex items-center gap-4">
              <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Instagram className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Facebook className="w-5 h-5" />} />
              <SocialLink href="#" icon={<Github className="w-5 h-5" />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6 text-slate-200">Shop</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li>
                <FooterLink href="#">Latest Arrivals</FooterLink>
              </li>
              <li>
                <FooterLink href="#">Bestsellers</FooterLink>
              </li>
              <li>
                <FooterLink href="#">Pre-orders</FooterLink>
              </li>
              <li>
                <FooterLink href="#">Gift Cards</FooterLink>
              </li>
              <li>
                <FooterLink href="#">Sale</FooterLink>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-6 text-slate-200">Support</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li>
                <FooterLink href="#">Help Center</FooterLink>
              </li>
              <li>
                <FooterLink href="#">Shipping & Returns</FooterLink>
              </li>
              <li>
                <FooterLink href="#">Order Tracking</FooterLink>
              </li>
              <li>
                <FooterLink href="#">Size Guide</FooterLink>
              </li>
              <li>
                <FooterLink href="#">Contact Us</FooterLink>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-6 text-slate-200">Stay Updated</h4>
            <p className="text-slate-400 text-sm mb-4">
              Subscribe to get special offers, free giveaways, and
              once-in-a-lifetime deals.
            </p>
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 bg-white text-slate-950 p-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} SkyScale Models. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <Link href="#" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="hover:text-white transition-colors duration-200 block w-fit"
    >
      {children}
    </Link>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-950 transition-all duration-300"
    >
      {icon}
    </a>
  );
}
