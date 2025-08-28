import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  Form,
  Image,
  Alert,
  Table,
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomContainer from "../../components/SubComponent/CustomContainer";
import useIsMobile from "../../components/CustomHook/useIsmobile";
import {
  selectCartItems,
  selectCartTotal,
  selectCartStatus,
  selectSyncStatus,
  selectCartError,
} from "../../redux/features/Cart/SliceCard";
import { fetchCartAPI, clearCartAPI } from "../../redux/api/cartApi/cartApi";
import {
  updateCartQuantity,
  removeFromCart,
  forceSyncCart,
} from "../../redux/features/Cart/CartAction";
import "./Cart.scss";

const normalizeItem = (item, index) => {
  const id = item?.productId || item?.product?._id || `temp-${index}`;
  const name = item?.name || item?.product?.name || "Unnamed Product";
  const price = Number(item?.price || item?.product?.price || 0);
  const qty = item?.quantity || 1;
  const img =
    item?.product?.featureImages?.[0]?.url ||
    item?.image ||
    "/assets/placeholder-product.jpg";

  return { id, name, price, qty, img };
};

const Cart = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const cartStatus = useSelector(selectCartStatus);
  const syncStatus = useSelector(selectSyncStatus);
  const error = useSelector(selectCartError);

  const [localQuantities, setLocalQuantities] = useState({});

  // Update local quantity state when cart changes
  useEffect(() => {
    const quantities = {};
    cartItems.forEach((item, index) => {
      const { id, qty } = normalizeItem(item, index);
      quantities[id] = qty;
    });
    setLocalQuantities(quantities);
  }, [cartItems]);

  // Fetch cart on load
  useEffect(() => {
    dispatch(fetchCartAPI());
  }, [dispatch]);

  const handleQuantityChange = useCallback(
    (productId, newQuantity) => {
      setLocalQuantities((prev) => ({ ...prev, [productId]: newQuantity }));
      dispatch(updateCartQuantity(productId, newQuantity));
    },
    [dispatch]
  );

  const handleRemoveItem = useCallback(
    (productId) => dispatch(removeFromCart(productId)),
    [dispatch]
  );

  const handleClearCart = useCallback(() => {
    dispatch(clearCartAPI());
  }, [dispatch]);

  const handleProductClick = useCallback(
    (productId) => productId && navigate(`/product/${productId}`),
    [navigate]
  );

  // Memoized normalized items
  const normalizedItems = useMemo(
    () => cartItems.map((item, i) => normalizeItem(item, i)),
    [cartItems]
  );

  if (cartStatus === "loading") {
    return (
      <CustomContainer className="my-3">
        <div className="text-center py-5">
          <Spinner animation="border" role="status" className="me-2" />
          Loading cart...
        </div>
      </CustomContainer>
    );
  }

  return (
    <main>
      <CustomContainer className="my-3">
        <h1 className="mb-3 fw-bold" style={{ fontSize: "24px" }}>
          Shopping Cart
        </h1>

        {normalizedItems.length === 0 ? (
          <>
            <Alert variant="info" className="text-center">
              Your cart is currently empty.
            </Alert>
            <div className="text-center" style={{ fontSize: "14px" }}>
              <Link to="/">Return to Shop</Link>
            </div>
          </>
        ) : (
          <Row className="gx-4 gy-4">
            {syncStatus === "loading" && (
              <Col xs={12}>
                <Alert variant="info" className="d-flex align-items-center">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Syncing cart with server...
                </Alert>
              </Col>
            )}

            {error && (
              <Col xs={12}>
                <Alert variant="warning">
                  Sync error: {error}. Changes are saved locally.
                </Alert>
              </Col>
            )}

            {/* CART ITEMS */}
            <Col xs={12} lg={8}>
              <section className="bg-white p-4 rounded shadow-sm">
                <div className="d-flex justify-content-between mb-3">
                  <h2 className="h5 mb-0">Cart Items</h2>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={handleClearCart}
                    disabled={syncStatus === "loading"}
                  >
                    Clear Cart
                  </Button>
                </div>

                <div className="cart-list">
                  {isMobile ? (
                    <div className="mobile-cart d-flex flex-column gap-3">
                      {normalizedItems.map(({ id, name, price, qty, img }) => (
                        <article
                          key={id}
                          className="mobile-cart-item d-flex p-3 rounded shadow-sm bg-light position-relative"
                        >
                          <Image
                            src={img}
                            alt={name}
                            width={100}
                            height={100}
                            style={{
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                            loading="lazy"
                            onClick={() => handleProductClick(id)}
                            role="button"
                          />
                          <div className="ms-3 flex-grow-1">
                            <h3
                              className="item-name mb-1"
                              style={{ fontSize: "12px", cursor: "pointer" }}
                              onClick={() => handleProductClick(id)}
                            >
                              {name}
                            </h3>
                            <p className="mb-1 text-muted">
                              ${price.toFixed(2)}
                            </p>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fw-bold">
                                ${(price * qty).toFixed(2)}
                              </span>
                              <Form.Select
                                value={localQuantities[id] || qty}
                                size="sm"
                                onChange={(e) =>
                                  handleQuantityChange(
                                    id,
                                    parseInt(e.target.value)
                                  )
                                }
                                disabled={syncStatus === "loading"}
                              >
                                {[...Array(50).keys()].slice(1).map((x) => (
                                  <option key={x} value={x}>
                                    {x}
                                  </option>
                                ))}
                              </Form.Select>
                            </div>
                          </div>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-2"
                            onClick={() => handleRemoveItem(id)}
                            disabled={syncStatus === "loading"}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="cart-table-wrapper">
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Qty</th>
                            <th>Total</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {normalizedItems.map(
                            ({ id, name, price, qty, img }) => (
                              <tr key={id}>
                                <td>
                                  <Image
                                    src={img}
                                    alt={name}
                                    width={80}
                                    height={80}
                                    style={{
                                      objectFit: "cover",
                                      borderRadius: "6px",
                                      cursor: "pointer",
                                    }}
                                    loading="lazy"
                                    onClick={() => handleProductClick(id)}
                                    role="button"
                                  />
                                </td>
                                <td
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleProductClick(id)}
                                >
                                  {name}
                                </td>
                                <td>${price.toFixed(2)}</td>
                                <td>
                                  <Form.Select
                                    value={localQuantities[id] || qty}
                                    size="sm"
                                    onChange={(e) =>
                                      handleQuantityChange(
                                        id,
                                        parseInt(e.target.value)
                                      )
                                    }
                                    disabled={syncStatus === "loading"}
                                    style={{ width: "60px" }}
                                  >
                                    {[...Array(50).keys()].slice(1).map((x) => (
                                      <option key={x} value={x}>
                                        {x}
                                      </option>
                                    ))}
                                  </Form.Select>
                                </td>
                                <td>${(price * qty).toFixed(2)}</td>
                                <td>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleRemoveItem(id)}
                                    disabled={syncStatus === "loading"}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </Button>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
                  <Button
                    as={Link}
                    to="/"
                    variant="outline-secondary"
                    style={{
                      color: `var(--primary)`,
                      borderColor: `var(--primary)`,
                      borderRadius: `3px`,
                    }}
                  >
                    Return to Shop
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => dispatch(forceSyncCart())}
                    disabled={syncStatus === "loading"}
                    style={{
                      color: `var(--white)`,
                      borderColor: `var(--primary)`,
                      borderRadius: `3px`,
                    }}
                  >
                    {syncStatus === "loading" ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Syncing...
                      </>
                    ) : (
                      "Force Sync Cart"
                    )}
                  </Button>
                </div>
              </section>
            </Col>

            {/* CART SUMMARY */}
            <Col xs={12} lg={4}>
              <aside className="bg-white p-4 rounded shadow-sm">
                <h2 className="h5 mb-3">Cart Summary</h2>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <strong>${(subtotal || 0).toFixed(2)}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <strong>Free</strong>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold mb-3">
                  <span>Total:</span>
                  <span>${(subtotal || 0).toFixed(2)}</span>
                </div>
                <Button
                  as={Link}
                  to="/checkout"
                  className="w-100 rounded"
                  disabled={
                    syncStatus === "loading" || normalizedItems.length === 0
                  }
                >
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
