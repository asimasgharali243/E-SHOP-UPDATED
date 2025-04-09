import React from 'react'
import { Row,Col } from 'react-bootstrap'
const categories = [
  { id: 1, name: 'Category 1', image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Category 2', image: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Category 3', image: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Category 4', image: 'https://via.placeholder.com/150' },
  { id: 5, name: 'Category 5', image: 'https://via.placeholder.com/150' },
  { id: 6, name: 'Category 6', image: 'https://via.placeholder.com/150' },
  { id: 7, name: 'Category 7', image: 'https://via.placeholder.com/150' },
  { id: 8, name: 'Category 8', image: 'https://via.placeholder.com/150' },    
]
export default function CategorySlider() {
  return (
    <Row>

{categories.map((category) => (
  <Col key={category.id}>
    <img src={category.image} alt={category.name} />
    <p>{category.name}</p>
  </Col>
))}
    </Row>
  )
}
