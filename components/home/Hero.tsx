"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/hero-mech.png",
    title: "Titan Class",
    highlight: "Mecha Warfare",
    description:
      "Dominate the battlefield with high-detail articulated suits. Precision engineered for the ultimate collector.",
    color: "#ff8c42", // Orange
  },
  {
    id: 2,
    image: "/hero-plane.png",
    title: "Legends of",
    highlight: "Aviation History",
    description:
      "Relive the golden age of flight with museum-grade WW2 fighter replicas. Every rivet captured in perfect scale.",
    color: "#3b82f6", // Blue
  },
  {
    id: 3,
    image: "/hero-scifi.png",
    title: "Speed of",
    highlight: "The Future",
    description:
      "Aerodynamic perfection from 2150. Sleek, futuristic vehicle concepts brought to life.",
    color: "#8b5cf6", // Violet
  },
  {
    id: 4,
    image: "/hero-urban-mech.png",
    title: "Urban Defense",
    highlight: "Tactical Units",
    description:
      "Specialized crowd control and defense units. Rugged, durable, and ready for any diorama setup.",
    color: "#10b981", // Emerald
  },
  {
    id: 5,
    image: "/hero-stealth.png",
    title: "Stealth Ops",
    highlight: "Night Fighters",
    description:
      "Ghost through the radar with our advanced stealth aircraft collection. Includes limited edition black-ops variants.",
    color: "#6366f1", // Indigo
  },
  {
    id: 6,
    image: "/hero-desert.png",
    title: "Desert Storm",
    highlight: "Air Superiority",
    description:
      "Dominate the skies with camouflage patterns designed for maximum stealth in arid environments.",
    color: "#eab308", // Yellow
  },
  {
    id: 7,
    image: "/hero-tank.png",
    title: "Armored Fury",
    highlight: "The Iron Beast",
    description:
      "1/35 scale main battle tank with weathered armor and realistic mud effects.",
    color: "#65a30d", // Green
  },
  {
    id: 8,
    image: "/hero-f1.png",
    title: "Velocity",
    highlight: "Grand Prix",
    description:
      "Precision-engineered F1 racer model. Carbon fiber detailing and aerodynamic perfection.",
    color: "#ef4444", // Red
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
        setIsAutoPlaying(false);
      } else if (e.key === "ArrowRight") {
        nextSlide();
        setIsAutoPlaying(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide]);

  return (
    <section
      className="relative w-full h-[calc(100vh-160px)] min-h-[600px] flex items-center justify-center overflow-hidden bg-black group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      aria-roledescription="carousel"
    >
      {/* Background Carousel */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={slides[current].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0 }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={slides[current].image}
            alt={slides[current].highlight}
            fill
            className="object-cover object-center opacity-90"
            priority
          />
          {/* Constant Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 text-white/50 hover:bg-black/50 hover:text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden md:block"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 text-white/50 hover:bg-black/50 hover:text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden md:block"
        aria-label="Next slide"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      <div className="container relative z-20 text-center px-4 mt-auto pb-20">
        {/* Main Content - Text Keyed to Slide */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[current].id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto space-y-4 md:space-y-6"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight drop-shadow-lg">
              {slides[current].title} <br />
              <span
                style={{ color: slides[current].color }}
                className="drop-shadow-md"
              >
                {slides[current].highlight}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
              {slides[current].description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators - Animated */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 items-center h-4 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className="relative py-2 focus:outline-none group"
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === current ? (
                <motion.div
                  layoutId="active-indicator"
                  className="w-12 h-1.5 rounded-full"
                  style={{ backgroundColor: slides[current].color }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              ) : (
                <div className="w-2 h-2 rounded-full bg-white/40 group-hover:bg-white/70 transition-colors" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
