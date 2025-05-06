import React, { useRef } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { NextArrow, PrevArrow } from '../Home/Arrow';

function Shopproduct() {

  const product = [
    {
      img: "/img/Rectangle 128.png",
      title: "Cello Pack of 47 Opalware Dazzle Opalware Oleander Dinn...",
      Count: "1022",
      price: "490",
      star: "3.5",
      crossprice: "2,321",
      off: "89%",
      delivery: "Free Delivery",
    },
    {
      img: "/img/Rectangle 128.png",
      title: "Cello Pack of 47 Opalware Dazzle Opalware Oleander Dinn...",
      Count: "1022",
      price: "490",
      star: "3.5",
      crossprice: "2,321",
      off: "89%",
      delivery: "Free Delivery",
    },
    {
      img: "/img/Rectangle 128.png",
      title: "Cello Pack of 47 Opalware Dazzle Opalware Oleander Dinn...",
      Count: "1022",
      price: "490",
      star: "3.5",
      crossprice: "2,321",
      off: "89%",
      delivery: "Free Delivery",
    },
    {
      img: "/img/Rectangle 128.png",
      title: "Cello Pack of 47 Opalware Dazzle Opalware Oleander Dinn...",
      Count: "1022",
      price: "490",
      star: "3.5",
      crossprice: "2,321",
      off: "89%",
      delivery: "Free Delivery",
    },
    {
      img: "/img/Rectangle 128.png",
      title: "Cello Pack of 47 Opalware Dazzle Opalware Oleander Dinn...",
      Count: "1022",
      price: "490",
      star: "3.5",
      crossprice: "2,321",
      off: "89%",
      delivery: "Free Delivery",
    },
    {
      img: "/img/Rectangle 128.png",
      title: "Cello Pack of 47 Opalware Dazzle Opalware Oleander Dinn...",
      Count: "1022",
      price: "490",
      star: "3.5",
      crossprice: "2,321",
      off: "89%",
      delivery: "Free Delivery",
    },
  ]
  const slider = useRef();
  const setting = {
    infinite: true,
    speed: 400,
    autoplay: false,
    slidesToShow: 4,
    arrows: true, // Enable arrows
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          autoplay: false,
          infinite: true,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          autoplay: false,
          infinite: true,
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          autoplay: false,
          infinite: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          autoplay: false,
          initialSlide: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          autoplay: false,
          slidesToScroll: 1
        }
      }
    ]
  };
  return (
    <>
      <section className="px-3 py-1">
        <div>
          <h2 className='fw-bold fs-3 px-2' style={{ color: "#6B6363" }}>Exclusive Product</h2>
        </div>
        <Slider ref={slider} {...setting} className="">
          {product.map((shop, index) => {
            const { title, Count, img, price, crossprice, off, star, delivery } = shop;
            return (
              <div className='px-2'>
                <div className="card mb-4" key={index}>
                  <img src={img} className="card-img-top" alt="Car" />
                  <div className="p-2">
                    <h6 className="card-title" style={{ fontSize: "13px" }}>{title}</h6>
                    <p className="card-text">
                      <div>
                        <span>({Count})</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="text-success font-weight-bold" style={{ fontWeight: "600" }}>₹{price}</span>
                        <span className="text-muted px-2" style={{ fontWeight: "600" }}><s>₹{crossprice}</s></span>
                        <span className="badge text-dark">{off}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="ml-2 text-muted" style={{ fontWeight: "500" }}>{star} start</span>
                      </div>
                      <div>
                        <h6 style={{ fontSize: "13px" }}>{delivery}</h6>
                      </div>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </section>
    </>
  );
}
export default Shopproduct;
