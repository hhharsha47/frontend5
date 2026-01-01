"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { products, Product } from "@/components/shop/shop-data";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Share2,
  Heart,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/context/CartContext";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const { addToCart } = useCart();

  useEffect(() => {
    if (params.id) {
      const foundProduct = products.find((p) => p.id === params.id);
      if (foundProduct) {
        setProduct(foundProduct);
        setActiveImage(foundProduct.image);
      } else {
        router.push("/shop");
      }
    }
  }, [params.id, router]);

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
        Loading...
      </div>
    );

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`Added ${quantity} x ${product.title} to cart`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] selection:bg-[var(--primary-blue)] selection:text-white pb-20">
      {/* Blueprint Background Overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "url('/images/blueprint_background_1765622394131.png')",
          backgroundSize: "cover",
        }}
      ></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-8">
        {/* Breadcrumb / Back */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link
            href="/shop"
            className="group flex items-center gap-2 text-gray-500 hover:text-[var(--primary-blue)] transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-medium">Back to Shop</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Interactive Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            {/* Main Image Stage - Transparent/Merged */}
            <div className="relative aspect-[4/3] w-full flex items-center justify-center overflow-visible z-10">
              {/* Floating element decoration */}
              <div className="absolute top-0 right-0 block z-20">
                {product.isNew && (
                  <span className="bg-[var(--primary-orange)] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-orange-500/20">
                    NEW RELEASE
                  </span>
                )}
              </div>

              <motion.div
                key={activeImage}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="relative w-full h-full"
              >
                <Image
                  src={activeImage || product.image}
                  alt={product.title}
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </motion.div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
              {[product.image, product.image, product.image].map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-24 h-24 flex-shrink-0 bg-white/50 backdrop-blur-sm rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                    activeImage === img && idx === 0
                      ? "border-[var(--primary-blue)] shadow-lg scale-105 opacity-100"
                      : "border-transparent hover:border-blue-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt="Thumbnail"
                    fill
                    className="object-cover p-2"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right: Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col pt-4"
          >
            <div className="mb-2 flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-50 text-[var(--primary-blue)] text-xs font-bold rounded-lg uppercase tracking-wider">
                {product.category}
              </span>
              <div className="flex items-center text-yellow-400 gap-1">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-gray-900 text-sm font-bold">4.9</span>
                <span className="text-gray-400 text-sm font-medium">
                  (128 reviews)
                </span>
              </div>
            </div>

            <h1 className="text-4xl lg:text-5xl font-outfit font-bold text-gray-900 leading-tight mb-4">
              {product.title}
            </h1>

            <div className="flex items-end gap-4 mb-8">
              <span className="text-5xl font-bold text-[var(--primary-blue)]">
                ${product.price.toFixed(0)}
                <span className="text-2xl text-[var(--primary-blue)]/60">
                  .{product.price.toFixed(2).split(".")[1]}
                </span>
              </span>
              {product.inStock ? (
                <span className="mb-2 flex items-center gap-1 text-green-600 text-sm font-bold bg-green-50 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  IN STOCK
                </span>
              ) : (
                <span className="mb-2 flex items-center gap-1 text-red-500 text-sm font-bold bg-red-50 px-3 py-1 rounded-full">
                  OUT OF STOCK
                </span>
              )}
            </div>

            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              Experience the pinnacle of scale modeling with this ultra-detailed
              replica. Precision-engineered parts ensuring a museum-quality
              finish. Perfect for enthusiasts demanding accuracy and style.
            </p>

            {/* Scale Info Card */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[var(--primary-blue)]">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">
                    Scale
                  </p>
                  <p className="font-outfit font-bold text-gray-900">
                    {product.scale}
                  </p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[var(--primary-blue)]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">
                    Level
                  </p>
                  <p className="font-outfit font-bold text-gray-900">Expert</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mb-8">
              {/* Qty & Add */}
              <div className="flex items-center p-2 bg-white rounded-[2.5rem] shadow-lg shadow-gray-100 border border-gray-100">
                <div className="flex items-center gap-4 px-2">
                  <button
                    onClick={handleDecrement}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-8 text-center font-bold text-xl">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 h-14 bg-[var(--primary-blue)] rounded-[2rem] text-white font-bold text-lg hover:shadow-xl hover:shadow-blue-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ml-4"
                >
                  {product.inStock ? "Add to Cart" : "Unavailable"}
                </button>
              </div>

              {/* Secondary Actions */}
              <div className="flex items-center gap-4 px-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex-1 h-12 rounded-2xl flex items-center justify-center gap-2 font-bold transition-colors ${
                    isLiked
                      ? "text-red-500 bg-red-50"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                  />
                  {isLiked ? "Saved" : "Save for Later"}
                </button>
                <button className="flex-1 h-12 rounded-2xl text-gray-500 flex items-center justify-center gap-2 font-bold hover:bg-gray-100 transition-colors">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Truck className="w-5 h-5 text-[var(--primary-blue)]" />
                <span className="font-medium">
                  Free shipping on orders over $100
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <ShieldCheck className="w-5 h-5 text-[var(--primary-blue)]" />
                <span className="font-medium">30-day money-back guarantee</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
