import React, { useState } from "react";
import "./ToggleIcon.scss";

const ToggleIcon = ({ handleoffCanvass,handleClose,isOpen }) => {
  

  const toggleIcon = () => {
    if (isOpen) {
      handleClose();
    } else {
      handleoffCanvass();
    }
  };

  return (
    <div
      className={`toggle-icon ${isOpen ? "open" : ""}`}
      onClick={toggleIcon}
      aria-label="Menu Toggle"
      role="button"
    >
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export default ToggleIcon;
