import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { fetchUserOrders } from "../../service/orderService";
import { assets } from "../../assets/assets";
import "./MyOrders.css";

const MyOrders = () => {
  const { token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    const response = await fetchUserOrders(token);
    setData(response);
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders-container">
      <h2 className="text-center mb-4">📦 My Orders</h2>

      {data.length === 0 ? (
        <p className="no-orders">No orders yet. Start ordering delicious food! 🍔</p>
      ) : (
        <div className="orders-wrapper">
          {data.map((order, index) => (
            <div key={index} className="order-card">
              <div className="order-left">
                <img src={assets.delivery} alt="" className="delivery-icon" />
                <div>
                  <h5>Order #{index + 1}</h5>
                  <p className="order-items">
                    {order.orderedItems.map((item, idx) =>
                      idx === order.orderedItems.length - 1
                        ? `${item.name} x${item.quantity}`
                        : `${item.name} x${item.quantity}, `
                    )}
                  </p>
                </div>
              </div>

              <div className="order-right">
                <p className="order-price">₹{order.amount.toFixed(2)}</p>
                <span
                  className={`status-badge ${
                    order.orderStatus === "delivered"
                      ? "status-delivered"
                      : order.orderStatus === "processing"
                      ? "status-processing"
                      : "status-pending"
                  }`}
                >
                  ● {order.orderStatus}
                </span>
                <button className="refresh-btn" onClick={fetchOrders}>
                  ⟳
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
