"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingCart, Heart } from "lucide-react";

const products = [
  {
    id: 1,
    name: "XV-9 Heavy Assault Mech",
    category: "Mecha",
    price: "$129.99",
    image: "/latest-mech.png",
    tag: "New Arrival",
  },
  {
    id: 2,
    name: "P-51 Mustang 'Old Crow'",
    category: "Aviation",
    price: "$89.99",
    image: "/latest-p51.png",
    tag: "Best Seller",
  },
  {
    id: 3,
    name: "Aurora GP-X Racer",
    category: "Sci-Fi Vehicles",
    price: "$149.99",
    image: "/latest-racer.png",
    tag: "Limited Edition",
  },
];

export default function LatestModels() {
  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Latest Arrivals
            </h2>
            <p className="text-gray-500 max-w-md">
              Fresh from the workshop. Explore our newest additions to the
              catalog.
            </p>
          </div>
          <button className="text-primary font-semibold hover:text-primary-orange transition-colors flex items-center gap-2">
            View All Models <span aria-hidden="true">&rarr;</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative aspect-[4/3] bg-gray-50 p-6 overflow-hidden">
                <span className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-dark shadow-sm">
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
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-primary-orange">
                    {product.category}
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <span className="text-xl font-bold text-gray-900">
                    {product.price}
                  </span>
                  <button className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
