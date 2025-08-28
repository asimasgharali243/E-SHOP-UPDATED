import React from "react";
import { useDispatch } from "react-redux";
import GeneralCarousel from "../GeneralCustomCarousel";
import ProductCard from "../../Card/ProductCard";

// ✅ Import proper cart action
import { addToCart } from "../../../redux/features/Cart/CartAction";

const ProductSlider = ({
  title,
  products,
  showControls = true,
  onQuickView,
  onToggleLike,
  onProductClick,
}) => {
  const dispatch = useDispatch();

  // Handlers
  const handleQuickView = (productId) => onQuickView?.(productId);
  const handleToggleLike = (productId) => onToggleLike?.(productId);
  const handleProductClick = (productId) => onProductClick?.(productId);

  const handleAddToCart = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (product) {
      // ✅ use addToCart (local + debounce sync)
      console.log("Adding to cart:", product);
      dispatch(addToCart(product, 1));
    }
  };

  return (
    <GeneralCarousel
      title={title}
      showControls={showControls}
      responsive={{
        superLargeDesktop: { breakpoint: { max: 4000, min: 1400 }, items: 6 },
        desktop: { breakpoint: { max: 1400, min: 992 }, items: 5 },
        tablet: { breakpoint: { max: 992, min: 768 }, items: 4 },
        mobile: { breakpoint: { max: 768, min: 576 }, items: 3 },
        smallMobile: { breakpoint: { max: 576, min: 0 }, items: 2 },
      }}
    >
      {products.map((product) => (
        <div key={product._id} className="carousel-product-item">
          <ProductCard
            product={product}
            onQuickView={handleQuickView}
            onToggleLike={handleToggleLike}
            onAddToCart={handleAddToCart}
            onProductClick={handleProductClick}
          />
        </div>
      ))}
    </GeneralCarousel>
  );
};

export default ProductSlider;
