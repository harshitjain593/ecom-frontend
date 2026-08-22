import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeartButton from './HeartButton';

const ProductCard = ({ product }) => {
  const [currentImage, setCurrentImage] = useState(product.productImage);
  const [intervalId, setIntervalId] = useState(null);

  const handleMouseEnter = () => {
    if (product.image_gallery?.length > 0) {
      let index = 0;
      const id = setInterval(() => {
        index = (index + 1) % product.image_gallery.length;
        setCurrentImage(product.image_gallery[index]);
      }, 1000);
      setIntervalId(id);
    }
  };

  const handleMouseLeave = () => {
    setCurrentImage(product.productImage);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  useEffect(() => () => {
    if (intervalId) clearInterval(intervalId);
  }, [intervalId]);

  const discount = product.mrp_price
    ? Math.ceil(((product.mrp_price - product.selling_price) / product.mrp_price) * 100)
    : 0;

  return (
    <div className="product-card">
      <div
        className="product-card__image-wrap"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link to={`/productdetail/${product._id}`}>
          <img src={currentImage} alt={product.product_name} className="product-card__image" />
        </Link>
        {product.badges && (
          <div className="product-card__badge" data-badge={product.badges} />
        )}
        <HeartButton productId={product._id} check={product.isWishlist} />
      </div>
      <Link to={`/productdetail/${product._id}`} className="product-card__body">
        <h6 className="product-card__name">{product.product_name}</h6>
        {product.category && (
          <span className="product-card__category">{product.category}</span>
        )}
        <div className="product-card__pricing">
          <span className="product-card__price">₹{product.selling_price}</span>
          {product.mrp_price > product.selling_price && (
            <>
              <span className="product-card__mrp">₹{product.mrp_price}</span>
              <span className="product-card__discount">{discount}% off</span>
            </>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
