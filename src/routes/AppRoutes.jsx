import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Menu from "../pages/Menu";
import Cart from "../pages/Cart";
import Profile from "../pages/Profile";
import Orders from "../pages/Orders";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/Layout";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes wrapped in Layout and ProtectedRoute */}
        <Route element={<Layout />}>
          <Route 
            path="/menu" 
            element={
              <ProtectedRoute>
                <Menu />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Default Redirect for Unmatched Routes */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
