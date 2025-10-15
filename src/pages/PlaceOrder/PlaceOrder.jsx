import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { calculateCartTotals } from "../../util/cartUtils";
import { toast } from "react-toastify";
import { RAZORPAY_KEY } from "../../util/contants";
import { useNavigate } from "react-router-dom";
import { createOrder, deleteOrder, verifyPayment } from "../../service/orderService";
import { clearCartItems } from "../../service/cartService";

const PlaceOrder = () => {
  const { foodList, quantities, setQuantities, token } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    state: "",
    city: "",
    zip: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((data) => ({ ...data, [name]: value }));
  };

  const cartItems = foodList.filter((food) => quantities[food.id] > 0);
  const { subtotal, shipping, tax, total } = calculateCartTotals(cartItems, quantities);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const orderData = {
      userAddress: `${data.firstName} ${data.lastName}, ${data.address}, ${data.city}, ${data.state}, ${data.zip}`,
      phoneNumber: data.phoneNumber,
      email: data.email,
      orderedItems: cartItems.map((item) => ({
        foodId: item.foodId,
        quantity: quantities[item.id],
        price: item.price * quantities[item.id],
        category: item.category,
        imageUrl: item.imageUrl,
        description: item.description,
        name: item.name,
      })),
      amount: total.toFixed(2),
      orderStatus: "Preparing",
    };

    try {
      const response = await createOrder(orderData, token);
      if (response.razorpayOrderId) initiateRazorpayPayment(response);
      else toast.error("Unable to place order");
    } catch (error) {
      toast.error("Error placing order.");
    }
  };

  const initiateRazorpayPayment = (order) => {
    const options = {
      key: RAZORPAY_KEY,
      amount: order.amount,
      currency: "INR",
      name: "Food Land",
      description: "Food Order Payment",
      order_id: order.razorpayOrderId,
      handler: verifyPaymentHandler,
      prefill: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        contact: data.phoneNumber,
      },
      theme: { color: "#ff6600" },
      modal: { ondismiss: deleteOrderHandler },
    };
    const razor = new window.Razorpay(options);
    razor.open();
  };

  const verifyPaymentHandler = async (paymentResponse) => {
    const payload = {
      razorpay_payment_id: paymentResponse.razorpay_payment_id,
      razorpay_order_id: paymentResponse.razorpay_order_id,
      razorpay_signature: paymentResponse.razorpay_signature,
    };
    try {
      const success = await verifyPayment(payload, token);
      if (success) {
        toast.success("Payment successful!");
        await clearCartItems(token, setQuantities);
        navigate("/myorders");
      } else toast.error("Payment failed!");
    } catch {
      toast.error("Payment verification failed.");
    }
  };

  const deleteOrderHandler = async (orderId) => {
    try {
      await deleteOrder(orderId, token);
    } catch {
      toast.error("Couldn't cancel the order.");
    }
  };

  return (
    <div className="placeorder-wrapper">
      <div className="logo-center">
        <img src={assets.logo} alt="Logo" />
      </div>
      <div className="checkout-container">
        {/* Billing Form */}
        <form className="billing-form" onSubmit={onSubmitHandler}>
          <h2>Billing Details</h2>
          <div className="form-group">
            <input name="firstName" placeholder="First Name" required onChange={onChangeHandler} />
            <input name="lastName" placeholder="Last Name" required onChange={onChangeHandler} />
          </div>
          <input name="email" type="email" placeholder="Email" required onChange={onChangeHandler} />
          <input name="phoneNumber" placeholder="Mobile Number" required onChange={onChangeHandler} />
          <input name="address" placeholder="Address" required onChange={onChangeHandler} />
          <div className="form-group">
            <input name="state" placeholder="State" required onChange={onChangeHandler} />
            <input name="city" placeholder="City" required onChange={onChangeHandler} />
            <input name="zip" placeholder="Zip Code" required onChange={onChangeHandler} />
          </div>
          <button className="checkout-btn" disabled={cartItems.length === 0}>
            Pay ₹{total.toFixed(2)} Securely
          </button>
        </form>

        {/* Cart Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          {cartItems.map((item) => (
            <div className="summary-item" key={item.id}>
              <span>{item.name} × {quantities[item.id]}</span>
              <span>₹{item.price * quantities[item.id]}</span>
            </div>
          ))}
          <hr />
          <div className="summary-item"><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div className="summary-item"><span>Shipping</span><span>₹{shipping.toFixed(2)}</span></div>
          <div className="summary-item"><span>Tax</span><span>₹{tax.toFixed(2)}</span></div>
          <div className="summary-total"><b>Total</b><b>₹{total.toFixed(2)}</b></div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
