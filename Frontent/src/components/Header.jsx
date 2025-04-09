import React from 'react';

const Header = ({ toggleTheme }) => {
  return (
    <header className="header">
      <div className="container">
        <h1 className="logo">ShopEase</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/shop">Shop</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <button onClick={toggleTheme}>Switch Theme</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
