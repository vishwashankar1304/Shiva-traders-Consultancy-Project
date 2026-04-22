
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/utils/formatters";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-2xl border-0 bg-white hover:scale-105 transform">
      <Link to={`/products/${product._id}`}>
        <div className="aspect-square overflow-hidden relative bg-gray-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ShoppingCart className="text-white drop-shadow-lg" size={32} />
            </div>
          </div>
          
          {/* Discount badge (optional) */}
          {product.discount && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-brand-orange to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              -{product.discount}%
            </div>
          )}
          
          {/* In stock badge */}
          <div className="absolute top-3 left-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            In Stock
          </div>
        </div>

        <CardContent className="p-4 pb-2">
          <div className="flex justify-between items-start gap-2 mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg line-clamp-2 text-gray-900 group-hover:text-brand-blue transition-colors duration-300">
                {product.name}
              </h3>
              <p className="text-xs text-brand-blue font-medium mt-1 uppercase tracking-wider">
                {product.category}
              </p>
            </div>
            <button
              onClick={handleFavorite}
              className="flex-shrink-0 p-1.5 rounded-full hover:bg-gray-100 transition-all duration-200"
            >
              <Heart
                size={18}
                className={`transition-all duration-300 ${
                  isFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
            </button>
          </div>

          <p className="text-gray-500 text-sm mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Rating (if available) */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.round(product.rating) ? "text-brand-yellow" : "text-gray-300"}>
                    ⭐
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500 font-medium">({product.reviews || 0})</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-2 flex justify-between items-center gap-3 flex-wrap">
          <span className="font-bold text-xl bg-gradient-to-r from-brand-blue to-indigo-600 bg-clip-text text-transparent">
            {formatPrice(product.price)}
          </span>
          <Button
            size="sm"
            className={`gap-2 transition-all duration-300 ${
              isAdding
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gradient-to-r from-brand-blue to-indigo-600 hover:from-brand-blue/90 hover:to-indigo-700"
            } text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105`}
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} />
            {isAdding ? "Added!" : "Add"}
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ProductCard;
