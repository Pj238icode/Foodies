import React, { useRef } from "react";
import { categories } from "../../assets/assets";
import "./ExploreMenu.css";

const ExploreMenu = ({ category, setCategory }) => {
  const menuRef = useRef(null);

  const scrollLeft = () => {
    menuRef.current?.scrollBy({ left: -250, behavior: "smooth" });
  };

  const scrollRight = () => {
    menuRef.current?.scrollBy({ left: 250, behavior: "smooth" });
  };

  return (
    <div className="explore-menu">
      <div className="menu-header">
        <h1>Explore Our Menu</h1>
        <div className="scroll-buttons">
          <button className="scroll-btn" onClick={scrollLeft}>
            <i className="bi bi-arrow-left"></i>
          </button>
          <button className="scroll-btn" onClick={scrollRight}>
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>

      <p className="menu-subtitle">Discover delicious dishes by category</p>

      <div className="explore-menu-list" ref={menuRef}>
        {categories.map((item, index) => (
          <div
            key={index}
            className={`explore-menu-item ${
              category === item.category ? "active" : ""
            }`}
            onClick={() =>
              setCategory((prev) =>
                prev === item.category ? "All" : item.category
              )
            }
          >
            <img src={item.icon} alt={item.category} />
            <p>{item.category}</p>
          </div>
        ))}
      </div>

      <hr />
    </div>
  );
};

export default ExploreMenu;
