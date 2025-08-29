import React from "react";
import { useNavigate } from "react-router-dom";
import "./Categories.scss";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to the search page like in header logic
    navigate(`/search?query=${encodeURIComponent(category.name)}`);
  };

  return (
    <div
      className="categories-container"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className="category-icon">
        {category.icon ? (
          <img src={category.icon} alt={category.name} />
        ) : (
          <i className="fa fa-folder"></i>
        )}
      </div>

      <div className="category-name">{category.name}</div>
    </div>
  );
};

export default CategoryCard;
