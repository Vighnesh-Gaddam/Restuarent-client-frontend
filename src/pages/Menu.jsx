import React, { useState, useEffect } from "react";
import MenuCard from "../components/MenuCard";
import { fetchMenuItems, fetchCartItems } from "../services/api";
import { FaSearch } from "react-icons/fa";

const categories = ["All", "Snacks", "Drinks", "Meals", "Desserts"];

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const refreshCart = async () => {
    try {
      const response = await fetchCartItems();
      setCartItems(response.data.items);
    } catch (error) {
      console.error("Error refreshing cart:", error);
    }
  };

  useEffect(() => {
    const getMenuItems = async () => {
      try {
        const response = await fetchMenuItems();
        if (Array.isArray(response.data.data)) {
          setMenuItems(response.data.data);
          setFilteredItems(response.data.data);
        }
      } catch (err) {
        console.error("Failed to load menu items.", err);
      } finally {
        setLoading(false);
      }
    };

    getMenuItems();
    refreshCart();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setFilteredItems(category === "All" ? menuItems : menuItems.filter((item) => item.category === category));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setFilteredItems(menuItems.filter((item) => item.name.toLowerCase().includes(e.target.value.toLowerCase())));
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#ffa16c] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#ffa16c] font-semibold mt-3 text-center">Loading Menu...</p>
      </div>
    </div>
  );

  return (
    <div className="ml-72 h-screen overflow-y-auto p-6 scrollbar-hide">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search food..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f7c4a1]"
          />
          <FaSearch className="absolute left-3 top-4 text-gray-400" />
        </div>
        <div className="flex items-center space-x-4">
          <img
            src={user?.profilePic || "https://randomuser.me/api/portraits/men/45.jpg"}
            alt="Profile"   
            className="w-12 h-12 rounded-full border border-gray-300"
          />
          <div>
            <h4 className="font-semibold">{user?.name || "Guest"}</h4>
            <p className="text-sm text-gray-500">{user?.email || "guest@example.com"}</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">{selectedCategory} Items</h2>

      <div className="flex gap-4 mb-4">
        {categories.map((category) => (
          <button key={category} className={`px-5 py-2 rounded-full text-sm font-medium ${selectedCategory === category ? "bg-[#ffa16c] text-white" : "bg-gray-200 text-gray-600 hover:bg-[#f7c4a1] hover:text-white"}`} onClick={() => handleCategoryChange(category)}>
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <MenuCard key={item._id} foodItem={item} cartItems={cartItems} refreshCart={refreshCart} />
        ))}
      </div>
    </div>
  );
};

export default Menu;
