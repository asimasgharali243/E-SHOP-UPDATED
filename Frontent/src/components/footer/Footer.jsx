import React from 'react';
import ItemContainer from './ItemContainer';

const Footer = () => {
  return (
    <footer className="bg-dark text-white">
      <div className="container-fluid py-4 bg-opacity-10" style={{ backgroundColor: '#ffffff10' }}>
        <div className="row align-items-center justify-content-between px-4">
          <div className="col-md-6 mb-4 mb-md-0">
            <h1 className="h1 mb-2">Eshop</h1>
            <p className="mb-0">A multivendor shopping platform</p>
          </div>
          <div className="col-md-4">
            <div className="input-group">
              <input 
                type="text"
                className="form-control rounded mx-3"
                placeholder="Enter your email"
                
              />
              <button className="btn btn-info text-white rounded" type="button">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <ItemContainer />

      <div className="container text-center text-light small py-3">
        <div className="row">
          <div className="col-md-6 mb-2 mb-md-0">
            &copy; Eshop. All rights reserved
          </div>
          <div className="col-md-6">
            &copy; Terms. Privacy policy
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
