// src/components/CustomContainer.jsx
import React from 'react';
import { Container } from 'react-bootstrap';
import './CustomContainer.scss';

export default function CustomContainer({ children, className = '', ...rest }) {
  return (
    <Container className={className} {...rest}>
      {children}
    </Container>
  );
}
