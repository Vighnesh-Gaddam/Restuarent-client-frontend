import { toast } from "react-toastify";
import axios from "axios";
import { Navigate } from "react-router";

// const BASE_URL = "http://localhost:1001/api";
const BASE_URL = "https://restuarant-backend-ffam.onrender.com/api";

// User Authentication APIs
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, userData, {
      headers: {
        "Content-Type": "application/json", // JSON format since it's not multipart in this case
      },
    });
    return response; // Return data to be used by the frontend
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, credentials, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // ✅ Allows cookies to be sent and received
    });

    return response;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};

export const logoutUserAPI = async () => {
  const response = await axios.post(`${BASE_URL}/auth/logout`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("refreshToken")}`, // Send token to invalidate session
    },
    withCredentials: true,
  });
  return response;
};

export const fetchMenuItems = async () => {
  const response = await axios.get(`${BASE_URL}/menu`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
    },
    withCredentials: true,
  });
  return response;
};



// export const addToCart = async (items) => {
//   try {
//     const response = await axios.post(
//       `${BASE_URL}/cart/`,
//       { items }, // Directly send the object (no need for JSON.stringify)
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//           "Content-Type": "application/json",
//         },
//         withCredentials: true, // Move this outside headers
//       }
//     );

//     console.log(response.data); // Axios auto-parses JSON
//     return response.data;
//   } catch (error) {
//     console.error("Error adding to cart:", error.response?.data || error.message);
//   }
// };

export const addToCart = async (items) => {
  try {
    const response = await axios.post(`${BASE_URL}/cart/`,
      { items }, // Ensure only `items` array is sent
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
        },
        withCredentials: true, // Must be outside headers
      }
    );

    console.log("all",response.data);
    return response;
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};

export const fetchCartItems = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/cart/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
      },
      withCredentials: true,
    });

    return response.data; // ✅ Return only the relevant data
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error; // Rethrow to handle errors in the calling function
  }
};

export const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/refresh-token`,
      {},
      { withCredentials: true }
    );

    const { accessToken } = response.data;
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      return accessToken;
    } else {
      throw new Error("Failed to refresh access token");
    }
  } catch (error) {
    console.error("Error refreshing token:", error.response?.data || error.message);
    localStorage.removeItem("accessToken"); // Remove invalid token
    toast.error("Session expired, please log in again.");
    throw error;
  }
};


