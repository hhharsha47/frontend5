"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  ShoppingCart,
  Heart,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRef } from "react";

const bestsellers = [
  {
    id: 101,
    name: "T-800 Endoskeleton Bust",
    category: "Sci-Fi",
    price: "$249.99",
    image: "/bestseller-t800.png",
    tag: "Trending",
  },
  {
    id: 102,
    name: "F-14 Tomcat 'Maverick'",
    category: "Aviation",
    price: "$99.99",
    image: "/bestseller-f14.png",
    tag: "Top Rated",
  },
  {
    id: 103,
    name: "Atlas Titan Model",
    category: "Mecha",
    price: "$189.99",
    image: "/bestseller-titan.png",
    tag: "Best Seller",
  },
  {
    id: 104,
    name: "Cyberpunk Racer 2077",
    category: "Vehicles",
    price: "$79.99",
    image: "/bestseller-cyberpunk.png",
    tag: "Hot",
  },
  {
    id: 105,
    name: "Spitfire Mk. IX",
    category: "Aviation",
    price: "$85.00",
    image: "/bestseller-spitfire.png",
    tag: "Classic",
  },
];

export default function Bestsellers() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  return (
    <section className="pt-10 pb-0 bg-gray-50/50">
      <div className="container relative group/section">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
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

        {/* Navigation Buttons */}
        <div className="absolute top-[60%] -translate-y-1/2 left-4 md:-left-4 z-20">
          <button
            onClick={() => scroll("left")}
            className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:text-primary hover:border-primary transition-all md:opacity-0 md:group-hover/section:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="absolute top-[60%] -translate-y-1/2 right-4 md:-right-4 z-20">
          <button
            onClick={() => scroll("right")}
            className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:text-primary hover:border-primary transition-all md:opacity-0 md:group-hover/section:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative -mx-4 md:mx-0">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 px-4 md:px-0 pb-8 no-scrollbar snap-x snap-mandatory scroll-smooth"
          >
            {bestsellers.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex-none w-[280px] md:w-[320px] snap-center group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                  <span className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-orange shadow-sm">
                    {product.tag}
                  </span>
                  <button className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300">
                    <Heart className="w-4 h-4" />
                  </button>
                  <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover" // Changed to cover to fill the frame properly
                    />
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {product.category}
                    </p>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-bold text-primary-dark">
                      {product.price}
                    </span>
                    <button className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
