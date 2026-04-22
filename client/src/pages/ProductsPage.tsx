import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";
import { Search, SlidersHorizontal } from "lucide-react";
import { productApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Function to load products
  const loadProducts = useCallback(async () => {
    try {
      const fetchedProducts = await productApi.getAllProducts();
      setProducts(fetchedProducts);
      
      // Extract categories
      const uniqueCategories = Array.from(
        new Set(fetchedProducts.map((product) => product.category))
      );
      setCategories(uniqueCategories);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...products];
    
    // Get current search and category from URL params
    const currentSearch = searchParams.get("search") || "";
    const currentCategory = searchParams.get("category") || "all";
    
    // Apply search filter
    if (currentSearch) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
          product.description.toLowerCase().includes(currentSearch.toLowerCase())
      );
    }
    
    // Apply category filter
    if (currentCategory && currentCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === currentCategory
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        // Default sorting (featured)
        break;
    }
    
    setFilteredProducts(filtered);
  }, [products, searchParams, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL params with current search term
    const params = new URLSearchParams(searchParams);
    const searchValue = (e.target as HTMLFormElement).querySelector('input[type="search"]')?.value || "";
    if (searchValue.trim()) {
      params.set("search", searchValue.trim());
    } else {
      params.delete("search");
    }
    setSearchParams(params);
  };

  const handleCategoryChange = (value: string) => {
    // Update URL params with new category
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSortBy("featured");
    setSearchParams(new URLSearchParams());
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-blue border-t-brand-orange rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-blue to-indigo-600 text-white py-12 mb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 animate-slideInLeft">Explore Our Products</h1>
          <p className="text-blue-100 text-lg animate-slideInRight">Discover premium electrical products and home solutions</p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {/* Search and filters */}
        <div className="mb-10">
          {/* Search Bar */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex w-full max-w-2xl mx-auto gap-2">
              <div className="relative flex-1">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search products by name, description..."
                  value={searchParams.get("search") || ""}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-3 text-base border-2 border-gray-200 hover:border-brand-blue focus:border-brand-blue transition-colors rounded-lg"
                />
              </div>
              <Button type="submit" className="bg-gradient-to-r from-brand-blue to-indigo-600 hover:from-brand-blue/90 hover:to-indigo-700 text-white font-semibold px-6 shadow-md hover:shadow-lg transition-all">
                <Search size={18} />
              </Button>
            </form>
          </div>
          
          {/* Desktop filters */}
          <div className="hidden md:flex items-center justify-between gap-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-end gap-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <Select
                    value={searchParams.get("category") || "all"}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="w-[200px] border-2 border-gray-200 hover:border-brand-blue focus:border-brand-blue">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-end gap-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value)}
                  >
                    <SelectTrigger className="w-[200px] border-2 border-gray-200 hover:border-brand-blue focus:border-brand-blue">
                      <SelectValue placeholder="Featured" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {(searchParams.get("search") || searchParams.get("category") || sortBy !== "featured") && (
              <Button 
                variant="ghost" 
                onClick={handleClearFilters}
                className="hover:bg-red-50 text-red-600 hover:text-red-700 font-semibold"
              >
                ✕ Clear Filters
              </Button>
            )}
          </div>
          
          {/* Mobile filters */}
          <div className="md:hidden flex justify-between items-center gap-2 mb-4">
            <Button
              variant="outline"
              className="flex-1 border-2 border-gray-200 hover:border-brand-blue font-semibold"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <SlidersHorizontal size={18} className="mr-2" /> Filters
            </Button>
            {(searchParams.get("search") || searchParams.get("category") || sortBy !== "featured") && (
              <Button 
                variant="outline"
                className="flex-1 border-2 border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 font-semibold"
                onClick={handleClearFilters}
              >
                Clear
              </Button>
            )}
          </div>
          
          {/* Mobile filters modal */}
          {filterOpen && (
            <div className="md:hidden mb-4 p-5 border-2 border-gray-200 rounded-lg bg-white shadow-lg animate-slideInLeft">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <Select
                    value={searchParams.get("category") || "all"}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="border-2 border-gray-200">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value)}
                  >
                    <SelectTrigger className="border-2 border-gray-200">
                      <SelectValue placeholder="Featured" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? "s" : ""}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <div key={product._id} className="animate-fadeInUp" style={{ animationDelay: `${(index % 4) * 0.1}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-200">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">Try adjusting your search terms or filter criteria to find what you're looking for.</p>
            <Button 
              asChild
              className="bg-gradient-to-r from-brand-blue to-indigo-600 hover:from-brand-blue/90 hover:to-indigo-700 text-white font-semibold px-6 py-3"
            >
              <Link to="/products" onClick={handleClearFilters}>
                View All Products
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;