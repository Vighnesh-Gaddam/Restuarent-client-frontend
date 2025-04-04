import { useEffect, useState } from "react";
import { fetchCartItems, placeOrderAPI, removeCartItemAPI, verifyPaymentAPI } from "../services/api";
import CartCard from "../components/CartCard";
import { toast } from "react-toastify";
import { Navigate } from "react-router";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(true); // Loader for fetching cart

  const loadCart = async () => {
    setCartLoading(true); // Start loading
    const token = localStorage.getItem("refreshToken");
    if (!token) {
      console.error("User not logged in");
      toast.error("You need to log in first!");
    }

    try {
      const response = await fetchCartItems();
      console.log("Cart API Response:", response);

      if (response?.data?.items) {
        setCartItems(response.data.items);
      } else {
        console.warn("Cart items not found in API response.");
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart.");
      setCartItems([]);
    } finally {
      setCartLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleUpdateQuantity = (itemId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.menuItemId._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeCartItemAPI(itemId);
      setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
      toast.success("Item removed from cart! 🗑️");
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast.error("Failed to remove item!");
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.menuItemId?.price || 0) * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("❌ Your cart is empty! Add items before placing an order.");
      return;
    }

    setLoading(true);
    try {
      const orderResponse = await placeOrderAPI();
      console.log("📌 Order Response:", orderResponse);

      const razorpayOrderId = orderResponse?.data?.data?.razorpayOrderId;
      const totalPrice = orderResponse?.data?.data?.totalPrice;

      if (!razorpayOrderId) {
        toast.error("❌ Failed to create order.");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: totalPrice * 100,
        currency: "INR",
        order_id: razorpayOrderId,
        name: "PBCOE Canteen",
        description: "Thank you for ordering from PBCOE Canteen",
        image: "/Logo2.svg",
        handler: async function (response) {
          console.log("📌 Razorpay Payment Response:", response);

          try {
            const paymentVerificationResponse = await verifyPaymentAPI(response);
            console.log("📌 Payment Verification Response:", paymentVerificationResponse);

            if (paymentVerificationResponse?.data?.message) {
              toast.success("✅ Payment successful! Order placed.");
              await loadCart(); // Re-fetch cart after payment
            } else {
              loadCart();
              toast.error("❌ Payment verification failed.");
            }
          } catch (error) {
            console.error("❌ Payment verification error:", error);
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: "Kevin11",
          email: "customer@example.com",
          contact: "9876543210",
        },
        theme: { color: "#F37254" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("❌ Error placing order:", error);
      toast.error("Failed to place order.");
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-6 p-6 min-h-screen ml-72">
      {/* Left Side - Cart Items */}
      <div className="flex-1 space-y-4">
        <h1 className="text-3xl font-bold mb-4">Your Cart</h1>

        {cartLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#ffa16c] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#ffa16c] font-semibold mt-3 text-center">Loading Cart...</p>
            </div>
          </div>
        ) : cartItems.length > 0 ? (
          cartItems.map((item) => (
            <CartCard
              key={item._id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveItem}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center mt-16">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
              alt="Empty Cart"
              className="w-48 h-48"
            />
            <h2 className="text-2xl font-semibold mt-4">Your cart is empty!</h2>
            <p className="text-gray-500 mt-2">Looks like you haven't added anything yet.</p>
            <button
              onClick={() => Navigate("/menu")} 
              className="mt-6 bg-[#ffa16c] text-white py-2 px-4 rounded-lg font-bold hover:bg-[#ff8f4a]"
            >
              Browse Menu
            </button>
          </div>
        )}
      </div>

      {/* Right Side - Order Summary */}
      <div className="w-96 bg-white shadow-lg rounded-xl p-6 sticky top-6 self-start h-[90vh]">
        <h2 className="text-2xl font-semibold border-b pb-3 mb-4">Order Summary</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-center mt-16">No items in cart</p>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center gap-4 border-b py-3">
                <img
                  src={item.menuItemId?.foodImage || ""}
                  alt={item.menuItemId?.name || "Item"}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.menuItemId?.name || "Unknown Item"}</h3>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <span className="font-bold text-gray-800">₹{(item.menuItemId?.price || 0) * item.quantity}</span>
              </div>
            ))}
          </div>
        )}

        {cartItems.length > 0 && (
          <>
            <div className="flex justify-between font-semibold text-lg mt-4">
              <span>Total Price:</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="mt-6 w-full bg-[#ffa16c] text-white py-3 rounded-lg font-bold hover:bg-[#ff8f4a] flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                "Place Order"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
