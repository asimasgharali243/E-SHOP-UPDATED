import React, { useState, useEffect } from "react";
import {
  Container,
  Badge,
  Breadcrumb,
  ButtonGroup,
  Tabs,
  Tab,
  Table,
  Accordion,
  ProgressBar,
  Row,
  Col,
  Button,
  Form,
  Card,
  Spinner,
  Collapse,
} from "react-bootstrap";
import "./SingleProduct.scss";
import Rating from "react-rating";
import CustomContainer from "../../components/SubComponent/CustomContainer";
export default function SingleProductPage() {
  //   const [quantity, setQuantity] = useState(1);
  //   const [activeImage, setActiveImage] = useState(0);
  //   const [selectedColor, setSelectedColor] = useState("white");
  //   const [loadingImages, setLoadingImages] = useState(true);
  //   const [imageError, setImageError] = useState(false);
  //   const [showComments, setShowComments] = useState(false);
  //   const [newComment, setNewComment] = useState("");
  //   const [userName, setUserName] = useState("");
  //   const [userRating, setUserRating] = useState(0);
  //   const [hoverRating, setHoverRating] = useState(0);
  //   const [comments, setComments] = useState([
  //     {
  //       id: 1,
  //       user: "John Doe",
  //       rating: 5,
  //       comment: "Amazing product! Worth every penny.",
  //       date: "2023-05-15",
  //       likes: 24,
  //       liked: false
  //     },
  //     {
  //       id: 2,
  //       user: "Sarah K.",
  //       rating: 4,
  //       comment: "Good quality but shipping was a bit late.",
  //       date: "2023-06-02",
  //       likes: 12,
  //       liked: false
  //     },
  //     {
  //       id: 3,
  //       user: "Mike Ross",
  //       rating: 3,
  //       comment: "Decent, but I expected better packaging.",
  //       date: "2023-06-10",
  //       likes: 5,
  //       liked: false
  //     },
  //   ]);

  //   // Generate stable image URLs with cache-friendly approach
  //   const generateImageUrl = (width, height, seed) => {
  //     return `https://picsum.photos/id/${seed}/${width}/${height}`;
  //   };

  //   // Main product images
  //   const productImages = [
  //     generateImageUrl(800, 600, 10),
  //     generateImageUrl(800, 600, 20),
  //     generateImageUrl(800, 600, 30),
  //     generateImageUrl(800, 600, 40),
  //   ];

  //   // Related products data
  //   const relatedProducts = [
  //     {
  //       id: 50,
  //       title: "AK-900 Wired Keyboard",
  //       price: "$960",
  //       oldPrice: "$1160",
  //       discount: "-20%",
  //       rating: 4,
  //     },
  //     {
  //       id: 60,
  //       title: "IPS LCD Gaming Monitor",
  //       price: "$370",
  //       oldPrice: "$400",
  //       discount: "-30%",
  //       rating: 5,
  //     },
  //     {
  //       id: 70,
  //       title: "RGB Liquid CPU Cooler",
  //       price: "$170",
  //       oldPrice: "$200",
  //       discount: "-20%",
  //       rating: 4,
  //     },
  //   ];

  //   // Preload images to prevent flickering
  //   useEffect(() => {
  //     const loadImages = async () => {
  //       try {
  //         const imagePromises = [
  //           ...productImages.map(img => new Promise((resolve) => {
  //             const image = new Image();
  //             image.src = img;
  //             image.onload = resolve;
  //             image.onerror = resolve;
  //           })),
  //           ...relatedProducts.map(product => new Promise((resolve) => {
  //             const image = new Image();
  //             image.src = generateImageUrl(400, 300, product.id);
  //             image.onload = resolve;
  //             image.onerror = resolve;
  //           }))
  //         ];

  //         await Promise.all(imagePromises);
  //         setLoadingImages(false);
  //       } catch (error) {
  //         console.error("Error loading images:", error);
  //         setImageError(true);
  //         setLoadingImages(false);
  //       }
  //     };

  //     loadImages();
  //   }, []);

  //   const colors = [
  //     { name: "white", color: "#ffffff" },
  //     { name: "red", color: "#e74c3c" },
  //     { name: "black", color: "#0e0d0d" },
  //     { name: "blue", color: "#3c5be7" },
  //   ];

  //   const handleCommentSubmit = (e) => {
  //     e.preventDefault();
  //     if (!newComment.trim() || !userName.trim()) return;

  //     const newCommentObj = {
  //       id: comments.length + 1,
  //       user: userName,
  //       rating: userRating,
  //       comment: newComment,
  //       date: new Date().toISOString().split('T')[0],
  //       likes: 0,
  //       liked: false
  //     };

  //     setComments([...comments, newCommentObj]);
  //     setNewComment("");
  //     setUserRating(0);
  //     setUserName("");
  //   };

  //   const toggleLike = (commentId) => {
  //     setComments(comments.map(comment => {
  //       if (comment.id === commentId) {
  //         return {
  //           ...comment,
  //           likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
  //           liked: !comment.liked
  //         };
  //       }
  //       return comment;
  //     }));
  //   };

  //   const renderStars = (rating, interactive = false, setRatingFn = null) => {
  //     return (
  //       <div className="stars">
  //         {[...Array(5)].map((_, i) => {
  //           const starValue = i + 1;
  //           const displayRating = interactive ? (hoverRating || userRating) : rating;

  //           return (
  //             <i
  //               key={i}
  //               className={`bi ${
  //                 starValue <= displayRating
  //                   ? "bi-star-fill"
  //                   : starValue - 0.5 <= displayRating
  //                   ? "bi-star-half"
  //                   : "bi-star"
  //               } ${interactive ? "interactive-star" : ""} text-warning`}
  //               onClick={() => interactive && setRatingFn && setRatingFn(starValue)}
  //               onMouseEnter={() => interactive && setHoverRating(starValue)}
  //               onMouseLeave={() => interactive && setHoverRating(0)}
  //             />
  //           );
  //         })}
  //       </div>
  //     );
  //   };

  //   if (loadingImages) {
  //     return (
  //       <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
  //         <Spinner animation="border" role="status">
  //           <span className="visually-hidden">Loading...</span>
  //         </Spinner>
  //       </Container>
  //     );
  //   }

  //   if (imageError) {
  //     return (
  //       <Container className="text-center py-5">
  //         <i className="bi bi-exclamation-triangle-fill text-danger fs-1 mb-3"></i>
  //         <h3>Error loading product images</h3>
  //         <p>Please try refreshing the page or check your internet connection</p>
  //         <Button variant="primary" onClick={() => window.location.reload()}>
  //           Refresh Page
  //         </Button>
  //       </Container>
  //     );
  //   }

  return (
    // <Container  className="product-page py-5">
    //   <Row>
    //     {/* Thumbnails */}
    //     <Col md={1} xs={2} className="thumbs d-flex flex-md-column gap-2">
    //       {productImages.map((img, idx) => (
    //         <img
    //           key={idx}
    //           src={img}
    //           alt={`thumbnail-${idx}`}
    //           className={`thumb-img ${activeImage === idx ? "active" : ""}`}
    //           onClick={() => setActiveImage(idx)}
    //           loading="lazy"
    //           crossOrigin="anonymous"
    //         />
    //       ))}
    //     </Col>

    //     {/* Main Image */}
    //     <Col md={5} xs={10} className="text-center">
    //       <img
    //         src={productImages[activeImage]}
    //         alt="product"
    //         className="main-img img-fluid rounded"
    //         loading="eager"
    //         crossOrigin="anonymous"
    //       />
    //     </Col>

    //     {/* Product Info */}
    //     <Col md={6} xs={12} className="details ps-md-4">
    //       <h1 className="product-title mb-3">Havic HV G-92 Gamepad</h1>
    //       <div className="product-rating mb-3">
    //         {renderStars(4.5)}
    //         <span className="text-muted ms-2">(150 Reviews)</span>
    //         <span className="text-success ms-2">
    //           <i className="bi bi-check-circle-fill" /> In Stock
    //         </span>
    //       </div>
    //       <h2 className="product-price text-danger mb-3">$192.00</h2>
    //       <p className="desc mb-4">
    //         Playstation 5 Controller skin high quality vinyl with air channel adhesive for easy air free
    //         install & mess free removal.
    //       </p>

    //       {/* Colors */}
    //       <div className="mb-4">
    //         <strong className="d-block mb-2">Colors:</strong>
    //         <div className="d-flex gap-2">
    //           {colors.map((c) => (
    //             <button
    //               key={c.name}
    //               className={`color-circle ${selectedColor === c.name ? "active" : ""}`}
    //               style={{ backgroundColor: c.color }}
    //               onClick={() => setSelectedColor(c.name)}
    //               aria-label={`Select ${c.name} color`}
    //             />
    //           ))}
    //         </div>
    //       </div>

    //       {/* Size */}
    //       <div className="mb-4">
    //         <strong className="d-block mb-2">Size:</strong>
    //         <div className="d-flex flex-wrap gap-2">
    //           {["S", "M", "L", "XL"].map((s) => (
    //             <Button
    //               key={s}
    //               variant="outline-secondary"
    //               size="sm"
    //             >
    //               {s}
    //             </Button>
    //           ))}
    //         </div>
    //       </div>

    //       {/* Quantity */}
    //       <div className="d-flex align-items-center mb-4">
    //         <Button
    //           variant="light"
    //           onClick={() => setQuantity((q) => Math.max(1, q - 1))}
    //           aria-label="Decrease quantity"
    //         >
    //           <i className="bi bi-dash" />
    //         </Button>
    //         <Form.Control
    //           type="number"
    //           value={quantity}
    //           min="1"
    //           onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
    //           className="mx-2 qty-input"
    //         />
    //         <Button
    //           variant="light"
    //           onClick={() => setQuantity((q) => q + 1)}
    //           aria-label="Increase quantity"
    //         >
    //           <i className="bi bi-plus" />
    //         </Button>
    //       </div>

    //       {/* Actions */}
    //       <div className="d-flex gap-2 mb-4">
    //         <Button variant="danger" className="flex-grow-1">
    //           <i className="bi bi-cart-fill me-2" /> Buy Now
    //         </Button>
    //         <Button variant="outline-dark" aria-label="Add to wishlist">
    //           <i className="bi bi-heart" />
    //         </Button>
    //       </div>

    //       {/* Delivery Info */}
    //       <div className="delivery-info p-3 bg-light rounded mb-4">
    //         <div className="d-flex align-items-center mb-2">
    //           <i className="bi bi-truck text-primary me-3 fs-4" />
    //           <div>
    //             <h6 className="mb-0">Free Delivery</h6>
    //             <small className="text-muted">Enter your postal code for delivery options</small>
    //           </div>
    //         </div>
    //         <div className="d-flex align-items-center">
    //           <i className="bi bi-arrow-repeat text-primary me-3 fs-4" />
    //           <div>
    //             <h6 className="mb-0">30-Day Returns</h6>
    //             <small className="text-muted">Free return within 30 days</small>
    //           </div>
    //         </div>
    //       </div>
    //     </Col>
    //   </Row>

    //   {/* Reviews Section */}
    //   <Row className="mt-5">
    //     <Col md={8}>
    //       <div className="d-flex justify-content-between align-items-center mb-4">
    //         <h4>Customer Reviews ({comments.length})</h4>
    //         <Button
    //           variant="outline-primary"
    //           onClick={() => setShowComments(!showComments)}
    //           aria-expanded={showComments}
    //         >
    //           {showComments ? 'Hide Comments' : 'Show Comments'}
    //         </Button>
    //       </div>

    //       <Collapse in={showComments}>
    //         <div>
    //           {/* Comment Form */}
    //           <Form onSubmit={handleCommentSubmit} className="mb-4 p-3 border rounded">
    //             <h5 className="mb-3">Add Your Review</h5>
    //             <Form.Group className="mb-3">
    //               <Form.Label>Your Rating</Form.Label>
    //               <div className="mb-2">
    //                 {renderStars(userRating, true, setUserRating)}
    //               </div>
    //             </Form.Group>
    //             <Form.Group className="mb-3">
    //               <Form.Control
    //                 placeholder="Your Name"
    //                 value={userName}
    //                 onChange={(e) => setUserName(e.target.value)}
    //                 required
    //               />
    //             </Form.Group>
    //             <Form.Group className="mb-3">
    //               <Form.Control
    //                 as="textarea"
    //                 rows={3}
    //                 placeholder="Your Review"
    //                 value={newComment}
    //                 onChange={(e) => setNewComment(e.target.value)}
    //                 required
    //               />
    //             </Form.Group>
    //             <Button variant="primary" type="submit">Submit Review</Button>
    //           </Form>

    //           {/* Comments List */}
    //           {comments.map((comment) => (
    //             <Card key={comment.id} className="mb-3 p-3 review-card">
    //               <div className="d-flex justify-content-between align-items-center mb-2">
    //                 <div>
    //                   <strong>{comment.user}</strong>
    //                   <small className="text-muted ms-2">{comment.date}</small>
    //                 </div>
    //                 <div>{renderStars(comment.rating)}</div>
    //               </div>
    //               <p className="mb-2">{comment.comment}</p>
    //               <div className="d-flex align-items-center">
    //                 <Button
    //                   variant="link"
    //                   size="sm"
    //                   className="p-0 me-2"
    //                   onClick={() => toggleLike(comment.id)}
    //                 >
    //                   <i className={`bi ${comment.liked ? 'bi-hand-thumbs-up-fill text-primary' : 'bi-hand-thumbs-up'}`} />
    //                 </Button>
    //                 <small className="text-muted">{comment.likes} likes</small>
    //               </div>
    //             </Card>
    //           ))}
    //         </div>
    //       </Collapse>
    //     </Col>
    //   </Row>

    //   {/* Related Products */}
    //   <Row className="mt-5">
    //     <Col>
    //       <h4 className="mb-4">You May Also Like</h4>
    //       <Row>
    //         {relatedProducts.map((product) => (
    //           <Col key={product.id} lg={4} md={6} className="mb-4">
    //             <Card className="h-100 related-card">
    //               <div className="product-image-container">
    //                 <Card.Img
    //                   variant="top"
    //                   src={generateImageUrl(400, 300, product.id)}
    //                   alt={product.title}
    //                   crossOrigin="anonymous"
    //                 />
    //                 <div className="discount-badge bg-danger text-white">
    //                   {product.discount}
    //                 </div>
    //               </div>
    //               <Card.Body>
    //                 <Card.Title>{product.title}</Card.Title>
    //                 <div className="price mb-2">
    //                   <span className="text-danger fw-bold">{product.price}</span>
    //                   <span className="text-muted text-decoration-line-through ms-2">
    //                     {product.oldPrice}
    //                   </span>
    //                 </div>
    //                 {renderStars(product.rating)}
    //                 <Button variant="outline-primary" size="sm" className="mt-2">
    //                   Add to Cart
    //                 </Button>
    //               </Card.Body>
    //             </Card>
    //           </Col>
    //         ))}
    //       </Row>
    //     </Col>
    //   </Row>
    // </Container>

    // <CustomContainer className="product-page py-5">
    //     <Row>
    //         <Col lg={7} md={6} sm={12} as={Row} className="product-photo bg-primary d-flex flex-column flex-lg-row" style={{backgroundColor:'blue'}} >
    //             <Col lg={{span:3,order:1}} md={{span:4,order:2}}>adjkksdhaskjdhskjhdja</Col>
    //             <Col lg={{span:9,order:2}} md={{span:8,order:1}}>js,adsadns,mndsa,mnd,msa</Col>
    //         </Col>
    //         <Col lg={{span:5}} md={6} sm={12} as={Row} className="product-details bg-secondary">
    //         </Col>
    //     </Row>
    //     </CustomContainer>

    <CustomContainer className="product-page py-5">
      {/* Main Product Section */}
      <Row className="mb-5">
        {/* Product Images Column */}
        <Col
          lg={7}
          md={6}
          sm={12}
          as={Row}
          className="product-photo bg-light d-flex flex-lg-row flex-md-column"
        >
          <Col
            lg={{ span: 3, order: 1 }}
            md={{ span: 4, order: 2 }}
            className="thumbnails d-flex flex-lg-column flex-md-row  pe-lg-3 pe-md-0"
          >
            {[1, 2, 3, 4].map((img) => (
              <div
                key={img}
                className="thumbnail mb-2 me-md-2 me-lg-0 cursor-pointer"
              >
                <img
                  src={`/assets/products_15_1_1920x.jpg`}
                  alt={`Product thumbnail ${img}`}
                  crossOrigin="anonymous"
                  className="img-fluid border rounded"
                />
              </div>
            ))}
          </Col>
          <Col
            lg={{ span: 9, order: 2 }}
            md={{ span: 8, order: 1 }}
            className="main-image"
          >
            <div className="position-relative">
              <img
                src={`/assets/products_15_1_1920x.jpg`}
                alt="Main product image"
                crossOrigin="anonymous"
                className="img-fluid rounded shadow"
              />
              <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
                SALE
              </Badge>
              <Button
                variant="light"
                className="position-absolute bottom-0 end-0 m-2 rounded-circle"
                aria-label="Zoom image"
              >
                <i className="bi bi-zoom-in"></i>
              </Button>
            </div>
          </Col>
        </Col>

        {/* Product Details Column */}
        <Col
          lg={{ span: 5 }}
          md={6}
          sm={12}
          className="product-details ps-lg-5 ps-md-4"
        >
          <div className="sticky-top" style={{ top: "20px" }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <Breadcrumb>
                  <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
                  <Breadcrumb.Item href="#">Electronics</Breadcrumb.Item>
                  <Breadcrumb.Item active>Smartphones</Breadcrumb.Item>
                </Breadcrumb>
                <h1 className="mb-2">Premium Smartphone X2000 Pro</h1>
                <div className="d-flex align-items-center mb-2">
                  <Rating rating={4.5} />
                  <a href="#reviews" className="ms-2 text-muted">
                    (142 reviews)
                  </a>
                </div>
              </div>
              <Button variant="outline-secondary" className="rounded-circle">
                <i className="bi bi-heart"></i>
              </Button>
            </div>

            <div className="mb-4">
              <div className="d-flex align-items-center mb-2">
                <h3 className="mb-0 text-primary me-3">$899.99</h3>
                <span className="text-decoration-line-through text-muted me-3">
                  $1,099.99
                </span>
                <Badge bg="success" className="me-2">
                  18% OFF
                </Badge>
                <Badge bg="info">Free Shipping</Badge>
              </div>
              <p className="text-success mb-0">
                <i className="bi bi-check-circle-fill me-1"></i> In Stock (15
                available)
              </p>
            </div>

            <div className="mb-4">
              <h5 className="mb-3">Key Features</h5>
              <ul className="list-unstyled">
                <li className="mb-1">
                  <i className="bi bi-check-circle text-success me-2"></i> 6.7"
                  Super AMOLED Display
                </li>
                <li className="mb-1">
                  <i className="bi bi-check-circle text-success me-2"></i> 108MP
                  Triple Camera System
                </li>
                <li className="mb-1">
                  <i className="bi bi-check-circle text-success me-2"></i>{" "}
                  Snapdragon 8 Gen 2 Processor
                </li>
                <li className="mb-1">
                  <i className="bi bi-check-circle text-success me-2"></i>{" "}
                  5000mAh Battery with Fast Charging
                </li>
              </ul>
            </div>

            <Form className="mb-4">
              <Form.Group className="mb-3">
                <Form.Label>Color</Form.Label>
                <div className="d-flex">
                  {["Black", "Silver", "Blue", "Green"].map((color) => (
                    <Form.Check
                      key={color}
                      type="radio"
                      id={`color-${color}`}
                      label={color}
                      name="color"
                      className="me-3"
                    />
                  ))}
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Storage</Form.Label>
                <ButtonGroup className="w-100">
                  {["128GB", "256GB", "512GB"].map((size) => (
                    <Button key={size} variant="outline-secondary">
                      {size}
                    </Button>
                  ))}
                </ButtonGroup>
              </Form.Group>

              <div className="d-flex align-items-center mb-4">
                <Form.Label className="me-3 mb-0">Quantity</Form.Label>
                <ButtonGroup className="me-3">
                  <Button variant="outline-secondary">-</Button>
                  <Button variant="outline-secondary" disabled>
                    1
                  </Button>
                  <Button variant="outline-secondary">+</Button>
                </ButtonGroup>
                <span className="text-muted small">Max 3 per customer</span>
              </div>

              <div className="d-grid gap-3">
                <Button variant="primary" size="lg" className="py-3">
                  <i className="bi bi-cart-fill me-2"></i> Add to Cart
                </Button>
                <Button variant="outline-primary" size="lg" className="py-3">
                  Buy Now
                </Button>
              </div>
            </Form>

            <div className="d-flex justify-content-between small text-muted">
              <div className="d-flex align-items-center">
                <i className="bi bi-shield-check me-2"></i> 2-Year Warranty
              </div>
              <div className="d-flex align-items-center">
                <i className="bi bi-arrow-repeat me-2"></i> 30-Day Returns
              </div>
              <div className="d-flex align-items-center">
                <i className="bi bi-credit-card me-2"></i> EMI Available
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Product Tabs Section */}
      <Row className="mb-5">
        <Col>
          <Tabs
            defaultActiveKey="description"
            id="product-tabs"
            className="mb-4"
          >
            <Tab eventKey="description" title="Description">
              <div className="p-3">
                <h4 className="mb-3">Product Description</h4>
                <p>
                  The Premium Smartphone X2000 Pro redefines mobile excellence
                  with its cutting-edge technology and sleek design. Experience
                  unparalleled performance with the latest Snapdragon processor
                  and stunning visuals on our 6.7" Super AMOLED display.
                </p>

                <h5 className="mt-4 mb-3">Technical Specifications</h5>
                <Table striped bordered responsive>
                  <tbody>
                    <tr>
                      <td>Display</td>
                      <td>6.7" Super AMOLED, 120Hz refresh rate</td>
                    </tr>
                    <tr>
                      <td>Processor</td>
                      <td>Snapdragon 8 Gen 2</td>
                    </tr>
                    <tr>
                      <td>RAM</td>
                      <td>12GB LPDDR5</td>
                    </tr>
                    <tr>
                      <td>Storage</td>
                      <td>128GB/256GB/512GB UFS 4.0</td>
                    </tr>
                    <tr>
                      <td>Camera</td>
                      <td>108MP main + 12MP ultra-wide + 8MP telephoto</td>
                    </tr>
                    <tr>
                      <td>Battery</td>
                      <td>5000mAh with 65W fast charging</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Tab>
            <Tab eventKey="specs" title="Specifications">
              <div className="p-3">
                <h4 className="mb-3">Detailed Specifications</h4>
                <Accordion>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Display</Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        <li>6.7-inch Dynamic AMOLED 2X</li>
                        <li>Quad HD+ resolution (3200 x 1440)</li>
                        <li>120Hz adaptive refresh rate</li>
                        <li>HDR10+ certified</li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>Performance</Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        <li>Qualcomm Snapdragon 8 Gen 2</li>
                        <li>Adreno 740 GPU</li>
                        <li>12GB LPDDR5 RAM</li>
                        <li>UFS 4.0 storage</li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            </Tab>
            <Tab eventKey="reviews" title={`Reviews (142)`} id="reviews">
              <div className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h4 className="mb-1">Customer Reviews</h4>
                    <div className="d-flex align-items-center">
                      <Rating rating={4.5} size="lg" />
                      <span className="ms-2">4.5 out of 5</span>
                    </div>
                    <p className="text-muted small mb-0">
                      Based on 142 reviews
                    </p>
                  </div>
                  <Button variant="primary">Write a Review</Button>
                </div>

                <div className="mb-5">
                  <h5 className="mb-3">Review Highlights</h5>
                  <Row>
                    <Col md={6}>
                      <div className="p-3 bg-light rounded">
                        <h6>What customers say</h6>
                        <p className="mb-2">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>{" "}
                          "Best camera I've ever used"
                        </p>
                        <p className="mb-2">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>{" "}
                          "Battery lasts all day"
                        </p>
                        <p className="mb-2">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>{" "}
                          "Super fast performance"
                        </p>
                        <p className="mb-0">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>{" "}
                          "Premium build quality"
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>

                <h5 className="mb-3">Latest Reviews</h5>
                {[1, 2, 3].map((review) => (
                  <div key={review} className="border-bottom pb-4 mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <div
                            className="bg-secondary rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "40px", height: "40px" }}
                          >
                            <i className="bi bi-person-fill text-white"></i>
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-0">Customer {review}</h6>
                          <div className="d-flex align-items-center">
                            <Rating
                              rating={review === 1 ? 5 : review === 2 ? 4 : 3}
                              size="sm"
                            />
                            <span className="text-muted small ms-2">
                              2 days ago
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-decoration-none"
                      >
                        Helpful (12)
                      </Button>
                    </div>
                    <h6>{"Great phone".repeat(review)}</h6>
                    <p className="mb-2">
                      {"This is one of the best smartphones I've ever used. The camera quality is exceptional and the battery life lasts me all day. ".repeat(
                        review
                      )}
                    </p>
                    <div className="d-flex">
                      {review === 1 &&
                        [1, 2].map((img) => (
                          <img
                            key={img}
                            src={`/review-${img}.jpg`}
                            alt="Review"
                            className="img-thumbnail me-2"
                            style={{ width: "80px", height: "80px" }}
                          />
                        ))}
                    </div>
                  </div>
                ))}

                <div className="text-center mt-4">
                  <Button variant="outline-primary">Load More Reviews</Button>
                </div>
              </div>
            </Tab>
            <Tab eventKey="faq" title="FAQ">
              <div className="p-3">
                <h4 className="mb-4">Frequently Asked Questions</h4>
                <Accordion>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      What's included in the box?
                    </Accordion.Header>
                    <Accordion.Body>
                      The package includes: Smartphone unit, USB-C cable, 65W
                      fast charger, SIM ejector tool, clear protective case, and
                      documentation.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>
                      Is this phone water resistant?
                    </Accordion.Header>
                    <Accordion.Body>
                      Yes, the X2000 Pro has an IP68 rating, meaning it can
                      withstand immersion in up to 1.5 meters of freshwater for
                      up to 30 minutes.
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {/* Related Products Section */}
      <Row className="mb-5">
        <Col>
          <h3 className="mb-4">You May Also Like</h3>
          <Row>
            {[1, 2, 3, 4].map((product) => (
              <Col key={product} lg={3} md={6} className="mb-4">
                <Card className="h-100 product-card">
                  <div className="position-relative">
                    <Card.Img variant="top" src={`/related-${product}.jpg`} />
                    <Badge
                      bg="danger"
                      className="position-absolute top-0 start-0 m-2"
                    >
                      -15%
                    </Badge>
                    <Button
                      variant="light"
                      className="position-absolute top-0 end-0 m-2 rounded-circle shadow-sm"
                      aria-label="Add to wishlist"
                    >
                      <i className="bi bi-heart"></i>
                    </Button>
                  </div>
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-2">
                      <Badge bg="info" className="text-uppercase">
                        New
                      </Badge>
                      <Rating rating={4} size="sm" />
                    </div>
                    <Card.Title className="h6 mb-1">
                      Related Product {product}
                    </Card.Title>
                    <Card.Text className="small text-muted mb-2">
                      Accessory | Smartphone
                    </Card.Text>
                    <div className="d-flex align-items-center">
                      <span className="text-primary fw-bold me-2">
                        ${(200 + product * 50).toFixed(2)}
                      </span>
                      <span className="text-decoration-line-through text-muted small">
                        ${(250 + product * 50).toFixed(2)}
                      </span>
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-transparent border-top-0">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="w-100"
                    >
                      Add to Cart
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* Recently Viewed Section */}
      <Row className="mb-5">
        <Col>
          <h3 className="mb-4">Recently Viewed</h3>
          <div className="position-relative">
            <Button
              variant="light"
              className="position-absolute start-0 top-50 translate-middle-y z-1 rounded-circle shadow-sm d-none d-md-block"
              style={{ left: "-20px" }}
            >
              <i className="bi bi-chevron-left"></i>
            </Button>
            <Button
              variant="light"
              className="position-absolute end-0 top-50 translate-middle-y z-1 rounded-circle shadow-sm d-none d-md-block"
              style={{ right: "-20px" }}
            >
              <i className="bi bi-chevron-right"></i>
            </Button>
            <Row
              className="flex-nowrap overflow-auto py-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {[1, 2, 3, 4, 5].map((product) => (
                <Col
                  key={`viewed-${product}`}
                  xs={6}
                  sm={4}
                  md={3}
                  lg={2}
                  className="mb-2"
                >
                  <Card className="h-100">
                    <Card.Img variant="top" src={`/viewed-${product}.jpg`} />
                    <Card.Body className="p-2">
                      <Card.Title className="h6 mb-1 small">
                        Viewed Item {product}
                      </Card.Title>
                      <div className="d-flex align-items-center">
                        <span className="text-primary fw-bold small">
                          ${(50 + product * 20).toFixed(2)}
                        </span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Col>
      </Row>

      {/* Product Support Section */}
      <Row className="mb-5">
        <Col>
          <Card className="border-0 bg-light">
            <Card.Body className="p-4">
              <Row>
                <Col md={4} className="text-center mb-4 mb-md-0">
                  <div className="mb-3">
                    <i
                      className="bi bi-headset text-primary"
                      style={{ fontSize: "2rem" }}
                    ></i>
                  </div>
                  <h5>24/7 Customer Support</h5>
                  <p className="mb-0">
                    Have questions? Our support team is ready to help.
                  </p>
                </Col>
                <Col md={4} className="text-center mb-4 mb-md-0">
                  <div className="mb-3">
                    <i
                      className="bi bi-truck text-primary"
                      style={{ fontSize: "2rem" }}
                    ></i>
                  </div>
                  <h5>Fast & Free Shipping</h5>
                  <p className="mb-0">Free delivery on all orders over $50.</p>
                </Col>
                <Col md={4} className="text-center">
                  <div className="mb-3">
                    <i
                      className="bi bi-arrow-repeat text-primary"
                      style={{ fontSize: "2rem" }}
                    ></i>
                  </div>
                  <h5>Easy Returns</h5>
                  <p className="mb-0">
                    30-day return policy for your peace of mind.
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </CustomContainer>
  );
}
