import React, { useContext, useState } from "react";
import "./Menubar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Menubar = () => {
  const [active, setActive] = useState("home");
  const { quantities, token, setToken, setQuantities } = useContext(StoreContext);
  const uniqueItemsInCart = Object.values(quantities).filter((qty) => qty > 0).length;
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setQuantities({});
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg shadow-sm py-3 bg-white sticky-top">
      <div className="container">
        {/* Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <img src={assets.logo} alt="Logo" height={44} />
          <span className="fw-bold fs-4 brand-text">Fast Food</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Menu */}
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link
                className={`nav-link nav-item-link ${active === "home" ? "active" : ""}`}
                to="/"
                onClick={() => setActive("home")}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link nav-item-link ${active === "explore" ? "active" : ""}`}
                to="/explore"
                onClick={() => setActive("explore")}
              >
                Explore
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link nav-item-link ${active === "contact-us" ? "active" : ""}`}
                to="/contact"
                onClick={() => setActive("contact-us")}
              >
                Contact Us
              </Link>
            </li>
          </ul>

          {/* Cart + Auth */}
          <div className="d-flex align-items-center gap-4">
            <Link to="/cart" className="position-relative">
              <img src={assets.cart} alt="Cart" height={28} />
              {uniqueItemsInCart > 0 && (
                <span className="badge bg-danger cart-badge">{uniqueItemsInCart}</span>
              )}
            </Link>

            {!token ? (
              <>
                <button className="btn btn-outline-primary btn-sm px-3" onClick={() => navigate("/login")}>
                  Login
                </button>
                <button className="btn btn-primary btn-sm px-3" onClick={() => navigate("/register")}>
                  Sign Up
                </button>
              </>
            ) : (
              <div className="dropdown">
                <img
                  src={assets.profile}
                  alt="Profile"
                  width="35"
                  height="35"
                  className="rounded-circle dropdown-toggle profile-img"
                  data-bs-toggle="dropdown"
                />
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button className="dropdown-item" onClick={() => navigate("/myorders")}>My Orders</button>
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={logout}>Logout</button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menubar;
