import React, { useState } from 'react';
import { Form, Accordion, Button, Col,Row } from 'react-bootstrap';

const FilterSidebar = () => {
  const [activeKeys, setActiveKeys] = useState([]);

  const handleToggle = (key) => {
    if (activeKeys.includes(key)) {
      // If key is already active, remove it (close it)
      setActiveKeys(activeKeys.filter((k) => k !== key));
    } else {
      // Otherwise, add it (open it)
      setActiveKeys([...activeKeys, key]);
    }
  };

  return (
    <div className='ps-5 pe-4'>
      <Row  className='text-black' ><Col  className='bg-white pt-3 pb-4' style={{marginLeft:'12px'}}><span className='ms-2' style={{fontSize:'20px',fontWeight:550}}>Filters</span></Col><Col className='text-end  bg-white pt-3 pb-4'  style={{marginRight:'12px'}}><span className='' style={{fontSize:'20px',fontWeight:550}}>Advanced</span></Col></Row>
      
      <Accordion as={Col} activeKey={activeKeys} flush alwaysOpen>
        {/* Brand Filter */}
        <Accordion.Item eventKey="0">
          <Accordion.Header onClick={() => handleToggle("0")}>Brand</Accordion.Header>
          <Accordion.Body>
            <Form.Control type="text" placeholder="Search brand..." className="mb-2" />
            <Form.Check type="checkbox" label="Nike (123)" />
            <Form.Check type="checkbox" label="Adidas (55)" />
            <Form.Check type="checkbox" label="Apple (65)" />
            <Form.Check type="checkbox" label="New Balance (99)" />
            <Form.Check type="checkbox" label="Puma (325)" />
            <Form.Check type="checkbox" label="Uniqlo (61)" />
          </Accordion.Body>
        </Accordion.Item>

        {/* Price Filter */}
        <Accordion.Item eventKey="1">
          <Accordion.Header onClick={() => handleToggle("1")}>Price</Accordion.Header>
          <Accordion.Body>
            <Form.Range min={0} max={300000} />
            <div className="d-flex gap-2 mt-2">
              <Form.Control type="number" placeholder="Min" />
              <Form.Control type="number" placeholder="Max" />
            </div>
          </Accordion.Body>
        </Accordion.Item>

        {/* Size Filter */}
        <Accordion.Item eventKey="2">
          <Accordion.Header onClick={() => handleToggle("2")}>Size</Accordion.Header>
          <Accordion.Body className="d-flex flex-wrap gap-2">
            {['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
              <Button key={size} size="sm" variant="outline-secondary">{size}</Button>
            ))}
          </Accordion.Body>
        </Accordion.Item>

        {/* Color Filter */}
        <Accordion.Item eventKey="3">
          <Accordion.Header onClick={() => handleToggle("3")}>Color</Accordion.Header>
          <Accordion.Body className="d-flex flex-wrap gap-2">
            {['black', 'red', 'blue', 'green', 'yellow', 'orange'].map((color) => (
              <div
                key={color}
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: color,
                  borderRadius: '50%',
                  border: '1px solid #ddd',
                  cursor: 'pointer',
                }}
              ></div>
            ))}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default FilterSidebar;
