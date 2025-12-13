"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";
import {
  ArrowRight,
  Upload,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  ChevronRight,
} from "lucide-react";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  quantity: number;
  message: string;
};

export default function CustomModelPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log(data);
    toast.success("Request received!", {
      description: "Our team is reviewing your specifications.",
      className: "bg-white border-indigo-100 text-indigo-900",
    });
    setIsSubmitting(false);
    reset();
  };

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* 1. Cinematic Hero with Overlay */}
      <section className="relative h-[50vh] min-h-[500px] w-full overflow-hidden flex items-end">
        <Image
          src="/custom-model-hero.png"
          alt="Custom Model Workshop"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/50 to-transparent" />

        <div className="container relative z-10 pb-20 px-4 md:px-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/10 border border-indigo-600/20 text-indigo-700 text-xs font-bold tracking-wider uppercase mb-6 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              Custom Commission
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
              Engineered to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                Perfection.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed font-light">
              We translate your vision into a physical masterpiece. Archival
              accuracy, museum-grade materials, and obsessive detailing.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container pb-32 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Context & Value Props (4 cols) */}
          <div className="lg:col-span-4 space-y-10 lg:sticky lg:top-32">
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                Signature Customizations
              </h3>
              <div className="space-y-6">
                <ServiceItem
                  icon={<Zap className="w-4 h-4 text-indigo-600" />}
                  title="Lighting Integration"
                  desc="Fiber optic cockpit displays & engine glow."
                />
                <ServiceItem
                  icon={<ShieldCheck className="w-4 h-4 text-indigo-600" />}
                  title="Weathering Effects"
                  desc="From factory fresh to combat-hardened patina."
                />
                <ServiceItem
                  icon={<Clock className="w-4 h-4 text-indigo-600" />}
                  title="Internal Cutaways"
                  desc="Reveal engine blocks and interior bulkheads."
                />
                <ServiceItem
                  icon={<CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                  title="Diorama Bases"
                  desc="Custom terrain matching the vehicle's history."
                />
              </div>
            </div>

            <div className="bg-indigo-900 text-white p-8 rounded-2xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Zap
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="font-medium italic text-indigo-100 mb-6 leading-relaxed">
                  "SkyScale recreated my grandfather's P-51D down to the
                  specific nose art. It brought tears to his eyes."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center font-bold text-xs">
                    MK
                  </div>
                  <p className="text-xs font-bold tracking-widest uppercase text-indigo-300">
                    Michael K., Private Client
                  </p>
                </div>
              </div>
              {/* Decorative background circle */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-800 rounded-full blur-3xl opacity-50" />
            </div>
          </div>

          {/* Right Column: The Form (8 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-8"
          >
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-indigo-900/5 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />

              <div className="flex items-end justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    Commission Request
                  </h2>
                  <p className="text-slate-500">
                    Share your vision. We'll handle the engineering.
                  </p>
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Response Time
                  </p>
                  <p className="text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-full text-sm inline-block">
                    Within 24 Hours
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Personal Details">
                    <input
                      {...register("firstName", { required: true })}
                      placeholder="First Name"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                    />
                    <input
                      {...register("lastName", { required: true })}
                      placeholder="Last Name"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium mt-3"
                    />
                  </InputGroup>

                  <InputGroup label="Contact Info">
                    <input
                      {...register("email", { required: true })}
                      placeholder="Email Address"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                    />
                    <input
                      {...register("phone")}
                      placeholder="Phone Number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium mt-3"
                    />
                  </InputGroup>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                    Project Vision
                  </label>
                  <input
                    {...register("subject", { required: true })}
                    placeholder="What are we building? (e.g. 1:18 Scale F-14 Tomcat)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                    Specifications
                  </label>
                  <textarea
                    {...register("message", { required: true })}
                    rows={6}
                    placeholder="Describe the details: Specific historical era, weathering level (factory fresh vs. combat worn), mounting preferences..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium resize-none leading-relaxed"
                  />
                </div>

                <div className="border border-dashed border-indigo-200 bg-indigo-50/30 rounded-2xl p-8 flex items-center justify-between gap-6 cursor-pointer hover:bg-indigo-50/60 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform text-indigo-500">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        Reference Materials
                      </p>
                      <p className="text-sm text-slate-500">
                        Upload photos or diagrams
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-white px-3 py-1 rounded-full text-indigo-600 shadow-sm">
                    Optional
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:translate-y-[-2px] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Submit Commission <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

// Subcomponents
// Subcomponents
function ServiceItem({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4 items-start group">
      <div className="shrink-0 w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mt-0.5 group-hover:bg-indigo-100 transition-colors">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-slate-900 text-sm mb-0.5 group-hover:text-indigo-700 transition-colors">
          {title}
        </h4>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          {desc}
        </p>
      </div>
    </div>
  );
}

function InputGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
        {label}
      </label>
      {children}
    </div>
  );
}
