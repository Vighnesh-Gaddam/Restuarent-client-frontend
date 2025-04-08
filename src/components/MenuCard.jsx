import React, { useState, useEffect } from "react";
import { FaCartPlus, FaTrash } from "react-icons/fa";
import { addToCart, removeCartItemAPI } from "../services/api";
import { toast } from "react-toastify";

const MenuCard = ({ foodItem, cartItems, refreshCart }) => {
    const [inCart, setInCart] = useState(false);
    const [cartItemId, setCartItemId] = useState(null);

    useEffect(() => {
        if (!Array.isArray(cartItems)) return; // Prevent errors if cartItems is undefined or not an array
    
        const existingItem = cartItems.find(item => item?.menuItemId?._id === foodItem._id);
        
        if (existingItem) {
            setInCart(true);
            setCartItemId(existingItem._id);
        } else {
            setInCart(false);
            setCartItemId(null);
        }
    }, [cartItems, foodItem._id]);

    const handleAddToCart = async () => {
        if (!foodItem.inStock) return; // Prevent adding out-of-stock items

        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user._id) {
                toast.error("User not found. Please log in.");
                return;
            }

            const payload = {
                userId: user._id,
                items: [{ menuItemId: foodItem._id, quantity: 1 }],
            };

            await addToCart(payload);
            toast.success("Item added to cart!");
            refreshCart(); // Refresh cart state

        } catch (error) {
            toast.error("Failed to add item to cart");
            console.error("Error adding to cart:", error);
        }
    };

    const handleRemoveFromCart = async () => {
        try {
            if (!cartItemId) {
                toast.error("Invalid cart item ID!");
                return;
            }

            await removeCartItemAPI(cartItemId);
            toast.success("Item removed from cart!");
            refreshCart(); // Refresh cart state

        } catch (error) {
            toast.error("Failed to remove item from cart");
            console.error("Error removing from cart:", error);
        }
    };

    return (
        <div 
            className="menu-card flex bg-white rounded-3xl shadow-lg w-full h-[200px] mx-auto items-center my-2"
        >
            <div className="flex flex-col items-center w-1/3">
                <div className="w-24 h-36 bg-gray-200 rounded-2xl overflow-hidden flex items-center justify-center">
                    <img
                        src={foodItem.foodImage}
                        alt={foodItem.name}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            <div className="w-2/3 pr-3">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">{foodItem.name}</h2>
                    <span className="text-[#ffa16c] text-lg font-bold">₹{foodItem.price}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{foodItem.description}</p>

                <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>{foodItem.category}</span>
                    <span className={foodItem.inStock ? "text-green-500" : "text-red-500"}>
                        {foodItem.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                </div>

                {/* ✅ BUTTON LOGIC UPDATED */}
                {inCart ? (
                    <button
                        onClick={handleRemoveFromCart}
                        className="bg-red-500 text-white w-full p-2 rounded-full flex items-center justify-center mt-3 transition-all duration-300 hover:bg-red-700 border border-red-700"
                    >
                        <FaTrash className="mr-2 text-lg" />
                        Remove from Cart
                    </button>
                ) : (
                    <button
                        onClick={foodItem.inStock ? handleAddToCart : null}
                        disabled={!foodItem.inStock}
                        className={`w-full p-2 rounded-full flex items-center justify-center mt-3 transition-all duration-300 
                            ${foodItem.inStock 
                                ? "bg-[#ffa16c] text-white hover:bg-[#ff8b45] border border-[#ff8b45]"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`
                        }
                    >
                        <FaCartPlus className="mr-2 text-lg" />
                        {foodItem.inStock ? "Add to Cart" : "Out of Stock"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default MenuCard;
