import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";
import { productApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await productApi.getAllProducts();
        // Get first 4 products as featured
        setFeaturedProducts(products.slice(0, 4));
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load featured products",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [toast]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div>Loading featured products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Modern Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-blue via-blue-600 to-indigo-700 text-white py-24 md:py-32">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange opacity-10 rounded-full blur-3xl -mr-48 -mt-24 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-yellow opacity-10 rounded-full blur-3xl -ml-48 -mb-24"></div>
        
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8 animate-slideInLeft">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Quality Electricals at{" "}
                <span className="bg-gradient-to-r from-brand-yellow to-orange-300 bg-clip-text text-transparent">
                  Unbeatable Prices
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 leading-relaxed font-light">
                Discover our extensive range of premium electrical products and home improvement solutions with guaranteed same-day delivery.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                size="lg" 
                asChild
                className="bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-6 text-lg"
              >
                <Link to="/products" className="flex items-center">
                  Shop Now <ArrowRight size={20} className="ml-2" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild
                className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm font-semibold px-8 py-6 text-lg transition-all duration-300"
              >
                <Link to="/contact">
                  Get in Touch
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <div>
                  <div className="font-semibold">4.9/5</div>
                  <div className="text-sm text-blue-100">1000+ Reviews</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image with floating effect */}
          <div className="hidden md:block relative animate-float">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-orange to-brand-yellow opacity-20 rounded-2xl blur-2xl"></div>
            <img 
              src='/lovable-uploads/images/products/siva traders.jpg'
              alt="Electricals Showcase"
              className="relative rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center animate-fadeInUp" style={{ animationDelay: '0s' }}>
              <div className="text-4xl font-bold text-brand-blue mb-2">500+</div>
              <p className="text-gray-600 font-medium">Products</p>
            </div>
            <div className="text-center animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl font-bold text-brand-blue mb-2">10K+</div>
              <p className="text-gray-600 font-medium">Happy Customers</p>
            </div>
            <div className="text-center animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold text-brand-blue mb-2">100%</div>
              <p className="text-gray-600 font-medium">Genuine Products</p>
            </div>
            <div className="text-center animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl font-bold text-brand-blue mb-2">24/7</div>
              <p className="text-gray-600 font-medium">Customer Support</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div className="animate-slideInLeft">
              <h2 className="text-4xl font-bold mb-2 text-gray-900">Featured Products</h2>
              <p className="text-gray-600 text-lg">Handpicked selection just for you</p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex hover:bg-gradient-to-r hover:from-brand-blue/10 hover:to-brand-orange/10">
              <Link to="/products" className="flex items-center gap-2 text-brand-blue hover:text-brand-blue text-lg">
                View All <ArrowRight size={20} />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <div className="mt-8 md:hidden flex justify-center">
            <Button asChild className="bg-gradient-to-r from-brand-blue to-indigo-600 hover:from-brand-blue/90 hover:to-indigo-700 text-white px-8 py-6 text-lg font-semibold">
              <Link to="/products" className="flex items-center gap-2">
                View All Products <ArrowRight size={20} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* USP Section - Modern Cards */}
      <section className="py-20 bg-gradient-to-b from-white via-blue-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-transparent border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp" style={{ animationDelay: '0s' }}>
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🚚</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Free Shipping</h3>
              <p className="text-gray-600 leading-relaxed">Enjoy complimentary shipping on all orders exceeding ₹500. Fast and reliable delivery guaranteed.</p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-transparent border border-orange-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🔄</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Easy Returns</h3>
              <p className="text-gray-600 leading-relaxed">30-day hassle-free return policy. No questions asked if you're not satisfied with your purchase.</p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-yellow-50 to-transparent border border-yellow-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🔒</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Secure Payment</h3>
              <p className="text-gray-600 leading-relaxed">100% secure checkout with encrypted transactions. Your payment information is always protected.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-blue via-indigo-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange opacity-10 rounded-full blur-3xl -mr-48 -mt-24"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-slideInLeft">
            Ready to Upgrade Your Home?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto animate-slideInRight">
            Browse our collection of premium electrical products and home improvement solutions.
          </p>
          <Button 
            size="lg" 
            asChild
            className="bg-gradient-to-r from-brand-yellow to-orange-300 hover:from-yellow-400 hover:to-orange-400 text-gray-900 font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-10 py-6 text-lg"
          >
            <Link to="/products">
              Start Shopping Now
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
