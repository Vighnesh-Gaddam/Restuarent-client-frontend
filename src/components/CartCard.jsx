/* eslint-disable no-unused-vars */
import { useState } from "react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { updateCartQuantityAPI } from "../services/api"; // ✅ Import API function
import { toast } from "react-toastify";

const CartCard = ({ item, onUpdateQuantity, onRemove }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [loading, setLoading] = useState(false); // ✅ Prevent multiple clicks

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return; // Prevent invalid quantity
    setLoading(true); // 🚀 Show loading state

    try {
      await updateCartQuantityAPI(item._id, newQuantity); // 🔄 API call
      setQuantity(newQuantity); // ✅ Update local state
      onUpdateQuantity(item.menuItemId._id, newQuantity); // ✅ Update parent state
    } catch (error) {
      toast.error("Failed to update quantity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-white rounded-xl shadow-md p-4 w-full items-center gap-4">
      {/* Image */}
      <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
        <img
          src={item.menuItemId.foodImage}
          alt={item.menuItemId.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Item Details */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold">{item.menuItemId.name}</h2>
        <p className="text-gray-500 text-sm">{item.menuItemId.description}</p>
        <span className="text-[#ffa16c] font-bold text-lg">₹{item.menuItemId.price}</span>

        {/* Quantity Controls */}
        <div className="flex items-center mt-2 space-x-2">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center"
            disabled={loading || quantity === 1} // Disable if loading or min quantity
          >
            <FaMinus />
          </button>
          <span className="text-lg font-medium">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center"
            disabled={loading} // Prevent multiple clicks
          >
            <FaPlus />
          </button>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item._id)}
        className="text-red-500 hover:text-red-700"
        disabled={loading}
      >
        <FaTrash size={20} />
      </button>
    </div>
  );
};

export default CartCard;
