import { Row, Button, Dropdown, ButtonGroup } from 'react-bootstrap';
import { useState, useMemo, useCallback } from 'react';
import ProductCard from '../Card/ProductCard';
import './Grid.scss';

export default function CustomGrid({ productData, handleToggleFilter }) {
  const [sortOption, setSortOption] = useState('');
  const [gridMode, setGridMode] = useState('wide'); // 'wide' or 'compact'

  const handleSortChange = useCallback((option) => {
    setSortOption(option);
  }, []);

  const toggleGridMode = useCallback(() => {
    setGridMode(prev => (prev === 'wide' ? 'compact' : 'wide'));
  }, []);

  const sortedProducts = useMemo(() => {
    const products = Array.isArray(productData) ? productData : [];
    switch (sortOption) {
      case 'Newest': return [...products].sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'Price: Low to High': return [...products].sort((a, b) => a.price - b.price);
      case 'Price: High to Low': return [...products].sort((a, b) => b.price - a.price);
      case 'Rating': return [...products].sort((a, b) => b.rating - a.rating);
      case 'Discount': return [...products].sort((a, b) => b.discount - a.discount);
      case 'Name': return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case 'Popular': return [...products].sort((a, b) => b.popular - a.popular);
  
      default: return products;
    }
  }, [productData, sortOption]);

  return (
    <>
      {/* Control Bar */}
      <Row className="justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2 w-100 justify-content-between">
          
          {/* Mobile Filter */}
          <Button
            variant="outline-primary"
            size="sm"
            className="d-md-none"
            onClick={handleToggleFilter}
            aria-label="Toggle Filter"
          >
            <i className="bi bi-funnel-fill"></i>
          </Button>

          {/* Grid Switcher (Only Two Buttons) */}
          <ButtonGroup>
            <Button
              variant={gridMode === 'wide' ? 'primary' : 'light'}
              size="sm"
              onClick={() => setGridMode('wide')}
              title="More items per row"
              aria-label="Wide View"
            >
              <i className="bi bi-grid-3x3-gap-fill" />
            </Button>
            <Button
              variant={gridMode === 'compact' ? 'primary' : 'light'}
              size="sm"
              onClick={() => setGridMode('compact')}
              title="Fewer items per row"
              aria-label="Compact View"
            >
              <i className="bi bi-grid" />
            </Button>
          </ButtonGroup>

          {/* Sort Dropdown */}
          <Dropdown className="ms-auto">
            <Dropdown.Toggle
              as={Button}
              variant="light"
              size="sm"
              id="sort-dropdown"
              aria-label="Sort Products"
            >
              <i className="bi bi-filter" style={{ fontSize: '22px' }}></i>
            <span className="ms-2">{sortOption ? `Sort by: ${sortOption}` : 'Sort'}</span>

            </Dropdown.Toggle>
            <Dropdown.Menu>
              {['Popular', 'Newest', 'Price: Low to High', 'Price: High to Low', 'Rating', 'Discount', 'Name'].map(option => (
                <Dropdown.Item key={option} onClick={() => handleSortChange(option)}>
                  {option}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Row>

      {/* Product Grid */}
      <section className={`catalog-grid catalog-grid--${gridMode} `} aria-label="Product List">
        {sortedProducts.map((product) => (
          <div key={product.id} className="item">
            <ProductCard product={product} layoutType={gridMode} />
          </div>
        ))}
      </section>
    </>
  );
}
