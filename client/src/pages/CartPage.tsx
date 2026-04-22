import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/utils/formatters";
import { Plus, Minus, Trash, ArrowRight } from "lucide-react";

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-6">🛒</div>
            <h1 className="text-4xl font-bold mb-3 text-gray-900">Your Cart is Empty</h1>
            <p className="text-lg text-gray-600 mb-8">Looks like you haven't added any products yet. Start shopping now!</p>
            <Button asChild className="bg-gradient-to-r from-brand-blue to-indigo-600 hover:from-brand-blue/90 hover:to-indigo-700 text-white font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8 md:py-12">
      {/* Header */}
      <div className="container mx-auto px-4 mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 animate-slideInLeft">Shopping Cart</h1>
        <p className="text-gray-600 text-lg mt-2 animate-slideInRight">You have {cart.items.length} item{cart.items.length !== 1 ? "s" : ""} in your cart</p>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-bold text-gray-900">Product</TableHead>
                      <TableHead className="text-right font-bold text-gray-900">Price</TableHead>
                      <TableHead className="text-center font-bold text-gray-900">Quantity</TableHead>
                      <TableHead className="text-right font-bold text-gray-900">Subtotal</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.items.map((item, index) => (
                      <TableRow 
                        key={item.product.id}
                        className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors duration-200 animate-fadeInUp"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 group hover:shadow-lg transition-all">
                              <img 
                                src={item.product.imageUrl} 
                                alt={item.product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link 
                                to={`/products/${item.product.id}`}
                                className="font-semibold text-lg text-gray-900 hover:text-brand-blue transition-colors duration-200 line-clamp-2"
                              >
                                {item.product.name}
                              </Link>
                              <div className="text-sm text-gray-500 mt-1">
                                {item.product.category}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-gray-900">
                          {formatPrice(item.product.price)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 border-gray-200 hover:border-brand-blue hover:bg-blue-50 transition-all"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={16} />
                            </Button>
                            <span className="mx-3 w-8 text-center font-semibold text-gray-900">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 border-gray-200 hover:border-brand-blue hover:bg-blue-50 transition-all"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus size={16} />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-bold text-lg bg-gradient-to-r from-brand-blue to-indigo-600 bg-clip-text text-transparent">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Trash size={18} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                variant="outline" 
                asChild
                className="border-2 border-gray-200 hover:border-brand-blue hover:bg-blue-50 text-gray-900 font-semibold px-6 py-3 transition-all"
              >
                <Link to="/products">← Continue Shopping</Link>
              </Button>
            </div>
          </div>
          
          {/* Order summary */}
          <div>
            <div className="bg-gradient-to-br from-brand-blue to-indigo-600 text-white rounded-xl shadow-lg p-8 sticky top-24 animate-slideInRight">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-blue-100">
                  <span className="font-medium">Subtotal ({cart.items.length} {cart.items.length === 1 ? "item" : "items"}):</span>
                  <span className="font-bold text-lg">{formatPrice(cart.totalPrice)}</span>
                </div>
                
                <div className="flex justify-between items-center text-blue-100">
                  <span className="font-medium">Shipping:</span>
                  <span className="font-bold text-lg text-brand-yellow">FREE</span>
                </div>
                
                <div className="pt-4 border-t-2 border-blue-400">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">Total:</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-brand-yellow to-orange-300 bg-clip-text text-transparent">
                      {formatPrice(cart.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full mt-6 bg-gradient-to-r from-brand-yellow to-orange-300 hover:from-yellow-400 hover:to-orange-400 text-gray-900 font-bold text-lg py-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={handleCheckout}
              >
                Proceed to Checkout
                <ArrowRight size={20} className="ml-2" />
              </Button>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-blue-100 text-sm">
                  <span className="text-xl">🔒</span>
                  <span className="font-medium">100% Secure Checkout</span>
                </div>
                <div className="flex items-center gap-3 text-blue-100 text-sm">
                  <span className="text-xl">🚚</span>
                  <span className="font-medium">Free Shipping on Orders</span>
                </div>
                <div className="flex items-center gap-3 text-blue-100 text-sm">
                  <span className="text-xl">🔄</span>
                  <span className="font-medium">30-Day Money Back Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;