import React, { useEffect } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { NextArrow, PrevArrow } from './Arrow';
import './index.css';
import './homeTheme.css';
import { fetchProduct } from '../../action/index';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from './ProductCard';

function Excusivecategory() {
    const dispatch = useDispatch();
    const products = useSelector(state => state.productData.data);

    useEffect(() => {
        dispatch(fetchProduct());
    }, [dispatch]);

    const productList = products?.result?.products || [];

    const setting = {
        infinite: productList.length > 4,
        speed: 400,
        dots: true,
        autoplay: false,
        slidesToShow: 4,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        slidesToScroll: 1,
        responsive: [
            { breakpoint: 1440, settings: { slidesToShow: 4, slidesToScroll: 1 } },
            { breakpoint: 1294, settings: { slidesToShow: 3, slidesToScroll: 1 } },
            { breakpoint: 900, settings: { slidesToShow: 3, slidesToScroll: 1 } },
            { breakpoint: 675, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 1 } },
        ],
    };

    return (
        <section id="products" className="home-section product-section">
            <div className="home-container">
                <h2 className="home-section-title">Featured Collection</h2>
                {productList.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-muted">No products available</p>
                    </div>
                ) : productList.length === 1 ? (
                    <div className="d-flex justify-content-center">
                        <ProductCard product={productList[0]} />
                    </div>
                ) : (
                    <Slider {...setting} className="product-slider">
                        {productList.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </Slider>
                )}
            </div>
        </section>
    );
}

export default Excusivecategory;
