"use client";

import { Product } from "./shop-data";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  sortOption: string;
  setSortOption: (option: string) => void;
}

export default function ProductGrid({
  products,
  sortOption,
  setSortOption,
}: ProductGridProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-14 relative z-20">
        <p className="text-gray-500 text-sm">
          Showing{" "}
          <span className="font-bold text-gray-900">{products.length}</span>{" "}
          results
        </p>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="text-sm font-medium text-gray-900 bg-transparent border-none focus:ring-0 cursor-pointer outline-none"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No models found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters or search query.
          </p>
        </div>
      )}
    </div>
  );
}
