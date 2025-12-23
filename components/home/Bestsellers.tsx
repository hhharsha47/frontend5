"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Heart,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { Product, products } from "@/components/shop/shop-data";

export default function Bestsellers() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  // IDs of bestsellers
  const bestSellerIds = ["101", "102", "103", "104", "105"];

  // Map for display tags that aren't in the main DB yet
  const tags: Record<string, string> = {
    "101": "Trending",
    "102": "Top Rated",
    "103": "Best Seller",
    "104": "Hot",
    "105": "Classic",
  };

  const bestsellerItems = products.filter((p) => bestSellerIds.includes(p.id));
  // create a large enough buffer for seamless infinite scroll
  const infiniteItems = [
    ...bestsellerItems,
    ...bestsellerItems,
    ...bestsellerItems,
    ...bestsellerItems,
  ];

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || isHovered) return;

    let animationFrameId: number;

    const scroll = () => {
      if (!scrollContainer) return;

      // If we've scrolled past the first set (approx), reset to 0 to loop seamlessly
      // We use a buffer. When scrollLeft is large enough, subtract chunk width.
      // But simple way: calculate width of one set.
      // Better: check if we are near end.
      // Simpler approach for "infinite":
      // Just keep incrementing. If max, reset.
      // To be seamless: When we reach the point where the 2nd set starts matching the 1st set's view, we jump back.
      // We have 4 sets.
      // If scrollLeft >= scrollWidth / 2, we can jump back to (scrollLeft - scrollWidth/2).
      // Or if scrollLeft >= scrollWidth / 4 (one set width), jump to 0?
      // No, jump to 0 might be jerky if not exact.
      // Let's rely on checking if we can reset.

      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += 0.5; // Low speed for elegance
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350; // Approx card width + gap
      const newScrollLeft =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation(); // Stop bubbling
    addToCart(product, 1);
    toast.success(`Added ${product.title} to cart`);
  };

  return (
    <section className="pt-4 pb-0 bg-gray-50/50">
      <div
        className="container relative group/section"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Bestsellers
            </h2>
            <p className="text-gray-500 max-w-md">
              Our most popular models, loved by collectors worldwide.
            </p>
          </div>
          <button className="text-primary font-semibold hover:text-primary-orange transition-colors flex items-center gap-2">
            View All Bestsellers <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Buttons - Tighter Positioning */}
        <div className="absolute top-[60%] -translate-y-1/2 left-0 z-30">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:text-primary hover:border-primary transition-all md:opacity-0 md:group-hover/section:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute top-[60%] -translate-y-1/2 right-0 z-30">
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:text-primary hover:border-primary transition-all md:opacity-0 md:group-hover/section:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative -mx-4 md:mx-0">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 px-4 md:px-0 pb-8 no-scrollbar snap-x snap-mandatory scroll-smooth"
          >
            {infiniteItems.map((product, index) => (
              <motion.div
                key={`${product.id}-${index}`}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: (index % bestsellerItems.length) * 0.1, // Stagger based on original length to avoid long delays
                  duration: 0.6,
                  ease: "easeOut",
                }}
                className="flex-none w-[280px] md:w-[320px] snap-center group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/30 transition-all duration-500 relative"
              >
                <Link href={`/shop/${product.id}`} className="block h-full">
                  <div className="relative aspect-[4/3] bg-gray-50 group-hover:bg-purple-500/5 transition-colors duration-500 overflow-hidden">
                    {/* Metallic Shimmer Effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

                    <span className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-orange shadow-sm">
                      {tags[product.id]}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <div className="relative w-full h-full">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-contain p-4"
                      />
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {product.category}
                      </p>
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                        {product.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-lg font-bold text-primary-dark">
                        ${product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
