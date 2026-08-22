import React from "react";
import Slider from "react-slick";
import { NextArrow, PrevArrow } from "./Arrow";
import ProductCard from "./ProductCard";

const Sliders = ({ products }) => {
    const getSlidesToShow = (breakpoint) => {
        if (!products?.length) return 1;
        const limits = { 1440: 4, 1294: 3, 900: 3, 675: 2, 480: 2 };
        return Math.min(limits[breakpoint] || 4, products.length);
    };

    const setting = {
        infinite: products?.length > 4,
        speed: 400,
        autoplay: false,
        slidesToShow: getSlidesToShow(1440),
        arrows: products?.length > 4,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        slidesToScroll: 1,
        responsive: [
            { breakpoint: 1440, settings: { slidesToShow: getSlidesToShow(1440), slidesToScroll: 1 } },
            { breakpoint: 1294, settings: { slidesToShow: getSlidesToShow(1294), slidesToScroll: 1 } },
            { breakpoint: 900, settings: { slidesToShow: getSlidesToShow(900), slidesToScroll: 1 } },
            { breakpoint: 675, settings: { slidesToShow: getSlidesToShow(675), slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: getSlidesToShow(480), slidesToScroll: 1 } },
        ],
    };

    if (!products?.length) {
        return (
            <div className="text-center py-4">
                <p className="text-muted">No products available</p>
            </div>
        );
    }

    if (products.length === 1) {
        return (
            <div className="d-flex justify-content-center">
                <ProductCard product={products[0]} />
            </div>
        );
    }

    return (
        <Slider {...setting} className="product-slider">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </Slider>
    );
};

export default Sliders;
