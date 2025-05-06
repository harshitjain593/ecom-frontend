import React from "react";
import Slider from "react-slick";
import { NextArrow, PrevArrow } from "./Arrow";

const PotteryEnd = () => {
    const settings = {
        infinite: true,
        speed: 400,
        autoplay: true,
        slidesToShow: 6,
        arrows: false,
        slidesToScroll: 1,
        PrevArrow:<PrevArrow/>,
        NextArrow:<NextArrow/>,
        responsive: [
            {
                breakpoint: 1440,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 1,
                    autoplay: true,
                    infinite: true,
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    autoplay: true,
                    infinite: true,
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    autoplay: true,
                    infinite: true,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    autoplay: true,
                    initialSlide: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 3,
                    autoplay: true,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <section className="pottery-main">
            <h3 className="h3Tag  potter-title"  >#potterylove</h3>
            <Slider {...settings} className="slider">
                <div className="pottery-container">
                    <img src="/img/pottery1.jpg" alt="Pottery 1" className="" />
                </div>
                <div className="pottery-container">
                    <img src="/img/pottery2.jpg" alt="Pottery 2" />
                </div>
                <div className="pottery-container">
                    <img src="/img/pottery3.jpg" alt="Pottery 3"  />
                </div>
                <div className="pottery-container">
                    <img src="/img/pottery4.jpg" alt="Pottery 4"  />
                </div>
                <div className="pottery-container">
                    <img src="/img/pottery5.jpg" alt="Pottery 5"  />
                </div>
                <div className="pottery-container">
                    <img src="/img/pottery6.jpg" alt="Pottery 6"  />
                </div>
            </Slider>
        </section>
    );
};

export default PotteryEnd;
