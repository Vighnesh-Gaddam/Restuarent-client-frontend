import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const OrderCard = ({ order }) => {
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // 🎨 Dynamic Colors for Status & Payment
  const statusColors = {
    processing: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const paymentColors = {
    pending: "bg-orange-100 text-orange-700",
    paid: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
  };

  // 🏎 Infinite Carousel Settings
  const sliderRef = useRef(null);
  const sliderSettings = {
    dots: false,
    infinite: true, // ♾️ Makes it loop infinitely
    centerMode: true, // 🎯 Centers slides for a smooth effect
    speed: 500,
    slidesToShow: Math.min(order.items.length, 1), // Show 2 slides if available
    slidesToScroll: 1,
    autoplay: order.items.length > 1,
    autoplaySpeed: 2000,
    // pauseOnHover: true,
    arrows: false,
    swipe: true,
  };

  return (
    <div className="bg-white rounded-lg border shadow-lg p-4 w-full max-w-md hover:shadow-2xl transition-all">
      {/* Order Items with Image First (Infinite Carousel if more than 1) */}
      <div className="relative">
        {order.items.length > 1 ? (
          <div className="relative">
            {/* Slider */}
            <Slider ref={sliderRef} {...sliderSettings} className="px-4">
              {order.items.map((item) => (
                <div key={item._id} className="p-3">
                  <div className="flex flex-col items-center bg-gray-100 rounded-lg p-4 shadow-md">
                    <img
                      src={item.menuItemId.foodImage}
                      alt={item.menuItemId.name}
                      className="w-32 h-32 object-cover rounded-md"
                    />
                    <p className="font-medium text-base mt-2 text-center">{item.menuItemId.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        ) : (
          // Show Single Item Without Carousel
          <div className="flex flex-col items-center bg-gray-100 rounded-lg p-4 shadow-md">
            <img
              src={order.items[0].menuItemId.foodImage}
              alt={order.items[0].menuItemId.name}
              className="w-32 h-32 object-cover rounded-md"
            />
            <p className="font-medium text-base mt-2 text-center">{order.items[0].menuItemId.name}</p>
            <p className="text-sm text-gray-500">Qty: {order.items[0].quantity}</p>
          </div>
        )}
      </div>

      {/* Order Details Below Image */}
      <div className="mt-4">
        <div className="flex justify-between items-center border-b pb-3 mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Order Placed</h3>
            <p className="text-sm text-gray-600">{formattedDate}</p>
          </div>
          <span className={`px-3 py-1 rounded-md text-sm font-medium ${statusColors[order.status]}`}>
            {order.status}
          </span>
        </div>

        {/* Price & Payment */}
        <div className="flex justify-between items-center mb-3">
          <p className="text-lg font-bold text-blue-700">₹{order.totalPrice}</p>
          <span className={`px-3 py-1 rounded-md text-sm font-medium ${paymentColors[order.paymentStatus]}`}>
            {order.paymentStatus}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
