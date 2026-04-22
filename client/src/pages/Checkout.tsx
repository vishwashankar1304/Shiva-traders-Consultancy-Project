import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/utils/formatters";
import { ArrowLeft, CreditCard, IndianRupee } from "lucide-react";

interface AddressFormData {
  fullName: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

type PaymentMethod = "razorpay" | "cash_on_delivery";

// Pincode to city/state mapping (sample Indian pincodes)
const PINCODE_MAPPING: Record<string, { city: string; state: string }> = {
  "110001": { city: "New Delhi", state: "Delhi" },
  "110002": { city: "New Delhi", state: "Delhi" },
  "110003": { city: "New Delhi", state: "Delhi" },
  "110004": { city: "New Delhi", state: "Delhi" },
  "110005": { city: "New Delhi", state: "Delhi" },
  "400001": { city: "Mumbai", state: "Maharashtra" },
  "400002": { city: "Mumbai", state: "Maharashtra" },
  "400003": { city: "Mumbai", state: "Maharashtra" },
  "400004": { city: "Mumbai", state: "Maharashtra" },
  "400005": { city: "Mumbai", state: "Maharashtra" },
  "560001": { city: "Bangalore", state: "Karnataka" },
  "560002": { city: "Bangalore", state: "Karnataka" },
  "560003": { city: "Bangalore", state: "Karnataka" },
  "560004": { city: "Bangalore", state: "Karnataka" },
  "560005": { city: "Bangalore", state: "Karnataka" },
  "700001": { city: "Kolkata", state: "West Bengal" },
  "700002": { city: "Kolkata", state: "West Bengal" },
  "700003": { city: "Kolkata", state: "West Bengal" },
  "500001": { city: "Hyderabad", state: "Telangana" },
  "500002": { city: "Hyderabad", state: "Telangana" },
  "500003": { city: "Hyderabad", state: "Telangana" },
  "600001": { city: "Chennai", state: "Tamil Nadu" },
  "600002": { city: "Chennai", state: "Tamil Nadu" },
  "600003": { city: "Chennai", state: "Tamil Nadu" },
  "201301": { city: "Noida", state: "Uttar Pradesh" },
  "201302": { city: "Noida", state: "Uttar Pradesh" },
  "201303": { city: "Noida", state: "Uttar Pradesh" },
  "380001": { city: "Ahmedabad", state: "Gujarat" },
  "380002": { city: "Ahmedabad", state: "Gujarat" },
  "380003": { city: "Ahmedabad", state: "Gujarat" },
  "122001": { city: "Gurugram", state: "Haryana" },
  "122002": { city: "Gurugram", state: "Haryana" },
  "122003": { city: "Gurugram", state: "Haryana" },
};

const CheckoutPage = () => {
  const { cart, checkout } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("razorpay");
  
  const [addressData, setAddressData] = useState<AddressFormData>({
    fullName: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // If pincode is being updated, auto-fill city and state
    if (name === "pincode") {
      setAddressData((prev) => ({
        ...prev,
        [name]: value,
      }));
      
      // Auto-fill city and state if pincode exists in mapping
      if (value.length === 6) {
        const locationData = PINCODE_MAPPING[value];
        if (locationData) {
          setAddressData((prev) => ({
            ...prev,
            city: locationData.city,
            state: locationData.state,
          }));
          toast({
            title: "Location Found",
            description: `${locationData.city}, ${locationData.state}`,
          });
        }
      }
    } else {
      setAddressData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const { fullName, street, city, state, pincode, phone } = addressData;
    if (!fullName || !street || !city || !state || !pincode || !phone) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all address fields",
      });
      return false;
    }
    
    // Basic pincode validation (6 digits for India)
    if (!/^\d{6}$/.test(pincode)) {
      toast({
        variant: "destructive",
        title: "Invalid pincode",
        description: "Please enter a valid 6-digit pincode",
      });
      return false;
    }
    
    // Basic phone validation (10 digits for India)
    if (!/^\d{10}$/.test(phone)) {
      toast({
        variant: "destructive",
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number",
      });
      return false;
    }
    
    return true;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    // For Razorpay payment method, we would typically integrate with their API here
    // For this example, we'll just simulate a successful payment
    
    setTimeout(() => {
      const address = {
        ...addressData
      };
      
      const orderId = checkout(address, paymentMethod);
      setIsProcessing(false);
      
      if (orderId) {
        navigate(`/orders/${orderId}`);
      }
    }, 1000);
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  if (cart.items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/cart")}
            className="mb-4 text-brand-blue hover:bg-blue-50 font-semibold"
          >
            <ArrowLeft size={18} className="mr-2" /> Back to Cart
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 animate-slideInLeft">Secure Checkout</h1>
          <p className="text-gray-600 text-lg mt-2 animate-slideInRight">Complete your purchase safely and securely</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Address and Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress indicator */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-brand-blue to-indigo-600 text-white font-bold">1</div>
              <div className="flex-1 h-1 bg-gradient-to-r from-brand-blue to-indigo-600"></div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-brand-blue to-indigo-600 text-white font-bold">2</div>
              <div className="flex-1 h-1 bg-gray-200"></div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-white font-bold">3</div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 animate-fadeInUp">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-2xl">📍</div>
                <h2 className="text-2xl font-bold text-gray-900">Shipping Address</h2>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="font-semibold text-gray-700">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="John Doe"
                      value={addressData.fullName}
                      onChange={handleInputChange}
                      className="py-3 text-base border-2 border-gray-200 hover:border-brand-blue focus:border-brand-blue transition-colors rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-semibold text-gray-700">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="9876543210"
                      value={addressData.phone}
                      onChange={handleInputChange}
                      className="py-3 text-base border-2 border-gray-200 hover:border-brand-blue focus:border-brand-blue transition-colors rounded-lg"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="street" className="font-semibold text-gray-700">Street Address *</Label>
                  <Input
                    id="street"
                    name="street"
                    placeholder="123 Main Street, Apartment 4B"
                    value={addressData.street}
                    onChange={handleInputChange}
                    className="py-3 text-base border-2 border-gray-200 hover:border-brand-blue focus:border-brand-blue transition-colors rounded-lg"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="font-semibold text-gray-700">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="New York"
                      value={addressData.city}
                      onChange={handleInputChange}
                      className="py-3 text-base border-2 border-gray-200 hover:border-brand-blue focus:border-brand-blue transition-colors rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="font-semibold text-gray-700">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="New York"
                      value={addressData.state}
                      onChange={handleInputChange}
                      className="py-3 text-base border-2 border-gray-200 hover:border-brand-blue focus:border-brand-blue transition-colors rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode" className="font-semibold text-gray-700">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      placeholder="123456"
                      value={addressData.pincode}
                      onChange={handleInputChange}
                      className="py-3 text-base border-2 border-gray-200 hover:border-brand-blue focus:border-brand-blue transition-colors rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="text-2xl">💳</div>
                <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
              </div>
              
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                className="space-y-3"
              >
                <div className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                  paymentMethod === "razorpay" 
                    ? "border-brand-blue bg-blue-50" 
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                  <RadioGroupItem value="razorpay" id="razorpay" className="w-5 h-5" />
                  <Label htmlFor="razorpay" className="flex items-center cursor-pointer flex-1 ml-3">
                    <CreditCard className="mr-3 h-6 w-6 text-brand-blue" />
                    <div>
                      <div className="font-bold text-gray-900">Razorpay Payment</div>
                      <div className="text-sm text-gray-500">Secure online payment gateway</div>
                    </div>
                  </Label>
                </div>

                <div className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                  paymentMethod === "cash_on_delivery" 
                    ? "border-green-500 bg-green-50" 
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                  <RadioGroupItem value="cash_on_delivery" id="cod" className="w-5 h-5" />
                  <Label htmlFor="cod" className="flex items-center cursor-pointer flex-1 ml-3">
                    <IndianRupee className="mr-3 h-6 w-6 text-green-500" />
                    <div>
                      <div className="font-bold text-gray-900">Cash on Delivery</div>
                      <div className="text-sm text-gray-500">Pay when your order arrives</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          {/* Order Summary Sidebar */}
          <div>
            <div className="bg-gradient-to-br from-brand-blue to-indigo-600 text-white rounded-xl shadow-lg p-8 sticky top-24 animate-slideInRight">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-3 max-h-64 overflow-y-auto mb-6 pb-6 border-b-2 border-blue-400">
                {cart.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm text-blue-100">
                    <span className="flex-1">{item.product.name}</span>
                    <span className="ml-2">×{item.quantity}</span>
                    <span className="ml-2 font-semibold text-right min-w-fit">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-blue-100">
                  <span className="font-medium">Subtotal:</span>
                  <span className="font-bold text-lg">{formatPrice(cart.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-blue-100">
                  <span className="font-medium">Shipping:</span>
                  <span className="font-bold text-lg text-brand-yellow">FREE</span>
                </div>
                <div className="flex justify-between text-blue-100">
                  <span className="font-medium">Tax:</span>
                  <span className="font-bold text-lg">₹0</span>
                </div>
              </div>

              <div className="pt-6 border-t-2 border-blue-400 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">Total:</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-brand-yellow to-orange-300 bg-clip-text text-transparent">
                    {formatPrice(cart.totalPrice)}
                  </span>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-brand-yellow to-orange-300 hover:from-yellow-400 hover:to-orange-400 text-gray-900 font-bold text-lg py-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" 
                size="lg"
                onClick={handlePlaceOrder}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="mr-2 w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  "Place Order Now"
                )}
              </Button>
              
              <div className="mt-8 space-y-4 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-xl">🔒</span>
                  <div>
                    <div className="font-bold">Secure & Encrypted</div>
                    <div className="text-blue-100 text-xs">Your data is protected</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xl">✓</span>
                  <div>
                    <div className="font-bold">Easy Returns</div>
                    <div className="text-blue-100 text-xs">30-day money-back guarantee</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xl">📦</span>
                  <div>
                    <div className="font-bold">Free Shipping</div>
                    <div className="text-blue-100 text-xs">On all orders</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;