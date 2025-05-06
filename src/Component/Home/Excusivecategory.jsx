import React, { useEffect, useRef, useState } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { NextArrow, PrevArrow } from './Arrow';
import { Link } from 'react-router-dom';
import './index.css';
import { fetchProduct } from '../../action/index';
import { useDispatch, useSelector } from 'react-redux';
import HeartButton from './HeartButton';

function Excusivecategory() {
    const dispatch = useDispatch();
    const products = useSelector(state => state.productData.data );

    useEffect(() => {
        dispatch(fetchProduct());
    }, [dispatch]);

    const slider = useRef();
    const setting = {
        infinite: true,
        speed: 400,
        dots:true,
        autoplay: false,
        slidesToShow: 4,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1440,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    dots:true,
                }
            },
            {
                breakpoint: 1294,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    dots:true,
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    dots:true,
                }
            },
            {
                breakpoint: 675,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    dots:true,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    dots:true,
                }
            }
        ]
    };

    return (
        <section id='products' className="container-fluid pt-1 card-container">
            <div>
                <h3 className='h3Tag'>Products</h3>
            </div>
            <Slider ref={slider} {...setting} className="sliders ">
                {products && products.result.products &&
                    products.result.products.map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))}
            </Slider>
        </section>
    );
}

const ProductCard = ({ product }) => {
    const [currentImage, setCurrentImage] = useState(product.productImage);
    const [imageIndex, setImageIndex] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    const handleMouseEnter = () => {
        if (product.image_gallery && product.image_gallery.length > 0) {
            // Clear existing interval if any
            if (intervalId) {
                clearInterval(intervalId);
            }

            // Start a new interval to loop through images
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
        <div className="px-md-4">
            <div className="card-custom">
                <div className='position-relative' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <Link to={`/productdetail/${product._id}`}>
                        <img src={currentImage} className="card-img-top" alt="Product" style={{ height: "240px" }} />
                    </Link>
                    {product.badges&& <div className="product-badge" data-badge={product.badges}></div>}
                    <HeartButton productId={product._id} check={product.isWishlist}/>
                </div>
                <Link to={`/productdetail/${product._id}`}>
                    <div className="card-body" style={{ width: '100%' }}>
                        <h6 className="card-title text-dark" style={{ color: "#626161", fontSize: "14px", fontWeight: '700' }}>{product.product_name} Ripple Vase</h6>
                        <span className="text-secondary slide-discription" style={{ fontSize: "12px" }}>{product.category}</span>
                        <div className='slider-price-container d-flex justify-content-start align-items-center' style={{ gap: '10%' }}>
                            <h5 className='fs-5 text-dark' style={{ fontWeight: 700 }}> ₹{product.selling_price}</h5>
                            <h6 className='text-secondary fs-6' style={{ textDecoration: 'line-through' }}> ₹{product.mrp_price} </h6>
                            <span className=' text-success text-center ' style={{fontSize:'.85rem' ,padding:'2px',borderRadius:'3px',fontWeight:'700', marginBottom:'.5rem'}}>{Math.ceil(((product.mrp_price - product.selling_price) / product.mrp_price) * 100).toFixed()}% off</span>
                        </div>
                      {product.badges&&  <div className='mobile-badge'>
                            <p>{product.badges}</p>
                        </div>}
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Excusivecategory;
