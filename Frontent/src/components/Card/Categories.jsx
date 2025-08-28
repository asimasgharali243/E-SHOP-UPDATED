import React from "react";

const CategoryCard = ({ category }) => {
  return (
    <div className="categories-container">
      <div className="category-icon">
        <i className={category.icon}></i>
      </div>
      <div className="category-name">{category.name}</div>
    </div>
  );
};

export default CategoryCard;
