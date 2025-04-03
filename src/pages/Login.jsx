import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser({ email, password });
      console.log(response.data.data);

      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      toast.success(response.data.message, { position: "top-right" });

      setTimeout(() => {
        navigate("/menu");
      }, 1500);
    } catch (err) {
      toast.error(err.response.data.message, { position: "top-right" });
    }
  };

  return (
    <div className="h-screen bg-gradient-to-r from-[#fda06b] to-[#f8f8f8] flex items-center justify-center">
      <div className="bg-white w-96 p-8 rounded-lg shadow-lg space-y-6">
        <div className="text-center mb-4">
          <img src="/Logo2.svg" alt="Logo" className="mx-auto w-24 mb-2" />
          <h2 className="text-3xl font-semibold text-[#424242]">Welcome Back!</h2>
          <p className="text-gray-500 mt-2">Please sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-[#424242] font-medium">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full p-3 mt-2 border border-[#fda06b] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fda06b] text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[#424242] font-medium">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full p-3 mt-2 border border-[#fda06b] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fda06b] text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-[#fda06b] text-white rounded-lg hover:bg-[#f17e49] focus:outline-none focus:ring-2 focus:ring-[#fda06b]"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-[#424242]">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#fda06b] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
