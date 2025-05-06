import React, { useRef } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { NextArrow, PrevArrow } from './Arrow';
import './index.css';


function Testimonial() {


  const slider = useRef();
  const setting = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    // fade: true,
    cssEase: 'linear',
  };
  return (
    <>
      <section className=" py-4 testimonial" style={{ textAlign: "center" }}>
        <div>
          <h2 className='fw-bold fs-3 py-2' style={{ color: "#6B6363" }}>Our Happy Client</h2>
        </div>
        <Slider ref={slider} {...setting} className=''>
          <div className='px-1'>
            <div className='d-flex justify-content-center'>
              <img src="https://www.ugaoo.com/cdn/shop/files/Customer_Testimonial_Thumbnails_Samarth_copy.jpg?v=1661747399&width=70" alt="Client 1" style={{ width: "100px", borderRadius: "30px", height: "100px" }} />
            </div>
            <p>our satisfied clients are at the heart of everything we do. We take pride in providing exceptional products and services that exceed expectations. But don't just take our word for it – hear what our happy clients have to say! From seamless shopping experiences to top-notch customer support, our dedicated team works tirelessly to ensure every customer leaves smiling. Join the ranks of our delighted clients and experience ecommerce excellence like never before.</p>
            <h3>Sarmarth Goyal</h3>
          </div>
          <div className='px-1'>
            <div className='d-flex justify-content-center'>
              <img src="https://www.ugaoo.com/cdn/shop/files/Customer_Testimonial_Thumbnails_Aishwarya.jpg?v=1661747317&width=70" alt="Client 1" style={{ width: "100px", borderRadius: "30px", height: "100px" }} />
            </div>
            <p>But it's not just about the transactions – it's about the relationships we build with each and every customer. We take pride in going above and beyond to ensure that every interaction with our brand leaves a lasting impression. Whether it's providing personalized recommendations or resolving any concerns promptly, our dedicated team is committed to making our clients feel valued and appreciated.</p>
            <h3>Aishwarya Roy</h3>
          </div>
          <div className='px-1'>
            <div className='d-flex justify-content-center'>
              <img src="https://www.ugaoo.com/cdn/shop/files/Customer_Testimonial_Thumbnails_Pragyasmita.jpg?v=1661747356&width=70" alt="Client 2" style={{ width: "100px", borderRadius: "30px", height: "100px" }} />
            </div>
            <p>Join the ranks of our satisfied clientele and discover why Shine Decoration is the go-to destination for all your shopping needs. With a passion for excellence and a dedication to customer satisfaction, we look forward to exceeding your expectations and earning your trust as your preferred ecommerce partner.</p>
            <h3>Pragya Smith</h3>
          </div>
        </Slider>
      </section>
    </>
  );
}
export default Testimonial;

