/* eslint-disable no-unused-vars */
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUserAPI } from "../services/api";
import { FaBars, FaShoppingCart, FaUserCircle, FaClipboardList, FaSignOutAlt } from "react-icons/fa"; // Friendly icons from react-icons

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const location = useLocation(); // Get the current location

//   const handleLogout = async () => {
//     try {
//       const response = await logoutUserAPI();  // API call to logout

//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");

//       toast.success("Logged out successfully!", { position: "top-right" });

//       setTimeout(() => {
//         navigate("/");
//       }, 1500);
//     } catch (error) {
//       toast.error("Logout failed. Please try again.", { position: "top-right" });
//     }
//   };

//   // Function to check if the link is active
//   const isActive = (path) => location.pathname === path;

//   return (
//     <div className="w-72 bg-[#ffffff] text-[#424242] h-full flex flex-col shadow-lg"> {/* Increased width */}
//       {/* Logo Section */}
//       <div className="flex-shrink-0 p-6 mt-4"> {/* Increased padding */}
//         <img src="/public/Logo2.svg" alt="Logo" className="mx-auto w-32 mb-2" /> {/* Increased logo size */}
//       </div>

//       {/* Menu Items */}
//       <div className="flex-grow">
//         <ul className="space-y-6 p-6">
//           <li>
//             <Link
//               to="/menu"
//               className={`flex items-center justify-center p-3 rounded text-xl ${
//                 isActive("/menu") 
//                   ? "text-[#f7c4a1] pr-6 border-r-4 border-r-[#f7c4a1] font-bold" 
//                   : "text-[#424242] hover:text-[#f7c4a1] hover:bg-[#f8f8f8]"
//               }`}
//             >
//               <FaBars className={`mr-4 text-2xl ${isActive("/menu") ? "text-[#f7c4a1]" : "text-[#424242]"}`} /> {/* Larger icon size */}
//               Menu
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/cart"
//               className={`flex items-center justify-center p-3 rounded text-xl ${
//                 isActive("/cart") 
//                   ? "text-[#f7c4a1] pr-6 border-r-4 border-r-[#f7c4a1]" 
//                   : "text-[#424242] hover:text-[#f7c4a1] hover:bg-[#f8f8f8]"
//               }`}
//             >
//               <FaShoppingCart className={`mr-4 text-2xl ${isActive("/cart") ? "text-[#f7c4a1]" : "text-[#424242]"}`} /> {/* Larger icon size */}
//               Cart
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/profile"
//               className={`flex items-center justify-center p-3 rounded text-xl ${
//                 isActive("/profile") 
//                   ? "text-[#f7c4a1] pr-6 border-r-4 border-r-[#f7c4a1]" 
//                   : "text-[#424242] hover:text-[#f7c4a1] hover:bg-[#f8f8f8]"
//               }`}
//             >
//               <FaUserCircle className={`mr-4 text-2xl ${isActive("/profile") ? "text-[#f7c4a1]" : "text-[#424242]"}`} /> {/* Larger icon size */}
//               Profile
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/orders"
//               className={`flex items-center justify-center p-3 rounded text-xl ${
//                 isActive("/orders") 
//                   ? "text-[#f7c4a1] pr-6 border-r-4 border-r-[#f7c4a1]" 
//                   : "text-[#424242] hover:text-[#f7c4a1] hover:bg-[#f8f8f8]"
//               }`}
//             >
//               <FaClipboardList className={`mr-4 text-2xl ${isActive("/orders") ? "text-[#f7c4a1]" : "text-[#424242]"}`} /> {/* Larger icon size */}
//               Orders
//             </Link>
//           </li>
//         </ul>
//       </div>

//       {/* Logout Button */}
//       <div className="p-6 mt-auto border-t border-gray-400"> {/* Increased padding */}
//         <button
//           onClick={handleLogout}
//           className="flex items-center justify-center w-full p-3 text-[#424242] hover:text-red-600 hover:bg-[#f8f8f8] rounded text-xl"
//         >
//           <FaSignOutAlt className="mr-4 text-2xl" /> {/* Larger icon size */}
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logoutUserAPI();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      toast.success("Logged out successfully!", { position: "top-right" });
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      toast.error("Logout failed. Please try again.", { position: "top-right" });
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed left-0 top-0 w-72 h-screen bg-white text-[#424242] flex flex-col shadow-lg">
      {/* Logo Section */}
      <div className="p-6 mt-4">
        <img src="/Logo2.svg" alt="Logo" className="mx-auto w-32 mb-2" />
      </div>

      {/* Menu Items */}
      <div className="flex-grow overflow-y-auto">
        <ul className="space-y-6 p-6">
          {[
            { to: "/menu", icon: FaBars, label: "Menu" },
            { to: "/cart", icon: FaShoppingCart, label: "Cart" },
            { to: "/profile", icon: FaUserCircle, label: "Profile" },
            { to: "/orders", icon: FaClipboardList, label: "Orders" },
          ].map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`flex items-center p-3 rounded text-xl ${
                  isActive(to)
                    ? "text-[#f7c4a1] pr-6 border-r-4 border-r-[#f7c4a1] font-bold"
                    : "text-[#424242] hover:text-[#f7c4a1] hover:bg-[#f8f8f8]"
                }`}
              >
                <Icon className={`mr-4 text-2xl ${isActive(to) ? "text-[#f7c4a1]" : "text-[#424242]"}`} />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout Button */}
      <div className="p-6 border-t border-gray-400">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full p-3 text-[#424242] hover:text-red-600 hover:bg-[#f8f8f8] rounded text-xl"
        >
          <FaSignOutAlt className="mr-4 text-2xl" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
