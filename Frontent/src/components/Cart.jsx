import React, { useState, useCallback } from "react";
import {  Link,Links, Navigate } from "react-router-dom";
import { Row, Col, Button, Form, Image, Alert, Table } from "react-bootstrap";
import CustomContainer from "../components/SubComponent/CustomContainer";
import useIsmobile from "../components/CustomHook/useIsmobile";
import "./Cart.scss";

const Cart = () => {
  const isMobile = useIsmobile();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "LCD Monitor",
      price: 650,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: 2,
      name: "H1 Gamepad",
      price: 550,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&q=80&w=200",
    },
  ]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCartClick = useCallback((e) => {
    const type = e.target.getAttribute("data-type");
    const id = Number(e.target.getAttribute("data-id"));
    const value = e.target.value;

    if (!id) return;

    setCartItems((prev) =>
      prev
        .map((item) => {
          if (type === "qty" && item.id === id) {
            return { ...item, quantity: parseInt(value) || 1 };
          }
          return item;
        })
        .filter((item) => (type === "delete" && item.id === id ? false : true))
    );
    if(type ==="open" && id){
    Navigate(`/product/${id}`);
    }
  }, []);

  const handleClearCart = () => setCartItems([]);

  return (
    <main>
      <CustomContainer className="my-3">
        <h1 className=" mb-3 "
        style={{ fontSize: `24px`,fontWeight:"bold",padding:'0px 12px' } }
        >Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <><Alert variant="info" className="text-center">Your cart is currently empty.</Alert>
          <div className="text-center"
          style={{ fontSize: `14px`} }
          ><Link  to="/"> Return to Shop</Link></div></>
        ) : (
          <Row className="gx-4 gy-4" onChange={handleCartClick} onClick={handleCartClick}>
            {/* Cart Items Section */}
            <Col xs={12} lg={8}>
              <section className="bg-white p-4 rounded shadow-sm"
               style={{color:`var(--text1)`}}
              >
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                  <h2 className="h5 mb-0">Cart Items</h2>
                  <Button variant="outline-danger" size="sm" onClick={handleClearCart}>Clear Cart</Button>
                </div>

                <div className="cart-list">
                  {isMobile ? (
                    <div className="mobile-cart d-flex flex-column gap-3">
                      {cartItems.map((item) => (
                        <article key={item.id} 
                        data-id={item.id}
                        datatype="open"
                        className="mobile-cart-item d-flex p-3 rounded shadow-sm bg-light position-relative">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={100}
                            height={100}
                            style={{ objectFit: "cover", borderRadius: "6px" }}
                            loading="lazy"
                          />
                          <div className="ms-3 flex-grow-1"
                          style={{ fontSize: `12px`} }
                          >
                            <h3 className="item-name mb-1"
                            style={{ fontSize: `12px`} }
                            >{item.name}</h3>
                            <p className="mb-1 text-muted">${item.price.toFixed(2)}</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fw-bold">${(item.price * item.quantity).toFixed(2)}</span>
                              <Form.Select
                                value={item.quantity}
                                size="sm"
                                data-id={item.id}
                                data-type="qty"
                                className="qty-select"
                              >
                                {[...Array(50).keys()].slice(1).map((x) => (
                                  <option key={x} value={x}>{x}</option>
                                ))}
                              </Form.Select>
                            </div>
                          </div>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-2"
                            data-id={item.id}
                            data-type="delete"
                            aria-label="Remove item"
                          >
                            <i
                             data-id={item.id}
                            data-type="delete"
                           
                            className="bi bi-trash"></i>
                          </Button>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="cart-table-wrapper">
                      <Table responsive  className="cart-table">
                        <thead>
                          <tr>
                            <th colSpan={6}>
                              <div className="d-flex justify-content-between gap-2 "
                              
                              style={{ fontSize: `16px `} }
                              >
                                <span>Image</span>
                                <span>Name</span>
                                <span>Price</span>
                                <span>Qty</span>
                                <span>Total</span>
                                <span>Action</span>
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartItems.map((item) => (
                            <tr key={item.id} 
                           className="cart-item-row"
                            >
                              <td colSpan={6} className="border-none outline-none" >
                                <div className="cart-item-wrapper d-flex justify-content-between align-items-center p-3 border rounded mb-3"
                                style={{ fontSize: `14px `}
                               }
datatype="open"
data-id={item.id}

                                >
                                  <div className="d-flex align-items-center gap-3">
                                    <Image
                                    
                                    style={{ objectFit: "cover", borderRadius: "6px" }}
                                    src={item.image} alt={item.name} width={80} height={80} loading="lazy" />
                                    <div>{item.name}</div>
                                  </div>
                                  <div>${item.price.toFixed(2)}</div>
                                  <Form.Select
                                    value={item.quantity}
                                    size="sm"
                                    data-id={item.id}
                                    data-type="qty"
                                    style={{ width: "60px" }}
                                  >
                                    {[...Array(50).keys()].slice(1).map((x) => (
                                      <option key={x} value={x}>{x}</option>
                                    ))}
                                  </Form.Select>
                                  <div>${(item.price * item.quantity).toFixed(2)}</div>
                                  <Button variant="outline-danger " style={{border: "none",fontSize: `16px `}} size="sm" data-id={item.id} data-type="delete"
                                  aria-label="Remove item button"
                                  >
 <i className="bi bi-trash" 
 aria-label="Remove item icon"
                             data-id={item.id}
                            data-type="delete"
                           ></i>                              
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
                  <Button as={Link} to="/" variant="outline-secondary">Return to Shop</Button>
                  <Button variant="outline-primary"  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  style={{background:`var(--primary)`, fontSize:`14px `,color:`var(--white)`}}
                    
                    >
                    Update Cart
                  </Button>
                </div>
              </section>
            </Col>

            {/* Summary Section */}
            <Col xs={12} lg={4}>
              <aside className="bg-white p-4 rounded shadow-sm"
              style={{color:`var(--text1)`}}
              >
                <h2 className="h5 mb-3"
                style={{fontSize: `20px `, fontWeight: `bold`} }
                >Cart Summary</h2>
                <div className="d-flex justify-content-between mb-2" 
                style={{ fontSize: `14px`} }
                >
                  <span>Subtotal:</span>
                  <strong>${subtotal.toFixed(2)}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2"
                style={{ fontSize: `14px`} }
                >
                  <span>Shipping:</span>
                  <strong>Free</strong>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold mb-3">
                  <span>Total:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <Button as={Link} to="/checkout"  className="w-100 rounded" style={{fontSize: `16px `, fontWeight: `bold`, backgroundColor: `var(--secondary)`,border: `none`,borderRadius: `0px`} }  >
                  Proceed to Checkout
                </Button>
              </aside>
            </Col>
          </Row>
        )}
      </CustomContainer>
    </main>
  );
};

export default Cart;









// import React, { useState, useCallback } from "react";
// import { Link } from "react-router-dom";
// import CustomContainer from "../components/SubComponent/CustomContainer";
// import { Row, Col, Button, Form, Image, Alert, Table } from "react-bootstrap";
// import "./Cart.scss";
// import useIsmobile from "../components/CustomHook/useIsmobile";

// const Cart = () => {
//   const isMobile = useIsmobile();
//   const [cartItems, setCartItems] = useState([
//     {
//       id: 1,
//       name: "LCD Monitor msd,mda,d saa ",
//       price: 650,
//       quantity: 1,
//       image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&q=80&w=200",
//     },
//     {
//       id: 2,
//       name: "H1 Gamepad",
//       price: 550,
//       quantity: 2,
//       image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&q=80&w=200",
//     },
//   ]);

//   const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

//   const handleCartClick = useCallback((e) => {
//     const type = e.target.getAttribute("data-type");
//     const id = Number(e.target.getAttribute("data-id"));
//     const value = e.target.value;

//     if (!id) return;

//     setCartItems((prev) =>
//       prev.map((item) => {
//         if (type === "qty" && item.id === id) {
//           return { ...item, quantity: parseInt(value) || 1 };
//         }
//         return item;
//       }).filter((item) => (type === "delete" && item.id === id ? false : true))
//     );
//   }, []);

//   const handleClearCart = () => setCartItems([]);

//   return (
//     <main>
//       <CustomContainer className="my-5">
//         <h1 className="text-center mb-4">Shopping Cart</h1>
//         {cartItems.length === 0 ? (
//           <Alert variant="info" className="text-center">Your cart is currently empty.</Alert>
//         ) : (
//           <Row className="gx-4 gy-4" onChange={handleCartClick} onClick={handleCartClick}>
//             <Col xs={12} lg={8}>
//               <section className="bg-white p-4 rounded shadow-sm">
//                 <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
//                   <h2 className="h5 mb-0">Cart Items</h2>
//                   <Button variant="outline-danger" size="sm" onClick={handleClearCart}>Clear Cart</Button>
//                 </div>

//                 <div className="cart-list">
//                   {isMobile ? (
//                     <div className="mobile-cart d-flex flex-column gap-2" >
//                       {cartItems.map((item) => (
//                         <div key={item.id} className="mobile-cart-item w-100  d-flex px-1 py-3 rounded shadow-md position-relative">
//                           <Image
//                             src={item.image}
//                             alt={item.name}
//                             width={100}
//                             style={{ objectFit: "cover" ,aspectRatio:"1/1",padding:"1px"}} 

//                             className="mobile-cart-image"
//                             loading="lazy"
//                           />
//                           <div className="mobile-cart-details d-flex flex-column w-100 ">
//                             <h3 className="item-name "
//                             style={{ fontSize: `12px`,paddingRight:"15px"} }
//                             >{item.name}</h3>
//                              <div className="text-end position-absolute top-0 end-0   me-2"
//                              style={{paddingTop:"10px",objectFit:"cover" ,border:"none",zIndex:"2" }}
//                              >
//                               <Button
//                                 variant="outline-danger"
//                                 size="sm"
//                                 style={{  width:"auto",aspectRatio:"1/1",padding:"1px",objectFit:"cover" ,border:"none",zIndex:"2" }}
//                                 data-id={item.id}
//                                 data-type="delete"
//                               >
//                                <i className="bi bi-trash" ></i>
//                               </Button>
//                             </div>

//                             <div className="cart-info-row text-muted">
                              
//                               <span className="value text-muted"
//                               style={{ fontSize: `12px`} }
                              
//                               >{item.price.toFixed(2)}</span>
//                             </div>

//                             <div className="cart-info-row align-items-center">
//                             <div className="cart-info-row ">
//                               <span className="value  fw-bold"
//                               style={{ fontSize: `13px`} }
//                               >${(item.price * item.quantity).toFixed(2)}</span>
//                             </div>  
//                               <Form.Select
//                                 value={`${item.quantity}`} 
//                                 size="sm"
//                                 style={{ maxWidth: "70px" }}
//                                 data-id={item.id}
//                                 data-type="qty"
//                                 className="qty-select"
//                               >
//                                 {[...Array(50).keys()].slice(1).map((x) => (
//                                   <option key={x} value={x}>{x}</option>
//                                 ))}
//                               </Form.Select>
//                             </div>

                            

                           
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                    <div className="cart-table-wrapper">
//   <Table hover responsive className="cart-table mb-0">
//     <thead>
//   <tr  className="cart-item-row">
//           <td colSpan={6}>
//             <div className="cart-item-wrapper d-flex align-items-center justify-content-between rounded p-3 border mb-3">
//               <div className="d-flex align-items-center gap-3">
//            Image
//               </div>
//               <div>Price</div>
//               <div>Qty</div>
//               <div>Total</div>
//               <div>Action</div>
//             </div>
//           </td>
//         </tr>
 
//       {/* <tr className="cart-table-header">
//         <th>Image</th>
//         <th>Product</th>
//         <th>Price</th>
//         <th>Qty</th>
//         <th>Total</th>
//         <th>Action</th>
//       </tr> */}
//     </thead>
//     <tbody>
//       {cartItems.map((item) => (
//         <tr key={item.id} className="cart-item-row">
//           <td colSpan={6}>
//             <div className="cart-item-wrapper d-flex align-items-center justify-content-between rounded p-3 border mb-3">
//               <div className="d-flex align-items-center gap-3">
//                 <Image src={item.image} alt={item.name} width={80} height={80} loading="lazy" />
//                 <div className="fw-bold">{item.name}</div>
//               </div>
//               <div>${item.price.toFixed(2)}</div>
//               <Form.Select
//                 value={item.quantity}
//                 size="sm"
//                 data-id={item.id}
//                 data-type="qty"
//                 style={{ width: "60px" }}
//               >
//                 {[...Array(50).keys()].slice(1).map((x) => (
//                   <option key={x} value={x}>{x}</option>
//                 ))}
//               </Form.Select>
//               <div>${(item.price * item.quantity).toFixed(2)}</div>
//               <Button variant="outline-danger" size="sm" data-id={item.id} data-type="delete">
//                 ×
//               </Button>
//             </div>
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </Table>
// </div>
// )}
//                 </div>

//                 <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
//                   <Button as={Link} to="/" variant="outline-secondary">Return to Shop</Button>
//                   <Button variant="outline-primary" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
//                     Update Cart
//                   </Button>
//                 </div>
//               </section>
//             </Col>

//             <Col xs={12} lg={4}>
//               <aside className="bg-white p-4 rounded shadow-sm">
//                 <h2 className="h5 mb-3">Cart Summary</h2>
//                 <div className="d-flex justify-content-between mb-2">
//                   <span>Subtotal:</span>
//                   <strong>${subtotal.toFixed(2)}</strong>
//                 </div>
//                 <div className="d-flex justify-content-between mb-2">
//                   <span>Shipping:</span>
//                   <strong>Free</strong>
//                 </div>
//                 <hr />
//                 <div className="d-flex justify-content-between fw-bold mb-3">
//                   <span>Total:</span>
//                   <span>${subtotal.toFixed(2)}</span>
//                 </div>
//                 <Button as={Link} to="/checkout" variant="success" className="w-100">Proceed to Checkout</Button>
//               </aside>
//             </Col>
//           </Row>
//         )}
//       </CustomContainer>
//     </main>
//   );
// };

// export default Cart;
