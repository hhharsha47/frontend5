"use client";

import { useState } from "react";
import {
  Package,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  X,
  Image as ImageIcon,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: "Active" | "Draft";
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "1/48 F-14 Tomcat",
      price: 129.99,
      stock: 15,
      category: "Aircraft",
      status: "Active",
    },
    {
      id: "2",
      name: "1/35 Sherman Tank",
      price: 89.99,
      stock: 8,
      category: "Armor",
      status: "Active",
    },
    {
      id: "3",
      name: "Weathering Set A",
      price: 15.0,
      stock: 42,
      category: "Supplies",
      status: "Active",
    },
    {
      id: "4",
      name: "Custom B-17 Decals",
      price: 24.99,
      stock: 0,
      category: "Decals",
      status: "Draft",
    },
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    price: 0,
    stock: 0,
    category: "Aircraft",
    status: "Active",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProduct.name || "New Product",
      price: Number(newProduct.price) || 0,
      stock: Number(newProduct.stock) || 0,
      category: newProduct.category || "Aircraft",
      status: newProduct.status || "Draft",
    };
    setProducts([product, ...products]);
    setIsAddOpen(false);
    setNewProduct({
      name: "",
      price: 0,
      stock: 0,
      category: "Aircraft",
      status: "Active",
    });
    toast.success("Product added successfully");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Product deleted");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-display">
            Products
          </h1>
          <p className="text-slate-500 mt-1">
            Manage your catalog and inventory.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider">
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 text-slate-400">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-900 text-sm">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                    <Tag className="w-3 h-3" />
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "text-sm font-bold",
                      product.stock === 0 ? "text-red-500" : "text-slate-700"
                    )}
                  >
                    {product.stock} units
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border",
                      product.status === "Active"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        product.status === "Active"
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                      )}
                    />
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-bold">No products found</h3>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="font-bold text-lg text-slate-900">
                Add New Product
              </h2>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Product Name
                </label>
                <input
                  required
                  type="text"
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Price ($)
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        price: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    Stock
                  </label>
                  <input
                    required
                    type="number"
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        stock: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Category
                </label>
                <select
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                >
                  <option>Aircraft</option>
                  <option>Armor</option>
                  <option>Ships</option>
                  <option>Sci-Fi</option>
                  <option>Supplies</option>
                  <option>Decals</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all mt-4"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
