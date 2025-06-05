import React, { useState } from "react";
import "./ToggleIcon.scss";

const ToggleIcon = ({ handleoffCanvass,handleClose,isOpen ,style}) => {
  

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
      <span style={style}></span>
      <span style={style}></span>
      <span style={style}></span>
    </div>
  );
};

export default ToggleIcon;
