"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Mecha & Robots",
    description: "High-grade articulated mobile suits.",
    image: "/hero-mech.png",
    count: "42 Models",
    color: "from-orange-500/80",
  },
  {
    id: 2,
    name: "Aviation",
    description: "Historic & modern aircraft replicas.",
    image: "/hero-plane.png",
    count: "65 Models",
    color: "from-blue-500/80",
  },
  {
    id: 3,
    name: "Sci-Fi Vehicles",
    description: "Futuristic racers and spaceships.",
    image: "/hero-scifi.png",
    count: "28 Models",
    color: "from-violet-500/80",
  },
  {
    id: 4,
    name: "Tools & Paints",
    description: "Everything you need to build.",
    image: "/tools-paints.png", // Reusing mech for now as a placeholder
    count: "150+ Items",
    color: "from-emerald-500/80",
  },
];

export default function Categories() {
  return (
    <section className="py-8 bg-white">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-gray-500 max-w-lg text-lg">
              Explore our diverse collection organized by theme and type. Find
              exactly what you need for your next build.
            </p>
          </div>
          <button className="text-primary font-bold text-lg hover:text-primary-orange transition-colors flex items-center gap-2 group">
            View Full Catalog{" "}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <Link href="#" className="absolute inset-0 z-20">
                <span className="sr-only">View {cat.name}</span>
              </Link>

              {/* Image Background */}
              <div className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-110">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${cat.color} via-black/40 to-black/10 opacity-80 group-hover:opacity-90 transition-opacity duration-300`}
              />

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white z-10">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-block px-3 py-1 mb-3 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium border border-white/30">
                    {cat.count}
                  </span>
                  <h3 className="text-2xl font-bold mb-2">{cat.name}</h3>
                  <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                    {cat.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
