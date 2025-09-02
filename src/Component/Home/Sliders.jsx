import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { NextArrow, PrevArrow } from "./Arrow";
import HeartButton from "./HeartButton";

const Sliders = ({ products }) => {
    // Debug logging to understand the product data
    console.log('Sliders component - products:', products);
    console.log('Sliders component - products length:', products?.length);
    console.log('Sliders component - products type:', typeof products);
    
    // Calculate dynamic slidesToShow based on actual product count
    const getSlidesToShow = (breakpoint) => {
        if (!products || products.length === 0) return 1;
        
        const breakpointSettings = {
            1440: 4,
            1294: 3,
            900: 3,
            675: 3,
            480: 2
        };
        
        const maxSlides = breakpointSettings[breakpoint] || 4;
        const actualSlides = Math.min(maxSlides, products.length);
        console.log(`Breakpoint ${breakpoint}: maxSlides=${maxSlides}, actualSlides=${actualSlides}, products.length=${products.length}`);
        return actualSlides;
    };

    const setting = {
        infinite: products && products.length > 4, // Only enable infinite if we have more than 4 products
        speed: 400,
        autoplay: false,
        slidesToShow: getSlidesToShow(1440), // Default for large screens
        arrows: products && products.length > 4, // Only show arrows if we have more products than slides
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1440,
                settings: {
                    slidesToShow: getSlidesToShow(1440),
                    slidesToScroll: 1,
                    infinite: products && products.length > 4,
                    arrows: products && products.length > 4,
                }
            },
            {
                breakpoint: 1294,
                settings: {
                    slidesToShow: getSlidesToShow(1294),
                    slidesToScroll: 1,
                    infinite: products && products.length > 3,
                    arrows: products && products.length > 3,
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: getSlidesToShow(900),
                    slidesToScroll: 1,
                    infinite: products && products.length > 3,
                    arrows: products && products.length > 3,
                }
            },
            {
                breakpoint: 675,
                settings: {
                    slidesToShow: getSlidesToShow(675),
                    slidesToScroll: 1,
                    infinite: products && products.length > 3,
                    arrows: products && products.length > 3,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: getSlidesToShow(480),
                    slidesToScroll: 1,
                    infinite: products && products.length > 2,
                    arrows: products && products.length > 2,
                }
            }
        ]
    };

    return (
        <>
            {!products || products.length === 0 ? (
                <div className="text-center py-4">
                    <p className="text-muted">No products available</p>
                </div>
            ) : products.length === 1 ? (
                // If only one product, render it without carousel
                <div className="d-flex justify-content-center">
                    <ProductCard product={products[0]} />
                </div>
            ) : (
                // If multiple products, render carousel
                <Slider {...setting}>
                    {products.map((product, index) => (
                        <ProductCard key={product._id || index} product={product} />
                    ))}
                </Slider>
            )}
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
        <div className="px-md-4">
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
                    {/* <div style={{}}> */}
                    <HeartButton productId={product._id} check={product.isWishlist}/>
                    {/* </div> */}

                  {product.badges &&  <div className="product-badge" data-badge={product.badges}></div>}
                </div>
                <Link to={`/productdetail/${product._id}`}>
                    <div className="card-body" style={{ width: '100%' }}>
                        <h6 className="card-title" style={{  fontSize: "14px" }}>{product.product_name}</h6>
                        <span className="text-secondary slide-discription" style={{ fontSize: "12px" }}>{product.category}</span>
                        <div className='slider-price-container d-flex justify-content-start align-items-center' style={{ gap: '5%' }}>
                            <h5 className='fs-5 text-dark' style={{ fontWeight: 700 }}>₹{product.selling_price}</h5>
                            <h6 className='text-secondary oldprice' style={{ textDecoration: 'line-through' }}>₹{product.mrp_price}</h6>
                            <span className=' text-bg-warning text-center ' style={{fontSize:'.7rem' ,padding:'2px',borderRadius:'3px',fontWeight:'500'}}>{Math.ceil(((product.mrp_price - product.selling_price) / product.mrp_price) * 100).toFixed()}% off</span>
                        </div>
                    {product.badges&&    <div className='mobile-badge'>
                            <p>{product.badges}</p>
                        </div>}
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Sliders;
