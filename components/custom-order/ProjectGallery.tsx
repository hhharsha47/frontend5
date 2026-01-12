"use client";

import { useEffect, useState } from "react";
import { getProjectGallery, GalleryImage } from "@/app/actions/custom-order";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectGalleryProps {
  orderId: string;
}

export default function ProjectGallery({ orderId }: ProjectGalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const imgs = await getProjectGallery(orderId);
        setImages(imgs || []);
      } catch (e) {
        console.error("Failed to load gallery", e);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-slate-50 rounded-xl border border-slate-100">
        <Loader2 className="w-6 h-6 text-slate-300 animate-spin" />
      </div>
    );
  }

  if (images.length === 0) {
    return null; // Don't show anything if no images (keeps UI clean)
  }

  return (
    <div className="border-t border-slate-100 pt-8 mb-8">
      <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
        Production Updates
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img, idx) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative aspect-square bg-slate-100 rounded-xl overflow-hidden cursor-zoom-in border border-slate-200"
            onClick={() => window.open(img.url, "_blank")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.caption}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <p className="text-white text-xs font-medium truncate w-full">
                {img.caption}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
