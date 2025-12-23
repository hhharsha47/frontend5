"use client";

import { useState, useMemo } from "react";
import FilterSidebar from "@/components/shop/FilterSidebar";
import ProductGrid from "@/components/shop/ProductGrid";
import { Search, SlidersHorizontal } from "lucide-react";
import { products as initialProducts } from "@/components/shop/shop-data";
import { motion } from "framer-motion";

export default function ShopPage() {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "All",
  ]);
  const [selectedScales, setSelectedScales] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isNewOnly, setIsNewOnly] = useState(false);
  const [sortOption, setSortOption] = useState("popular");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        // Search Filter
        const matchesSearch =
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase());

        // Category Filter
        const matchesCategory =
          selectedCategories.includes("All") ||
          selectedCategories.includes(product.category);

        // Scale Filter
        const matchesScale =
          selectedScales.length === 0 || selectedScales.includes(product.scale);

        // Price Filter
        const matchesPrice =
          product.price >= priceRange[0] && product.price <= priceRange[1];

        // Status Filter
        const matchesStock = !inStockOnly || product.inStock;
        const matchesNew = !isNewOnly || product.isNew;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesScale &&
          matchesPrice &&
          matchesStock &&
          matchesNew
        );
      })
      .sort((a, b) => {
        switch (sortOption) {
          case "price_asc":
            return a.price - b.price;
          case "price_desc":
            return b.price - a.price;
          case "newest":
            return (a.isNew ? -1 : 1) - (b.isNew ? -1 : 1); // Mock logic for newness
          default:
            return 0; // Popularity implied by default order
        }
      });
  }, [
    searchQuery,
    selectedCategories,
    selectedScales,
    priceRange,
    inStockOnly,
    isNewOnly,
    sortOption,
  ]);

  return (
    <div className="min-h-screen bg-[#FFFFFE]">
      {/* Decorative Header Background */}
      <div className="absolute top-0 left-0 right-0 h-[600px] z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-multiply"
          style={{
            backgroundImage:
              "url('/images/blueprint_background_1765622394131.png')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFFFFE]/60 to-[#FFFFFE]"></div>
      </div>
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center justify-center text-center gap-8 mb-16 relative z-10 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <span className="text-[var(--primary-orange)] font-bold tracking-[0.2em] text-xs uppercase mb-4 block">
              Premium Collection
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-outfit font-bold text-gray-900 mb-6 leading-[1.1]">
              Find Your Perfect <br />
              <span className="text-[var(--primary-blue)] drop-shadow-sm">
                Scale Model
              </span>
            </h1>
            <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Discover our curated selection of high-fidelity 3D scale models,
              from vintage aircraft to modern armor.
            </p>
          </motion.div>

          {/* Big Search Bar - Centered */}
          <motion.div
            className="w-full max-w-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, ease: "backOut" }}
          >
            <div className="relative group shadow-2xl shadow-blue-100/60 rounded-full transition-all hover:shadow-blue-100/80 hover:-translate-y-1 bg-white">
              <input
                type="text"
                placeholder="Search models, brands, or sku..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-16 py-6 bg-transparent border border-gray-100 rounded-full text-gray-800 font-medium placeholder:text-gray-400 focus:outline-none focus:border-[var(--primary-blue)] focus:ring-4 focus:ring-blue-50/50 transition-all text-lg"
              />
              <button className="absolute right-3 top-3 bottom-3 aspect-square bg-[var(--primary-blue)] rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200 hover:bg-[var(--accent-blue)] transition-all transform active:scale-95">
                <Search className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </motion.div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24">
            <FilterSidebar
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedScales={selectedScales}
              setSelectedScales={setSelectedScales}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              isNewOnly={isNewOnly}
              setIsNewOnly={setIsNewOnly}
            />
          </aside>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-8 sticky top-20 z-10">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="w-full flex items-center justify-center gap-3 bg-[var(--primary-dark)] text-white p-4 rounded-full font-bold shadow-lg shadow-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {isMobileFilterOpen ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {/* Mobile Filter Content */}
          {isMobileFilterOpen && (
            <div className="lg:hidden mb-8">
              <FilterSidebar
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedScales={selectedScales}
                setSelectedScales={setSelectedScales}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                isNewOnly={isNewOnly}
                setIsNewOnly={setIsNewOnly}
              />
            </div>
          )}

          {/* Product Grid */}
          <main className="lg:col-span-9 min-h-[800px]">
            <ProductGrid
              products={filteredProducts}
              sortOption={sortOption}
              setSortOption={setSortOption}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
