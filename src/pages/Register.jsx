import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import { Link } from "react-router-dom"; 

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.name || !formData.phone) {
      toast.error("Please fill in all fields", { position: "top-right" });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await registerUser(formData);
      toast.success(response.message, { position: "top-right" });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Registration failed. Please try again.";
      toast.error(errorMessage, { position: "top-right" });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="h-screen bg-gradient-to-r from-[#fda06b] to-[#f8f8f8] flex items-center justify-center">
      <div className="bg-white w-96 p-8 rounded-lg shadow-lg space-y-6">
        <div className="text-center">
        <img src="/Logo2.svg" alt="Logo" className="mx-auto w-24 mb-2" />
          <h2 className="text-3xl font-semibold text-[#424242]">Create Your Account</h2>
          <p className="text-gray-500 mt-2">Please fill in the form to sign up</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block text-[#424242] font-medium">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              className="w-full p-3 mt-2 border border-[#fda06b] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fda06b] text-black"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-[#424242] font-medium">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-3 mt-2 border border-[#fda06b] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fda06b] text-black"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-[#424242] font-medium">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              className="w-full p-3 mt-2 border border-[#fda06b] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fda06b] text-black"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[#424242] font-medium">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full p-3 mt-2 border border-[#fda06b] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fda06b] text-black"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-[#fda06b] text-white rounded-lg hover:bg-[#f17e49] focus:outline-none focus:ring-2 focus:ring-[#fda06b]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-[#424242]">
          Already have an account?{" "}
          <Link to="/" className="text-[#fda06b] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;