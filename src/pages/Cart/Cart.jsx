import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./Cart.css";
import { Link, useNavigate } from "react-router-dom";
import { calculateCartTotals } from "../../util/cartUtils";

const Cart = () => {
  const navigate = useNavigate();
  const { foodList, increaseQty, decreaseQty, quantities, removeFromCart } =
    useContext(StoreContext);

  const cartItems = foodList.filter((food) => quantities[food.id] > 0);

  const { subtotal, shipping, tax, total } = calculateCartTotals(
    cartItems,
    quantities
  );

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty. Add something delicious!</p>
          <Link to="/" className="browse-btn">
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="cart-main">
          <div className="cart-items">
            {cartItems.map((food) => (
              <div key={food.id} className="cart-item">
                <img src={food.imageUrl} alt={food.name} className="cart-img" />
                <div className="cart-info">
                  <h3>{food.name}</h3>
                  <p className="food-category">{food.category}</p>
                  <div className="qty-controls">
                    <button onClick={() => decreaseQty(food.id)}>-</button>
                    <span>{quantities[food.id]}</span>
                    <button onClick={() => increaseQty(food.id)}>+</button>
                  </div>
                </div>
                <div className="cart-actions">
                  <p className="price">₹{food.price * quantities[food.id]}</p>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(food.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>₹{subtotal === 0 ? 0 : shipping.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <hr />
            <div className="summary-row total">
              <strong>Total</strong>
              <strong>₹{total.toFixed(2)}</strong>
            </div>
            <button
              className="checkout-btn"
              onClick={() => navigate("/order")}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
            <Link to="/" className="continue-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
