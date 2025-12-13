"use client";

import { useState } from "react";
import { ChevronDown, RefreshCw, Filter } from "lucide-react";
import { categories, scales } from "./shop-data";

interface FilterSidebarProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedScales: string[];
  setSelectedScales: (scales: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  isNewOnly: boolean;
  setIsNewOnly: (val: boolean) => void;
}

export default function FilterSidebar({
  selectedCategories,
  setSelectedCategories,
  selectedScales,
  setSelectedScales,
  priceRange,
  setPriceRange,
  inStockOnly,
  setInStockOnly,
  isNewOnly,
  setIsNewOnly,
}: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    categories: true,
    scales: true,
    price: true,
    status: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (category: string) => {
    if (category === "All") {
      setSelectedCategories(["All"]);
    } else {
      let newCategories = [...selectedCategories];
      if (newCategories.includes("All")) {
        newCategories = [];
      }

      if (newCategories.includes(category)) {
        newCategories = newCategories.filter((c) => c !== category);
      } else {
        newCategories.push(category);
      }

      if (newCategories.length === 0) {
        newCategories = ["All"];
      }

      setSelectedCategories(newCategories);
    }
  };

  const handleScaleChange = (scale: string) => {
    let newScales = [...selectedScales];
    if (newScales.includes(scale)) {
      newScales = newScales.filter((s) => s !== scale);
    } else {
      newScales.push(scale);
    }
    setSelectedScales(newScales);
  };

  const handleReset = () => {
    setSelectedCategories(["All"]);
    setSelectedScales([]);
    setPriceRange([0, 500]);
    setInStockOnly(false);
    setIsNewOnly(false);
  };

  return (
    <div className="w-full bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-outfit font-bold text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5 text-[var(--primary-blue)]" />
          Filters
        </h2>
        <button
          onClick={handleReset}
          className="text-xs font-semibold text-gray-400 hover:text-[var(--primary-orange)] flex items-center gap-1 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <button
          onClick={() => toggleSection("categories")}
          className="w-full flex items-center justify-between mb-4 group"
        >
          <span className="font-outfit font-bold text-gray-800 text-lg">
            Category
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              openSections.categories ? "rotate-180" : ""
            }`}
          />
        </button>

        {openSections.categories && (
          <div className="space-y-3">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="peer h-5 w-5 rounded-lg border-2 border-gray-200 text-[var(--primary-blue)] focus:ring-offset-0 focus:ring-0 checked:bg-[var(--primary-blue)] checked:border-[var(--primary-blue)] transition-all"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                </div>
                <span
                  className={`font-medium transition-colors ${
                    selectedCategories.includes(category)
                      ? "text-[var(--primary-blue)]"
                      : "text-gray-500 group-hover:text-[var(--primary-blue)]"
                  }`}
                >
                  {category}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="h-px bg-gray-100 w-full mb-8"></div>

      {/* Scales */}
      <div className="mb-8">
        <button
          onClick={() => toggleSection("scales")}
          className="w-full flex items-center justify-between mb-4"
        >
          <span className="font-outfit font-bold text-gray-800 text-lg">
            Scale
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              openSections.scales ? "rotate-180" : ""
            }`}
          />
        </button>

        {openSections.scales && (
          <div className="grid grid-cols-2 gap-3">
            {scales.map((scale) => (
              <label key={scale} className="cursor-pointer group relative">
                <input
                  type="checkbox"
                  className="hidden peer"
                  checked={selectedScales.includes(scale)}
                  onChange={() => handleScaleChange(scale)}
                />
                <div className="w-full text-center py-2 px-3 text-sm font-medium border-2 border-gray-100 rounded-xl text-gray-500 peer-checked:bg-[var(--primary-blue)] peer-checked:text-white peer-checked:border-[var(--primary-blue)] transition-all hover:border-[var(--primary-blue)]">
                  {scale}
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="h-px bg-gray-100 w-full mb-8"></div>

      <div className="h-px bg-gray-100 w-full mb-8"></div>

      {/* Price Range */}
      <div className="mb-8">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between mb-6 block"
        >
          <span className="font-outfit font-bold text-gray-800 text-lg">
            Price Range
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              openSections.price ? "rotate-180" : ""
            }`}
          />
        </button>

        {openSections.price && (
          <div>
            <div className="relative h-12 mb-4">
              {/* Custom Range Slider UI Imitation */}
              <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-100 rounded-full -translate-y-1/2 px-1">
                {/* Visual Track Fill - Simplified for single thumb demo */}
                <div
                  className="absolute left-0 h-full bg-[var(--primary-blue)] rounded-full"
                  style={{ width: `${(priceRange[1] / 500) * 100}%` }}
                ></div>
              </div>

              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value)])
                }
                className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
              />

              {/* Thumb */}
              <div
                className="absolute top-1/2 w-6 h-6 bg-white border-4 border-[var(--primary-blue)] rounded-full -translate-y-1/2 -translate-x-1/2 shadow-md pointer-events-none transition-all"
                style={{ left: `${(priceRange[1] / 500) * 100}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                <span className="text-xs text-gray-400 block mb-0.5">Min</span>
                <span className="text-sm font-bold text-gray-900">
                  ${priceRange[0]}
                </span>
              </div>
              <div className="h-0.5 w-4 bg-gray-300"></div>
              <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                <span className="text-xs text-gray-400 block mb-0.5">Max</span>
                <span className="text-sm font-bold text-gray-900">
                  ${priceRange[1]}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-gray-100 w-full mb-8"></div>

      {/* Special Filters (Status) */}
      <div>
        <button
          onClick={() => toggleSection("status")}
          className="w-full flex items-center justify-between mb-4 group"
        >
          <span className="font-outfit font-bold text-gray-800 text-lg">
            Availability & Status
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              openSections.status ? "rotate-180" : ""
            }`}
          />
        </button>

        {openSections.status && (
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  className="peer h-5 w-5 rounded-lg border-2 border-gray-200 text-[var(--primary-blue)] focus:ring-offset-0 focus:ring-0 checked:bg-[var(--primary-blue)] checked:border-[var(--primary-blue)] transition-all"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-700 group-hover:text-[var(--primary-blue)] transition-colors">
                  In Stock Only
                </span>
                <span className="text-xs text-gray-400">
                  Show only ready-to-ship items
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  className="peer h-5 w-5 rounded-lg border-2 border-gray-200 text-[var(--primary-blue)] focus:ring-offset-0 focus:ring-0 checked:bg-[var(--primary-blue)] checked:border-[var(--primary-blue)] transition-all"
                  checked={isNewOnly}
                  onChange={(e) => setIsNewOnly(e.target.checked)}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-700 group-hover:text-[var(--primary-blue)] transition-colors">
                  New Arrivals
                </span>
                <span className="text-xs text-gray-400">
                  The latest additions
                </span>
              </div>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
