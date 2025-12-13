"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, count } = useCart();
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] bg-[#F8F9FB] flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Your cart is empty
        </h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Looks like you haven't added any models to your fleet yet. Explore our
          catalog to find your next project.
        </p>
        <Link
          href="/shop"
          className="px-8 py-3 bg-[var(--primary-blue)] text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-20 pt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-outfit font-bold text-gray-900 mb-8">
          Shopping Cart ({count} items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                key={item.product.id}
                className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6 group"
              >
                {/* Image */}
                <div className="relative w-full sm:w-32 h-32 bg-gray-50 rounded-2xl flex-shrink-0 flex items-center justify-center p-2">
                  <Image
                    src={item.product.image}
                    alt={item.product.title}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 w-full text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
                    <div>
                      <span className="text-xs font-bold text-[var(--primary-blue)] bg-blue-50 px-2 py-1 rounded-md mb-2 inline-block">
                        {item.product.category}
                      </span>
                      <h3 className="font-bold text-lg text-gray-900 leading-tight">
                        {item.product.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Scale: {item.product.scale}
                      </p>
                    </div>
                    <p className="hidden sm:block font-bold text-xl text-gray-900 mt-2 sm:mt-0">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between sm:justify-start gap-4 mt-4">
                    {/* Quantity Control */}
                    <div className="flex items-center bg-gray-50 rounded-xl border border-gray-100 h-10">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="w-10 h-full flex items-center justify-center hover:bg-white rounded-l-xl transition-colors text-gray-600 hover:text-red-500"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="w-10 h-full flex items-center justify-center hover:bg-white rounded-r-xl transition-colors text-gray-600 hover:text-green-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Mobile Price (shown here on small screens) */}
                    <p className="sm:hidden font-bold text-lg text-gray-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all ml-auto sm:ml-0"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium font-mono">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Estimate</span>
                  <span className="font-medium font-mono">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax Estimate</span>
                  <span className="font-medium font-mono">$0.00</span>
                </div>
                <div className="h-px bg-gray-100 my-4"></div>
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Order Total</span>
                  <span className="font-mono">${total.toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full h-14 bg-[var(--primary-blue)] text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-blue-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
                Checkout
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Secure Checkout
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