// export const removeCartItemAPI = async (cartItemId) => {
//   try {
//     const response = await axios.delete(`${BASE_URL}/cart/${cartItemId}`, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//       },
//       withCredentials: true,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error removing cart item:", error.response?.data || error.message);
//     toast.error(error.response?.data?.message || "Failed to remove item!");
//     throw error;
//   }
// };
export const removeCartItemAPI = async (cartItemId) => {
  try {
    let token = localStorage.getItem("refreshToken");
    if (!token) throw new Error("Unauthorized: No access token");

    console.log("🛒 Removing item from cart:", cartItemId); // Debug log

    const response = await axios.delete(`${BASE_URL}/cart/${cartItemId}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("🚨 Error removing cart item:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Failed to remove item!");

    if (error.response?.status === 404) {
      console.warn("⚠️ Item not found, updating UI...");
      return { success: false, message: "Item not found in cart" };
    }

    throw error;
  }
};



export const clearCartAPI = async () => {
  try {
    const response = await axios.delete(`${BASE_URL}/cart/clear`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
      },
      withCredentials: true,
    });

    toast.success("Cart cleared successfully! 🗑️"); // ✅ Success notification
    return response.data;
  } catch (error) {
    console.error("Error clearing cart:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Failed to clear cart!");
    throw error;
  }
};

// ✅ More robust updateCartQuantity function
export const updateCartQuantityAPI = async (cartItemId, quantity) => {
  try {
    let token = localStorage.getItem("refreshToken");
    if (!token) throw new Error("Unauthorized: No access token");

    console.log("🔄 Updating cart item:", cartItemId, "to quantity:", quantity);

    const response = await axios.put(
      `${BASE_URL}/cart/${cartItemId}`,
      { quantity },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true, // Ensures cookies are sent with the request
      }
    );

    return response.data; // ✅ Return updated cart data
  } catch (error) {
    console.error("❌ Error updating cart quantity:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Failed to update cart item");

    throw new Error(error.response?.data?.message || "Error updating cart quantity");
  }
};


export const getUserProfile = async () => {
  try {
    let token = localStorage.getItem("refreshToken");
    if (!token) throw new Error("Unauthorized: No access token");
    console.log(`👤 Fetching profile... ${BASE_URL}/user/profile`);

    const response = await axios.get(`${BASE_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    return response.data; // ✅ Return only relevant data
  } catch (error) {
    console.error("🚨 Error fetching profile:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Failed to fetch profile");
    throw error;
  }
};

// ✅ Update User Profile
export const updateUserProfile = async (data) => {
  try {
    let token = localStorage.getItem("refreshToken");
    if (!token) throw new Error("Unauthorized: No access token");

    console.log("✏️ Updating profile:", data);

    const response = await axios.put(`${BASE_URL}/user/profile`, data, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    toast.success("Profile updated successfully! ✅");
    return response.data;
  } catch (error) {
    console.error("❌ Error updating profile:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Failed to update profile");
    throw error;
  }
};

// ✅ Delete User Account
export const deleteUserAPI = async () => {
  try {
    let token = localStorage.getItem("refreshToken");
    if (!token) throw new Error("Unauthorized: No access token");

    console.warn("🛑 Deleting user account...");

    const response = await axios.delete(`${BASE_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    toast.success("Account deleted successfully 🗑️");
    localStorage.removeItem("refreshToken"); // Clear token after deletion
    return response.data;
  } catch (error) {
    console.error("🚨 Error deleting account:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Failed to delete account!");
    throw error;
  }
};



export const verifyPayment = async (response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

    const verifyRes = await axios.post("/api/payments/verify", {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    // Check the correct success/failure flag returned from the backend
    if (verifyRes.data.status === "success") { // or any field like verifyRes.data.paymentStatus
      toast.success("Payment verified! 🎉");
      Navigate("/orders"); // Redirect to orders page
    } else {
      toast.error("Payment verification failed!");
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    toast.error("Error verifying payment.");
  }
};

export const placeOrderAPI = async (totalPrice) => {
  try {
    const token = localStorage.getItem("refreshToken"); // Get token from storage
    if (!token) {
      throw new Error("Unauthorized: No access token");
    }

    const response = await axios.post(
      `${BASE_URL}/order/`,
      { totalPrice }, // Send total price to backend
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Include token in request
          "Content-Type": "application/json",
        },
        withCredentials: true, // Ensure cookies are sent
      }
    );

    return response;
  } catch (error) {
    console.error("🚨 Error placing order:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to place order");
  }
};


// Verify the paymentimport axios from "axios";
// export const verifyPaymentAPI = async (paymentResponse) => {
//   try {
//     const token = localStorage.getItem("accessToken");

//     console.log("🔹 Token Retrieved from LocalStorage:", token ? "✅ Exists" : "❌ Not Found");

//     if (!token) {
//       console.error("🚨 No authentication token found! User might not be logged in.");
//       throw new Error("User not authenticated.");
//     }

//     console.log("🔹 Sending Payment Verification Request to Backend:", {
//       url: `${BASE_URL}/payments/verify`,
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       data: paymentResponse,
//     });

//     const { data } = await axios.post(
//       `${BASE_URL}/payments/verify`,
//       paymentResponse,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("✅ Payment Verification Response:", data);
//     return data;
//   } catch (error) {
//     console.error("❌ Payment Verification Failed:", error?.response?.data || error);
//     throw error;
//   }
// };

export const verifyPaymentAPI = async (paymentData) => {
  try {
    const token = localStorage.getItem("refreshToken"); // Retrieve token from storage

    if (!token) {
      console.error("🚨 No token found! User may not be authenticated.");
      return;
    }

    const response = await axios.post(
      "http://localhost:1001/api/payments/verify",
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add token
          "Content-Type": "application/json",
        },
        withCredentials: true, // Include credentials
      }
    );

    console.log("✅ Payment Verified:", response);
    return response;
  } catch (error) {
    console.error("❌ Payment Verification Failed:", error.response?.data || error);
  }
};

// Fetch user orders
export const fetchUserOrders = async () => {
  try {
    const token = localStorage.getItem("refreshToken"); // Assuming you use JWT for auth
    if (!token) throw new Error("Unauthorized: No access token");
    const response = await axios.get(`${BASE_URL}/order/myOrders`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

