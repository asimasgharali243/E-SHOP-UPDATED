import React, { useState, useCallback, useMemo } from 'react';
import { Form, Accordion, Button, Col, Row } from 'react-bootstrap';
import './grid.scss'
const FilterSidebar = React.memo(() => {
  const [activeKeys, setActiveKeys] = useState(new Set());

  const handleToggle = useCallback((key) => {
    setActiveKeys((prev) => {
      const newSet = new Set(prev);
      newSet.has(key) ? newSet.delete(key) : newSet.add(key);
      return newSet;
    });
  }, []);

  const handleDelegatedClick = useCallback((e) => {
    const role = e.target.getAttribute('data-role');
    if (!role) return;

    if (role === 'select-size') {
      console.log(`Size clicked: ${e.target.innerText}`);
    }

    if (role === 'select-color') {
      console.log(`Color clicked: ${e.target.dataset.color}`);
    }
  }, []);

  const brands = useMemo(() => ['Nike', 'Adidas', 'Apple', 'New Balance', 'Puma', 'Uniqlo'], []);
  const sizes = useMemo(() => ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'], []);
  const colors = useMemo(() => ['black', 'red', 'blue', 'green', 'yellow', 'orange'], []);

  return (
    <aside className="filter-sidebar bg-white" aria-label="Sidebar Filters">
      <div className="d-none d-md-flex justify-content-between align-items-center px-3 py-3"
      style={{fontSize:`clamp(14px, 1.2vw, 18px)`, fontWeight: 600,color:`var(--text1)`}}
      >
          <span className="" style={{ }}>Filters</span>
        
          <span style={{   }}>Advanced</span>
      </div>
      <Accordion as={Col} activeKey={[...activeKeys]} flush alwaysOpen>
        {/* Brand Filter */}
        <Accordion.Item eventKey="0" 
        style={{fontSize:`clamp(12px, 1.2vw, 14px)`, fontWeight: 600}}
        >
          <Accordion.Header
          className='custom-accordion-header'
          onClick={() => handleToggle('0')}>Brand</Accordion.Header>
          <Accordion.Body>
            <Form.Control type="text" placeholder="Search brand..." className="mb-2" />
            {brands.map((brand, i) => (
              <Form.Check
                key={brand}
                type="checkbox"
                label={`${brand} (${Math.floor(Math.random() * 300)})`}
                aria-label={`${brand} brand filter`}
              />
            ))}
          </Accordion.Body>
        </Accordion.Item>

        {/* Price Filter */}
        <Accordion.Item eventKey="1">
          <Accordion.Header onClick={() => handleToggle('1')}>Price</Accordion.Header>
          <Accordion.Body>
            <Form.Range min={0} max={300000} aria-label="Price range" />
            <div className="d-flex gap-2 mt-2">
              <Form.Control type="number" placeholder="Min" aria-label="Min price" />
              <Form.Control type="number" placeholder="Max" aria-label="Max price" />
            </div>
          </Accordion.Body>
        </Accordion.Item>

        {/* Size Filter (using event delegation) */}
        <Accordion.Item eventKey="2">
          <Accordion.Header onClick={() => handleToggle('2')}>Size</Accordion.Header>
          <Accordion.Body
            className="d-flex flex-wrap gap-2"
            onClick={handleDelegatedClick}
            data-section="sizes"
          >
            {sizes.map((size) => (
              <Button
                key={size}
                size="sm"
                variant="outline-secondary"
                data-role="select-size"
              >
                {size}
              </Button>
            ))}
          </Accordion.Body>
        </Accordion.Item>

        {/* Color Filter (using event delegation) */}
        <Accordion.Item eventKey="3">
          <Accordion.Header onClick={() => handleToggle('3')}>Color</Accordion.Header>
          <Accordion.Body
            className="d-flex flex-wrap gap-2"
            onClick={handleDelegatedClick}
            data-section="colors"
          >
            {colors.map((color) => (
              <div
                key={color}
                data-role="select-color"
                data-color={color}
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: color,
                  borderRadius: '50%',
                  border: '1px solid #ddd',
                  cursor: 'pointer',
                }}
                title={`Filter by ${color}`}
                aria-label={`${color} color filter`}
              ></div>
            ))}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </aside>
  );
});

export default FilterSidebar;
