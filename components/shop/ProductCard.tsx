"use client";

import Link from "next/link";
import { useState } from "react";
import { Product } from "./shop-data";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  isShopPage?: boolean;
}

export default function ProductCard({
  product,
  isShopPage = false,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(0);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity(1);
    addToCart(product, 1);
    toast.success(`Added ${product.title} to cart`);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity((prev) => {
      addToCart(product, 1);
      return prev + 1;
    });
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity === 1) {
      setQuantity(0);
      addToCart(product, -1);
    } else {
      setQuantity((prev) => {
        addToCart(product, -1);
        return prev - 1;
      });
    }
  };

  return (
    <Link href={`/shop/${product.id}`} className="block group h-full">
      <div className="relative bg-white rounded-xl overflow-hidden pb-4 border border-transparent hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 ease-out h-full flex flex-col">
        {/* Image Container - Floating Effect - Merged with Card & Rounded */}
        <div className="relative h-64 overflow-hidden bg-gray-50/50 group-hover:bg-purple-500/5 transition-colors duration-500 flex items-center justify-center w-full px-4 pt-4 pb-2">
          {/* Metallic Shimmer Effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

          {!product.image.includes("placeholder") ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              className={`object-contain p-2 drop-shadow-lg transition-all duration-500 relative z-0 ${
                isShopPage
                  ? "group-hover:-translate-y-3 group-hover:drop-shadow-2xl"
                  : ""
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 rounded-3xl">
              <span className="text-xs">No Image</span>
            </div>
          )}

          {/* Badges */}
          {product.isNew && (
            <div className="absolute top-2 left-4 bg-[var(--primary-orange)] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm z-30">
              NEW
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-5 pt-2 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-outfit font-bold text-gray-900 text-lg leading-tight line-clamp-2 min-h-[3.25rem] group-hover:text-[var(--primary-blue)] transition-colors">
              {product.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded-sm">
              {product.category}
            </span>
            <span className="text-xs font-medium text-gray-400">
              {product.scale}
            </span>
          </div>

          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                Price
              </span>
              <span className="text-xl font-bold text-gray-900">
                ${product.price.toFixed(0)}
                <span className="text-sm text-gray-500 font-medium">
                  .{product.price.toFixed(2).split(".")[1]}
                </span>
              </span>
            </div>

            <div
              className="flex items-center gap-3"
              onClick={(e) => e.preventDefault()}
            >
              {!product.inStock && (
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                  Out of Stock
                </span>
              )}
              {quantity === 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--primary-blue)] text-white shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover:rotate-90 duration-300"
                  disabled={!product.inStock}
                  title={product.inStock ? "Add to Cart" : "Out of Stock"}
                >
                  <Plus
                    className={`w-5 h-5 stroke-2 flex-shrink-0 transition-transform`}
                  />
                </button>
              ) : (
                <div
                  className="h-10 flex items-center bg-[var(--primary-blue)] rounded-full p-1 shadow-lg shadow-blue-200 min-w-[100px] justify-between animate-in fade-in zoom-in duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <button
                    onClick={handleDecrement}
                    className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  >
                    <Minus className="w-4 h-4 stroke-[2.5]" />
                  </button>
                  <span className="text-white font-outfit font-bold text-base w-6 text-center tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
