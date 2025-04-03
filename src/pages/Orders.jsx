import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderCard from "../components/OrderCard"; // Import the OrderCard component

const Orders = () => {
  const [orders, setOrders] = useState([]); // Ensure it's an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:1001/api/order/myOrders", {
          withCredentials: true, // Ensure session cookies are sent
        });
        setOrders(response.data.data || []); // Ensure it's always an array
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="ml-72 p-6 h-screen overflow-y-auto scrollbar-hide">
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
        <p className="text-gray-500 text-center">No orders found.</p>
      )}
    </div>
  );
};

export default Orders;
