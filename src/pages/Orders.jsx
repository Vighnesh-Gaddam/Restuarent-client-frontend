import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import OrderCard from "../components/OrderCard";
import { fetchUserOrders } from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // ✅ Initialize navigate

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchUserOrders(); // ✅ Fetch orders with proper auth
        setOrders(data.data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, []);

  return (
    <div className="ml-72 p-6 h-screen scrollbar-hide">
      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading orders...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : orders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      ) : (
        // 🎯 Updated Empty Orders UI with Image & Button
        <div className="flex flex-col items-center justify-center text-center mt-16">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="No Orders Found"
            className="w-48 h-48"
          />
          <h2 className="text-2xl font-semibold mt-4">No orders found!</h2>
          <p className="text-gray-500 mt-2">Looks like you haven't placed any orders yet.</p>
          <button
            onClick={() => navigate("/menu")} // ✅ Using navigate instead of window.location
            className="mt-6 bg-[#ffa16c] text-white py-2 px-4 rounded-lg font-bold hover:bg-[#ff8f4a]"
          >
            Browse Menu
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;
