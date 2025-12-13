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
}

export default function ProductCard({ product }: ProductCardProps) {
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
    <Link href={`/shop/${product.id}`} className="block group">
      <div className="relative bg-white rounded-[2.5rem] overflow-visible pb-4 border border-transparent hover:border-blue-50 hover:shadow-2xl hover:shadow-[var(--primary-blue)]/20 hover:-translate-y-2 transition-all duration-500 ease-out">
        {/* Image Container - Floating Effect - Merged with Card & Rounded */}
        <div className="relative h-72 -mt-12 mb-4 overflow-hidden bg-white rounded-t-[2.5rem] group-hover:scale-105 transition-all duration-500 flex items-center justify-center z-10 w-full px-2">
          {!product.image.includes("placeholder") ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain p-2 drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
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
        <div className="px-6 pt-2">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-outfit font-bold text-gray-900 text-lg leading-tight line-clamp-2 min-h-[3rem]">
              {product.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {product.category}
            </span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="text-xs font-medium text-gray-500">
              {product.scale}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-medium ml-0.5">
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
                  className={`w-12 h-12 flex items-center justify-center rounded-full bg-[var(--primary-blue)] text-white shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    quantity === 0 ? "group-hover:rotate-90" : ""
                  }`}
                  disabled={!product.inStock}
                  title={product.inStock ? "Add to Cart" : "Out of Stock"}
                >
                  <Plus className="w-6 h-6 stroke-2" />
                </button>
              ) : (
                <div
                  className="h-12 flex items-center bg-[var(--primary-blue)] rounded-full p-1 shadow-lg shadow-blue-200 min-w-[110px] justify-between animate-in fade-in zoom-in duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <button
                    onClick={handleDecrement}
                    className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  >
                    <Minus className="w-5 h-5 stroke-[2.5]" />
                  </button>
                  <span className="text-white font-outfit font-bold text-lg w-6 text-center tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  >
                    <Plus className="w-5 h-5 stroke-[2.5]" />
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
