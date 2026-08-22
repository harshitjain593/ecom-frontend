import React from 'react';
import { Link } from 'react-router-dom';
import './brandWordmark.css';

const BrandWordmark = ({ variant = 'header', className = '' }) => (
  <Link to="/" className={`oluxe-wordmark oluxe-wordmark--${variant} ${className}`.trim()}>
    OLUXE
  </Link>
);

export default BrandWordmark;
