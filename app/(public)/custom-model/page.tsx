"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  MessageCircle,
  Play,
  ClipboardList,
  PenTool,
  Truck,
  Sparkles,
  ChevronRight,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CustomModelPage() {
  return (
    <main className="relative min-h-screen py-24 px-6 overflow-hidden bg-slate-50 selection:bg-indigo-500/30 selection:text-indigo-900 font-sans">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-violet-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="container max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <header className="text-center mb-24 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-100 shadow-sm text-indigo-600 text-[11px] font-bold tracking-widest uppercase mb-8 hover:transform hover:scale-105 transition-transform cursor-default">
              <Sparkles className="w-3 h-3 fill-indigo-600" />
              Custom Commission Service
            </span>
            <h1 className="text-5xl md:text-7xl font-sans font-bold tracking-tight text-slate-900 mb-8 leading-[1.1]">
              Your Vision. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 animate-gradient-x bg-[length:200%_auto]">
                Masterfully Engineered.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-light max-w-2xl mx-auto">
              From concept to display case, we build museum-grade replicas
              tailored to your exact specifications.
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          {/* Left Column: Process Timeline */}
          <div className="lg:col-span-7 relative">
            {/* Timeline Line */}
            <div className="absolute left-[27px] top-4 bottom-12 w-0.5 bg-gradient-to-b from-indigo-200 via-slate-200 to-transparent hidden md:block" />

            <div className="space-y-16 relative">
              <StepItem
                number="01"
                title="Initiate Request"
                description="Start a chat with our AI concierge. Tell us the model type (Aircraft, Armor, Ship), scale, and specific details like 'Battle of Midway' weathering."
                icon={<MessageCircle className="w-6 h-6" />}
                action={
                  <Link href="/chatbot" className="inline-flex">
                    <button className="group relative inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-semibold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all hover:-translate-y-0.5">
                      Start Chat
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </Link>
                }
              />

              <StepItem
                number="02"
                title="Feasibility & Quote"
                description="Our team reviews your specs. Within 24 hours, you'll receive a detailed proposal including estimated production time and a transparent price breakdown with no hidden fees."
                icon={<ClipboardList className="w-6 h-6" />}
              />

              <StepItem
                number="03"
                title="Precision Production"
                description="Once approved, master modelers begin. We combine industrial 3D printing for structural accuracy with artisanal hand-painting and weathering for hyper-realism."
                icon={<PenTool className="w-6 h-6" />}
              />

              <StepItem
                number="04"
                title="Secure Delivery"
                description="Your model is packed in custom-cut high-density foam and shipped via insured courier. Unbox your masterpiece ready for immediate display."
                icon={<Truck className="w-6 h-6" />}
              />
            </div>
          </div>

          {/* Right Column: Interaction & Video */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-10">
            {/* Video Player */}
            <VideoPlayer />

            {/* Trust Indicators */}
            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/50 shadow-xl shadow-slate-200/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden"
                    >
                      <UserIcon className="w-full h-full text-slate-400 p-2" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex text-yellow-500 text-xs mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Sparkles key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                    Trusted by 500+ collectors
                  </p>
                </div>
              </div>
              <p className="text-slate-600 italic text-sm leading-relaxed border-l-2 border-indigo-200 pl-4">
                &quot;The attention to detail on my custom F-14 was insane. They
                even got the squadron markings perfect based on a photo I
                sent.&quot;
              </p>
              <p className="text-xs font-bold text-slate-900 mt-4 pl-4 uppercase tracking-wider">
                — Alex R., Verified Buyer
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// --- Components ---

function StepItem({
  number,
  title,
  description,
  icon,
  action,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative pl-0 md:pl-20 group"
    >
      {/* Timeline Node (Desktop) */}
      <div className="hidden md:flex absolute left-0 top-0 w-14 h-14 rounded-2xl bg-white border border-indigo-50 shadow-lg shadow-indigo-500/10 items-center justify-center z-10 transition-all duration-500 group-hover:scale-110 group-hover:shadow-indigo-500/20 group-hover:border-indigo-200">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 rounded-2xl" />
        <div className="text-indigo-600 group-hover:text-violet-600 transition-colors">
          {icon}
        </div>
      </div>

      {/* Card Content */}
      <div className="relative bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(79,70,229,0.08)] transition-all duration-300 hover:-translate-y-1">
        {/* Background Number Watermark */}
        <span className="absolute right-6 top-6 text-6xl font-black text-slate-100/80 pointer-events-none select-none tracking-tighter">
          {number}
        </span>

        {/* Mobile Icon */}
        <div className="md:hidden w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
          {icon}
        </div>

        <h3 className="text-2xl font-bold text-slate-900 mb-3 relative z-10">
          {title}
        </h3>
        <p className="text-slate-600 leading-relaxed font-medium text-base mb-6 relative z-10 max-w-lg">
          {description}
        </p>

        {action && <div className="relative z-10 pt-2">{action}</div>}
      </div>
    </motion.div>
  );
}

function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      videoRef.current.muted = false;
      setIsPlaying(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="relative aspect-[4/5] bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-900/20 ring-1 ring-slate-900/5 group"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-all duration-700",
          isPlaying
            ? "scale-100 opacity-100"
            : "scale-105 opacity-60 group-hover:scale-100 group-hover:opacity-80"
        )}
        src="https://videos.pexels.com/video-files/7289556/7289556-hd_1920_1080_30fps.mp4"
        loop={!isPlaying} // Loop when in preview mode
        muted={!isPlaying}
        autoPlay={!isPlaying}
        playsInline
        controls={isPlaying}
      />

      {/* Overlay - Only visible when NOT playing */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col justify-end p-8 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent cursor-pointer"
            onClick={handlePlay}
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-2xl shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                <div className="w-16 h-16 rounded-full bg-white text-indigo-600 flex items-center justify-center pl-1 shadow-lg">
                  <Play className="w-6 h-6 fill-current" />
                </div>
              </div>
            </div>

            <div className="relative z-30 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 backdrop-blur-md text-indigo-400 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">
                <Play className="w-3 h-3 fill-current" />
                Watch Process
              </span>
              <h3 className="text-white font-bold text-3xl mb-2 tracking-tight">
                Craftsmanship
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed max-w-xs font-medium">
                See how to transform high-fidelity 3D prints into museum-quality
                display pieces.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Simple generic user icon placeholder
function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}
