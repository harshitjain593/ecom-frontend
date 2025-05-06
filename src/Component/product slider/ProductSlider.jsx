import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './productsliders.css'

import HeartButton from "../Home/HeartButton";
 
const ProductSlider = ({products}) => {

    return (
              <>
            {products && products.map((product, index) => (
                <ProductCard key={index} product={product} />
            ))}
    
              </>
    );
};

const ProductCard = ({ product }) => {
    const [currentImage, setCurrentImage] = useState(product.productImage);
    const [imageIndex, setImageIndex] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    const handleMouseEnter = () => {
        if (product.image_gallery && product.image_gallery.length > 0) {
            const id = setInterval(() => {
                setImageIndex(prevIndex => {
                    const nextIndex = (prevIndex + 1) % product.image_gallery.length; // Loop back
                    setCurrentImage(product.image_gallery[nextIndex]);
                    return nextIndex;
                });
            }, 1000); // Change image every 1000ms

            setIntervalId(id);
        }
    };

    const handleMouseLeave = () => {
        setCurrentImage(product.productImage); // Revert to the original image
        if (intervalId) {
            clearInterval(intervalId); // Clear the interval
            setIntervalId(null);
        }
    };

    useEffect(() => {
        return () => {
            if (intervalId) {
                clearInterval(intervalId); // Cleanup on unmount
            }
        };
    }, [intervalId]);

    return (
        <div className="px-0 ">
            <div className="card-custom">
                <div
                    className="position-relative card-img-container"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <Link to={`/productdetail/${product._id}`}>
                        <img
                            src={currentImage}
                            className="card-img-top"
                            alt="Product"
                            style={{ height: "240px" }}
                        />
                    </Link>
                    <HeartButton productId={product._id} check={product.isWishlist}/>
                    {product.product?.badges &&<div className="product-badge" data-badge={product.product.badges}></div>}
                </div>
                <Link to={`/productdetail/${product._id}`}>
                    <div className="card-body" style={{ width: '100%' }}>
                        <h6 className="card-title" style={{ color: "#626161", fontSize: "14px" }}>{product.product_name}</h6>
                        <span className="text-secondary slide-discription" style={{ fontSize: "12px" }}>{product.category}</span>
                        <div className='slider-price-container d-flex justify-content-start align-items-center' style={{ gap: '10%' }}>
                            <h5 className='fs-4 text-dark' style={{ fontWeight: 700 }}>₹{product.selling_price}</h5>
                            <h6 className='text-secondary fs-6' style={{ textDecoration: 'line-through' }}>₹{product.mrp_price}</h6>
                            <span className=' text-bg-warning text-center ' style={{fontSize:'.7rem' ,padding:'2px',borderRadius:'3px',fontWeight:'500'}}>{Math.ceil(((product.mrp_price - product.selling_price) / product.mrp_price) * 100).toFixed()}% off</span>
                        </div>
                    {product.product?.badges  &&
                      <div className='mobile-badge'>
                            <p>{product.product.badges}</p>
                        </div>}
                
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default ProductSlider;
