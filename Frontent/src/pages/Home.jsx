// src/pages/Home.jsx
import { Container } from "react-bootstrap";
import HeaderSlider from "../components/carousel/HeaderSlider/HeaderSlider";
import ProductSlider from "../components/carousel/CarditemSlider/CardItemSlider";
import CategoriesSlider from "../components/carousel/categorySlider/CategorySlider";
import SecondBannerSlider from "../components/carousel/SecondBannerSlider/SecondBannerSlider";

export default function Home() {
  const categories = [
    { name: "Dresses", icon: "bi bi-person-lines-fill" },
    { name: "Handbags", icon: "bi bi-bag-fill" },
    { name: "Jewelry", icon: "bi bi-gem" },
    { name: "Shoes", icon: "bi bi-handbag-fill" },
  ];

  const productData = [
    {
      _id: "1",
      image: "/assets/products_4_1.jpg",
      name: "Samsung Galaxy Pro",
      price: 19.99,
    },
    {
      _id: "2",
      image: "/assets/products_1_1_1920x.jpg",
      name: "iPhone 13",
      price: 29.99,
    },
    {
      _id: "3",
      image: "https://via.placeholder.com/200",
      name: "Product 3",
      price: 39.99,
    },
  ];

  const handleQuickView = (productId) => console.log("Quick view:", productId);
  const handleToggleLike = (productId) =>
    console.log("Toggle like:", productId);
  const handleProductClick = (productId) =>
    console.log("Product clicked:", productId);

  return (
    <Container style={{ overflow: "hidden" }}>
      <HeaderSlider />
      <ProductSlider
        title="Flash Sales"
        products={productData}
        onQuickView={handleQuickView}
        onToggleLike={handleToggleLike}
        onProductClick={handleProductClick}
      />
      <CategoriesSlider title="Shop by Category" categories={categories} />
      <ProductSlider
        title="Featured Products"
        products={productData}
        onQuickView={handleQuickView}
        onToggleLike={handleToggleLike}
        onProductClick={handleProductClick}
      />
      <SecondBannerSlider />
      <ProductSlider
        title="New Arrivals"
        products={productData}
        onQuickView={handleQuickView}
        onToggleLike={handleToggleLike}
        onProductClick={handleProductClick}
      />
    </Container>
  );
}
