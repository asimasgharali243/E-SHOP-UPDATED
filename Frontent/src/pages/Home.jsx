// src/pages/Home.jsx
import { Container } from "react-bootstrap";
import HeaderSlider from "../components/carousel/HeaderSlider/HeaderSlider";
import ProductSlider from "../components/carousel/CarditemSlider/CardItemSlider";
import CategoriesSlider from "../components/carousel/categorySlider/CategorySlider";
import SecondBannerSlider from "../components/carousel/SecondBannerSlider/SecondBannerSlider";
import { useGetAllProductsQuery } from "../redux/api/productsApi/ProductApi";
import { useGetCategoriesQuery } from "../redux/api/productsApi/ProductApi";

export default function Home() {
  // Fetch products
  const {
    data: productData,
    isLoading: productLoading,
    isError: productError,
  } = useGetAllProductsQuery();
  const products = Array.isArray(productData)
    ? productData
    : productData?.products ?? [];

  // Fetch categories
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetCategoriesQuery();
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  const handleQuickView = (productId) => console.log("Quick view:", productId);
  const handleToggleLike = (productId) =>
    console.log("Toggle like:", productId);
  const handleProductClick = (productId) =>
    console.log("Product clicked:", productId);

  if (productLoading || categoriesLoading) return <p>Loading...</p>;
  if (productError || categoriesError) return <p>Error fetching data!</p>;

  // Product sections
  const flashSalesProducts = products.filter((p) => p.discount > 0);
  const featuredProducts = products
    .slice()
    .sort((a, b) => b.ratings - a.ratings || b.numOfReviews - a.numOfReviews)
    .slice(0, 10);
  const newArrivals = products
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);
  const topRated = products
    .slice()
    .sort((a, b) => b.ratings - a.ratings)
    .slice(0, 10);
  const trending = products
    .slice()
    .sort((a, b) => b.numOfReviews - a.numOfReviews)
    .slice(0, 10);
  const recommended = products
    .slice()
    .sort(() => 0.5 - Math.random())
    .slice(0, 10); // random example

  return (
    <Container style={{ overflow: "hidden" }}>
      <HeaderSlider />

      {flashSalesProducts.length > 0 && (
        <ProductSlider
          title="Flash Sales"
          products={flashSalesProducts}
          onQuickView={handleQuickView}
          onToggleLike={handleToggleLike}
          onProductClick={handleProductClick}
        />
      )}

      {categories.length > 0 && (
        <CategoriesSlider title="Shop by Category" categories={categories} />
      )}

      {featuredProducts.length > 0 && (
        <ProductSlider
          title="Featured Products"
          products={featuredProducts}
          onQuickView={handleQuickView}
          onToggleLike={handleToggleLike}
          onProductClick={handleProductClick}
        />
      )}

      <SecondBannerSlider />

      {newArrivals.length > 0 && (
        <ProductSlider
          title="New Arrivals"
          products={newArrivals}
          onQuickView={handleQuickView}
          onToggleLike={handleToggleLike}
          onProductClick={handleProductClick}
        />
      )}

      {topRated.length > 0 && (
        <ProductSlider
          title="Top Rated"
          products={topRated}
          onQuickView={handleQuickView}
          onToggleLike={handleToggleLike}
          onProductClick={handleProductClick}
        />
      )}

      {trending.length > 0 && (
        <ProductSlider
          title="Trending Products"
          products={trending}
          onQuickView={handleQuickView}
          onToggleLike={handleToggleLike}
          onProductClick={handleProductClick}
        />
      )}

      {recommended.length > 0 && (
        <ProductSlider
          title="Recommended for You"
          products={recommended}
          onQuickView={handleQuickView}
          onToggleLike={handleToggleLike}
          onProductClick={handleProductClick}
        />
      )}
    </Container>
  );
}
