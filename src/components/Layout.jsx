import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"; // Assuming you have a Sidebar component

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <div className="flex-grow h-full overflow-y-auto bg-gray-100 p-6">
        <Outlet /> {/* This renders the current route's component */}
      </div>
    </div>
  );
};

export default Layout;
