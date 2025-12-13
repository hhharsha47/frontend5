"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Hammer, Heart, Users, PenTool, Star } from "lucide-react";
import { useRef } from "react";

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <main ref={containerRef} className="bg-white">
      {/* 1. Cinematic Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex items-end pb-24">
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 z-0 will-change-transform"
        >
          <Image
            src="/about/hero.png"
            alt="SkyScale Studio Workshop"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/30" />
        </motion.div>

        <div className="container relative z-10 text-white px-4 md:px-0">
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            className="max-w-5xl will-change-transform"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="block text-primary-orange font-mono tracking-widest text-sm md:text-base mb-4 uppercase"
            ></motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-7xl md:text-9xl font-bold tracking-tighter leading-none"
            >
              CRAFTING
              <br />
              <span className="text-gray-400">REALITY</span>
            </motion.h1>
          </motion.div>
        </div>
      </section>

      {/* 2. Editorial Story Section */}
      <section className="relative py-32 bg-white overflow-hidden">
        <div className="container relative z-10">
          <div className="flex flex-col lg:flex-row gap-20 items-start">
            {/* Typography Column */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 pt-10"
            >
              <h2 className="text-4xl md:text-6xl font-serif font-medium text-gray-900 leading-tight mb-8">
                &quot;Precision isn&apos;t just a metric. It&apos;s a
                religion.&quot;
              </h2>
              <div className="space-y-6 text-lg text-gray-500 font-light leading-relaxed max-w-xl">
                <p>
                  We started SkyScale because we were tired of &quot;good
                  enough&quot;. The market was flooded with mass-produced
                  approximations. We wanted the grease stains, the rivet
                  patterns, the specific shade of burnt iron on an afterburner.
                </p>
                <p>
                  Our studio isn&apos;t a factory. It&apos;s an atelier. Every
                  model that leaves our bench has been touched by human hands,
                  inspected by obsessional eyes, and validated against
                  historical schematics.
                </p>
              </div>
            </motion.div>

            {/* Floating Image Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 relative"
            >
              <div className="relative aspect-4/5 w-full max-w-md ml-auto">
                <Image
                  src="/about/craftsman.png"
                  alt="Artisan at work"
                  fill
                  className="object-cover rounded-sm shadow-2xl"
                />
                {/* Decorative Elements */}
                <div className="absolute -bottom-12 -left-12 bg-gray-900 text-white p-8 max-w-xs shadow-xl hidden md:block">
                  <p className="font-mono text-xs text-gray-400 mb-2"></p>
                  <p className="font-bold text-lg">1:18 Scale Spitfire Mk.IX</p>
                  <div className="w-full bg-gray-800 h-1 mt-4">
                    <div className="bg-primary-orange h-full w-3/4" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Bento Grid Values & Stats */}
      <PhilosophySection />

      {/* 4. Team "Showcase" Section */}
      <section className="py-24 bg-gray-50">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Behind the Bench
              </h2>
              <p className="text-gray-500 max-w-md">
                The artists, engineers, and dreamers who make it happen.
              </p>
            </div>
            <Link
              href="/contact"
              className="hidden md:flex items-center gap-2 text-gray-900 font-bold border-b-2 border-primary-orange pb-1 hover:text-primary-orange transition-colors"
            >
              Join the Team <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="relative h-[60vh] min-h-[500px] w-full rounded-2xl overflow-hidden group">
            <Image
              src="/about/team_v3.png"
              alt="The SkyScale Team"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
            />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 to-transparent p-12">
              <h3 className="text-white text-2xl font-bold mb-2">
                The Atelier
              </h3>
              <p className="text-gray-300">
                Where passion meets precision. Master artisans, one shared
                vision.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-primary font-bold"
            >
              Join the Team <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function PhilosophySection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const springScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const y = useTransform(springScroll, [0, 1], ["-20%", "20%"]);

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-gray-950">
      {/* Texture Overlay */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100"></div>
      </div>

      {/* Parallax Background */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 z-0 opacity-50 will-change-transform"
      >
        <Image
          src="/about/hero.png"
          alt="Background Texture"
          fill
          className="object-cover grayscale brightness-75"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gray-950/60" />
      </motion.div>

      <div className="container relative z-10 text-white">
        <div className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1 rounded-full mb-6 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-mono text-indigo-200 uppercase tracking-widest">
              Our Philosophy
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-white"
          >
            Built Different.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-rows-2 gap-4 md:gap-6 h-auto md:h-[600px]">
          {/* Large Block - Precision */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 0.99 }}
            className="md:col-span-2 row-span-2 group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 md:p-12 hover:border-indigo-500/50 hover:bg-white/10 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 backdrop-blur-xl"
          >
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-20 transition-opacity duration-700 rotate-12 transform group-hover:scale-110 group-hover:rotate-6">
              <Hammer className="w-64 h-64" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                  <PenTool className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-indigo-200 transition-colors">
                  Forensic Detailing
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed max-w-md group-hover:text-gray-300 transition-colors">
                  We utilize 3D scanning and archival blueprints to ensure
                  mm-perfect accuracy. If the real tank had a weld line there,
                  our model has it too.
                </p>
              </div>
              <div className="mt-8 border-t border-white/10 pt-8 flex items-end gap-x-4">
                <div className="text-6xl font-bold text-white tracking-tighter">
                  5k+
                </div>
                <div className="pb-2 text-indigo-300 uppercase tracking-widest text-xs font-semibold">
                  Custom Parts Created
                </div>
              </div>
            </div>
          </motion.div>

          {/* Medium Block - Passion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 hover:border-indigo-500/50 hover:bg-white/10 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 backdrop-blur-xl flex flex-col justify-between"
          >
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
              <Heart className="w-6 h-6 text-indigo-400 group-hover:text-indigo-200" />
            </div>
            <div>
              <h4 className="text-xl font-bold mb-3 text-white">
                Soulful finishes
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Hand-weathering that tells a story. Not just factory paint, but
                history.
              </p>
            </div>
          </motion.div>

          {/* Medium Block - Community */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 hover:border-indigo-500/50 hover:bg-white/10 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 backdrop-blur-xl flex flex-col justify-between"
          >
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
              <Users className="w-6 h-6 text-blue-400 group-hover:text-blue-200" />
            </div>
            <div>
              <h4 className="text-xl font-bold mb-3 text-white">
                Builder Community
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                We support 50+ local clubs and host annual model meets.
              </p>
            </div>
          </motion.div>

          {/* Wide Block - Awards (Unified Style) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 0.99 }}
            className="md:col-span-2 group relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-indigo-900/40 to-black/40 p-8 hover:border-indigo-400/50 hover:from-indigo-900/60 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 backdrop-blur-xl flex items-center"
          >
            <div className="relative z-10 max-w-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Strictly Limited Runs
                </h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                We protect your investment by capping production. Once a series
                is retired, the molds are destroyed. You own a piece of finite
                history.
              </p>
            </div>
            {/* Decorative faint star */}
            <Star className="absolute right-[-20px] bottom-[-40px] w-48 h-48 text-white/5 rotate-12 group-hover:rotate-45 transition-transform duration-700 ease-out" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
