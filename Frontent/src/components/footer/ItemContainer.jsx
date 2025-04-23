import React from 'react';
import Item from './Item';
import { products, Resources, Support, Company } from './menu';

const ItemContainer = () => {
  return (
    <div className="container-fluid py-5 px-3">
      <div className="row gy-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <Item Links={products} />
        </div>
        <div className="col-12 col-sm-6 col-lg-3 ">
          <Item Links={Resources} />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <Item Links={Company} />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <Item Links={Support} />
        </div>
      </div>
    </div>
  );
};

export default ItemContainer;
